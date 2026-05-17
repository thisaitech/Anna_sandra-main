/**
 * Rename Quotations → Estimation and remove all tax UI/export for quotations page.
 */
const fs = require('fs');

function rep(file, old, neu, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(old)) {
    s = s.replace(old, neu);
    fs.writeFileSync(file, s);
    console.log(file, 'Patched:', label);
    return true;
  }
  if (s.includes(neu)) {
    console.log(file, 'Already patched:', label);
    return true;
  }
  console.warn(file, 'MISSING:', label);
  return false;
}

let n = 0;
const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const quotPath = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';
const pdfPath = 'c:/project/Anna_sandra-main/dist/assets/pdfService-D_1uA_-Q.js';

// --- Navigation labels (index bundle has i18n embedded) ---
if (rep(indexPath, "quotations: 'Quotations'", "quotations: 'Estimation'", 'en nav label')) n++;
if (rep(indexPath, "quotations: 'மேற்கோள்கள்'", "quotations: 'மதிப்பீடு'", 'ta nav label')) n++;
if (rep(indexPath, 'title:"New Quotation"', 'title:"New Estimation"', 'sidebar title')) n++;
if (rep(indexPath, 'children:"New Quotation"', 'children:"New Estimation"', 'sidebar tooltip')) n++;

// --- Quotations page bundle (only used on /quotations) ---
if (rep(quotPath, 'pa("QTN")', 'pa("EST")', 'invoice prefix QTN→EST')) n++;

const nsOld =
  'Ns=()=>{const s=M().state||"Tamil Nadu";j(`💰 Calculating Totals - Seller: ${s}, Customer: ${ge||"(none)"}`);let a=0,r=0,n=0,i=0;y.forEach(F=>{const T=F.basePrice!==void 0?F.basePrice:F.price,v=(T-T*(F.discount||0)/100)*F.qty;i+=v;const _=Jt({taxableAmount:v,gstRate:F.tax||0,sellerState:s,customerState:ge});j(`  Item: ${F.name} - CGST: ₹${_.cgstAmount}, SGST: ₹${_.sgstAmount}, IGST: ₹${_.igstAmount}`),a+=_.cgstAmount,r+=_.sgstAmount,n+=_.igstAmount});const o=X==="percent"?i*(K/100):K,m=i-o,d=i>0?m/i:1,l=a*d,u=r*d,g=n*d,h=l+u+g,f=m+h,p=Je?Math.round(f)-f:0,C=Je?Math.round(f):f,D={subtotal:Math.round(i*100)/100,discount:Math.round(o*100)/100,totalTax:Math.round(h*100)/100,total:Math.round(C*100)/100,totalCGST:Math.round(l*100)/100,totalSGST:Math.round(u*100)/100,totalIGST:Math.round(g*100)/100,roundOffAmount:Math.round(p*100)/100};return j(`📊 FINAL TOTALS: CGST=₹${D.totalCGST}, SGST=₹${D.totalSGST}, IGST=₹${D.totalIGST}, Tax=₹${D.totalTax}`),D}';

const nsNew =
  'Ns=()=>{let i=0;y.forEach(F=>{const line=Number(F.total);i+=Number.isFinite(line)&&line>0?line:(Number(F.price)||0)*(Number(F.qty)||0)});const o=X==="percent"?i*(K/100):K,m=i-o,f=m,p=Je?Math.round(f)-f:0,C=Je?Math.round(f):f;return{subtotal:Math.round(i*100)/100,discount:Math.round(o*100)/100,totalTax:0,total:Math.round(C*100)/100,totalCGST:0,totalSGST:0,totalIGST:0,roundOffAmount:Math.round(p*100)/100}}';

if (rep(quotPath, nsOld, nsNew, 'calculateTotals no tax')) n++;

// Table header: remove TAX, TAXABLE, GST%, GST₹, CGST/SGST/IGST breakdown columns
const hdrOld =
  ',children:"TAX"}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider",style:{width:"60px",minWidth:"60px"},children:"MRP"}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",style:{width:"60px",minWidth:"60px"},children:"TAXABLE"}),B.discount&&e.jsxs(e.Fragment,{children:[e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",style:{width:"38px",minWidth:"38px"},children:"Dis%"}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",style:{width:"45px",minWidth:"45px"},children:"Dis₹"})]}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",style:{width:"38px",minWidth:"38px"},children:"GST%"}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",style:{width:"45px",minWidth:"45px"},children:"GST₹"}),B.gstBreakdown&&e.jsxs(e.Fragment,{children:[e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider",style:{width:"35px",minWidth:"35px"},children:"CGST%"}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider",style:{width:"35px",minWidth:"35px"},children:"SGST%"}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider",style:{width:"35px",minWidth:"35px"},children:"IGST%"})]}),e.jsx("th"';

const hdrNew =
  ',children:"MRP"}),B.discount&&e.jsxs(e.Fragment,{children:[e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",style:{width:"38px",minWidth:"38px"},children:"Dis%"}),e.jsx("th",{className:"px-1 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",style:{width:"45px",minWidth:"45px"},children:"Dis₹"})]}),e.jsx("th"';

if (rep(quotPath, hdrOld, hdrNew, 'table header remove tax cols')) n++;

// Row cells: remove tax mode select + taxable + gst columns (desktop table row)
const rowOld =
  '}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"58px",minWidth:"58px"},children:e.jsxs("select",{value:t.taxMode||"exclusive",onChange:a=>E(t.id,"taxMode",a.target.value),className:"w-full h-7 px-0.5 text-[9px] border border-slate-200 rounded bg-white",onClick:a=>a.stopPropagation(),children:[e.jsx("option",{value:"exclusive",children:"Without GST"}),e.jsx("option",{value:"inclusive",children:"With GST"})]})}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"60px",minWidth:"60px"},children:e.jsx("input",{type:"number",min:"0",step:"0.01",value:t.price||0,onChange:a=>E(t.id,"price",parseFloat(a.target.value)||0),className:"w-full h-7 px-1 text-[10px] text-center border border-slate-200 rounded",onClick:a=>a.stopPropagation()})}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle whitespace-nowrap",style:{width:"60px",minWidth:"60px"},children:e.jsxs("span",{className:"text-[10px] font-medium text-slate-600",children:["₹",((t.basePrice!==void 0?t.basePrice:t.price)*(t.qty||1)).toFixed(2)]})}),B.discount&&e.jsxs(e.Fragment,{children:[e.jsx("td"';

const rowNew =
  '}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"60px",minWidth:"60px"},children:e.jsx("input",{type:"number",min:"0",step:"0.01",value:t.price||0,onChange:a=>E(t.id,"price",parseFloat(a.target.value)||0),className:"w-full h-7 px-1 text-[10px] text-center border border-slate-200 rounded",onClick:a=>a.stopPropagation()})}),B.discount&&e.jsxs(e.Fragment,{children:[e.jsx("td"';

if (rep(quotPath, rowOld, rowNew, 'table row remove tax cells')) n++;

// Mobile card tax fields block
const mobOld =
  '}),e.jsxs("motion.div",{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"px-2 pb-2 border-t border-slate-100",children:e.jsxs("motion.div",{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"flex gap-1.5 pt-2",children:[e.jsxs("motion.div",{whileTap:{scale:.95},className:"flex-1",children:[e.jsx("span",{className:"text-[8px] text-slate-400",children:"GST%"}),e.jsx("input",{type:"number",min:"0",max:"100",value:t.tax||0,onChange:a=>E(t.id,"tax",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 text-[10px] text-center border border-slate-200 rounded",onClick:a=>a.stopPropagation()})]}),e.jsxs("motion.div"';

const mobNew =
  '}),e.jsxs("motion.div",{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"hidden",children:e.jsxs("motion.div",{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"flex gap-1.5 pt-2",children:[e.jsxs("motion.div",{whileTap:{scale:.95},className:"flex-1",children:[e.jsx("span",{className:"text-[8px] text-slate-400",children:"GST%"}),e.jsx("input",{type:"number",min:"0",max:"100",value:t.tax||0,onChange:a=>E(t.id,"tax",parseFloat(a.target.value)||0),className:"w-full h-6 px-1 text-[10px] text-center border border-slate-200 rounded",onClick:a=>a.stopPropagation()})]}),e.jsxs("motion.div"';

if (rep(quotPath, mobOld, mobNew, 'hide mobile GST fields')) n++;

// Print preview TAX INVOICE → ESTIMATION
if (rep(quotPath, 'children:"TAX INVOICE"}', 'children:"ESTIMATION"}', 'print header')) n++;
if (rep(quotPath, 'V||"QTN-XXXX"', 'V||"EST-XXXX"', 'print invoice placeholder')) n++;
if (rep(quotPath, 'Quotation loaded!', 'Estimation loaded!', 'toast message')) n++;

// Force tax summary row hidden (belt and suspenders)
if (rep(quotPath, 'k.totalTax>0&&e.jsxs("motion.div"', '!1&&e.jsxs("motion.div"', 'hide tax summary row')) n++;

// --- PDF / print export ---
if (rep(pdfPath, '? "QUOTATION":"TAX INVOICE"', '? "ESTIMATION":"TAX INVOICE"', 'pdf title')) n++;
if (rep(pdfPath, '? "QUOTATION":"TAX INVOICE"', '? "ESTIMATION":"TAX INVOICE"', 'pdf title alt')) n++;
// print HTML headers
if (rep(pdfPath, "? 'QUOTATION' : 'TAX INVOICE'", "? 'ESTIMATION' : 'TAX INVOICE'", 'print html title')) n++;
if (rep(pdfPath, '? "Quotation"', '? "Estimation"', 'document label')) n++;

// PDF: skip tax columns & summary for quote/quotation
const pdfTableOld =
  'const tableData = normalizedItems.map((item) => ([\n    item.index + 1,\n    item.name,\n    item.hsnCode || \'-\',\n    `${item.quantity} ${item.unit}`.trim(),\n    formatPdfCurrency(item.rate),\n    formatPdfCurrency(item.taxableValue),\n    `${item.taxRate}%`,\n    formatPdfCurrency(item.taxAmount),\n    formatPdfCurrency(item.total)\n  ]))';

// minified - find in file
const pdfMinOld =
  'const tableData=normalizedItems.map(t=>[t.index+1,t.name,t.hsnCode||"-",`${t.quantity} ${t.unit}`.trim(),c(t.rate),c(t.taxableValue),`${t.taxRate}%`,c(t.taxAmount),c(t.total)])';

const pdfMinNew =
  'const isEst=e.type==="quotation"||e.type==="quote";const tableData=normalizedItems.map(t=>isEst?[t.index+1,t.name,t.hsnCode||"-",`${t.quantity} ${t.unit}`.trim(),c(t.rate),c(t.total)]:[t.index+1,t.name,t.hsnCode||"-",`${t.quantity} ${t.unit}`.trim(),c(t.rate),c(t.taxableValue),`${t.taxRate}%`,c(t.taxAmount),c(t.total)])';

if (rep(pdfPath, pdfMinOld, pdfMinNew, 'pdf table columns estimation')) n++;

const pdfHeadOld =
  'head:[["#","Description of Goods/Services","HSN/SAC","Qty","Rate","Taxable Value","GST%","Tax Amt","Total"]]';
const pdfHeadMinOld =
  'head:[["#","Description of Goods/Services","HSN/SAC","Qty","Rate","Taxable Value","GST%","Tax Amt","Total"]]';

// In minified file the head is inline in autoTable call
const pdfAutoOld =
  'head:[["#","Description of Goods/Services","HSN/SAC","Qty","Rate","Taxable Value","GST%","Tax Amt","Total"]],body:tableData';
const pdfAutoNew =
  'head:isEst?[["#","Description","HSN/SAC","Qty","Rate","Total"]]:[["#","Description of Goods/Services","HSN/SAC","Qty","Rate","Taxable Value","GST%","Tax Amt","Total"]],body:tableData';

if (rep(pdfPath, pdfAutoOld, pdfAutoNew, 'pdf table head estimation')) n++;

// Hide tax summary block in PDF for estimation
const pdfTaxSumOld =
  'doc.text("TAX SUMMARY:",margin,leftY),leftY+=5';
const pdfTaxSumNew =
  'isEst||(doc.text("TAX SUMMARY:",margin,leftY),leftY+=5)';

if (rep(pdfPath, pdfTaxSumOld, pdfTaxSumNew, 'pdf hide tax summary label')) n++;

const pdfTaxAmtOld = 'doc.text("Tax Amount:",totalsX,totalsY)';
const pdfTaxAmtNew = 'isEst||doc.text("Tax Amount:",totalsX,totalsY)';

if (rep(pdfPath, pdfTaxAmtOld, pdfTaxAmtNew, 'pdf hide tax amount line')) n++;

const pdfTaxValOld =
  'doc.text(formatPdfCurrency(totalTax||displayTotalTax||0),pageWidth-margin,totalsY,{align:"right"}),totalsY+=5';
const pdfTaxValNew =
  'isEst||doc.text(formatPdfCurrency(totalTax||displayTotalTax||0),pageWidth-margin,totalsY,{align:"right"}),totalsY+=5';

if (rep(pdfPath, pdfTaxValOld, pdfTaxValNew, 'pdf hide tax amount value')) n++;

// Bump cache versions
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');
const bump = (pattern, replacement) => {
  if (html.match(pattern)) {
    html = html.replace(pattern, replacement);
    return true;
  }
  return false;
};
bump(/index-jCsVk30s\.js\?v=\d+/, (m) => {
  const v = Number(m.match(/\d+/)[0]) + 1;
  return `index-jCsVk30s.js?v=${v}`;
});
bump(/Quotations-CWlEFrSk\.js\?v=\d+/, (m) => {
  const v = Number(m.match(/\d+/)[0]) + 1;
  return `Quotations-CWlEFrSk.js?v=${v}`;
});
if (!html.includes('Quotations-CWlEFrSk.js?v=')) {
  html = html.replace(/Quotations-CWlEFrSk\.js/g, 'Quotations-CWlEFrSk.js?v=1');
}
fs.writeFileSync(htmlPath, html);
console.log('Updated index.html cache bust');

console.log('Total patches applied:', n);
process.exit(n > 0 ? 0 : 1);
