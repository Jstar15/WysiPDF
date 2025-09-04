import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

import { Cell, ImageBlock } from '../../../models/page';
import { TokenAttribute } from '../../../models/token-attribute';
import { TokenAttributeType } from '../../../models/token-attribute-type';
import {ImageCompressionService} from "../../../services/external/image-compression.service";
import {NgxImageCompressService, UploadResponse} from "ngx-image-compress";

type Align = 'left' | 'center' | 'right';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
  imports: [
    CommonModule, FormsModule, NgIf, NgFor,
    MatFormField, MatInput, MatLabel,
    MatIcon, MatButton,
    MatButtonToggleGroup, MatButtonToggle,
    MatSelect, MatOption
  ]
})
export class AddImageEditorComponent implements OnInit, OnChanges {
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Output() public change = new EventEmitter<Cell>();

  /** hidden file input ref */
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  // Local state (kept independent so preview stays stable)
  public imageBase64 = '';
  public filename = '';
  public width = 100;
  public alignment: Align = 'left';

  public imageTokens: TokenAttribute[] = [];
  public selectedTokenKey: string | null = null;

  constructor(private imageCompressService: NgxImageCompressService) {
  }

  async pickAndCompress(maxMb = 0.5): Promise<string> {
    try {
      // Lets user pick a file, then compress to <= maxMb
      const selected: UploadResponse = await this.imageCompressService.uploadFileOrReject();
      const result: UploadResponse = await this.imageCompressService.getImageWithMaxSizeAndMetas(
        { image: selected.image, orientation: selected.orientation, fileName: selected.fileName },
        maxMb,
        true
      );

      // Log before returning
      console.log('final bytes:', this.imageCompressService.byteCount(result.image));
      return result.image; // base64 data URL
    } catch (err: any) {
      // User canceled picker or compression failed
      console.warn('Image pick/compress aborted:', err?.message ?? err);
      throw err; // or `return ''` if you prefer a soft failure
    }
  }
  ngOnInit(): void {
    this.hydrateFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cell'] || changes['tokenAttrs']) {
      this.hydrateFromInputs();
    }
  }

  // ── UI Actions ──────────────────────────────────────────────────
  async openFilePicker(maxMb = 0.5): Promise<void> {
    try {
      // 1) Let user pick a file via the library (no hidden <input> needed)
      const selected: UploadResponse = await this.imageCompressService.uploadFileOrReject();

      // 2) Compress until <= maxMb
      const result: UploadResponse = await this.imageCompressService.getImageWithMaxSizeAndMetas(
        { image: selected.image, orientation: selected.orientation, fileName: selected.fileName },
        maxMb,
        true
      );

      // 3) Update your component state
      this.imageBase64 = result.image;                         // base64 data URL
      this.filename = result.fileName ?? selected.fileName ?? '';
      this.selectedTokenKey = null;                            // file overrides token

      console.log('final bytes:', this.imageCompressService.byteCount(result.image));
      this.emitPayload();
    } catch (err: any) {
      // User canceled or compression failed
      console.warn('Image pick/compress aborted:', err?.message ?? err);
    }
  }

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
      t => t.type === TokenAttributeType.IMAGE
    );

    const ib: ImageBlock | undefined = this.cell?.imageBlock;

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
      this.imageBase64 = value; // show preview if token is URL/data URL
    }
    // If not previewable, leave current preview as-is
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
    updated.type = 'image';
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
