const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const start = s.indexOf('async function xa');
const end = s.indexOf('function Bs', start);
console.log(s.slice(start, end));
