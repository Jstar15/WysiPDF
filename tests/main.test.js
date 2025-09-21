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
  let pdfBase642;
  let pdfBase643;
  before(async () => {
    wysi = new WysiPDFNode();
    pdfBase64 = await wysi.generatePdfBase64(Preset1,  []);
    const outputPath = path.join(pdfOutputFolder, 'test-output.pdf');
    fs.writeFileSync(outputPath, Buffer.from(pdfBase64, 'base64'));


    const tokens = [
      {
        "name": "test-token",
        "value": "replaced-token-success",
        "type": "text"
      }
    ];
    pdfBase642 = await wysi.generatePdfBase64(Preset2,  tokens);
    const outputPath2 = path.join(pdfOutputFolder, 'test-output-2.pdf');
    fs.writeFileSync(outputPath2, Buffer.from(pdfBase642, 'base64'));

    pdfBase643 = await wysi.generatePdfBase64(Preset2,  tokens);
    const outputPath3 = path.join(pdfOutputFolder, 'test-output-2.pdf');
    fs.writeFileSync(outputPath3, Buffer.from(pdfBase643, 'base64'));
  });

  it('should generate a PDF containing "Hello World"', async () => {
    const pdfData = new Uint8Array(Buffer.from(pdfBase64, 'base64'));
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let found = false;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const textItems = content.items.map(item => item.str).join('');
      console.log(textItems);
      if (textItems.includes('Hello World')) {
        found = true;
        break;
      }
    }

    expect(found).to.be.true;
  });


  it('should generate a PDF with Token Replacement"', async () => {
    const pdfData = new Uint8Array(Buffer.from(pdfBase642, 'base64'));
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let found = false;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const textItems = content.items.map(item => item.str).join('');
      console.log(textItems);
      if (textItems.includes('replaced-token-success')) {
        found = true;
        break;
      }
    }

    expect(found).to.be.true;
  });

  it('should fail token validation', async () => {
    const errors = await wysi.hasErrors(Preset2,  []);
    expect(errors?.length > 0).to.equal(true);
  });

  it('should pass token validation', async () => {
    const tokens = [
      {
        "name": "test-token",
        "value": "replaced-token-success",
        "type": "text"
      }
    ];
    const errors = await wysi.hasErrors(Preset2,  tokens);
    expect(errors?.length === 0).to.equal(true);
  });

  it('should validate isValid returns true', async () => {
    const valid = await wysi.isValid(Preset1, []);
    expect(valid).to.equal(true);
  });
});
