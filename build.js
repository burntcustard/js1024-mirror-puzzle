import { readFileSync, writeFileSync } from 'fs';
import { minify as minifyJs } from "terser";
import { minify as minifyHtml } from 'html-minifier';

const options = {
  toplevel: true,
  compress: {
    passes: 2,
    unsafe: true,
    unsafe_arrows: true,
    unsafe_comps: true,
    unsafe_math: true,
    booleans_as_integers: true,
  },
  mangle: {
   properties: {
    keep_quoted: true,
   },
  },
};

let js = readFileSync('src/main.js', 'utf8');

// Some custom mangling of JS to assist / work around Terser
js = js
  // Remove whitespace in CSS template literals
  .replace(/ = `[^`]+`/g, tag => tag.replace(/\s+/g, ''))
  // Replace const with let
  .replaceAll('const', 'let')
  // Replace all strict equality comparison with abstract equality comparison
  .replaceAll('===', '==')
  // Remove the last semicolon at the end of a CSS string
  .replaceAll(':0;`', ':0`');

const minifiedJs = await minifyJs(js, options);

const html = readFileSync('src/index.html', 'utf8');

const inlined = html.replace(
  /<script[^>]*><\/script>/,
  `<script>${minifiedJs.code}</script>`,
);

const minifiedInlined = minifyHtml(inlined, {
  removeAttributeQuotes: true,
  collapseWhitespace: true,
});

const mangled = minifiedInlined
  .replace('<!DOCTYPE html><html>', '') // Remoe doctype & opening tags
  .replace(';</script>', '</script>') // Remove final semicolon
  .replace('</body></html>', ''); // Remove closing tags

console.log(`${mangled.length}B`);

writeFileSync('index.mangled.html', mangled);
writeFileSync('index.html', minifiedInlined);
