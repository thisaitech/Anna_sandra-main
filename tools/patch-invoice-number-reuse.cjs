/**
 * Fix: after editing invoice 007, new invoice reuses 007 and old one disappears
 * (dedupeInvoicesByIdentity hides duplicate invoice numbers)
 */
const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js';
let s = fs.readFileSync(path, 'utf8');
let n = 0;

// 1) resolveInvoiceNumberForSave: never reuse an existing invoice number on create
const ylOld = 'yl=async()=>{if(Yl||!W){const t=await kr();return vs(t),t}return ea(W),W}';
const ylNew =
  'yl=async()=>{if(Yl||!W){const t=await kr();return vs(t),t}try{const _all=await ed("sale",0);if(Array.isArray(_all)&&_all.some(_i=>(_i.invoiceNumber||"").toUpperCase()===(W||"").toUpperCase())){const t=await kr();return vs(t),t}}catch(_e){}return ea(W),W}';
if (s.includes(ylOld)) {
  s = s.replace(ylOld, ylNew);
  n++;
  console.log('Patched resolveInvoiceNumberForSave (yl)');
} else if (s.includes(ylNew)) {
  console.log('yl already patched');
} else {
  console.warn('yl pattern not found');
}

// 2) After successful invoice update, reset to next auto number
const updOld =
  'p.success("Invoice updated successfully!"),await he(),f?.editingInvoiceId&&It(),Oa(null),$a(null)';
const updNew =
  'p.success("Invoice updated successfully!"),await he(),f?.editingInvoiceId&&It(),vs(nn()),Oa(null),$a(null)';
if (s.includes(updOld)) {
  s = s.replace(updOld, updNew);
  n++;
  console.log('Patched post-update invoice number reset');
} else if (s.includes(updNew)) {
  console.log('post-update reset already patched');
} else {
  console.warn('post-update pattern not found');
}

// 3) Main "+ Add" on sales list
const addOld =
  'onClick:()=>ue("create"),className:"px-4 py-2 bg-white border border-slate-200 rounded-lg ho';
const addNew =
  'onClick:()=>{vs(nn()),ue("create")},className:"px-4 py-2 bg-white border border-slate-200 rounded-lg ho';
if (s.includes(addOld)) {
  s = s.replace(addOld, addNew);
  n++;
  console.log('Patched list + Add button');
} else if (s.includes(addNew)) {
  console.log('list + Add already patched');
} else {
  console.warn('list + Add pattern not found');
}

// 4) Blue "+ Add" / create buttons (mobile/desktop)
const btnOld =
  'onClick:()=>{te.pathname==="/pos"&&(Ce(!0),localStorage.removeItem("pos_viewMode")),ue("create")}';
const btnNew =
  'onClick:()=>{vs(nn()),te.pathname==="/pos"&&(Ce(!0),localStorage.removeItem("pos_viewMode")),ue("create")}';
const count = (s.match(new RegExp(btnOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
if (count > 0) {
  s = s.split(btnOld).join(btnNew);
  n += count;
  console.log('Patched', count, 'create button(s)');
} else if (s.includes(btnNew)) {
  console.log('create buttons already patched');
} else {
  console.warn('create button pattern not found');
}

// 5) handleBackToList while editing
const backOld = 'Gi&&(f?.editingInvoiceId&&It(),Oa(null),$a(null),';
const backNew = 'Gi&&(f?.editingInvoiceId&&(It(),vs(nn())),Oa(null),$a(null),';
if (s.includes(backOld)) {
  s = s.replace(backOld, backNew);
  n++;
  console.log('Patched handleBackToList edit reset');
} else if (s.includes(backNew)) {
  console.log('handleBackToList already patched');
} else {
  console.warn('handleBackToList pattern not found');
}

fs.writeFileSync(path, s);
console.log('Done. Patch count:', n);
