import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import path from 'path';

const STYLE_ID = 'virtual:inlined-styles.css';
// Prefer source CSS; fallback example could be added if needed
const FS_STYLE_PATH = path.resolve('./dist/like-button/browser/styles.css'); // make sure this exists

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    resolveId(source, importer) {
      if (source === STYLE_ID) return STYLE_ID;
      if (source === './styles.css') {
        return STYLE_ID;
      }
      return null;
    },
    load(id) {
      if (id === STYLE_ID) {
        let css = '';
        try {
          css = fs.readFileSync(FS_STYLE_PATH, 'utf8');
        } catch (e) {
          this.error(`Failed to read CSS file at ${FS_STYLE_PATH}: ${e.message}`);
        }
        // Export as a normal string literal via JSON.stringify to avoid legacy octal issues
        return `export default ${JSON.stringify(css)};`;
      }
      return null;
    },
  };
}


export default {
  input: 'rollup-entry.js', // your entry point
  output: {
    file: 'dist/components/wysipdf.bundle.js',
    format: 'iife',
    name: 'WysiPDF',
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    inlineCssPlugin(),
    resolve({
      browser: true,
    }),
    commonjs(),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'EVAL') return; // suppress Angular eval warnings if any
    warn(warning);
  },
};
