import {ExtendedBarcodeFormat, QRLevel} from "../../models/page";

export interface IBarcodeService {
  /** Generate a DataURL (browser: <canvas>, Node: base64 PNG) */
  generateDataUrl(text: string, opts: GenerateBarcodeOptions): Promise<string>;

  /** Suggest a filename */
  suggestFilename(format: ExtendedBarcodeFormat, text: string): string;
}
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
