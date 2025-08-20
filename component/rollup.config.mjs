import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import path from 'path';

const STYLE_ID = 'virtual:inlined-styles.css';
const FS_STYLE_PATH = path.resolve('./dist/like-button/browser/styles.css'); // ensure this exists

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    resolveId(source) {
      if (source === STYLE_ID) return STYLE_ID;
      if (source === './styles.css') return STYLE_ID;
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
        return `export default ${JSON.stringify(css)};`;
      }
      return null;
    },
  };
}

function docsCopy() {
  return {
    name: 'docs-copy',
    async writeBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!fileName.endsWith('.js')) continue;
        const destPath = path.join('..', 'docs', fileName.replace(/^.*\//, ''));
        await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
        await fs.promises.writeFile(destPath, chunk.code);
      }
    },
  };
}

export default {
  input: 'rollup-entry.js',
  output: [
    {
      file: 'dist/components/wysipdf.bundle.js',
      format: 'iife',
      name: 'WysiPDF',
      inlineDynamicImports: true,
      sourcemap: false,
    },
    {
      // one level up
      file: '../docs/wysipdf.bundle.js',
      format: 'iife',
      name: 'WysiPDF',
      inlineDynamicImports: true,
      sourcemap: false,
    },
  ],
  plugins: [
    inlineCssPlugin(),
    resolve({ browser: true }),
    commonjs(),
    docsCopy(),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'EVAL') return;
    warn(warning);
  },
};
