const fs = require('fs');
for (const f of ['partyService-Wzcg7Wjf.js','invoiceService-wndk85Fv.js']) {
  const s = fs.readFileSync('dist/assets/'+f,'utf8');
  const i = s.indexOf('_sandReg');
  console.log(f, ':', s.slice(i, i+280));
}
