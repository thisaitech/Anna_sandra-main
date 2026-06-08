const fs = require('fs');
const idx = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
const i = idx.indexOf('Ws=({children:e})');
console.log(idx.slice(i, i + 4500));
