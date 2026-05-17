/**
 * Keep MRP field editable when editing invoice:
 * - Remove toFixed(2) on controlled input value (blocks typing)
 * - Show visible border/background when isEditingInvoice (as)
 */
const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js';
let s = fs.readFileSync(path, 'utf8');
let n = 0;

// Compact invoice table MRP input
const old1 =
  'value:Number(t.price||0).toFixed(2),onChange:a=>{const n=parseFloat(a.target.value)||0;B(t.id,"price",n)},className:"w-full h-6 px-1 bg-transparent border-0 text-sm text-center font-semibold text-slate-700 focus:ring-0 focus:outline-none"';
const new1 =
  'value:t.price??"",onChange:a=>{const v=a.target.value;if(v===""){B(t.id,"price",0);return}const n=parseFloat(v);isNaN(n)||B(t.id,"price",n)},readOnly:!1,className:D("w-full h-6 px-1 text-sm text-center font-semibold text-slate-700 focus:ring-1 focus:outline-none",as?"bg-white border border-slate-300 rounded":"bg-transparent border-0 focus:ring-0")';

if (s.includes(old1)) {
  s = s.replace(old1, new1);
  n++;
  console.log('Patched compact MRP input');
} else if (s.includes(new1)) {
  console.log('Compact MRP patch already applied');
} else {
  console.warn('Compact MRP pattern not found');
}

// Wide / alternate layout MRP input (emerald style)
const old2 =
  'value:Number(t.price||0).toFixed(2),onChange:a=>{const n=parseFloat(a.target.value)||0;B(t.id,"price",n)},className:"w-full px-2 py-1 bg-emerald-50 border border-emerald-300 rounded text-sm text-right font-bold text-emerald-700"';
const new2 =
  'value:t.price??"",onChange:a=>{const v=a.target.value;if(v===""){B(t.id,"price",0);return}const n=parseFloat(v);isNaN(n)||B(t.id,"price",n)},readOnly:!1,className:D("w-full px-2 py-1 rounded text-sm text-right font-bold text-emerald-700 focus:ring-1 focus:outline-none",as?"bg-white border-2 border-emerald-400":"bg-emerald-50 border border-emerald-300")';

if (s.includes(old2)) {
  s = s.replace(old2, new2);
  n++;
  console.log('Patched wide MRP input');
} else if (s.includes(new2)) {
  console.log('Wide MRP patch already applied');
} else {
  console.warn('Wide MRP pattern not found');
}

// Legacy pattern without isEditingInvoice styling (fallback)
const old3 = 'value:Number(t.price||0).toFixed(2),onChange:a=>{const n=parseFloat(a.target.value)||0;B(t.id,"price",n)}';
const new3 = 'value:t.price??"",onChange:a=>{const v=a.target.value;if(v===""){B(t.id,"price",0);return}const n=parseFloat(v);isNaN(n)||B(t.id,"price",n)},readOnly:!1';
if (s.includes(old3)) {
  const count = (s.match(new RegExp(old3.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  s = s.replaceAll(old3, new3);
  n += count;
  console.log('Patched', count, 'remaining MRP value bindings');
}

fs.writeFileSync(path, s);
console.log('Done. Total patch groups:', n);
