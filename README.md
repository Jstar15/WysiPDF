# WysiPDF

WysiPDF is a lightweight PDF design tool with a fully visual, grid-based interface that lets you design rows, columns, and content blocks with ease. Built on pdfMake, it enables the creation of dynamic, data-driven PDF templates, and is bundled into a single JavaScript file for fast deployment — in the browser or on the server.

![WysiPDF screenshot](readme/images/screenshot-3.png)

---

## 🚀 Live Demo

Try it in the browser: **[https://jstar15.github.io/WysiPDF/](https://jstar15.github.io/WysiPDF/)**

---

## ✨ Key Features

### Grid-Based Editor & Layout

* **Flexible Grid Engine**: rows and cells with **resizable widths**, **adjustable heights**, and **relative sizing**. Content flows naturally downward.
* **Row & Column Management**: drag, reorder, duplicate, add, or remove rows and columns.
* **Repeatable Rows**: assign a JSON array to dynamically render rows or sections.
* **Conditional Display**: show or hide rows based on **token-based logic**.
* **Page Breaks**: insert breaks anywhere; content flows across pages automatically.
* **Cell Styling**: define padding, background color, borders, alignment, and relative width.
* **Page Numbering**: Inject page number into the footer of each page
* **Different Headers**: Can configure a header for page 2+

### Rich Content Blocks

* **Rich Text**: QuillJS-powered formatting with bold, italic, underline, font size/color, alignment, and inline tokens.
* **Tables**: structured rows/cells with support for rich text, bullets, and alignment.
* **Images**: insert file uploads or base64 directly into cells, with **automatic compression** for performance.
* **Charts**: Pie, Doughnut, and Bar charts rendered as high-quality PNGs.
* **Barcodes & QR Codes**: configurable 1D/2D codes, exported as PNG for crisp printing.
* **Dynamic Tokens**: all content blocks can bind to tokens for live data rendering.
* **Icons**: Icon can be inserted, icon pack included.

### Styling & Theming

* **Fonts**: Roboto, Raleway, Nunito, Cormorant.
* **Color Palettes**: define once, reuse anywhere for consistent styling.
* **Headers & Footers**: repeat automatically, with page numbering, margins, and background colors.
* **Template Presets**: 6 built-in templates for quick prototyping and demos.

### Tokens, Data & Validation

* **Token Editor**: add, edit, or import tokens from JSON payloads.
* **Dynamic JSON Injection**: generate PDFs with **any valid JSON structure**.
* **Conditional Logic**: AND/OR rules determine visibility of rows or blocks.
* **Repeatable Content**: iterate over arrays for multiple row rendering.
* **Validation**: missing or invalid tokens highlighted in red; optional pre-generation validation available.



![WysiPDF screenshot](readme/images/flow.png)

### Export & Runtime

* **PDF**: generated as base64 via pdfMake.
* **Standalone HTML Export**: fully self-contained with embedded images, charts, and barcodes.
* **Live Preview**: reflects exactly how the final PDF will render.
* **Inspector / Debug Mode**: view **Page JSON**, **pdfMake definition**, and **token list**.
* **Undo/Redo**: full forward/backward state management.

---

## 📦 Installation & Usage

### Option A — Standalone (no build tools)

Include the built script and access `WysiPDF` globally. 
See full working example in the repo ./docs/index.html
```html
<script src="./wysipdf.bundle.js"></script>

<div id="editor-host"></div>

<button id="exportHtml">Export HTML</button>
<button id="exportPdf">Export PDF</button>

<script>
  let wysi, page;

  window.addEventListener('DOMContentLoaded', async () => {
    wysi = new WysiPDF({ mount: '#editor-host' });

    await wysi.onPageChange(p => (page = p));

    document.getElementById('exportPdf').addEventListener('click', async () => {
      const base64 = await wysi.generatePdfBase64(page, page.tokenAttrs || []);
      const a = document.createElement('a');
      a.href = 'data:application/pdf;base64,' + base64;
      a.download = 'wysipdf.pdf';
      a.click();
    });
  });
</script>
```

### Option B — ESM / Node.js (Server)

Run WysiPDF on the server using Node.js:

```ts
import fs from 'fs';
import WysiPDFNodeModule from './wysipdf.node.esm.mjs';
const WysiPDFNode = WysiPDFNodeModule.default || WysiPDFNodeModule;

(async () => {
  const wysi = new WysiPDFNode();
  const pdfBase64 = await wysi.generatePdfBase64(page, page.tokenAttrs || []);
  fs.writeFileSync('output.pdf', Buffer.from(pdfBase64, 'base64'));
  console.log('PDF successfully exported to output.pdf');
})();
```

### Option C — Install via npm (node 22+)
Install WysiPDF directly from npm:

```bash
npm install wysipdf
```

Then use in your Node.js project:

```ts
import WysiPDFNodeModule from 'wysipdf';
import page from './template-2.json' assert { type: 'json' };
import fs from 'fs';

const WysiPDFNode = WysiPDFNodeModule.default || WysiPDFNodeModule;

(async () => {
  const wysi = new WysiPDFNode();
  const pdfBase64 = await wysi.generatePdfBase64(page, page.tokenAttrs || []);
  fs.writeFileSync('output.pdf', Buffer.from(pdfBase64, 'base64'));
  console.log('PDF successfully exported to output.pdf');
})();
```

The npm package includes both the Node ESM bundle and the browser bundle.


---

## 🔶 Runtime API

| Method                                  | Description                                                               |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `loadPage(page)`                        | Load a page model into the editor host                                    |
| `onPageChange(cb)`                      | Subscribe to live edits of the page model                                 |
| `generatePdfBase64(page, tokens)`       | Produce a PDF (base64) from a page + dynamic tokens                       |
| `generatePdfBase64FromJson(page, json)` | Produce a PDF from a raw JSON payload                                     |
| `generateHtml(page, tokens)`            | Produce standalone HTML (string) for the page                             |
| `generateHtmlFromJson(page, json)`      | Produce HTML from a raw JSON token payload                                |
| `hasErrors(page, tokens)`               | Validate tokens; returns list of errors (red-highlighted cells in editor) |
| `isValid(page, tokens)`                 | Returns `true` if `hasErrors(...).length === 0`                           |

---

## 🗱 Content Blocks

* **Text**: rich text with inline tokens and QuillJS styling.
* **Image**: upload or base64; automatically compressed for performance; adjustable alignment, padding, and sizing.
* **Chart**: Pie, Doughnut, Bar rendered as PNG.
* **Barcode / QR**: 1D/2D codes, PNG export for print fidelity.
* **Table**: structured rows/cells with bullets and rich text.
* **Spacer / Divider**: control layout rhythm.
* **Page Break**: deterministic pagination control.
* **Validation**: highlights missing or invalid tokens in red.

---

## 🔶 Tokens & Dynamic Content

* Supports **text, number, boolean, date, JSON/array tokens**.
* **Dynamic JSON injection**: automatically maps JSON to template fields.
* **Conditional Logic**: AND/OR rules for row/block visibility.
* **Repeatable Rows / Partials**: iterate over arrays for multiple renderings.

---

## 🔧 Powered By

WysiPDF integrates libraries **behind the scenes** to enable its rich functionality:

* **QuillJS** for rich text editing.
* **pdfMake** for PDF generation.
* **ECharts** for charts.
* **JsBarcode & QRCode** for barcodes.
* **Angular** framework for dynamic editing, state management, and UI components.
* **Auto Image Compression** ensures performance and lightweight exports.

All bundled into **one single JS file** that can run on **client or server side**.

---

## 📄 License

MIT