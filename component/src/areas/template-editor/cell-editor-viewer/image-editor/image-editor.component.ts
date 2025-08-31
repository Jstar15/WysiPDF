import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Cell, ImageBlock } from '../../../../models/interfaces';
import { TokenAttribute } from '../../../../models/TokenAttribute';
import { TokenAttributeTypeEnum } from '../../../../models/TokenAttributeTypeEnum';

type Align = 'left' | 'center' | 'right';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
  imports: [
    CommonModule, FormsModule, NgIf, NgFor,
    MatFormField, MatInput, MatLabel,
    MatIcon,
    MatButtonToggleGroup, MatButtonToggle,
    MatSelect, MatOption
  ]
})
export class AddImageEditorComponent implements OnInit, OnChanges {
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];

  @Output() public change = new EventEmitter<Cell>();

  // Local state (kept independent so preview stays stable)
  public imageBase64 = '';
  public filename = '';
  public width = 100;
  public alignment: Align = 'left';

  public imageTokens: TokenAttribute[] = [];
  public selectedTokenKey: string | null = null;

  ngOnInit(): void {
    this.hydrateFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cell'] || changes['tokenAttrs']) {
      this.hydrateFromInputs();
    }
  }

  // ── UI Actions ──────────────────────────────────────────────────
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = String(reader.result ?? '');
      this.filename = file.name;
      this.selectedTokenKey = null; // file overrides token
      this.emitPayload();
    };
    reader.readAsDataURL(file);
  }

  onTokenChanged(): void {
    if (this.selectedTokenKey) {
      this.filename = `[token:${this.selectedTokenKey}]`;
      this.previewFromTokenIfPossible();
    }
    this.emitPayload();
  }

  onWidthChanged(v: number | string): void {
    const n = Number(v);
    if (Number.isFinite(n)) this.width = this.clampWidth(n);
    this.emitPayload();
  }

  onAlignmentChanged(): void {
    this.emitPayload();
  }

  // ── Internal ────────────────────────────────────────────────────
  private hydrateFromInputs(): void {
    // Refresh selectable tokens (IMAGE only)
    this.imageTokens = (this.tokenAttrs ?? []).filter(
      t => t.type === TokenAttributeTypeEnum.IMAGE
    );

    const ib: ImageBlock | undefined = this.cell?.imageBlock;

    // Only set image fields from inputs if provided (avoid wiping preview)
    if (ib?.imageBase64) this.imageBase64 = ib.imageBase64;
    if (ib?.filename)    this.filename    = ib.filename;

    this.width     = this.clampWidth(ib?.width ?? this.width ?? 100);
    this.alignment = (ib?.alignment as Align) ?? this.alignment;

    const tokenKey = (ib as any)?.HtmlTokenElement?.key as string | undefined;
    if (tokenKey) this.selectedTokenKey = tokenKey;

    if (this.selectedTokenKey) this.previewFromTokenIfPossible();

    this.emitPayload();
  }

  private previewFromTokenIfPossible(): void {
    const token = this.imageTokens.find(t => t.name === this.selectedTokenKey);
    if (!token) return;

    const value = String(token.value ?? '').trim();
    if (this.isDataUrl(value) || this.isHttpUrl(value)) {
      this.imageBase64 = value; // show preview if token is a URL/data URL
    }
    // not previewable → keep current preview as-is
  }

  private emitPayload(): void {
    const imageBlock: ImageBlock = {
      imageBase64: this.imageBase64 || '',
      filename:
        this.filename ||
        (this.selectedTokenKey ? `[token:${this.selectedTokenKey}]` : ''),
      width: this.width,
      alignment: this.alignment,
      ...(this.selectedTokenKey
        ? { HtmlTokenElement: { key: this.selectedTokenKey, type: 'image' } }
        : {})
    } as ImageBlock;

    const updated: Cell = { ...this.cell, imageBlock };
    this.change.emit(updated);
  }

  private clampWidth(n: number): number {
    return Math.min(100, Math.max(1, Math.round(n)));
  }

  private isDataUrl(v: string): boolean {
    return /^data:image\/[a-zA-Z]+;base64,/.test(v);
  }

  private isHttpUrl(v: string): boolean {
    return /^https?:\/\//i.test(v);
  }
}
