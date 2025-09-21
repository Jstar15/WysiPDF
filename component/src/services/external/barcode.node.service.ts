import canvas from 'canvas';
const { createCanvas } = canvas; // destructure after import

import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { BarcodeFormat, ExtendedBarcodeFormat, QRLevel } from '../../models/page';
import { IBarcodeService } from './barcode-service.interface';

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

/**
 * Node-only barcode service
 * Renders directly into PNG with canvas
 */
export class BarcodeServiceNode implements IBarcodeService {
  private isNode: boolean;

  constructor() {
    this.isNode = typeof window === 'undefined';
  }

  suggestFilename(format: ExtendedBarcodeFormat, text: string): string {
    const clean = (text ?? '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${clean || 'barcode'}.png`;
  }

  async generatePngBuffer(
    text: string,
    opts: GenerateBarcodeOptions
  ): Promise<Buffer> {
    if (!this.isNode) {
      throw new Error('BarcodeServiceNode can only run in Node');
    }

    const clean = (text ?? '').trim();
    if (!clean) throw new Error('No text provided for barcode generation.');

    this.validateInput(clean, opts.format);

    if (opts.format === 'QR') {
      const size = opts.size ?? 256;
      const canvasEl = createCanvas(size, size);
      await QRCode.toCanvas(canvasEl, clean, {
        errorCorrectionLevel: opts.errorCorrectionLevel ?? 'M',
        margin: opts.margin ?? 2,
        width: size,
        color: { dark: opts.dark ?? '#000000', light: opts.light ?? '#ffffff' },
      });
      return canvasEl.toBuffer('image/png');
    } else {
      const width = opts.width ?? 2;
      const height = opts.height ?? 90;
      const canvasEl = createCanvas(400, 200); // enough space
      JsBarcode(canvasEl, clean, {
        format: opts.format as BarcodeFormat,
        width,
        height,
        displayValue: opts.displayValue ?? false,
        margin: opts.margin ?? 10,
      });
      return canvasEl.toBuffer('image/png');
    }
  }

  async generateDataUrl(
    text: string,
    opts: GenerateBarcodeOptions
  ): Promise<string> {
    const buffer = await this.generatePngBuffer(text, opts);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  }

  private validateInput(text: string, format: ExtendedBarcodeFormat) {
    if (!this.isNode || format === 'QR') return;

    switch (format) {
      case 'EAN13':
        if (!/^\d{12,13}$/.test(text))
          throw new Error('EAN-13 requires 12 digits (13th optional)');
        break;
      case 'EAN8':
        if (!/^\d{7,8}$/.test(text))
          throw new Error('EAN-8 requires 7 digits (8th optional)');
        break;
      case 'UPC':
        if (!/^\d{11,12}$/.test(text))
          throw new Error('UPC requires 11 digits (12th optional)');
        break;
      case 'ITF':
      case 'ITF14':
        if (!/^\d+$/.test(text) || text.length % 2 !== 0)
          throw new Error(`${format} requires even digits`);
        break;
      case 'CODE39':
        if (!/^[0-9A-Z\-.\$\/+% ]+$/.test(text))
          throw new Error('CODE39 only supports A–Z, 0–9, space, - . $ / + %');
        break;
      case 'MSI':
        if (!/^\d+$/.test(text)) throw new Error('MSI requires numeric digits');
        break;
      case 'pharmacode': {
        if (!/^\d+$/.test(text))
          throw new Error('Pharmacode requires numeric digits');
        const num = parseInt(text, 10);
        if (num < 3 || num > 131070)
          throw new Error('Pharmacode must be 3–131070');
        break;
      }
      case 'codabar':
        if (!/^[0-9\-\$:/.+ABCD]+$/.test(text))
          throw new Error('Codabar supports 0–9, - $ : / . + A–D');
        break;
      case 'CODE128':
        if (text.length === 0)
          throw new Error('CODE128 requires at least 1 character');
        break;
    }
  }
}
