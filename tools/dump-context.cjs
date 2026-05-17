const fs = require('fs');
const q = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const i = q.indexOf('Incl":"Excl');
const chunk = q.substring(i - 500, i + 350);
fs.writeFileSync('c:/project/Anna_sandra-main/tools/ctx-mobile-exact.txt', chunk);
console.log(JSON.stringify(chunk));
