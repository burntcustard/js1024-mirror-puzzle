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

const js = readFileSync('src/main.js', 'utf8');

const cleanJs = js.replace(/g.style.cssText = `[^`]+`/g, tag => tag.replace(/\s+/g, ''));

const minifiedJs = await minifyJs(cleanJs, options);

const html = readFileSync('src/index.html', 'utf8');

const inlined = html.replace(
  /<script[^>]*><\/script>/,
  `<script>${minifiedJs.code}</script>`,
);

const minifiedInlined = minifyHtml(inlined, {
  removeAttributeQuotes: true,
  collapseWhitespace: true,
});

console.log(`${minifiedInlined.length}B`);

writeFileSync('index.html', minifiedInlined);
