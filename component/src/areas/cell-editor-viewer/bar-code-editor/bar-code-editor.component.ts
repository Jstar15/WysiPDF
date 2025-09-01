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

import { Cell, BarcodeBlock } from '../../../models/interfaces';
import { TokenAttribute } from '../../../models/TokenAttribute';
import { TokenAttributeTypeEnum } from '../../../models/TokenAttributeTypeEnum';
import { BarcodeFormat, BarcodeService } from '../../../services/external/barcode.service';

type Align = 'left' | 'center' | 'right';
type ExtendedBarcodeFormat = BarcodeFormat | 'QR';

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
  // ── Inputs/Outputs (mirror Image editor) ────────────────────────
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Output() public change = new EventEmitter<Cell>();

  // ── Local state for UI/preview ──────────────────────────────────
  public imageBase64: string = '';
  public filename: string = '';
  public width: number = 100;
  public alignment: Align = 'left';

  public textValue: string = '';                         // manual text
  public selectedTokenKey: string | null = null;         // token providing text
  public selectedFormat: ExtendedBarcodeFormat = 'CODE128'; // preview-only

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
    // NEW (no service change needed)
    { value: 'QR',        label: 'QR Code' },
  ];

  public barcodeTokens: TokenAttribute[] = [];
  public errorMsg: string | null = null;
  public isGenerating = false;

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
    const allowed = new Set<TokenAttributeTypeEnum | string>([
      TokenAttributeTypeEnum.TEXT,
      TokenAttributeTypeEnum.NUMBER,
      TokenAttributeTypeEnum.BARCODE
    ]);
    this.barcodeTokens = (this.tokenAttrs ?? []).filter(t => allowed.has(t.type));

    const bb: BarcodeBlock | undefined = (this.cell as any)?.barcodeBlock;

    if (bb?.imageBase64) this.imageBase64 = bb.imageBase64;
    if (bb?.filename)    this.filename    = bb.filename;

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

    // If no token preview, still emit current state so parent stays in sync
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
      let dataUrl: string;

      if (this.selectedFormat === 'QR') {
        // Generate QR without touching your service
        const { toDataURL } = await import('qrcode');
        dataUrl = await toDataURL(text, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 256,
          color: { dark: '#000000', light: '#ffffff' }
        });
      } else {
        // 1D path (unchanged)
        dataUrl = await this.barcodeSvc.generate(text, {
          format: this.selectedFormat as BarcodeFormat,
          width: 2,
          height: 90,
          displayValue: false,
          margin: 10
        });
      }

      this.imageBase64 = dataUrl;

      // If manual text, give a friendly filename
      if (!this.selectedTokenKey) {
        const safe = text.slice(0, 16).replace(/[^a-z0-9\-_.]+/gi, '_');
        this.filename = `barcode-${this.selectedFormat}-${safe}.png`;
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
      alignment: this.alignment,
      ...(this.selectedTokenKey
        ? { HtmlTokenElement: { key: this.selectedTokenKey, type: 'barcode' } }
        : {})
    } as BarcodeBlock;

    const updated: Cell = { ...this.cell, barcodeBlock };
    this.change.emit(updated);
  }

  private clampWidth(n: number): number {
    return Math.min(100, Math.max(1, Math.round(n)));
  }

  onWidthChanged(v: number | string): void {
    const n = Number(v);
    if (Number.isFinite(n)) this.width = this.clampWidth(n);
    this.emitPayload();
  }

  onAlignmentChanged(): void {
    this.emitPayload();
  }
}
