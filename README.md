# WysiPDF

> ⚠ **Disclaimer:** This project is **a work in progress** and **not ready for production**.  
> Features, APIs, and behavior may change without notice. Use at your own risk.

WysiPDF is a powerful, visual WYSIWYG editor for designing dynamic PDF templates.  
It gives you complete control over layout, styling, reusable components, JSON-driven partials, conditional display logic, and live previewing — all in your browser.

---

## 🚀 Live Demo
Try the current in-browser demo here:  
[**WysiPDF Demo**](https://jstar15.github.io/WysiPDF/)

---

## ✨ Features

### 🧹 Layout & Structure
* **Grid-Based Layout:** Resizable columns, drag-and-drop rows, explicit page breaks.
* **Rich Cells:** Styled HTML, images, and dynamic tokens supporting:
  * Padding & margin
  * Border size, radius & color
  * Background color
  * Rich text formatting

### 🧠 Conditional Display Logic
Define visibility rules per cell using token-based conditions with logical `AND` / `OR`.  
Test rules live against token values with instant pass/fail feedback.

### ♻️ Reusable Partials & Looping
* **Partials:** Reusable snippet templates.
* **One-Level Loop:** Bind JSON arrays to repeat partials per item, with index-aware tokens.

### ♻️ Token System Enhancements
* Inspect token payloads
* Edit tokens live during testing
* Clean JSON array emission
* Robust table token handling

### 🧪 Code & Payload Visibility
* Side-by-side views: payload, pdfMake definition, and injection data
* Inspect generated pdfMake before rendering

### 👨‍💼 PDF Generation
* Instant live preview using pdfMake
* Automatic header/footer height cleanup
* Multi-font support

### 🖼 Media & Styling
* Upload & position images
* Global page styling and branding controls
* Inline styles for portability

---

## 📦 Installation & Usage

### 🧪 Development
```bash
npm install
ng serve
```

### 🔌 Standalone Embedding
Include the built `wysipdf.bundle.js` file in any HTML page and use the provided global API:

```html
<script src="./wysipdf.bundle.js"></script>
<app-template-editor></app-template-editor>
<script>
  window.addEventListener('DOMContentLoaded', async () => {
    const page = { /* page model */ };
    await window.loadPage(page);
    await window.onPageChange(updated => console.log(updated));
  });
</script>
```

---

## 🌐 Global API

| Function | Description |
|----------|-------------|
| `loadPage(page)` | Loads a page model |
| `onPageChange(callback)` | Listens for changes |
| `generatePdfBase64(page, tokens)` | Returns PDF as base64 string |
| `generatePdfBase64FromJson(page, json)` | PDF from JSON token payload |

---

## 💠 Tech Stack
* Angular (Standalone APIs)
* Angular Material
* QuillJS
* pdfMake
* Custom core services

---

## 🛆 Output / Integration
Outputs:
* pdfMake definition
* Base64 PDF blob
* Updated page model

---

## 📈 Planned Features
* Multi-level loop support
* Advanced condition operators (regex, date math)
* Theme import/export
* Playground mode with sample data
* Debug mode (`?debug=true`)
* Export/import templates
* Example template library (Invoice, Certificate, Survey, Label)
* HTML export
* Chart.js bar/pie chart support

---

---

## 📄 License
MIT License
