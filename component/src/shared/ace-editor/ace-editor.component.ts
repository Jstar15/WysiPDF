import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {NgIf} from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonEditorChangePayload } from "./ace-editor.interface";

@Component({
  selector: 'ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss'],
  standalone: true,
  imports: [MatIcon, MatIconButton, MatTooltip, NgIf],
})
export class AceEditorComponent implements AfterViewInit, OnChanges {
  @Input() jsonList: any[] = [];
  @Input() theme: 'monokai' | 'dark' = 'monokai';
  @Output() jsonChange = new EventEmitter<JsonEditorChangePayload>();

  @ViewChild('editor', { static: false }) private editorRef!: ElementRef;

  private editor: any = null; // can be Ace editor or stub
  private programmatic = false;

  constructor(private snackBar: MatSnackBar) {}

  currentIndex = 0;
  text = '';
  isValid = true;
  parseError = '';

  get currentJson() {
    return this.jsonList?.[this.currentIndex] ?? null;
  }

  get canGoPrev() { return this.currentIndex > 0; }
  get canGoNext() { return this.currentIndex < this.jsonList.length - 1; }

  prev() { if (this.canGoPrev) { this.currentIndex--; this.updateEditor(); } }
  next() { if (this.canGoNext) { this.currentIndex++; this.updateEditor(); } }

  async ngAfterViewInit() {
    if ((globalThis as any).__isNode != true) {
      // Lazy load Ace only in browser
      const ace = await import('ace-builds');

      // Import modes/themes/extensions dynamically
      await import('ace-builds/src-noconflict/mode-json');
      await import('ace-builds/src-noconflict/theme-monokai');
      await import('ace-builds/src-noconflict/theme-tomorrow_night');
      await import('ace-builds/src-noconflict/ext-language_tools');
      await import('ace-builds/src-noconflict/worker-json');

      this.editor = ace.edit(this.editorRef.nativeElement);
      this.editor.session.setMode('ace/mode/json');
      this.applyTheme();

      this.editor.setOptions({
        fontSize: '14px',
        showPrintMargin: false,
        tabSize: 2,
        useSoftTabs: true,
        wrap: false,
        readOnly: true,
        highlightActiveLine: false,
        highlightGutterLine: false,
      });

      this.hookAceValidation();
    } else {
      // Node/SSR stub editor
      this.editor = {
        getValue: () => '',
        setValue: (_: any) => {},
        session: {
          on: () => {},
          setUseWorker: () => {},
        },
        setTheme: () => {},
        setOptions: () => {},
      };
    }

    this.updateEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jsonList'] && !changes['jsonList'].firstChange) {
      this.currentIndex = 0;
      this.updateEditor();
    }
  }

  private updateEditor() {
    const value = this.currentJson?.data ?? this.currentJson ?? {};
    this.setEditorText(value);
  }

  private setEditorText(value: any) {
    this.programmatic = true;
    this.text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    if (this.editor) this.editor.setValue(this.text, 1);
    this.programmatic = false;
  }

  private applyTheme() {
    if (this.editor) {
      this.editor.setTheme(
        this.theme === 'dark' ? 'ace/theme/tomorrow_night' : 'ace/theme/monokai'
      );
    }
  }

  private hookAceValidation() {
    if (!this.editor || !this.editor.session) return;
    const session = this.editor.getSession();
    session.setUseWorker(true);

    session.on('change', () => {
      if (this.programmatic) return;

      const value = this.editor.getValue();
      let valid = true;

      try {
        JSON.parse(value);
        this.parseError = '';
      } catch (err: any) {
        this.parseError = err.message ?? 'Invalid JSON';
        valid = false;
      }

      this.isValid = valid;
      this.emitJsonChange();
    });
  }

  private emitJsonChange() {
    this.jsonChange.emit({
      text: this.text,
      isValid: this.isValid,
      errorMessage: this.parseError,
    });
  }

  copy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.text);
      this.snackBar.open('Copied to clipboard', 'OK', { duration: 2000 });
    }
  }
}
