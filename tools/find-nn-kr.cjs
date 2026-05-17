const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');

function count(sub) {
  let n = 0;
  let i = 0;
  while ((i = s.indexOf(sub, i)) >= 0) {
    n++;
    i++;
  }
  return n;
}

for (const p of ['nn(', 'kr(', 'Ll(', 'oa(', 'on(']) {
  console.log(p, count(p));
}

// find resolveInvoiceNumber - search for kr() after await
let i = 0;
let c = 0;
while ((i = s.indexOf('await kr(', i)) >= 0 && c < 3) {
  console.log('\nawait kr:', s.substring(i - 150, i + 200));
  c++;
  i++;
}

// find oa( manual
i = s.indexOf('oa(s.invoiceNumber)');
console.log('\noa manual context:', s.substring(i - 50, i + 300));

// find closeCurrentTab It
i = s.indexOf('f?.editingInvoiceId&&It()');
console.log('\nclose tab:', s.substring(i - 50, i + 200));

// find + Add button - search "Add" with ue create nearby
i = 0;
c = 0;
while ((i = s.indexOf('children:"Add"', i)) >= 0 && c < 3) {
  console.log('\nAdd btn:', s.substring(i - 200, i + 250));
  c++;
  i++;
}
