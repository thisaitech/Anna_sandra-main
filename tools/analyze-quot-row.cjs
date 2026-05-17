const fs = require('fs');
const q = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');

const qStart = q.indexOf('tbody",{children:y.length>0&&y.map');
const sStart = s.indexOf('tbody",{children:f.invoiceItems.length>0&&f.invoiceItems.map');
if (qStart < 0) {
  const alt = q.indexOf('y.map((t,s)=>e.jsxs("tr"');
  console.log('alt qStart', alt);
}
console.log('qStart', qStart, 'sStart', sStart);

// Find end of first row - look for },s) or similar after tr
function extractRow(src, start, label) {
  const slice = src.slice(start, start + 8000);
  // find MRP cell and everything after
  const mrpIdx = slice.indexOf('children:"MRP"');
  const mrpInput = slice.indexOf('t.price');
  const discIdx = slice.indexOf('discountPercent');
  const totalIdx = slice.indexOf('t.total');
  console.log(`\n=== ${label} ===`);
  console.log('discountPercent in row slice:', discIdx);
  console.log('t.total in row slice:', totalIdx);
  // print from price input area
  const priceIdx = slice.indexOf('E(t.id,"price"');
  if (priceIdx < 0) {
    const p2 = slice.indexOf('onChange:a=>E(t.id,"price"');
    console.log('from price @', p2);
    console.log(slice.slice(p2, p2 + 3500));
  } else {
    console.log(slice.slice(priceIdx, priceIdx + 3500));
  }
}

extractRow(q, qStart >= 0 ? qStart : q.indexOf('y.map((t,s)=>e.jsxs("tr"'), 'Quotations');

const sTable = s.indexOf('ITEM NAME');
const sTbody = s.indexOf('tbody', sTable);
console.log('\nSales tbody @', sTbody);
const sSlice = s.slice(sTbody, sTbody + 8000);
const priceIdx = sSlice.indexOf('onChange:a=>E(t.id,"price"');
console.log('Sales from price:', sSlice.slice(priceIdx, priceIdx + 3500));

// Also check header row in Sales for tax columns
console.log('\nSales headers:', s.slice(sTable, sTable + 2000));
