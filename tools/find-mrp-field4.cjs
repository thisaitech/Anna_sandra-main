const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('MRP</th>'));

const idx = src.indexOf('enteredPrice = parseFloat(e.target.value)');
// find all occurrences
let i = 0;
let n = 0;
while ((i = src.indexOf('enteredPrice = parseFloat', i)) >= 0 && n < 5) {
  console.log('\n=== occurrence', n++, 'at', i, '===');
  console.log(src.substring(i - 600, i + 400));
  i++;
}

// search readOnly on price input
for (const p of ['readOnly', 'readOnly={', 'readOnly:']) {
  i = 0;
  while ((i = src.indexOf(p, i)) >= 0) {
    const ctx = src.substring(i - 150, i + 150);
    if (ctx.includes('price') || ctx.includes('MRP') || ctx.includes('enteredPrice')) {
      console.log('\nreadOnly ctx:', ctx.replace(/\n/g, ' '));
    }
    i++;
  }
}
