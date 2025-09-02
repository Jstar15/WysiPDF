import { Injectable } from '@angular/core';
import JsBarcode from 'jsbarcode';

/** 1D formats (unchanged) */
export type BarcodeFormat =
  | 'CODE128'
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'CODE39'
  | 'ITF'
  | 'ITF14'
  | 'MSI'
  | 'pharmacode'
  | 'codabar';

/** 2D */
export type QRLevel = 'L' | 'M' | 'Q' | 'H';
export type ExtendedBarcodeFormat = BarcodeFormat | 'QR';

export interface GenerateBarcodeOptions {
  /** Required: which symbology to render */
  format: ExtendedBarcodeFormat;

  /** 1D options */
  width?: number;         // bar width (px)
  height?: number;        // bar height (px)
  displayValue?: boolean;
  margin?: number;        // quiet zone (px)

  /** QR options */
  size?: number;                 // final pixel size (square)
  errorCorrectionLevel?: QRLevel;
  dark?: string;                 // CSS color for dark modules
  light?: string;                // CSS color for light modules
}

@Injectable({ providedIn: 'root' })
export class BarcodeService {
  /**
   * Unified generator for both 1D (JsBarcode) and 2D (QR) barcodes.
   * Returns a PNG data URL.
   */
  async generateDataUrl(text: string, opts: GenerateBarcodeOptions): Promise<string> {
    const clean = (text ?? '').trim();
    if (!clean) throw new Error('No text provided for barcode generation.');

    if (opts.format === 'QR') {
      const { toDataURL } = await import('qrcode'); // lazy load to keep bundle slim
      return await toDataURL(clean, {
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
        reject(new Error(err?.message || 'Barcode generation failed.'));
      }
    });
  }

  /** Helper: propose a friendly filename for manually-entered values */
  suggestFilename(format: ExtendedBarcodeFormat, text: string): string {
    const safe = (text ?? '').slice(0, 16).replace(/[^a-z0-9\-_.]+/gi, '_');
    return `barcode-${format}-${safe || 'value'}.png`;
  }
}
