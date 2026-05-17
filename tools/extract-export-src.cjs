const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/exportUtils-DcH-82Sc.js.map', 'utf8'));
const src = m.sourcesContent[0];
const i = src.indexOf('export function exportToTallyExcel');
console.log(src.substring(i, i + 5000));
