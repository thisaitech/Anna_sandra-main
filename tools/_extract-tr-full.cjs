const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const start = s.indexOf(',Tr=async');
const end = s.indexOf(',Dr=', start);
console.log(s.slice(start, end + 200));
