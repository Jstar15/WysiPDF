import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

import { BarcodeService, BarcodeFormat } from '../../services/barcode.service';
import { TokenAttribute } from '../../models/TokenAttribute';
import { TokenAttributeTypeEnum } from '../../models/TokenAttributeTypeEnum';
import { BarcodeBlock } from '../../models/interfaces';

export interface AddBarCodeDialogPayload {
  // If editing an existing block, pass it in. Otherwise pass a skeleton.
  barcodeBlock: BarcodeBlock;
  tokenAttrs: TokenAttribute[]; // tokens that might hold the text for the barcode
}

@Component({
  selector: 'app-add-bar-code-dialog',
  templateUrl: './add-bar-code-dialog.component.html',
  styleUrls: ['./add-bar-code-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule, NgIf, NgFor,
    MatDialogTitle, MatDialogActions,
    MatFormField, MatInput, MatLabel,
    MatButton, MatIcon,
    MatButtonToggleGroup, MatButtonToggle,
    MatSelect, MatOption
  ]
})
export class AddBarCodeDialogComponent implements OnInit {
  // Visual/display options (same contract as ImageBlock/BarcodeBlock)
  public imageBase64: string = '';
  public filename: string = '';
  public width: number = 100;
  public alignment: 'left' | 'center' | 'right' = 'left';

  // Barcode inputs
  public textValue: string = '';                    // manual text
  public selectedTokenKey: string | null = null;    // token providing text
  public selectedFormat: BarcodeFormat = 'CODE128'; // default, robust

  // Options / state
  public availableFormats: { value: BarcodeFormat; label: string }[] = [
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
  ];

  public barcodeTokens: TokenAttribute[] = [];
  public errorMsg: string | null = null;
  public isGenerating = false;

  constructor(
    private readonly barcodeSvc: BarcodeService,
    public dialogRef: MatDialogRef<BarcodeBlock, BarcodeBlock>,
    @Inject(MAT_DIALOG_DATA) public data: AddBarCodeDialogPayload
  ) {}

  ngOnInit(): void {
    // Accept TEXT, NUMBER, BARCODE as sources for the barcode content
    const allowed = new Set< TokenAttributeTypeEnum | string >([
      TokenAttributeTypeEnum.TEXT,
      TokenAttributeTypeEnum.NUMBER,
      TokenAttributeTypeEnum.BARCODE
    ]);

    this.barcodeTokens = (this.data?.tokenAttrs || []).filter(t => allowed.has(t.type));

    if (this.data?.barcodeBlock) {
      const bb = this.data.barcodeBlock;
      this.imageBase64 = bb.imageBase64 || '';
      this.filename = bb.filename || '';
      this.width = bb.width ?? 100;
      this.alignment = bb.alignment || 'left';

      const tokenKey = (bb as any)?.HtmlTokenElement?.key as string | undefined;
      if (tokenKey) {
        this.selectedTokenKey = tokenKey;
        // Try to preview using current token value (if present)
        const t = this.barcodeTokens.find(x => x.name === tokenKey);
        if (t?.value) {
          this.textValue = t.value;
          this.tryGenerate();
        }
      }
    }
  }

  public onTokenChanged(): void {
    this.errorMsg = null;

    if (this.selectedTokenKey) {
      const token = this.barcodeTokens.find(t => t.name === this.selectedTokenKey);
      this.filename = `[token:${this.selectedTokenKey}]`;
      this.textValue = token?.value ?? ''; // if absent, we can’t preview, but still allow save
      if (this.textValue) {
        this.tryGenerate();
      } else {
        // No preview available yet
        this.imageBase64 = '';
      }
    } else {
      // Reset to manual mode
      this.filename = '';
    }
  }

  public async tryGenerate(): Promise<void> {
    this.errorMsg = null;
    this.isGenerating = true;
    try {
      const text = (this.textValue || '').trim();
      if (!text) {
        this.imageBase64 = '';
        this.errorMsg = 'Enter text or select a token with a value.';
        return;
      }
      const dataUrl = await this.barcodeSvc.generate(text, {
        format: this.selectedFormat,
        // You can tweak pixel size if you like; this is just for the source image.
        width: 2,
        height: 90,
        displayValue: false,
        margin: 10
      });
      this.imageBase64 = dataUrl;
      // If manual text, set a friendly filename
      if (!this.selectedTokenKey) {
        const safe = text.slice(0, 16).replace(/[^a-z0-9\-_.]+/gi, '_');
        this.filename = `barcode-${this.selectedFormat}-${safe}.png`;
      }
    } catch (e: any) {
      this.imageBase64 = '';
      this.errorMsg = e?.message || 'Failed to generate barcode. Check the text and type.';
    } finally {
      this.isGenerating = false;
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    const result: BarcodeBlock = {
      imageBase64: this.imageBase64 || '',
      filename: this.filename || (this.selectedTokenKey ? `[token:${this.selectedTokenKey}]` : 'barcode.png'),
      width: this.width,
      alignment: this.alignment,
      ...(this.selectedTokenKey
        ? { HtmlTokenElement: { key: this.selectedTokenKey, type: 'barcode' } }
        : {})
    };

    this.dialogRef.close(result);
  }

  public canSave(): boolean {
    // Allow save if we generated a preview OR a token key is chosen (runtime injection later)
    return !!this.imageBase64 || !!this.selectedTokenKey;
  }
}
