# WysiPDF

WysiPDF is a powerful, visual WYSIWYG editor for designing **dynamic, token‑driven PDF templates**. Build complex layouts, reuse partials, evaluate conditional logic in real‑time, and preview instantly — all in your browser.

![WysiPDF Screenshot](/readme/images/screenshot-1.png)

---

## ✨ Highlights

* **Grid-based layout**: Rows & columns, resizable widths, drag-and-drop reordering, page-break rows.
* **Rich cells + quick styling**: Styled HTML, tokens, tables; compact toolbar for borders, fill, padding, alignment, and typography.
* **Images**: Embed PNG/JPG/SVG (URL or base64), control size/fit/alignment, and export cleanly to HTML/PDF.
* **Charts**: Add pie/bar/doughnut charts; rendered to high-quality images for both HTML and PDF output.
* **Color Palette Editor**: Define reusable, named color palettes per template; swatches available across editors for one-click theming.
* **Token Editor**: Create and edit tokens manually or **import from JSON** (supports arrays); live testing against the current template.
* **Partials & looping**: Reusable snippets; loop a partial over a JSON array (index-aware).
* **Conditional visibility**: Token-based conditions with `AND`/`OR`, live-evaluated as you edit.
* **Repeatable header & footer**: Template-level header/footer areas render on every page with natural heights (no hardcoded sizing).
* **Branding & typography**: Page defaults (background, margins, default font) plus **five built-in fonts** with configurable fallbacks.
* **Live preview & export**: Instant pdfMake preview while editing. **Export to HTML or PDF (base64)**; optional HTML **margin injection** for print-ready pages.
* **Transparent internals & payload views**: Inspect token payloads, the generated pdfMake document definition, and exported HTML for easy debugging.
* **Standalone or modular**: Use via a single `<script>` (global `WysiPDF`) or import as ESM and mount with `new WysiPDF({ mount })`.




---

## 🧩 Architecture (Quick Peek)

- **Angular (standalone)** app exposes a custom element `<app-template-editor>`.
- **Services** power the pipeline: token replacement, partial expansion, html/pdf generation.
- **Bundle** exposes a single **class** `WysiPDF` for clean programmatic control.
- For non-module HTML pages, the constructor is available globally as `window.WysiPDF`.

---

## 🚀 Getting Started

### Prereqs
- Node 18+
- PNPM/NPM/Yarn (your choice)

### Install & Dev
```bash
npm install
npm run start          # or: ng serve
```

### Build
```bash
npm run build          # produces the browser bundle (e.g., dist/**/wysipdf.bundle.js)
```

> Ensure your bundler outputs a single browser-friendly file that executes the Angular bootstrap and sets `window.WysiPDF = WysiPDF` (the provided entry already does this).

---

## 🔌 Usage

### Option A — Plain HTML (global constructor)

Include the bundle and create an instance. **No other globals required.**

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>WysiPDF Demo</title>
  <script src="./wysipdf.bundle.js"></script>
</head>
<body>
  <!-- Host container for the editor -->
  <div id="editor-host"></div>

  <button id="downloadHtmlBtn">Download HTML</button>
  <button id="downloadPdfBtn">Download PDF</button>

  <script>
    // Inject margins/styles into exported HTML (handy for printing/preview)
    function injectPageMargins(html, page) {
      const bg = (page && page.pageAttrs && page.pageAttrs.backgroundColor) || '#ffffff';
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

    let wysi, currentPage;

    window.addEventListener('DOMContentLoaded', async () => {
      if (typeof WysiPDF === 'undefined') {
        console.error('WysiPDF not found. Is the bundle loaded?');
        return;
      }

      // Create instance and mount it
      wysi = new WysiPDF({ mount: '#editor-host' });

      // Minimal starter page
      currentPage = {
        header: { rows: [] },
        content: { rows: [] },
        footer: { rows: [] },
        pageAttrs: {
          backgroundColor: 'white',
          marginTop: 10, marginRight: 0, marginLeft: 0, marginBottom: 10,
          footerMargin: 50, headerMargin: 30, defaultFont: 'Roboto'
        },
        tokenAttrs: [{ name: 'customerName', value: 'Alexandra Mills', type: 'TEXT' }],
        partialContent: [],
        colorPalettes: ['#111827','#F59E0B','#3B82F6','#10B981','#EF4444']
      };

      await wysi.loadPage(currentPage);
      await wysi.onPageChange(p => (currentPage = p));

      document.getElementById('downloadHtmlBtn').addEventListener('click', async () => {
        const raw = await wysi.generateHtml(currentPage, currentPage.tokenAttrs || []);
        const html = injectPageMargins(raw, currentPage);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url, download: 'wysipdf.html' });
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      });

      document.getElementById('downloadPdfBtn').addEventListener('click', async () => {
        const base64 = await wysi.generatePdfBase64(currentPage, currentPage.tokenAttrs || []);
        const a = document.createElement('a');
        a.href = 'data:application/pdf;base64,' + base64;
        a.download = 'wysipdf.pdf'; a.click();
      });
    });
  </script>
</body>
</html>
```

### Option B — ESM (module) usage

If your build allows ESM imports:

```ts
import WysiPDF from 'wysipdf'; // or relative path to your bundle entry

const wysi = new WysiPDF({ mount: '#editor-host' });
await wysi.loadPage(page);
const html = await wysi.generateHtml(page, tokens);
```

> **Note**: In ESM-only environments, ensure your bundler does not rely on `window.WysiPDF` and that `zone.js` is properly included.

---

## 🧭 API Reference

### `class WysiPDF`

**Constructor**
```ts
new WysiPDF(options?: { mount?: HTMLElement | string })
```
- `mount`: optional host element or CSS selector. Defaults to `document.body`.

**Instance Methods**
```ts
loadPage(page: any): Promise<void>
onPageChange(cb: (updatedPage: any) => void): Promise<void>
generatePdfBase64(page: any, tokens: any[]): Promise<string>
generatePdfBase64FromJson(page: any, json: string): Promise<string>
generateHtml(page: any, tokens: any[]): Promise<string>
generateHtmlFromJson(page: any, json: string): Promise<string>
```

> The `page` model is your structured document description (rows/columns/cells, attrs, tokens, partials). The library doesn’t force a schema version, but the editor emits a consistent shape that your app can persist.

---


## 🧪 Testing Tips

- Use the **Code/JSON Views** to validate token payloads and pdfMake definitions.
- For HTML export, optionally apply the **margin injection** helper shown above for better browser print layout.
- When embedding images or custom fonts, confirm base64 sizes and availability across environments.


---

## 🛣️ Roadmap / TODO

- Export/Import Template button (download/upload Page JSON + token set).
- Schema validation for tokens and display-logic to catch generation errors early.
- More sample templates and theme presets.


---

## 📄 License

MIT
