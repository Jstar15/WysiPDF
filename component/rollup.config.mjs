import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import fs from 'fs';
import path from 'path';

const STYLE_ID = 'virtual:inlined-styles.css';
const FS_STYLE_PATH = path.resolve('./dist/like-button/browser/styles.css');

// --- inline CSS plugin ---
function inlineCssPlugin() {
  return {
    name: 'inline-css',
    resolveId(source) {
      if (source === STYLE_ID || source === './styles.css') return STYLE_ID;
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

// --- copy bundle to docs folder ---
function docsCopy() {
  return {
    name: 'docs-copy',
    async writeBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!fileName.endsWith('.js') && !fileName.endsWith('.mjs')) continue;
        const destPath = path.join('..', 'docs', path.basename(fileName));
        await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
        await fs.promises.writeFile(destPath, chunk.code);
      }
    },
  };
}

// --- ignore browser-only modules ---
function ignoreNodeModulesPlugin(modules) {
  return {
    name: 'ignore-node-modules',
    resolveId(source) {
      if (modules.includes(source)) return source;
      return null;
    },
    load(id) {
      if (modules.includes(id)) return 'export default {}';
      return null;
    },
  };
}

// --- Node-only ESM bundle ---
export default [{
  input: 'src/main.node.ts',
  output: {
    file: 'dist/components/wysipdf.node.esm.mjs',
    format: 'esm',
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    json(),
    resolve({
      preferBuiltins: true, // crucial for Node built-ins
      browser: false,        // tells Rollup we target Node, not browser
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: false,
      exclude: ['**/*.spec.ts'],
    }),
    ignoreNodeModulesPlugin([
      '@angular/common/http',
      '@angular/platform-browser',
      '@angular/platform-browser/animations',
      '@angular/elements',
      'zone.js',
      'pdfmake',
      'file-saver',
      'highlight.js',
      'ngx-color',
      'ngx-color-picker',
      'ngx-image-compress',
      'quill',
    ]),
    inlineCssPlugin(),
    docsCopy(),
  ],
  external: [
    'fs','path','os','http','https','stream','url','util','crypto','child_process','zlib','vm','assert',
    'canvas','@napi-rs/canvas','@napi-rs/canvas-win32-x64-msvc' // Node native bindings
  ],
  onwarn(warning, warn) {
    if (warning.code === 'EVAL') return;
    warn(warning);
  },
},
  {
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
  }];
