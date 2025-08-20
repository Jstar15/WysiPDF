// assetsLoader.utility.ts
import { vfsFonts } from '../assets/vfs-fonts';

export const assetsLoaderUtility = {
  fonts: {
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
  },

  vfs: vfsFonts,

  rawFiles: Object.entries(vfsFonts).map(([name, data]) => ({
    name,
    data,
  })),

  async load(): Promise<void> {
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;

    // Step 1: Assign full VFS (for debugging/reference)
    (pdfMake as any).vfs = vfsFonts;

    // Step 2: Assign fonts config
    (pdfMake as any).fonts = this.fonts;

    // Step 3: Inject all files into internal fs
    if ((pdfMake as any).fs?.writeFileSync) {
      this.rawFiles.forEach((file) => {
        try {
          (pdfMake as any).fs.writeFileSync(file.name, file.data);
        } catch (err) {
          console.warn(`Failed to write file: ${file.name}`, err);
        }
      });
    }
  },
};
