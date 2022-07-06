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
  format: {
    wrap_func_args: false,
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
  .replaceAll('for(let ', 'for(') // Hoist for() vars to global (very risky) ~4B
  .replaceAll('=>{let ', '=>{') // Hoist button onclick lets (very risky) ~8B
  .replace('let t=get', 't=get') // Hoist getComputedStyle var (very risky) ~4B
  .replace('<!DOCTYPE html><html>', '') // Remove doctype & HTML opening tags
  .replace(';</script>', '</script>') // Remove final semicolon
  .replace('<head>', '') // Remove head opening tag
  .replace('</head>', '') // Remove head closing tag
  .replace('<body>', '') // Remove body opening tag
  .replace('</body></html>', ''); // Remove closing tags

console.log(`${mangled.length}B`);

writeFileSync('index.watch.html', minifiedInlined);

writeFileSync('index.html', mangled);
