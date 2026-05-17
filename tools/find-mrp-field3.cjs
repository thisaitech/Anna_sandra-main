const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('MRP</th>'));

const idx = src.indexOf('item.basePrice || item.price).toFixed(2)');
console.log('span at', idx);
console.log(src.substring(idx - 800, idx + 1200));
