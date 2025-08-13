// rollup-entry.js
import './dist/like-button/browser/polyfills.js';
import './dist/like-button/browser/main.js';
import css from './styles.css';

(function injectCss(content) {
  if (typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-inlined-css', 'true');
  style.textContent = content;
  document.head.appendChild(style);
})(css);
