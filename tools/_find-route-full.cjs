const fs = require('fs');
const idx = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
const i = idx.indexOf('to:"/login"');
console.log(idx.slice(i - 600, i + 400));
