/**
 * Fix GSTR-1 taxable value showing ₹0 while CGST/SGST are correct.
 * Invoices store line items with `rate` and `amount`, not `price`/`basePrice`.
 */
const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/ReportsNew-CXqGpqT9.js';
let s = fs.readFileSync(path, 'utf8');

const oldFn =
  'function ie(l){return!l.items||l.items.length===0?l.taxableAmount||l.subtotal||0:l.items.reduce((g,S)=>{const h=S.basePrice||S.basePurchasePrice||S.price||0,x=S.qty||S.quantity||1;return g+h*x},0)}';

const newFn =
  'function ie(l){const items=l.items||l.itemsList||[],hdr=Number(l.taxableAmount??l.subtotal??0);if(!items.length)return hdr;let g=0;for(const S of items){const x=Number(S.quantity??S.qty??1)||1,tax=Number(S.cgstAmount??0)+Number(S.sgstAmount??0)+Number(S.igstAmount??0)+Number(S.taxAmount??0),tot=Number(S.amount??S.total??S.totalAmount??0),rate=Number(S.rate??S.price??S.basePrice??0),ta=Number(S.taxableAmount??0);if(ta>0){g+=ta;continue}if(Number(S.basePrice)>0){g+=Number(S.basePrice)*x;continue}if(tot>0&&tax>0){g+=tot-tax;continue}if(tot>0){const tr=Number(S.taxRate??S.tax??0);S.taxMode==="inclusive"&&tr>0?g+=tot/(1+tr/100):rate>0?g+=rate*x:g+=tot;continue}rate>0&&(g+=rate*x)}if(g>0)return Math.round(g*100)/100;if(hdr>0)return hdr;const gt=Number(l.grandTotal??l.total??0),tx=Number(l.totalTaxAmount??l.tax??0)||Number(l.cgstAmount??0)+Number(l.sgstAmount??0)+Number(l.igstAmount??0);return gt>tx?Math.round((gt-tx)*100)/100:0}';

if (s.includes(oldFn)) {
  s = s.replace(oldFn, newFn);
  console.log('Patched calculateTaxableValue (ie)');
} else if (s.includes('S.rate??S.price')) {
  console.log('ie function already patched');
} else {
  console.warn('ie function pattern not found');
}

// GSTR summarize: include itemsList when reading per-line tax
const oldItems = '(u.items||[]).reduce';
const newItems = '((u.items||u.itemsList)||[]).reduce';
if (s.includes(oldItems)) {
  const count = s.split(oldItems).length - 1;
  s = s.split(oldItems).join(newItems);
  console.log('Patched items||itemsList in', count, 'reduce(s)');
}

fs.writeFileSync(path, s);
console.log('Done');
