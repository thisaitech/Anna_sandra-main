const fs = require('fs');
const { execSync } = require('child_process');
const quotPath = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let q = fs.readFileSync(quotPath, 'utf8');

const old =
  'k.total.toFixed(2)]})]}),e.jsxs("div",{className:"mb-4 p-4 bg-yellow-50 rounded-lg"';
const neu =
  'k.total.toFixed(2)]})]})}),_e&&e.jsxs("div",{className:"mb-4 p-4 bg-yellow-50 rounded-lg"';

if (!q.includes(old)) {
  console.error('Pattern not found');
  const i = q.indexOf('className:"w-64 space-y-2"');
  const j = q.indexOf('Grand Total:', i);
  console.error('Context:', q.slice(j, j + 200));
  process.exit(1);
}

q = q.replace(old, neu);
fs.writeFileSync(quotPath, q);
console.log('Closed w-64 totals block; restored _e&& before notes');

try {
  execSync(`npx --yes esbuild "${quotPath}" --bundle=false`, { stdio: 'pipe' });
  console.log('esbuild: syntax OK');
} catch (e) {
  console.error('esbuild:', (e.stderr || e.stdout || '').toString().slice(0, 800));
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = Number(m[1]) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache v=' + v);
}
