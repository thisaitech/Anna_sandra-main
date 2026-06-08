const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const start = s.indexOf(',vr=()=>');
const chunk = s.slice(start, start + 20000);
const idx = chunk.indexOf('window.location.href=g');
console.log(chunk.slice(Math.max(0, idx - 800), idx + 600));
