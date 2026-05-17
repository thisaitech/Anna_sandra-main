/**
 * Fix Estimation (Quotations) Add Item table: remove orphan tax/taxable cells
 * so row columns align with headers (no CGST/SGST/IGST/GST% on quotations).
 */
const fs = require('fs');
const { execSync } = require('child_process');

const quotPath = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let q = fs.readFileSync(quotPath, 'utf8');

const removals = [
  // Orphan TAXABLE display between MRP and discount (no header on quotations)
  `,e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"60px",minWidth:"60px"},children:e.jsxs("span",{className:"text-xs font-semibold text-slate-600",children:["₹",(t.basePrice||t.price).toFixed(2)]})})`,
  // GST % input (headers removed)
  `,e.jsx("td",{className:"px-0.5 py-1.5 text-center align-middle",style:{width:"35px",minWidth:"35px"},children:e.jsx("input",{type:"number",min:"0",max:"100",step:"1",value:t.tax||0,onChange:a=>{const r=parseFloat(a.target.value)||0;E(t.id,"tax",r)},className:"w-full h-6 px-0.5 bg-transparent border-0 text-xs font-semibold text-center text-slate-700 focus:ring-0 focus:outline-none",title:"GST % (Total)"})})`,
  // GST ₹ display
  `,e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"42px",minWidth:"42px"},children:e.jsxs("span",{className:"text-xs font-medium text-slate-600",children:["₹",(t.taxAmount||0).toFixed(2)]})})`,
  // CGST/SGST/IGST breakdown cells (optional column; quotations should not show tax)
  `,B.gstBreakdown&&e.jsxs(e.Fragment,{children:[e.jsx("td",{className:"px-2 py-1.5 text-center align-middle",style:{width:"45px",minWidth:"45px"},children:e.jsx("input",{type:"number",min:"0",max:"100",step:"0.1",value:t.cgstPercent||0,onChange:a=>E(t.id,"cgstPercent",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 bg-transparent border-0 text-[11px] font-semibold text-center text-slate-500 focus:ring-0 focus:outline-none",title:"CGST %"})}),e.jsx("td",{className:"px-2 py-1.5 text-center align-middle",style:{width:"45px",minWidth:"45px"},children:e.jsx("input",{type:"number",min:"0",max:"100",step:"0.1",value:t.sgstPercent||0,onChange:a=>E(t.id,"sgstPercent",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 bg-transparent border-0 text-[11px] font-semibold text-center text-slate-500 focus:ring-0 focus:outline-none",title:"SGST %"})}),e.jsx("td",{className:"px-2 py-1.5 text-center align-middle",style:{width:"45px",minWidth:"45px"},children:e.jsx("input",{type:"number",min:"0",max:"100",step:"0.1",value:t.igstPercent||0,onChange:a=>E(t.id,"igstPercent",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 bg-transparent border-0 text-[11px] font-semibold text-center text-slate-500 focus:ring-0 focus:outline-none",title:"IGST %"})})]})`,
];

let changed = 0;
for (const block of removals) {
  if (!q.includes(block)) {
    console.warn('MISSING (skip):', block.slice(0, 80) + '...');
    continue;
  }
  const count = q.split(block).length - 1;
  q = q.split(block).join('');
  changed += count;
  console.log('Removed', count, 'x:', block.slice(0, 60) + '...');
}

if (changed === 0) {
  console.error('No changes applied');
  process.exit(1);
}

fs.writeFileSync(quotPath, q);
console.log('Total removals:', changed);

// Verify syntax
try {
  execSync(`node --check "${quotPath}"`, { stdio: 'pipe' });
  console.log('node --check: OK');
} catch (e) {
  console.error('node --check FAILED:', (e.stderr || '').toString());
  process.exit(1);
}

try {
  execSync(`npx --yes esbuild "${quotPath}" --bundle=false`, { stdio: 'pipe' });
  console.log('esbuild: OK');
} catch (e) {
  console.error('esbuild FAILED:', (e.stderr || e.stdout || '').toString().slice(0, 800));
  process.exit(1);
}

// Bump cache
let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = Number(m[1]) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache v=' + v);
} else {
  console.warn('Could not find cache version in index.html');
}
