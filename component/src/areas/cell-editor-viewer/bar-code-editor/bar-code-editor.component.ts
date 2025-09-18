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
import { MatButton } from '@angular/material/button';

import {Cell, BarcodeBlock, ExtendedBarcodeFormat} from '../../../models/page';
import { TokenAttribute } from '../../../models/token-attribute';
import { TokenAttributeType } from '../../../models/token-attribute-type';
import {
  BarcodeService
} from '../../../services/external/barcode.service';

type Align = 'left' | 'center' | 'right';

@Component({
  selector: 'app-bar-code-editor',
  standalone: true,
  templateUrl: './bar-code-editor.component.html',
  styleUrls: ['./bar-code-editor.component.scss'],
  imports: [
    CommonModule, FormsModule, NgIf, NgFor,
    MatFormField, MatInput, MatLabel,
    MatIcon,
    MatButtonToggleGroup, MatButtonToggle,
    MatSelect, MatOption, MatButton
  ]
})
export class BarCodeEditorComponent implements OnInit, OnChanges {
  // ── Inputs/Outputs ──────────────────────────────────────────────
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Output() public change = new EventEmitter<Cell>();

  // ── Local state ────────────────────────────────────────────────
  public imageBase64: string = '';
  public filename: string = '';
  public width: number = 100;
  public alignment: Align = 'left';

  public textValue: string = '';                         // manual text
  public selectedTokenKey: string | null = null;         // token providing text
  public selectedFormat: ExtendedBarcodeFormat = 'CODE128'; // now typed from service

  public availableFormats: { value: ExtendedBarcodeFormat; label: string }[] = [
    { value: 'CODE128',   label: 'CODE128 (robust, recommended)' },
    { value: 'EAN13',     label: 'EAN-13 (12 digits + check)' },
    { value: 'EAN8',      label: 'EAN-8 (7 digits + check)' },
    { value: 'UPC',       label: 'UPC-A (11 digits + check)' },
    { value: 'CODE39',    label: 'CODE39' },
    { value: 'ITF',       label: 'ITF' },
    { value: 'ITF14',     label: 'ITF-14' },
    { value: 'MSI',       label: 'MSI' },
    { value: 'pharmacode',label: 'Pharmacode' },
    { value: 'codabar',   label: 'Codabar' },
    { value: 'QR',        label: 'QR Code' },
  ];

  public barcodeTokens: TokenAttribute[] = [];
  public errorMsg: string | null = null;
  public isGenerating = false;
  barcodeHeight: number = 40;  // default

  constructor(private readonly barcodeSvc: BarcodeService) {}

  // ── Lifecycle ───────────────────────────────────────────────────
  ngOnInit(): void {
    this.hydrateFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cell'] || changes['tokenAttrs']) {
      this.hydrateFromInputs();
    }
  }

  // ── UI Handlers ────────────────────────────────────────────────
  public onTokenChanged(): void {
    this.errorMsg = null;

    if (this.selectedTokenKey) {
      const token = this.barcodeTokens.find(t => t.name === this.selectedTokenKey);
      this.filename = `[token:${this.selectedTokenKey}]`;
      this.textValue = (token?.value ?? '').toString();

      if (this.textValue) {
        this.tryGenerate();
      } else {
        // No preview yet, but still allow runtime injection
        this.imageBase64 = '';
        this.emitPayload();
      }
    } else {
      // Manual mode
      this.filename = '';
      this.emitPayload();
    }
  }

  // ── Internal helpers ───────────────────────────────────────────
  private hydrateFromInputs(): void {
    // Accept TEXT, NUMBER, BARCODE as sources for barcode content
    const allowed = new Set<TokenAttributeType | string>([
      TokenAttributeType.TEXT,
      TokenAttributeType.NUMBER,
      TokenAttributeType.BARCODE
    ]);
    this.barcodeTokens = (this.tokenAttrs ?? []).filter(t => allowed.has(t.type));

    const bb: BarcodeBlock | undefined = (this.cell as any)?.barcodeBlock;

    if (bb?.imageBase64) this.imageBase64 = bb.imageBase64;
    if (bb?.filename)    this.filename    = bb.filename;
    if (bb?.heightPx)    this.barcodeHeight    = bb.heightPx;
    if (bb?.format)      this.selectedFormat    = bb.format;
    if (bb?.text)      this.textValue    = bb.text;

    this.width     = this.clampWidth(bb?.width ?? this.width ?? 100);
    this.alignment = (bb?.alignment as Align) ?? this.alignment;

    const tokenKey = (bb as any)?.HtmlTokenElement?.key as string | undefined;
    if (tokenKey) {
      this.selectedTokenKey = tokenKey;
      const t = this.barcodeTokens.find(x => x.name === tokenKey);
      this.textValue = (t?.value ?? '').toString();
      if (this.textValue) {
        // best-effort preview
        this.tryGenerate(false);
        return; // emit will happen in tryGenerate
      }
    }

    // keep parent in sync
    this.emitPayload();
  }

  public async tryGenerate(emitAfter: boolean = true): Promise<void> {
    this.errorMsg = null;
    const text = (this.textValue || '').trim();

    if (!text) {
      this.imageBase64 = '';
      this.errorMsg = 'Enter text or select a token with a value.';
      if (emitAfter) this.emitPayload();
      return;
    }

    this.isGenerating = true;
    try {
      // Delegate entirely to the service (1D and QR)
      const dataUrl: string = await this.barcodeSvc.generateDataUrl(text, {
        format: this.selectedFormat,
        // 1D defaults (ignored by QR)
        width: 2,
        height: this.barcodeHeight,
        displayValue: false,
        margin: 3,
        // QR defaults (ignored by 1D)
        size: 256,
        errorCorrectionLevel: 'M',
        dark: '#000000',
        light: '#ffffff'
      });

      this.imageBase64 = dataUrl;

      // If manual text, suggest a friendly filename via the service
      if (!this.selectedTokenKey) {
        this.filename = this.barcodeSvc.suggestFilename(this.selectedFormat, text);
      }
    } catch (e: any) {
      this.imageBase64 = '';
      this.errorMsg = e?.message || 'Failed to generate barcode. Check the text and type.';
    } finally {
      this.isGenerating = false;
      if (emitAfter) this.emitPayload();
    }
  }

  private emitPayload(): void {
    const barcodeBlock: BarcodeBlock = {
      imageBase64: this.imageBase64 || '',
      filename:
        this.filename ||
        (this.selectedTokenKey ? `[token:${this.selectedTokenKey}]` : ''),
      width: this.width,
      format: this.selectedFormat,
      heightPx: this.barcodeHeight,
      text: this.textValue,
      alignment: this.alignment,
      ...(this.selectedTokenKey
        ? { HtmlTokenElement: { key: this.selectedTokenKey, type: 'barcode' } }
        : {})
    } as BarcodeBlock;
debugger;
    const updated: Cell = { ...this.cell, barcodeBlock };
    updated.type = 'barcode';
    this.change.emit(updated);
  }

  private clampWidth(n: number): number {
    return Math.min(100, Math.max(1, Math.round(n)));
  }

  onWidthChanged(v: number | string): void {
    const n = Number(v);
    if (Number.isFinite(n)) this.width = this.clampWidth(n);
    this.tryGenerate();
  }

  onAlignmentChanged(): void {
    this.tryGenerate();
  }

  onHeightChanged(newHeight: number) {
    this.barcodeHeight = newHeight;
    this.tryGenerate();
  }

  onFormatChanged(format: ExtendedBarcodeFormat) {
    this.selectedFormat = format;
    this.tryGenerate();
  }

  onTextValueChange(value: string) {
    this.textValue = value;
    this.tryGenerate();
  }
}
