const fs = require('fs');
const quotPath = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let q = fs.readFileSync(quotPath, 'utf8');

const startMark = '!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"CGST:"})';
const endMark =
  'children:"Grand Total:"}),e.jsxs("span",{className:"text-gray-900",children:["₹",k.total.toFixed(2)]})]})]})}),_e&&';

const start = q.indexOf(startMark);
let end = q.indexOf(endMark, start);
if (start < 0 || end < 0) {
  console.error('Could not locate broken block', { start, end });
  process.exit(1);
}

const endLen = endMark.length;
const broken = q.slice(start, end + endLen);
const fixed =
  '!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"CGST:"}),e.jsxs("span",{className:"font-medium text-emerald-600",children:["₹",k.totalCGST.toFixed(2)]})]}),!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"SGST:"}),e.jsxs("span",{className:"font-medium text-emerald-600",children:["₹",k.totalSGST.toFixed(2)]})]}),!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"IGST:"}),e.jsxs("span",{className:"font-medium text-blue-600",children:["₹",k.totalIGST.toFixed(2)]})]}),!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"Total Tax:"}),e.jsxs("span",{className:"font-medium text-gray-900",children:["₹",k.totalTax.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-800",children:[e.jsx("span",{className:"text-gray-900",children:"Grand Total:"}),e.jsxs("span",{className:"text-gray-900",children:["₹",k.total.toFixed(2)]})]}),';

console.log('Replacing', broken.length, 'chars with', fixed.length, 'chars');
q = q.slice(0, start) + fixed + q.slice(end + endLen);
fs.writeFileSync(quotPath, q);
console.log('Fixed IGST/totals JSX block in Quotations bundle');

// Verify parse
const { execSync } = require('child_process');
try {
  execSync(`npx --yes esbuild "${quotPath}" --bundle=false`, { stdio: 'pipe' });
  console.log('esbuild: syntax OK');
} catch (e) {
  console.error('esbuild still fails:', e.stderr?.toString().slice(0, 500));
  process.exit(1);
}

// Bump cache version in index.html
let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = Number(m[1]) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped index.html cache to v=' + v);
} else {
  html = html.replace(
    'index-jCsVk30s.js"',
    'index-jCsVk30s.js?v=36"'
  );
  if (!html.includes('?v=')) {
    html = html.replace(
      '/assets/index-jCsVk30s.js',
      '/assets/index-jCsVk30s.js?v=36'
    );
  }
  fs.writeFileSync(htmlPath, html);
  console.log('Set index.html cache bust');
}
