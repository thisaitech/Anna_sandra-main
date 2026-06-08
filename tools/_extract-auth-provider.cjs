const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const start = s.indexOf('Ua=l.createContext');
const end = start + 8000;
console.log(s.slice(start, end));
