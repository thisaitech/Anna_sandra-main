const fs = require('fs');

function rep(file, old, neu, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes(old)) {
    if (s.includes(neu)) {
      console.log('Already:', label);
      return false;
    }
    console.warn('MISSING:', label, old.slice(0, 80));
    return false;
  }
  fs.writeFileSync(file, s.replace(old, neu));
  console.log('Patched:', label);
  return true;
}

let n = 0;
const quotPath = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';
const pdfPath = 'c:/project/Anna_sandra-main/dist/assets/pdfService-D_1uA_-Q.js';

if (rep(quotPath, 'k.totalTax>0&&e.jsxs("div",{className:"flex justify-between items-center py-0.5 border-t border-slate-300/50"', '!1&&e.jsxs("motion.div",{className:"flex justify-between items-center py-0.5 border-t border-slate-300/50"', 'hide tax summary div')) n++;

// PDF table body + head
const pdfOld1 =
  '),c(r.rate),c(r.taxableValue),`${r.taxRate}%`,c(r.taxAmount),c(r.total)]);V(t,{startY:o,head:[["#","Description of Goods/Services","HSN/SAC","Qty","Rate","Taxable Value","GST%","Tax Amt","Total"]],body:$';
const pdfNew1 =
  '),isEst?c(r.rate),c(r.total)]:[c(r.rate),c(r.taxableValue),`${r.taxRate}%`,c(r.taxAmount),c(r.total)]);V(t,{startY:o,head:isEst?[["#","Description","HSN/SAC","Qty","Rate","Total"]]:[["#","Description of Goods/Services","HSN/SAC","Qty","Rate","Taxable Value","GST%","Tax Amt","Total"]],body:$';
if (rep(pdfPath, pdfOld1, pdfNew1, 'pdf table estimation')) n++;

// Fix - the map starts differently. Read actual
const pdf = fs.readFileSync(pdfPath, 'utf8');
const idx = pdf.indexOf('c(r.taxableValue)');
console.log(pdf.substring(idx - 80, idx + 200));

if (rep(pdfPath, 't.text("Tax Amount:",A,h),t.text(c(tt||E||0),l-n,h,{align:"right"}),h+=5', 'isEst||(t.text("Tax Amount:",A,h),t.text(c(tt||E||0),l-n,h,{align:"right"})),h+=5', 'pdf hide tax amount')) n++;

// CGST lines in pdf totals - wrap display blocks
if (rep(pdfPath, 'T>0&&(t.text(`CGST: ${c(T)}`,n,f),f+=4)', 'isEst?0:T>0&&(t.text(`CGST: ${c(T)}`,n,f),f+=4)', 'pdf hide cgst')) n++;
if (rep(pdfPath, 'b>0&&(t.text(`SGST: ${c(b)}`,n,f),f+=4)', 'isEst?0:b>0&&(t.text(`SGST: ${c(b)}`,n,f),f+=4)', 'pdf hide sgst')) n++;
if (rep(pdfPath, 'v>0&&(t.text(`IGST: ${c(v)}`,n,f),f+=4)', 'isEst?0:v>0&&(t.text(`IGST: ${c(v)}`,n,f),f+=4)', 'pdf hide igst')) n++;

// Remove GST% GST₹ td cells from quotation rows - find after discount cols
const q = fs.readFileSync(quotPath, 'utf8');
const gstIdx = q.indexOf('children:"GST%"');
if (gstIdx > 0) console.log('GST% still in file at', gstIdx);

// Row GST columns pattern
const gstRowOld =
  '}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle whitespace-nowrap",style:{width:"38px",minWidth:"38px"},children:e.jsx("input",{type:"number",min:"0",max:"100",value:t.tax||0,onChange:a=>E(t.id,"tax",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 bg-transparent border-0 text-xs text-center font-semibold text-slate-700 focus:ring-0 focus:outline-none"})}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle whitespace-nowrap",style:{width:"45px",minWidth:"45px"},children:e.jsxs("span",{className:"text-[10px] font-medium text-slate-600",children:["₹",(t.taxAmount||0).toFixed(2)]})}),B.gstBreakdown';

const gstRowNew = '}),B.gstBreakdown';

if (rep(quotPath, gstRowOld, gstRowNew, 'remove gst% gst amount row cells')) n++;

// taxable value cell after price
const taxValOld =
  'placeholder:"0"})}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"60px",minWidth:"60px"},children:e.jsxs("span",{className:"text-[10px] font-medium text-slate-600",children:["₹",((t.basePrice!==void 0?t.basePrice:t.price)*(t.qty||1)).toFixed(2)]})}),B.discount';

const taxValNew = 'placeholder:"0"})}),B.discount';

if (rep(quotPath, taxValOld, taxValNew, 'remove taxable value cell')) n++;

console.log('round 3:', n);
