const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Parties-BmJMIjfc.js', 'utf8');

const i = s.indexOf('billingAddress:{street:Re');
console.log('create payload at', i);
console.log(s.substring(i - 800, i + 600));

const j = s.indexOf('await as(Z,r)');
console.log('\nupdate at', j);
console.log(s.substring(j - 900, j + 400));
