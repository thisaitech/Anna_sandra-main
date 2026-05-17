const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const needles = [
  'Quotations',
  'Quotation',
  'QTN',
  'GST%',
  'GST\u20b9',
  'With GST',
  'CGST',
  'children:"Tax"',
  'children:"Quotations"',
  '/quotations',
  'quotation',
];

for (const t of needles) {
  const i = s.indexOf(t);
  console.log(JSON.stringify(t), i >= 0 ? i : 'NOT FOUND');
  if (i >= 0) console.log('  ', s.substring(i - 30, i + 80).replace(/\n/g, ' '));
}
