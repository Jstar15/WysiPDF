import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import pdfjsLib from 'pdfjs-dist';
import WysiPDFNodeModule from '../component/dist/components/wysipdf.node.esm.mjs';

const WysiPDFNode = WysiPDFNodeModule.default || WysiPDFNodeModule;

// Load preset JSON
const Preset1 = JSON.parse(
    fs.readFileSync(path.resolve('./json/template-1.json'), 'utf-8')
);
const Preset2 = JSON.parse(
    fs.readFileSync(path.resolve('./json/template-2.json'), 'utf-8')
);
// Ensure pdfs folder exists
const pdfOutputFolder = path.resolve('./pdfs');
if (!fs.existsSync(pdfOutputFolder)) fs.mkdirSync(pdfOutputFolder);

describe('WysiPDF Node PDF Generation', function() {
  this.timeout(10000); // PDFs can take a few seconds

  let wysi;
  let pdfBase64;

  before(async () => {
    wysi = new WysiPDFNode();
    pdfBase64 = await wysi.generatePdfBase64(Preset2, Preset2.tokenAttrs || []);

    // write PDF for visual inspection
    const outputPath = path.join(pdfOutputFolder, 'test-output.pdf');
    fs.writeFileSync(outputPath, Buffer.from(pdfBase64, 'base64'));
  });

  it('should generate a PDF containing "Alexandra"', async () => {
    const pdfData = new Uint8Array(Buffer.from(pdfBase64, 'base64'));
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let found = false;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const textItems = content.items.map(item => item.str).join(' ');
      console.log(textItems);
      if (textItems.includes('Alexandra')) {
        found = true;
        break;
      }
    }

    expect(found).to.be.true;
  });

  it('should pass token validation', async () => {
    const errors = await wysi.hasErrors(Preset1, Preset1.tokenAttrs || []);
    expect(errors?.length ?? 0).to.equal(0);
  });

  it('should validate isValid returns true', async () => {
    const valid = await wysi.isValid(Preset1, Preset1.tokenAttrs || []);
    expect(valid).to.equal(true);
  });
});
