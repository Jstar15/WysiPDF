import { Injectable } from '@angular/core';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import {BarcodeFormat, ExtendedBarcodeFormat, QRLevel} from "../../models/page";

export interface GenerateBarcodeOptions {
  format: ExtendedBarcodeFormat;

  // 1D
  width?: number;
  height?: number;
  displayValue?: boolean;
  margin?: number;

  // QR
  size?: number;
  errorCorrectionLevel?: QRLevel;
  dark?: string;
  light?: string;
}

@Injectable({ providedIn: 'root' })
export class BarcodeService {
  async generateDataUrl(text: string, opts: GenerateBarcodeOptions): Promise<string> {
    const clean = (text ?? '').trim();
    if (!clean) throw new Error('No text provided for barcode generation.');

    // 🔍 Validate based on format before generating
    this.validateInput(clean, opts.format);

    if (opts.format === 'QR') {
      return QRCode.toDataURL(clean, {
        errorCorrectionLevel: opts.errorCorrectionLevel ?? 'M',
        margin: opts.margin ?? 2,
        width: opts.size ?? 256,
        color: {
          dark: opts.dark ?? '#000000',
          light: opts.light ?? '#ffffff',
        },
      });
    }

    // 1D branch
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, clean, {
          format: opts.format as BarcodeFormat,
          width: opts.width ?? 2,
          height: opts.height ?? 90,
          displayValue: opts.displayValue ?? false,
          margin: opts.margin ?? 10,
        });
        resolve(canvas.toDataURL('image/png'));
      } catch (err: any) {
        reject(new Error(`Failed to generate ${opts.format} barcode: ${err?.message || 'Unknown error'}`));
      }
    });
  }

  /** Validate text requirements for each format */
  private validateInput(text: string, format: ExtendedBarcodeFormat): void {
    if (format === 'QR') return; // no restriction except size limits

    switch (format) {
      case 'EAN13':
        if (!/^\d{12,13}$/.test(text)) {
          throw new Error('EAN-13 requires 12 digits (the 13th check digit is optional).');
        }
        break;
      case 'EAN8':
        if (!/^\d{7,8}$/.test(text)) {
          throw new Error('EAN-8 requires 7 digits (the 8th check digit is optional).');
        }
        break;
      case 'UPC':
        if (!/^\d{11,12}$/.test(text)) {
          throw new Error('UPC requires 11 digits (the 12th check digit is optional).');
        }
        break;
      case 'ITF':
      case 'ITF14':
        if (!/^\d+$/.test(text) || text.length % 2 !== 0) {
          throw new Error(`${format} requires an even number of digits.`);
        }
        break;
      case 'CODE39':
        if (!/^[0-9A-Z\-.\$\/+% ]+$/.test(text)) {
          throw new Error('CODE39 only supports A–Z, 0–9, space, and - . $ / + %');
        }
        break;
      case 'MSI':
        if (!/^\d+$/.test(text)) {
          throw new Error('MSI requires only numeric digits.');
        }
        break;
      case 'pharmacode':
        if (!/^\d+$/.test(text)) {
          throw new Error('Pharmacode requires only numeric digits.');
        }
        const num = parseInt(text, 10);
        if (num < 3 || num > 131070) {
          throw new Error('Pharmacode must be between 3 and 131070.');
        }
        break;
      case 'codabar':
        if (!/^[0-9\-\$:/.+ABCD]+$/.test(text)) {
          throw new Error('Codabar supports 0–9, - $ : / . + and start/stop A–D.');
        }
        break;
      case 'CODE128':
        // CODE128 accepts full ASCII but reject empty
        if (text.length === 0) {
          throw new Error('CODE128 requires at least 1 character.');
        }
        break;
    }
  }

  suggestFilename(format: ExtendedBarcodeFormat, text: string): string {
    const safe = (text ?? '').slice(0, 16).replace(/[^a-z0-9\-_.]+/gi, '_');
    return `barcode-${format}-${safe || 'value'}.png`;
  }
}
