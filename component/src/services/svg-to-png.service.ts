import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgToPngService {

  /**
   * Converts an SVG string to a PNG base64 string.
   * @param svgContent SVG markup string
   * @param width desired PNG width in px
   * @param height desired PNG height in px
   */
  public svgToPng(svgContent: string, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        // get PNG as base64
        const pngData = canvas.toDataURL('image/png');
        resolve(pngData);
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }
}
