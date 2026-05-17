const fs = require('fs');
const index = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const quot = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const pdf = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/pdfService-D_1uA_-Q.js', 'utf8');

console.log('index Quotations', index.indexOf('Quotations'));
console.log('index quotations nav', index.indexOf("quotations:"));

let i = index.indexOf('Quotations');
while (i >= 0) {
  console.log('  ', index.substring(i - 30, i + 40));
  i = index.indexOf('Quotations', i + 1);
}

console.log('\nquot Without GST', quot.indexOf('Without GST'));
console.log('quot totalTax>0', quot.indexOf('totalTax>0'));
if (quot.indexOf('totalTax>0') >= 0) {
  console.log(quot.substring(quot.indexOf('totalTax>0') - 40, quot.indexOf('totalTax>0') + 80));
}

console.log('\npdf QUOTATION', pdf.indexOf('QUOTATION'));
console.log('pdf quotation', pdf.indexOf('quotation'));
if (pdf.indexOf('QUOTATION') >= 0) console.log(pdf.substring(pdf.indexOf('QUOTATION') - 80, pdf.indexOf('QUOTATION') + 40));

console.log('\npdf tableData', pdf.indexOf('tableData=normalizedItems'));
if (pdf.indexOf('tableData=normalizedItems') >= 0)
  console.log(pdf.substring(pdf.indexOf('tableData=normalizedItems'), pdf.indexOf('tableData=normalizedItems') + 200));

console.log('\npdf TAX SUMMARY', pdf.indexOf('TAX SUMMARY'));
