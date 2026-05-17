const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js', 'utf8');

for (const term of ['shippingAddress', 'gstDetails', 'line1', 'pincode', 'pinCode', 'prepareParty', 'toFirestore', 'fromFirestore']) {
  const count = (s.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  console.log(term, count);
}

// Is there code that builds firebase payload separately from local?
const i = s.indexOf('Pt(L(_,T.PARTIES)');
console.log('\naddDoc calls:', (s.match(/Pt\(L\(_,T\.PARTIES\)/g) || []).length);
let idx = 0;
while ((idx = s.indexOf('Pt(L(_,T.PARTIES)', idx)) !== -1) {
  console.log(s.substring(idx - 150, idx + 100));
  idx++;
}
