const fs = require('fs');
const p = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
let s = fs.readFileSync(p, 'utf8');
const reps = [
  ['quotations:"மேற்கோள்கள்"', 'quotations:"மதிப்பீடு"'],
  ['quotations:{title:"மேற்கோள்கள்"', 'quotations:{title:"மதிப்பீடு"'],
  ['newQuotation:"புதிய மேற்கோள்"', 'newQuotation:"புதிய மதிப்பீடு"'],
  ['addQuotation:"Add Quotation"', 'addQuotation:"Add Estimation"'],
  ['addQuotation:"மேற்கோள்', 'addQuotation:"மதிப்பீடு'],
  ['quotationNumber:"Quotation Number"', 'quotationNumber:"Estimation Number"'],
];
let n = 0;
for (const [a, b] of reps) {
  if (s.includes(a)) {
    s = s.split(a).join(b);
    console.log('OK', a.slice(0, 40));
    n++;
  } else console.log('skip', a.slice(0, 40));
}
fs.writeFileSync(p, s);
console.log('done', n);
