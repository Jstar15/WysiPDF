import Preset1 from '../json/template-2.json' with { type: 'json' };

// import Node built-ins
import fs from 'fs';
import WysiPDFNodeModule from '../../component/dist/components/wysipdf.node.esm.mjs';
const WysiPDFNode = WysiPDFNodeModule.default || WysiPDFNodeModule;

(async () => {
  const wysi = new WysiPDFNode();

  const pdfBase64 = await wysi.generatePdfBase64(Preset1, Preset1.tokenAttrs || []);
  fs.writeFileSync('output.pdf', Buffer.from(pdfBase64, 'base64'));

  console.log('PDF successfully exported to output.pdf');
})();
