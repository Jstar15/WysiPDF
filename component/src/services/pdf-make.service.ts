// src/services/pdf-make.service.ts
import { Injectable } from '@angular/core';
import { vfsFonts } from '../assets/vfs-fonts';

type PdfMakeType = any;

@Injectable({ providedIn: 'root' })
export class PdfMakeService {
  private loadPromise: Promise<void> | null = null;
  private pdfMake: PdfMakeType | null = null;
  private isInitialized = false;

  private readonly fonts = {
    Raleway: {
      normal: 'Raleway-Regular.ttf',
      bold: 'Raleway-Bold.ttf',
      italics: 'Raleway-Italic.ttf',
      bolditalics: 'Raleway-BoldItalic.ttf'
    },
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Bold.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-BoldItalic.ttf'
    },
    Cormorant: {
      normal: 'CormorantGaramond-Regular.ttf',
      bold: 'CormorantGaramond-Bold.ttf',
      italics: 'CormorantGaramond-Italic.ttf',
      bolditalics: 'CormorantGaramond-BoldItalic.ttf'
    },
    Nunito: {
      normal: 'Nunito-Regular.ttf',
      bold: 'Nunito-Bold.ttf',
      italics: 'Nunito-Italic.ttf',
      bolditalics: 'Nunito-BoldItalic.ttf'
    },
    OpenSans: {
      normal: 'OpenSans_Condensed-Regular.ttf',
      bold: 'OpenSans_Condensed-Bold.ttf',
      italics: 'OpenSans_Condensed-Italic.ttf',
      bolditalics: 'OpenSans_Condensed-BoldItalic.ttf'
    }
  };

  private async ensureLoaded(): Promise<void> {
    if (this.isInitialized) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        const pdfMakeModule: any = await import('pdfmake/build/pdfmake');
        const pdfMakeLoaded: any =
          pdfMakeModule.pdfMake || pdfMakeModule.default || pdfMakeModule;

        this.pdfMake = pdfMakeLoaded;

        // Apply VFS and fonts
        this.pdfMake.vfs = vfsFonts;
        this.pdfMake.fonts = this.fonts;

        // Optional internal FS injection
        const fs = this.pdfMake.fs;
        if (fs?.writeFileSync) {
          for (const [name, data] of Object.entries(vfsFonts)) {
            try {
              fs.writeFileSync(name, data);
            } catch (err) {
              console.warn(`⚠️ Could not write font file "${name}" to internal fs:`, err);
            }
          }
        }

        this.isInitialized = true;
      } catch (err) {
        console.error('❌ Failed to load/initialize pdfMake:', err);
        throw err;
      }
    })();

    return this.loadPromise;
  }

  public async createPdf(docDefinition: any): Promise<any> {
    await this.ensureLoaded();
    if (!this.pdfMake) {
      throw new Error('pdfMake did not initialize properly');
    }
    return this.pdfMake.createPdf.bind(this.pdfMake)(docDefinition);
  }

  public async getBase64(docDefinition: any): Promise<string> {
    const pdf = await this.createPdf(docDefinition);
    return new Promise((resolve, reject) => {
      pdf.getBase64((b64: string) => {
        if (b64) resolve(b64);
        else reject(new Error('Failed to generate base64 PDF'));
      });
    });
  }
}
