const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
let i = 0;
let n = 0;
while ((i = s.indexOf('pe==="list"', i)) !== -1 && n < 10) {
  console.log('\n#', n, i);
  console.log(s.slice(i, i + 300));
  i++;
  n++;
}
