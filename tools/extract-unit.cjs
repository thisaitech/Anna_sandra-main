const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('resolveInvoiceItemUnit'));
const i = src.indexOf('resolveInvoiceItemUnit');
console.log(src.substring(i, i + 1500));
