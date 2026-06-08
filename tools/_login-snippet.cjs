const fs = require('fs');
const s = fs.readFileSync('dist/assets/Login-CPnslZnX.js', 'utf8');
console.log('len', s.length);
console.log('PWA', s.includes('__PWA__'));
console.log('start', s.slice(0, 800));
