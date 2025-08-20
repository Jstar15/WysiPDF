# WysiPDF

WysiPDF is a powerful, visual WYSIWYG editor for designing dynamic PDF templates. It gives you complete control over layout, styling, reusable components, JSON-driven partials, conditional display logic, and live previewing — all in your browser.

## ✨ Features

### 🧹 Layout & Structure

* **Grid-Based Layout:** Design rows and columns visually, with resizable column widths, drag-and-drop reordering of rows, and flexible structure including explicit page breaks.
* **Rich Cells:** Each cell can contain styled HTML, images, and dynamic tokens with support for:
  * Padding & margin
  * Border size, radius & color
  * Background color
  * Rich text formatting (bold, italic, font size, alignment, etc.)

### 🧠 Conditional Display Logic

Define visibility rules per cell using token-based conditions combined with logical `AND`/`OR` chains. Live test your rules against editable token values and see pass/fail feedback in real time.

### ♻️ Reusable Partials & Looping

* **Partials:** Create reusable snippet templates (e.g., headers, sections) and embed them anywhere.
* **One-Level Loop Support:** Bind a JSON array to a partial to repeat it for each item, with index-aware token replacement and isolation via deep clone.

### ♻️ Token System Enhancements

* **Injection Token Payload View:** Inspect the actual token payload that will be merged.
* **Custom Token Editing:** Edit token names/values in-place during testing to validate logic live.
* **JSON-Array Tokens:** Arrays are emitted cleanly (e.g., `items` instead of `items[0]`), avoiding fragile indexed paths.
* **Table Token Handling:** Robust token replacement within HTML table blocks without traversal errors.

### 🧪 Code & Payload Visibility

* **Code View:** See the underlying custom payload, pdfMake document definition, and injection token payload side-by-side for full transparency/debugging.
* **pdfMake Payload Preview:** Inspect the generated pdfMake structure before rendering.

### 👨‍💼 PDF Generation

* **Live Preview:** Instant in-browser rendering of the current design into a PDF using pdfMake.
* **Header/Footer Cleaning:** Automatic logic to sanitize fixed heights (e.g., removing hardcoded height attributes) so headers/footers size naturally.
* **Multi-Font Support:** Built-in support for up to 5 fonts with fallback and styling controls.

### 🖼 Media & Styling

* **Image Embedding:** Upload and position images in any cell with sizing and alignment controls.
* **Theme & Branding:** Control page-level background colors, margins, and default fonts globally.
* **Inline Styles:** Styles are applied inline to improve portability and reduce dependency on external CSS when exporting.

---

## 🚀 Installation & Usage

### 🧪 Development

```bash
npm install
ng serve
```

---

### 🔌 Standalone Embedding (Browser / Serverless)

You can use WysiPDF as a standalone JavaScript component in any HTML page. Just include the `wysipdf.bundle.js` file (produced by your build) and interact with it using a clean API:

#### ✅ Example:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WysiPDF Demo</title>
  <script src="./wysipdf.bundle.js"></script>
</head>
<body>
  <!-- The component will be used/inserted here -->
  <app-template-editor></app-template-editor>

  <script>
    window.addEventListener('DOMContentLoaded', async () => {
      // Initial template
      const page = {
        header: { rows: [] },
        content: { rows: [] },
        footer: { rows: [] },
        pageAttrs: {
          backgroundColor: 'white',
          marginTop: 10,
          marginRight: 0,
          marginLeft: 0,
          marginBottom: 10,
          footerMargin: 50,
          headerMargin: 30,
          defaultFont: 'Roboto'
        },
        tokenAttrs: [
          { name: 'customerName', value: 'John Doe', type: 'TEXT' }
        ],
        partialContent: []
      };

      // Load the page into the editor
      await window.loadPage(page);

      // Listen for changes
      await window.onPageChange(updatedPage => {
        console.log('Page was updated:', updatedPage);
      });

      // Example PDF generation from tokens
      const base64 = await window.generatePdfBase64(page, page.tokenAttrs);
      console.log("PDF base64:", base64);
    });
  </script>
</body>
</html>
```

---

### 🌐 Global API

| Function | Description |
|----------|-------------|
| `loadPage(page: Page)` | Loads a page model into the editor |
| `onPageChange(callback)` | Registers a listener that receives updated page models on change |
| `generatePdfBase64(page, tokens)` | Returns base64 string of PDF using given page and token array |
| `generatePdfBase64FromJson(page, json)` | Returns base64 PDF using JSON string for tokens |

> These functions are attached to `window` automatically when using the standalone bundle.

---

## 💠 Tech Stack

* **Angular (Standalone APIs)**
* **Angular Material**
* **QuillJS**
* **pdfMake**
* **Custom core services (token replacer, partial expander, etc.)**

---

## 🛆 Output / Integration

* Accepts a structured page model and token list
* Outputs:
  * pdfMake document definition
  * base64-encoded PDF blob
  * updated page structure for persistence
* Easy to wire into backend PDF generation if needed

---

## 🧪 Developer Tools

* Built-in JSON viewer for inspecting output
* Token payload testing
* Real-time display logic evaluation
* Transparent debugging: payload, rules, and document definition shown side-by-side


---

## 📄 License

MIT License


TODO
- Add "Export/Import Template" button that downloads the Page JSON and token set — makes it portable/sharable.
- Add validation, this can ensure the pdf will throw an error on generation if the incorrect token is injected
- Clean up and refactor
