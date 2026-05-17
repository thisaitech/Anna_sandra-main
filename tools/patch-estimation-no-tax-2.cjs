const fs = require('fs');

function rep(file, old, neu, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes(old)) {
    if (s.includes(neu)) {
      console.log(file, 'Already:', label);
      return false;
    }
    console.warn(file, 'MISSING:', label);
    return false;
  }
  s = s.replace(old, neu);
  fs.writeFileSync(file, s);
  console.log(file, 'Patched:', label);
  return true;
}

let n = 0;
const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const quotPath = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';
const pdfPath = 'c:/project/Anna_sandra-main/dist/assets/pdfService-D_1uA_-Q.js';

if (rep(indexPath, 'quotations:"Quotations"', 'quotations:"Estimation"', 'nav quotations string')) n++;
if (rep(indexPath, 'title:"Quotations"', 'title:"Estimation"', 'page title')) n++;
if (rep(indexPath, 'label:"Quotations"', 'label:"Estimation"', 'nav label')) n++;
if (rep(indexPath, 'labelTa:"மேற்கோள்கள்"', 'labelTa:"மதிப்பீடு"', 'nav label ta')) n++;
if (rep(indexPath, 'newQuotation:"New Quotation"', 'newQuotation:"New Estimation"', 'new quotation btn')) n++;

// Remove tax mode select cell + taxable value cell from desktop rows
const rowOld =
  'children:e.jsxs("select",{value:t.taxMode||"exclusive",onChange:a=>E(t.id,"taxMode",a.target.value),className:"h-6 text-[9px] px-0.5 bg-transparent border-0 rounded font-medium text-slate-600 focus:ring-0 focus:outline-none cursor-pointer",title:"GST Tax Mode",children:[e.jsx("option",{value:"exclusive",children:"Without GST"}),e.jsx("option",{value:"inclusive",children:"With GST"})]})}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"60px",minWidth:"60px"},children:e.jsx("input",{type:"number",step:"0.01",min:"0",value:Number(t.price||0).toFixed(2)';

const rowNew =
  'children:e.jsx("input",{type:"number",step:"0.01",min:"0",value:Number(t.price||0).toFixed(2)';

if (rep(quotPath, rowOld, rowNew, 'remove tax mode select cell')) n++;

// Remove taxable td after mrp price - find pattern
const quot = fs.readFileSync(quotPath, 'utf8');
const taxTdStart = quot.indexOf('placeholder:"0"})}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"60px",minWidth:"60px"},children:e.');
if (taxTdStart > 0) {
  // find end of taxable td - next is B.discount or gst
  const slice = quot.substring(taxTdStart, taxTdStart + 500);
  const endMatch = slice.match(/placeholder:"0"}\)\}\),e\.jsx\("td"/);
  if (endMatch) {
    const taxableBlock = slice.substring(0, slice.indexOf('}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"38px"'));
    if (taxableBlock.includes('text-slate-600')) {
      const fullOld = 'placeholder:"0"})}),e.jsx("td",{className:"px-1 py-1.5 text-center align-middle",style:{width:"60px",minWidth:"60px"},children:e.';
      // Need more context - read file at taxTdStart
    }
  }
}

// Simpler: hide tax summary with replace k.totalTax>0
if (rep(quotPath, 'k.totalTax>0&&e.jsxs("motion.div"', '!1&&e.jsxs("motion.div"', 'hide tax row')) n++;
if (rep(quotPath, 'k.totalTax>0&&e.jsxs("motion.div"', '!1&&e.jsxs("motion.div"', 'hide tax row 2')) n++;

// pdf patches
if (rep(pdfPath, '?"QUOTATION":"TAX INVOICE"', '?"ESTIMATION":"TAX INVOICE"', 'pdf header title')) n++;

// Find table mapping in pdf - search Description of Goods
const pdf = fs.readFileSync(pdfPath, 'utf8');
const descIdx = pdf.indexOf('Description of Goods');
console.log('pdf desc', descIdx, pdf.substring(descIdx - 100, descIdx + 250));

// isEst injection at start of ct after opening brace
const pdfFnOld = 'function ct(e){const t=new Y,l=t.internal.pageSize.getWidth(),n=12;let o=10;';
const pdfFnNew =
  'function ct(e){const isEst=e.type==="quotation"||e.type==="quote";const t=new Y,l=t.internal.pageSize.getWidth(),n=12;let o=10;';
if (rep(pdfPath, pdfFnOld, pdfFnNew, 'pdf isEst flag')) n++;

// table head/body - find exact minified
const headIdx = pdf.indexOf('Taxable Value');
if (headIdx > 0) {
  const chunk = pdf.substring(headIdx - 150, headIdx + 120);
  console.log('head chunk', chunk);
}

// Tax summary guard
if (rep(pdfPath, 't.text("TAX SUMMARY:",n,f),f+=5', 'isEst||(t.text("TAX SUMMARY:",n,f),f+=5)', 'pdf tax summary')) n++;
if (rep(pdfPath, 't.text("Tax Amount:",S,y)', 'isEst||t.text("Tax Amount:",S,y)', 'pdf tax amount label')) n++;

// Search Tax Amount in pdf
const taIdx = pdf.indexOf('Tax Amount:');
console.log('Tax Amount idx', taIdx, pdf.substring(taIdx - 30, taIdx + 80));

console.log('round 2 patches:', n);
