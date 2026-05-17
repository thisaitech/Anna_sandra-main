const q = require('fs').readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const patterns = [
  'k.total.toFixed(2)]})]}),',
  'k.total.toFixed(2)]})]})}),',
  'k.total.toFixed(2)]})]})})',
  'flex justify-between text-sm",children:[e.jsx("span",{className:"flex justify-between text-sm"',
];
for (const p of patterns) {
  let i = 0;
  let n = 0;
  while ((i = q.indexOf(p, i)) !== -1) {
    n++;
    const line = q.slice(0, i).split('\n').length;
    console.log(`\n#${n} line ${line} pat ${p.slice(0, 40)}`);
    console.log(q.slice(i - 60, i + p.length + 80));
    i++;
  }
  console.log('count', p, n);
}
