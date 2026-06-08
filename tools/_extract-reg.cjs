const fs = require('fs');
const s = fs.readFileSync('dist/assets/partyService-Wzcg7Wjf.js', 'utf8');
const i = s.indexOf('SandraSync] register parties');
console.log(s.slice(i - 200, i + 100));
