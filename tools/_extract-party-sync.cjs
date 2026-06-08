const fs = require('fs');
const s = fs.readFileSync('dist/assets/partyService-Wzcg7Wjf.js', 'utf8');
const i = s.indexOf('async function $t');
console.log(s.slice(i, i + 1200));
