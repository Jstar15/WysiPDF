import { Injectable } from '@angular/core';

// Node canvas library
let Canvas: any;
if (typeof window === 'undefined') {
  Canvas = require('canvas');
}

@Injectable({
  providedIn: 'root',
})
export class SvgToPngService {
  /**
   * Converts an SVG string to a PNG base64 string.
   * Works on Node and modern browsers without using document.createElement.
   * @param svgContent SVG markup string
   * @param width desired PNG width in px
   * @param height desired PNG height in px
   */
  public svgToPng(svgContent: string, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      // Encode SVG
      const encoded = encodeURIComponent(svgContent)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;

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

        // get PNG as base64
        const pngData = canvas.toDataURL('image/png');
        resolve(pngData);
      };
      img.onerror = (e) => reject(e);
      img.src = dataUrl;
    });
  }

}
