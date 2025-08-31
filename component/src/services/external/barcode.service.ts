import { Injectable } from '@angular/core';
import JsBarcode from 'jsbarcode';

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

@Injectable({ providedIn: 'root' })
export class BarcodeService {
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
}
