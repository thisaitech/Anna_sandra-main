const s = require('fs').readFileSync('../dist/assets/index-jCsVk30s.js', 'utf8');
for (const p of ['AIAssistantProvider', '/quotations', '/sales', 'useAIAssistant as', 'g as Fl']) {
  let i = 0;
  let n = 0;
  while ((i = s.indexOf(p, i)) !== -1 && n < 4) {
    console.log('\n' + p + ':', s.slice(i - 50, i + 150).replace(/\s+/g, ' '));
    i++;
    n++;
  }
}
