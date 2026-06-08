const fs = require('fs');
const files = ['partyService-Wzcg7Wjf.js','itemService-sgFD7LVj.js','invoiceService-wndk85Fv.js','expenseService-C2uEJ3jV.js'];
for (const f of files) {
  const s = fs.readFileSync('dist/assets/'+f,'utf8');
  const m = s.match(/typeof \w+==="function"&&setTimeout\(\(\)=>\{try\{[^}]+\}catch[^}]+\}\},0\)/);
  console.log(f, ':', m ? m[0] : 'NOT FOUND');
}
