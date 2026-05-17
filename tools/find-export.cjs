const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
for (const p of ['exportToTallyExcel', 'ed("sale', 'Nt(', 'Ve)', 'Ve,', 'tally-export']) {
  const i = s.indexOf(p);
  if (i < 0) { console.log(p, 'NOT FOUND'); continue; }
  console.log('\n===', p, 'at', i, '===');
  console.log(s.substring(Math.max(0, i - 100), i + 350).replace(/\n/g, ' '));
}
