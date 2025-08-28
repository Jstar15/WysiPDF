# WysiPDF

> ⚠ **Disclaimer:** This project is **a work in progress** and **not ready for production**.
> Features, APIs, and behavior may change without notice. Use at your own risk.

WysiPDF is a visual WYSIWYG editor and runtime for building **dynamic, data-driven documents**.
It ships as a **single bundle** you can drop into any page to design, preview, and generate **PDF** and **HTML** from **predefined** and **dynamic tokens**.

---

## 🚀 Live Demo

Try the current in-browser demo: [https://jstar15.github.io/WysiPDF/](https://jstar15.github.io/WysiPDF/)

---

## ✨ Highlights

### 📦 Single-file bundle

* One JavaScript file includes the editor UI **and** the generation runtime.
* No servers or plugins required; runs entirely in the browser.
* Works **standalone** via a `<script>` tag (global constructor `WysiPDF`) or via ESM imports.

### 🧹 Layout & Styling

* **Grid layout**: resizable columns, drag-and-drop rows, explicit page breaks.
* **Rich cells + quick styling** with support for:

  * **Images** and **Charts** (pie/doughnut/bar → exported as high-quality PNG)
  * **Rich text** (Quill formatting)
  * **Padding / Margins**
  * **Borders** (size, radius, color)
  * **Background colors**
* **Color Palette Editor**: define **reusable named palettes** per template (swatches available everywhere).
* **Fonts**: 5 built-in fonts (**Roboto, Raleway, Nunito, Cormorant, Open Sans**) with configurable fallbacks.
* **Repeatable header & footer**: template-level areas render on every page with natural heights.

### 🧩 Tokens & Data

* Use **predefined tokens** in your template, and pass **dynamic tokens** at generation time.
* **Token Editor**: create/edit tokens manually or **import from JSON** (arrays supported).
* Conditional visibility with `AND` / `OR` logic (live-evaluated).
* Clean JSON emission for arrays and tables.

### ♻️ Partials & Looping

* **Partials** for reusable sections.
* **Partial content looping** over arrays (one level) to repeat blocks for each item.

### 🖨 PDF & 🌐 HTML Generation

* Instant preview and export via **pdfMake**.
* Automatic header/footer height cleanup.
* Export **standalone HTML** with inline base styles; images/charts are embedded as `<img>` (PNG).
* Optional **margin-injection** helper for print-friendly HTML.

---

## 🔌 Use It Your Way

### Standalone (single bundle, no build tools)

Include the built script and use the global **constructor** `WysiPDF` (the bundle exposes `window.WysiPDF`):

```html
<script src="./wysipdf.bundle.js"></script>

<div id="editor-host"></div>

<button id="exportHtml">Export HTML</button>
<button id="exportPdf">Export PDF</button>

<script>
  // Optional: inject margins for nicer browser viewing/printing of exported HTML
  function injectPageMargins(html, page) {
    const bg   = (page && page.pageAttrs && page.pageAttrs.backgroundColor) || '#ffffff';
    const font = (page && page.pageAttrs && page.pageAttrs.defaultFont) || 'Roboto, Arial, sans-serif';
    const styleTag = `
<style id="wysi-export-margins">
  html { background: #f6f7f9; }
  body {
    margin: 32px auto !important;
    padding: 24px !important;
    max-width: 900px;
    background: ${bg};
    font-family: ${font};
    box-sizing: border-box;
  }
  @page { margin: 15mm; }
</style>`.trim();

    if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, styleTag + '</head>');
    if (!/<html/i.test(html))  return `<!doctype html><html><head>${styleTag}</head><body>${html}</body></html>`;
    if (!/<head>/i.test(html)) return html.replace(/<html([^>]*)>/i, `<html$1><head>${styleTag}</head>`);
    return html;
  }

  let wysi, page;

  window.addEventListener('DOMContentLoaded', async () => {
    // Mount the editor into a host element
    wysi = new WysiPDF({ mount: '#editor-host' });

    // Minimal starter page
    page = {
      header: { rows: [] },
      content: { rows: [] },
      footer: { rows: [] },
      pageAttrs: {
        backgroundColor: 'white',
        marginTop: 10, marginRight: 0, marginLeft: 0, marginBottom: 10,
        footerMargin: 50, headerMargin: 30, defaultFont: 'Roboto'
      },
      tokenAttrs: [{ name: 'customerName', value: 'Jane Doe', type: 'TEXT' }],
      partialContent: [],
      colorPalettes: ['#111827','#F59E0B','#3B82F6','#10B981','#EF4444'] // example palette
    };

    await wysi.loadPage(page);
    await wysi.onPageChange(p => (page = p));

    // Export HTML (print-friendly with margins)
    document.getElementById('exportHtml').addEventListener('click', async () => {
      const raw = await wysi.generateHtml(page, page.tokenAttrs || []);
      const html = injectPageMargins(raw, page);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: 'wysipdf.html' });
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    // Export PDF (base64 → download)
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

### Angular / ESM (optional)

All functionality is also available via ESM imports and as Angular standalone components/services (`PageToHtmlService`, `PdfGenerateService`, etc.):

```ts
import WysiPDF from 'wysipdf'; // or relative path to your bundle entry

const wysi = new WysiPDF({ mount: '#editor-host' });
await wysi.loadPage(page);
const html = await wysi.generateHtml(page, tokens);
const pdf64 = await wysi.generatePdfBase64(page, tokens);
```

---

## 🧭 Class API

All methods are **async**.

| Method                                  | Description                                          |
| --------------------------------------- | ---------------------------------------------------- |
| `loadPage(page)`                        | Load a page model into the editor                    |
| `onPageChange(cb)`                      | Listen for live edits to the page model              |
| `generatePdfBase64(page, tokens)`       | Generate a PDF (base64) from a page + dynamic tokens |
| `generatePdfBase64FromJson(page, json)` | Generate a PDF from raw JSON payload                 |
| `generateHtml(page, tokens)`            | Get standalone HTML (string) for the page            |
| `generateHtmlFromJson(page, json)`      | Get HTML from raw JSON token payload                 |

> **Note:** If you only need the runtime (no editor), you can omit the host element and just call the generation APIs.

---

## 🛆 Outputs

* pdfMake definition (for advanced integrations)
* **PDF (base64)** blob
* **Standalone HTML** (string)
* Updated page model

---

## 🔧 Implementation Notes

* Charts render through an Angular component to `imageBase64` (PNG), then the same block is embedded in HTML/PDF.
* Grid layout uses CSS Grid in the browser; exported HTML is self-contained and printable (use margin injection for best results).
* Fonts can be themed; the five defaults are included to keep files lightweight.

---

## 📈 Roadmap

* Sample templates (invoice, report, certificate, survey, label)
* Playground mode with sample data
* Validation for tokens on generation

---

## 📄 License

MIT License
