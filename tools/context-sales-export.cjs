const s = require('fs').readFileSync('../dist/assets/Sales-DxyuXk9a.js', 'utf8');
const idx = s.indexOf('className:"w-64 space-y-2"');
const j = s.indexOf('Grand Total:', idx);
console.log(s.slice(j, j + 900));
