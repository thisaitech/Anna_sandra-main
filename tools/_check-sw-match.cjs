const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const sw = fs.readFileSync('dist/sw.js', 'utf8');
const scripts = [...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map(m => m[1]);
const imports = [...html.matchAll(/import\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
console.log('HTML script URLs:', scripts);
console.log('HTML dynamic imports:', imports);
const precache = [...sw.matchAll(/url:"([^"]+)"/g)].map(m => m[1]);
const check = (url) => {
  const path = url.split('?')[0].replace(/^\//, '');
  const hit = precache.includes(path);
  console.log(hit ? 'OK' : 'MISSING', url, '->', path);
};
[...scripts, ...imports].forEach(check);
console.log('\nSW has ignoreURL:', sw.includes('ignoreURL'));
console.log('index version in html:', html.match(/index-jCsVk30s\.js\?v=(\d+)/)?.[1]);
