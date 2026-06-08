const fs = require('fs');
const inv = fs.readFileSync('dist/assets/invoiceService-wndk85Fv.js', 'utf8');
const i = inv.indexOf('K=()=>');
const j = inv.indexOf('function K');
console.log('K= at', i, i>=0?inv.slice(i,i+400):'none');
console.log('import o as', inv.includes('o as Ci') || inv.includes('Ci'));
