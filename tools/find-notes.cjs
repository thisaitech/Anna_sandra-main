const q = require('fs').readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const i = q.indexOf('className:"w-64 space-y-2"');
const j = q.indexOf('Grand Total:', i);
const slice = q.slice(j, j + 350);
console.log(JSON.stringify(slice));
