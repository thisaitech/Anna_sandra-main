const fs = require('fs');

function rep(file, old, neu, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes(old)) {
    if (neu && s.includes(neu)) {
      console.log('Already:', label);
      return false;
    }
    console.warn('MISSING:', label);
    return false;
  }
  s = s.replace(old, neu);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  return true;
}

let n = 0;
const quotPath = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';

let q = fs.readFileSync(quotPath, 'utf8');
const qtn = (q.match(/pa\("QTN"\)/g) || []).length;
if (qtn) {
  q = q.split('pa("QTN")').join('pa("EST")');
  q = q.split('ga("QTN")').join('ga("EST")');
  fs.writeFileSync(quotPath, q);
  console.log('Replaced QTN prefixes:', qtn);
  n++;
}

// Mobile: remove Incl/Excl + GST%
if (
  rep(
    quotPath,
    'e.jsx("button",{type:"button",onClick:a=>{a.stopPropagation(),E(t.id,"taxMode",t.taxMode==="inclusive"?"exclusive":"inclusive")},className:S("h-6 px-1.5 text-[8px] rounded border flex items-center gap-0.5",t.taxMode==="inclusive"?"bg-green-50 border-green-200 text-green-700":"bg-violet-50 border-violet-200 text-violet-700"),children:[e.jsx("span",{className:S("w-1 h-1 rounded-full",t.taxMode==="inclusive"?"bg-green-500":"bg-violet-500")}),t.taxMode==="inclusive"?"Incl":"Excl"]}),e.jsxs("motion.div",{className:"flex-1",children:[e.jsx("span",{className:"text-[8px] text-slate-400",children:"GST%"}),e.jsx("input",{type:"number",min:"0",max:"100",value:t.tax||0,onChange:a=>E(t.id,"tax",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 text-[10px] text-center border border-slate-200 rounded",onClick:a=>a.stopPropagation()})]}),',
    '',
    'mobile incl/excl and gst%'
  )
)
  n++;

// Also try div instead of motion.div for GST block if above fails
if (
  rep(
    quotPath,
    'e.jsx("button",{type:"button",onClick:a=>{a.stopPropagation(),E(t.id,"taxMode",t.taxMode==="inclusive"?"exclusive":"inclusive")},className:S("h-6 px-1.5 text-[8px] rounded border flex items-center gap-0.5",t.taxMode==="inclusive"?"bg-green-50 border-green-200 text-green-700":"bg-violet-50 border-violet-200 text-violet-700"),children:[e.jsx("span",{className:S("w-1 h-1 rounded-full",t.taxMode==="inclusive"?"bg-green-500":"bg-violet-500")}),t.taxMode==="inclusive"?"Incl":"Excl"]}),e.jsxs("motion.div",{className:"flex-1",children:[e.jsx("span",{className:"text-[8px] text-slate-400",children:"GST%"}),e.jsx("input",{type:"number",min:"0",max:"100",value:t.tax||0,onChange:a=>E(t.id,"tax",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 text-[10px] text-center border border-slate-200 rounded",onClick:a=>a.stopPropagation()})]}),',
    '',
    'mobile incl gst motion.div'
  )
)
  n++;

if (
  rep(
    quotPath,
    'e.jsx("button",{type:"button",onClick:a=>{a.stopPropagation(),E(t.id,"taxMode",t.taxMode==="inclusive"?"exclusive":"inclusive")},className:S("h-6 px-1.5 text-[8px] rounded border flex items-center gap-0.5",t.taxMode==="inclusive"?"bg-green-50 border-green-200 text-green-700":"bg-violet-50 border-violet-200 text-violet-700"),children:[e.jsx("span",{className:S("w-1 h-1 rounded-full",t.taxMode==="inclusive"?"bg-green-500":"bg-violet-500")}),t.taxMode==="inclusive"?"Incl":"Excl"]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("span",{className:"text-[8px] text-slate-400",children:"GST%"}),e.jsx("input",{type:"number",min:"0",max:"100",value:t.tax||0,onChange:a=>E(t.id,"tax",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 text-[10px] text-center border border-slate-200 rounded",onClick:a=>a.stopPropagation()})]}),',
    '',
    'mobile incl gst div'
  )
)
  n++;

// Print preview modal table
if (
  rep(
    quotPath,
    'e.jsx("th",{className:"text-right px-4 py-2 font-medium",children:"Rate"}),e.jsx("th",{className:"text-right px-4 py-2 font-medium",children:"GST%"}),e.jsx("th",{className:"text-right px-4 py-2 font-medium",children:"Amount"})',
    'e.jsx("th",{className:"text-right px-4 py-2 font-medium",children:"Rate"}),e.jsx("th",{className:"text-right px-4 py-2 font-medium",children:"Amount"})',
    'print preview header'
  )
)
  n++;

if (
  rep(
    quotPath,
    'ot=v.taxRate??v.gstRate??v.gst??0,Re=v.taxableAmount??Se*U,Vt=v.taxAmount??v.gstAmount??Re*ot/100,Tl=v.total??v.amount??Re+Vt;return e.jsxs("tr",{className:"border-t border-border",children:[e.jsx("td",{className:"px-4 py-2 font-medium text-foreground",children:R}),e.jsx("td",{className:"px-4 py-2",children:Z}),e.jsx("td",{className:"px-4 py-2 text-right",children:U}),e.jsxs("td",{className:"px-4 py-2 text-right",children:["₹",Number(Se||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsxs("td",{className:"px-4 py-2 text-right",children:[ot,"%"]}),e.jsxs("td",{className:"px-4 py-2 text-right font-semibold",children:["₹",Number(Tl||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]',
    'Tl=v.total??v.amount??Se*U;return e.jsxs("tr",{className:"border-t border-border",children:[e.jsx("td",{className:"px-4 py-2 font-medium text-foreground",children:R}),e.jsx("td",{className:"px-4 py-2",children:Z}),e.jsx("td",{className:"px-4 py-2 text-right",children:U}),e.jsxs("td",{className:"px-4 py-2 text-right",children:["₹",Number(Se||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsxs("td",{className:"px-4 py-2 text-right font-semibold",children:["₹",Number(Tl||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]',
    'print preview row'
  )
)
  n++;

// Export / share HTML table: remove Tax column
if (
  rep(
    quotPath,
    'e.jsx("th",{className:"text-right py-2 text-sm font-semibold text-gray-700",children:"Price"}),e.jsx("th",{className:"text-right py-2 text-sm font-semibold text-gray-700",children:"Tax"}),e.jsx("th",{className:"text-right py-2 text-sm font-semibold text-gray-700",children:"Total"})',
    'e.jsx("th",{className:"text-right py-2 text-sm font-semibold text-gray-700",children:"Price"}),e.jsx("th",{className:"text-right py-2 text-sm font-semibold text-gray-700",children:"Total"})',
    'export table header'
  )
)
  n++;

if (
  rep(
    quotPath,
    'e.jsxs("td",{className:"py-3 text-sm text-right text-gray-800",children:["₹",t.price.toFixed(2)]}),e.jsxs("td",{className:"py-3 text-sm text-right text-gray-800",children:[t.tax,"%"]}),e.jsxs("td",{className:"py-3 text-sm text-right font-medium text-gray-900",children:["₹",t.total.toFixed(2)]})]',
    'e.jsxs("td",{className:"py-3 text-sm text-right text-gray-800",children:["₹",t.price.toFixed(2)]}),e.jsxs("td",{className:"py-3 text-sm text-right font-medium text-gray-900",children:["₹",t.total.toFixed(2)]})]',
    'export table row'
  )
)
  n++;

// Hide CGST/SGST in export totals
if (rep(quotPath, 'k.totalCGST>0&&e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-gray-600",children:"CGST:"})', '!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"CGST:"})', 'hide export cgst')) n++;
if (rep(quotPath, 'k.totalSGST>0&&e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-gray-600",children:"SGST:"})', '!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"SGST:"})', 'hide export sgst')) n++;
if (rep(quotPath, 'k.totalIGST>0&&e.jsxs("div"', '!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span"', 'hide export igst')) n++;

// Classic print B.tax
if (rep(quotPath, 'B.tax&&e.jsx("th"', '!1&&e.jsx("th"', 'B.tax header')) n++;
if (rep(quotPath, 'B.tax&&e.jsxs("td"', '!1&&e.jsxs("td"', 'B.tax cell')) n++;
if (rep(quotPath, '+(B.tax?1:0)', '+0', 'colspan')) n++;

// Print template CGST block
if (
  rep(
    quotPath,
    'return t>0?e.jsxs(e.Fragment,{children:[e.jsxs("motion.div",{className:"flex justify-between mb-1 text-xs",children:[e.jsx("span",{children:"CGST:"}),e.jsxs("span",{children:["₹",s.toFixed(2)]})]}),e.jsxs("motion.div",{className:"flex justify-between mb-2 text-xs",children:[e.jsx("span",{children:"SGST:"}),e.jsxs("span",{children:["₹",a.toFixed(2)]})]})]}):null})()',
    'return null})()',
    'print cgst block'
  )
)
  n++;

if (
  rep(
    quotPath,
    'return t>0?e.jsxs(e.Fragment,{children:[e.jsxs("motion.div",{className:"flex justify-between mb-1 text-xs",children:[e.jsx("span",{children:"CGST:"}),e.jsxs("span",{children:["₹",s.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between mb-2 text-xs",children:[e.jsx("span",{children:"SGST:"}),e.jsxs("span",{children:["₹",a.toFixed(2)]})]})]}):null})()',
    'return null})()',
    'print cgst block div'
  )
)
  n++;

// Preview modal zero tax
if (
  rep(
    quotPath,
    'items:y.map(t=>({name:t.name,quantity:t.qty,price:t.price,total:t.total,gst:t.tax,hsnCode:t.hsnCode,taxMode:t.taxMode,basePrice:t.basePrice,cgstPercent:t.cgstPercent,cgstAmount:t.cgstAmount,sgstPercent:t.sgstPercent,sgstAmount:t.sgstAmount,igstPercent:t.igstPercent,igstAmount:t.igstAmount})),subtotal:',
    'items:y.map(t=>({name:t.name,quantity:t.qty,price:t.price,total:t.total,gst:0,hsnCode:t.hsnCode,taxMode:"inc",basePrice:t.price,cgstPercent:0,cgstAmount:0,sgstPercent:0,sgstAmount:0,igstPercent:0,igstAmount:0})),subtotal:',
    'preview modal items'
  )
)
  n++;

if (rep(quotPath, 'totalTax:k.totalTax,cgst:k.totalCGST,sgst:k.totalSGST,igst:k.totalIGST', 'totalTax:0,cgst:0,sgst:0,igst:0', 'preview modal totals')) n++;

if (rep(quotPath, 'children:"Quotations"', 'children:"Estimation"', 'page title')) n++;

console.log('Patches applied:', n);
