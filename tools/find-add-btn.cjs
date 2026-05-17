const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');

// yl function full
const yi = s.indexOf('yl=async()=>');
console.log('yl at', yi);
console.log(s.substring(yi, yi + 120));

// vs and oa definitions
let i = 0;
let c = 0;
while ((i = s.indexOf('vs=', i)) >= 0 && c < 5) {
  const ctx = s.substring(i, i + 120);
  if (ctx.includes('setInvoice') || ctx.includes('Invoice') || ctx.includes('value')) {
    console.log('\nvs=', ctx);
    c++;
  }
  i++;
}

// find vs( as applyAuto - search const vs=
i = s.indexOf('const vs=') || s.indexOf(',vs=');
console.log('\nvs def search');
['vs=t=>','vs=a=>','vs=e=>','vs=s=>','vs=n=>'].forEach(p => {
  const j = s.indexOf(p);
  if (j > 0) console.log(p, s.substring(j, j + 100));
});

// W and Yl - invoice number state
const wMatch = s.match(/\[W,(\w+)\]=l\.useState/);
console.log('\nW state setter', wMatch && wMatch[1]);
const ylMatch = s.match(/\[Yl,(\w+)\]=l\.useState/);
console.log('Yl state setter', ylMatch && ylMatch[1]);

// find list + Add with create
i = 0;
c = 0;
while ((i = s.indexOf('ue("create")', i)) >= 0 && c < 8) {
  console.log('\nue create', c, ':', s.substring(i - 120, i + 80));
  c++;
  i++;
}
