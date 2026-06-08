const fs = require('fs');
const files = {
  party: 'dist/assets/partyService-Wzcg7Wjf.js',
  item: 'dist/assets/itemService-sgFD7LVj.js',
  invoice: 'dist/assets/invoiceService-wndk85Fv.js',
  expense: 'dist/assets/expenseService-C2uEJ3jV.js',
  index: 'dist/assets/index-jCsVk30s.js',
};
for (const [name, rel] of Object.entries(files)) {
  const s = fs.readFileSync(rel, 'utf8');
  const imp = s.match(/from"\.\/index[^"]*"/);
  console.log('\n===', name, '===');
  if (imp) console.log('index import:', imp[0]);
  const reg = s.match(/typeof \w+==="function"&&setTimeout[^)]+\),0\)/);
  if (reg) console.log('reg:', reg[0].slice(0, 200));
  else {
    const alt = s.match(/SandraSync\] register \w+/g);
    console.log('register mentions:', alt);
  }
}
const idx = fs.readFileSync(files.index, 'utf8');
console.log('\nhas retry in 3s (old):', idx.includes('retry in 3s'));
console.log('has attempt counter:', idx.includes('__SANDRA_HANDLER_MISS__'));
