const esbuild = require('esbuild');
const { mkdirSync } = require('fs');

const srcDir = 'src';
const destDir = 'dist/components';
const destFileName = 'wysipdf.bundle.js';

mkdirSync(destDir, { recursive: true });

console.log(`Bundling ${destFileName}…`);
esbuild
  .build({
    entryPoints: [`${srcDir}/main.ts`],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: `${destDir}/${destFileName}`,
    format: 'iife', // or 'esm' if you prefer
  })
  .then(() => console.info(`${destFileName} created successfully!`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
