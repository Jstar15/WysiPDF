import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cell } from '../../../models/page';
import { TokenAttribute } from '../../../models/token-attribute';
import { QuillWrapperComponent } from '../../../shared/quill-wrapper/quill-wrapper.component';
import {PageStateService} from "../../../services/page-state.service";

@Component({
  selector: 'app-quill-editor',
  standalone: true,
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  imports: [
    CommonModule, FormsModule, NgIf,
    QuillWrapperComponent
  ]
})
export class QuillEditorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('wrapper') wrapper!: QuillWrapperComponent;

  constructor(private pageStateService: PageStateService) {
  }
  /** Inputs (mirror your other editors) */
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Input() public colorPalettes: string[] = [];

  /** Emits an updated Cell whenever HTML changes */
  @Output() public change = new EventEmitter<Cell>();

  /** Local UI state */
  public html: string = '';
  public editorVisible: boolean = true;

  ngOnInit(): void {
    this.hydrateFromInputs();
    this.pageStateService.getCurrentPage()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cell'] || changes['tokenAttrs'] || changes['colorPalettes']) {
      this.hydrateFromInputs();
    }
  }

  ngOnDestroy(): void {
    this.safeDestroyWrapper();
  }

  /** Hook this to (htmlChange) from your QuillWrapper */
  public onHtmlChange(nextHtml: string): void {
    this.html = nextHtml ?? '';
    this.emitPayload();
  }

  /** Optional: if wrapper exposes a destroy method for cleanup */
  private safeDestroyWrapper(): void {
    try {
      this.wrapper?.destroy?.();
      this.editorVisible = false;
    } catch {
      // no-op
    }
  }

  private hydrateFromInputs(): void {
    // Keep the local html in sync with the incoming cell
    this.html = (this.cell?.value as string) ?? '';
    // Emit once so parent stays in sync (optional; comment out if you prefer lazy emit)
    this.emitPayload();
  }

  private emitPayload(): void {
    const updated: Cell = { ...this.cell, value: this.html };
    updated.type = 'html';
    this.change.emit(updated);
  }
}
