import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  NgZone,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { MatDialog } from "@angular/material/dialog";
import { TokenAttribute } from "../../models/TokenAttribute";
import { AddTokenDialogComponent } from "../../dialogs/add-token-dialog/add-token-dialog.component";
import { CustomElementBlot } from "./CustomElementBlot";
import Quill from 'quill';
import { HtmlBlockContainer } from "../../models/interfaces";
import { HtmlToStructuredContentService } from "../../services/converters/html-to-structured-content.service";
import { NgForOf } from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-quill-wrapper',
  templateUrl: './quill-wrapper.component.html',
  imports: [NgForOf],
  styleUrls: ['./quill-wrapper.component.scss']
})
export class QuillWrapperComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() html: string = '';
  @Input() attributeArray: TokenAttribute[];
  @Input() colorPalettes: string[] = [];

  /** NEW: when true, disables undo/redo (keyboard shortcuts + clears stack) */
  @Input() disableUndoRedo: boolean = false;

  @Output() htmlChange = new EventEmitter<string>();
  @Output() htmlBlockContainerChange = new EventEmitter<HtmlBlockContainer>();

  zone: NgZone;
  delta: any;
  currentRange: any;

  toolbarId = `toolbar-${Math.random().toString(36).substring(2, 10)}`;
  editorId = `editor-${Math.random().toString(36).substring(2, 10)}`;

  quill: any;
  textChangeEvent: any;

  private keydownHandler = (e: KeyboardEvent) => {
    if (!this.disableUndoRedo) return;
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase();
      const isUndo = k === 'z';
      const isRedo = k === 'y' || (k === 'z' && e.shiftKey);
      if (isUndo || isRedo) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  formats: [
    "background",
    "bold",
    "color",
    "font",
    "italic",
    "size",
    "underline",
    "align"
  ];

  constructor(
    private htmlToStructuredContentService: HtmlToStructuredContentService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    CustomElementBlot['blotName'] = 'mathjax';
    CustomElementBlot['className'] = 'ql-mathjax';
    CustomElementBlot['tagName'] = 'SPAN';

    const Font: any = Quill.import('formats/font');
    Font.whitelist = [
      'roboto',
      'raleway',
      'lato',
      'nunito',
      'playfair',
      'ibmmono',
      'cormorant',
      'opensans'
    ];
    Quill.register(CustomElementBlot);

    const SizeStyle: any = Quill.import('attributors/style/size');
    SizeStyle.whitelist = ['9px','10px','11px','12px','14px', '16px', '18px', '24px', '32px', '48px', '72px', '90px'];
    Quill.register(SizeStyle, true);
  }

  ngAfterViewInit(): void {
    const modules: any = {
      table: true,
      toolbar: `#${this.toolbarId}`
    };

    this.quill = new Quill(`#${this.editorId}`, {
      modules: modules,
      formats: this.formats,
      placeholder: 'Compose here...',
      theme: 'snow'
    });

    this.quill.root.innerHTML = this.html;

    // Apply initial undo/redo disabling if requested
    this.applyUndoRedoDisabling();

    this.textChangeEvent = this.quill.on('text-change',
      (delta: any, oldDelta: any, source: string): void => {
        this.delta = oldDelta;
        const html: string = this.quill.root.innerHTML;
        const htmlBlockContainer: HtmlBlockContainer =
          this.htmlToStructuredContentService.convertHTmlToObject(html);
        this.htmlChange.emit(html);
        this.htmlBlockContainerChange.emit(htmlBlockContainer);
        this.currentRange = this.quill.getSelection(true);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.quill && changes['html']) {
      const nextHtml: string = changes['html'].currentValue ?? '';
      // Avoid redundant work
      if (nextHtml !== this.quill.root.innerHTML) {
        const sel = this.quill.getSelection(); // try to preserve caret

        // 🔑 Load HTML exactly as-is (keeps your custom blot markup intact)
        this.quill.root.innerHTML = nextHtml;

        // 🔑 Ask Quill to re-parse the DOM into its blot tree/delta
        this.quill.update('api');

        // Optional: clear history so undo doesn't jump back to pre-load state
        const history = this.quill.getModule('history');
        try { history?.clear?.(); } catch {}

        if (sel) {
          try { this.quill.setSelection(sel); } catch {}
        }
      }
    }

    if (this.quill && changes['disableUndoRedo']) {
      this.applyUndoRedoDisabling();
    }
  }


  ngOnDestroy(): void {
    this.destroy();
  }

  /** Explicit cleanup method you can also call from parent dialogs */
  public destroy(): void {
    try {
      if (this.quill) {
        // Remove event listeners
        this.quill.off('text-change', this.textChangeEvent);
        // Clear references
        this.quill = null;
      }
    } catch (e) {
      console.warn('Error while destroying Quill instance:', e);
    }
  }

  private applyUndoRedoDisabling(): void {
    if (!this.quill) return;

    // Always remove prior listener to avoid duplicates
    this.quill.root.removeEventListener('keydown', this.keydownHandler, true);

    if (this.disableUndoRedo) {
      // Clear existing stacks so no undo levels exist
      const history = this.quill.getModule('history');
      if (history) {
        try {
          history.clear?.();
          if ((history as any).stack) {
            (history as any).stack.undo = [];
            (history as any).stack.redo = [];
          }
        } catch {}
      }
      // Block keyboard shortcuts at capture phase
      this.quill.root.addEventListener('keydown', this.keydownHandler, true);
    }
  }

  addTable(row: number, column: number) {
    const table = this.quill.getModule('table');
    table.insertTable(row, column);
  }

  deleteTable() {
    const table = this.quill.getModule('table');
    table.deleteTable();
  }

  openDialog(): void {
    this.currentRange = this.quill.getSelection(true);
    const dialogRef = this.dialog.open(AddTokenDialogComponent, {
      width: '300px',
      data: { data: this.attributeArray }
    });

    dialogRef.afterClosed().subscribe((result: TokenAttribute) => {
      if (result != null) {
        this.quill.insertEmbed(this.currentRange.index, 'mathjax', result);
      }
    });
  }
}
