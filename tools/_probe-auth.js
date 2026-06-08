const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const needle = 'if(!s)return n.jsx(bn,{to:"/login",replace:!0})';
const i = s.indexOf(needle);
console.log('idx', i);
console.log(s.substring(i - 1500, i + 400));
