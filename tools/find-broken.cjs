const fs = require('fs');
const q = fs.readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const s = fs.readFileSync('../dist/assets/Sales-DxyuXk9a.js', 'utf8');

const patterns = [
  '!1&&e.jsxs("motion.div"',
  'children:"CGST:"',
  'k.totalCGST>0',
  't.price.toFixed(2)',
  'Thank you for your business',
];

for (const p of patterns) {
  let i = 0;
  let c = 0;
  while ((i = q.indexOf(p, i)) !== -1) {
    c++;
    if (c <= 3) {
      console.log('\n--- Q', p, 'at', i);
      console.log(q.slice(i, i + 400));
    }
    i++;
  }
  console.log('Q', p, 'count', c);
}

// Find position of esbuild error - search unique string near error
const needle = 'k.total.toFixed(2)';
const qi = q.indexOf(needle);
console.log('\nk.total.toFixed in Q at', qi);
if (qi >= 0) console.log(q.slice(qi - 300, qi + 400));
