const s = require('fs').readFileSync('../dist/assets/index-jCsVk30s.js', 'utf8');
const idx = s.indexOf('AIAssistantProvider');
console.log('provider def context:', s.slice(idx - 200, idx + 800));

// find JSX usage of AIAssistantProvider
let i = 0;
let n = 0;
while ((i = s.indexOf('AIAssistantProvider', i)) !== -1 && n < 8) {
  if (i !== idx) console.log('\nuse @', i, ':', s.slice(i - 30, i + 80).replace(/\s+/g, ' '));
  i++;
  n++;
}
