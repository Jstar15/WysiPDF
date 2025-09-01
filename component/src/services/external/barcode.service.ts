import { Injectable } from '@angular/core';
import JsBarcode from 'jsbarcode';

// Your existing 1D formats stay the same:
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

export interface BarcodeOptions {
  format: BarcodeFormat;
  width?: number;        // bar width (px)
  height?: number;       // bar height (px)
  displayValue?: boolean;
  margin?: number;       // quiet zone (px)
}

/** New: QR options (2D) */
export type QRLevel = 'L' | 'M' | 'Q' | 'H';
export interface QROptions {
  size?: number;                 // final pixel size (square)
  margin?: number;               // quiet zone
  errorCorrectionLevel?: QRLevel;
  dark?: string;                 // CSS color for dark modules
  light?: string;                // CSS color for light modules
}

@Injectable({ providedIn: 'root' })
export class BarcodeService {
  /** 1D barcodes via JsBarcode (unchanged) */
  async generate(text: string, opts: BarcodeOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, text, {
          format: opts.format,
          width: opts.width ?? 2,
          height: opts.height ?? 80,
          displayValue: opts.displayValue ?? false,
          margin: opts.margin ?? 10,
        });
        resolve(canvas.toDataURL('image/png'));
      } catch (err: any) {
        reject(err?.message || 'Barcode generation failed.');
      }
    });
  }

  /** NEW: QR codes via the 'qrcode' package (browser-friendly) */
  async generateQR(text: string, opts: QROptions = {}): Promise<string> {
    // Lazy-load to keep your main bundle lean
    const { toDataURL } = await import('qrcode');
    const dataUrl = await toDataURL(text, {
      errorCorrectionLevel: opts.errorCorrectionLevel ?? 'M',
      margin: opts.margin ?? 2,
      width: opts.size ?? 256,
      color: {
        dark:  opts.dark  ?? '#000000',
        light: opts.light ?? '#ffffff',
      },
    });
    return dataUrl;
  }
}
