const fs = require('fs');
const s = fs.readFileSync('dist/assets/partyService-Wzcg7Wjf.js', 'utf8');
const reg = s.indexOf('_sandRegP');
const chunk = s.slice(0, reg);
const names = [...chunk.matchAll(/async function (\$?\w+)\(/g)].map((m) => m[1]);
console.log('async fns before reg:', names.slice(-8));
const syncFn = chunk.match(/async function (\$\w+)\([^)]*\)\{[^}]{0,80}sync party/);
console.log('sync fn candidate:', syncFn && syncFn[1]);
