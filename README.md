# WysiPDF

> ⚠ **Disclaimer:** This project is **a work in progress** and **not ready for production**.  
> Features, APIs, and behavior may change without notice. Use at your own risk.

WysiPDF is a visual WYSIWYG editor and runtime for building **dynamic, data‑driven documents**.  
It ships as a **single bundle** you can drop into any page to design, preview, and generate **PDF** and **HTML** from **predefined** and **dynamic tokens**.

---

## 🚀 Live Demo
Try the current in‑browser demo: https://jstar15.github.io/WysiPDF/

---

## ✨ Highlights

### 📦 Single‑file bundle
- One JavaScript file includes the editor UI **and** the generation runtime.
- No servers or plugins required; runs entirely in the browser.

### 🧹 Layout & Styling
- **Grid layout**: resizable columns, drag‑and‑drop rows, explicit page breaks.
- **Rich cells** with support for:
  - **Images** and **Charts**
  - **Rich text** (Quill formatting)
  - **Padding / Margins**
  - **Borders** (size, radius, color)
  - **Background colors**
- **Fonts**: 5 built‑in fonts (Roboto, Raleway, Nunito, Cormorant, Open Sans).

### 🧩 Tokens & Data
- Use **predefined tokens** in your template, and pass **dynamic tokens** at generation time.
- Live token editor + payload inspector in the UI.
- Conditional visibility with `AND` / `OR` logic.
- Clean JSON emission for arrays and tables.

### ♻️ Partials & Looping
- **Partials** for reusable sections.
- **Partial content looping** over arrays (one level) to repeat blocks for each item.

### 📊 Charts (built‑in)
- Powered by **ECharts (modular)**.
- **Pie, Doughnut, Bar** charts supported.
- Bind via `ChartBlock.slices` (token‑backed); PNG is generated under the hood for export.
- Title, width (%) and alignment (**left / center / right**) respected in both PDF and HTML.

### 🖨 PDF Generation
- Instant preview and export via **pdfMake**.
- Automatic header/footer height cleanup.
- Multi‑font support (with the 5 built‑ins out of the box).

### 🌐 HTML Export
- Export a **standalone HTML** page with base styles inlined.
- Browser uses CSS Grid; images/charts are embedded as `<img>` (PNG).

---

## 🔌 Use It Your Way

### Standalone (single bundle)
Include the built script and use the global API:

```html
<script src="./wysipdf.bundle.js"></script>

<!-- Optional: embedded editor -->
<app-template-editor></app-template-editor>

<script>
  window.addEventListener('DOMContentLoaded', async () => {
    const page = {/* page model */};

    // Load a template
    await window.loadPage(page);

    // Observe edits
    await window.onPageChange(updated => console.log('page changed', updated));

    // Generate PDF (base64)
    const tokens = {/* dynamic data */};
    const pdfB64 = await window.generatePdfBase64(page, tokens);

    // Generate HTML (string) & download helper
    const html = window.generateHtmlString(page, { includeBaseStyles: true });
    window.downloadHtml(page, 'page.html', { includeBaseStyles: true });
  });
</script>
```

### Angular (optional)
All functionality is also available as Angular standalone components/services (editor, `PageToHtmlService`, generation helpers).

---

## 🌐 Global API
| Function | Description |
|---|---|
| `loadPage(page)` | Load a page model into the editor |
| `onPageChange(cb)` | Listen for live edits to the page model |
| `generatePdfBase64(page, tokens)` | Generate a PDF (base64) from a page + dynamic tokens |
| `generatePdfBase64FromJson(page, json)` | Generate a PDF from raw JSON payload |
| `generateHtmlString(page, opts?)` | Get a standalone HTML string for the page |
| `downloadHtml(page, filename?, opts?)` | Download the page as an HTML file |

> **Note:** If you only need the runtime (no editor), you can omit the `<app-template-editor>` tag and call the generation APIs directly.

---

## 🛆 Outputs
- pdfMake definition (for advanced integrations)
- **PDF (base64)** blob
- **Standalone HTML** (string or file)
- Updated page model

---

## 🔧 Implementation Notes
- Charts render through an Angular component into `imageBase64` (PNG), then the same block is embedded in HTML/PDF.  
- Grid layout uses CSS Grid in the browser; exported HTML is self‑contained.  
- Fonts can be themed; the five defaults are included to keep files lightweight.

---

## 📈 Roadmap
- Sample templates (invoice, report, certificate, survey, label)
- Playground mode with sample data
- Validation for tokens on genration

---

## 📄 License
MIT License
