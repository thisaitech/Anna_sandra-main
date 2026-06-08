/**
 * Mirror dist/ into electron-build/dist/ so desktop UI matches web exactly.
 * Usage: node tools/sync-electron-dist.cjs
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'dist');
const dest = path.join(root, 'electron-build', 'dist');
const skipDirs = new Set(['downloads']);

function copyDir(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    if (skipDirs.has(name)) continue;
    const sf = path.join(from, name);
    const df = path.join(to, name);
    const st = fs.statSync(sf);
    if (st.isDirectory()) copyDir(sf, df);
    else fs.copyFileSync(sf, df);
  }
}

if (!fs.existsSync(src)) {
  console.error('dist/ missing');
  process.exit(1);
}
copyDir(src, dest);
console.log('Synced dist -> electron-build/dist (downloads/ preserved)');
