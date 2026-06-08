/**
 * Fix broken sync registration: void(fn();) is invalid JS — broke all 4 service chunks.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const fixes = [
  {
    file: 'dist/assets/partyService-Wzcg7Wjf.js',
    broken: /\(function _sandRegP\(\)\{try\{if\(typeof vt==="function"\)return void\(vt\(p\.PARTIES,\$t\);\);\s*setTimeout\(_sandRegP,50\)\}catch\(_e\)\{console\.warn\("\[SandraSync\] register parties",_e\);setTimeout\(_sandRegP,50\)\}\}\)\(\)/,
    fixed:
      '(function _sandRegP(){try{if(typeof vt==="function"){vt(p.PARTIES,$t);return}setTimeout(_sandRegP,50)}catch(_e){console.warn("[SandraSync] register parties",_e);setTimeout(_sandRegP,50)}})();',
  },
  {
    file: 'dist/assets/itemService-sgFD7LVj.js',
    broken: /\(function _sandRegI\(\)\{try\{if\(typeof ee==="function"\)return void\(ee\(u\.ITEMS,ye\);\);\s*setTimeout\(_sandRegI,50\)\}catch\(_e\)\{console\.warn\("\[SandraSync\] register items",_e\);setTimeout\(_sandRegI,50\)\}\}\)\(\)/,
    fixed:
      '(function _sandRegI(){try{if(typeof ee==="function"){ee(u.ITEMS,ye);return}setTimeout(_sandRegI,50)}catch(_e){console.warn("[SandraSync] register items",_e);setTimeout(_sandRegI,50)}})();',
  },
  {
    file: 'dist/assets/invoiceService-wndk85Fv.js',
    broken: /\(function _sandRegV\(\)\{try\{if\(typeof He==="function"\)return void\(He\(p\.INVOICES,vt\);\);\s*setTimeout\(_sandRegV,50\)\}catch\(_e\)\{console\.warn\("\[SandraSync\] register invoices",_e\);setTimeout\(_sandRegV,50\)\}\}\)\(\)/,
    fixed:
      '(function _sandRegV(){try{if(typeof He==="function"){He(p.INVOICES,vt);return}setTimeout(_sandRegV,50)}catch(_e){console.warn("[SandraSync] register invoices",_e);setTimeout(_sandRegV,50)}})();',
  },
  {
    file: 'dist/assets/expenseService-C2uEJ3jV.js',
    broken: /\(function _sandRegE\(\)\{try\{if\(typeof W==="function"\)return void\(W\(c\.EXPENSES,H\);\);\s*setTimeout\(_sandRegE,50\)\}catch\(_e\)\{console\.warn\("\[SandraSync\] register expenses",_e\);setTimeout\(_sandRegE,50\)\}\}\)\(\)/,
    fixed:
      '(function _sandRegE(){try{if(typeof W==="function"){W(c.EXPENSES,H);return}setTimeout(_sandRegE,50)}catch(_e){console.warn("[SandraSync] register expenses",_e);setTimeout(_sandRegE,50)}})();',
  },
];

let n = 0;
for (const { file, broken, fixed } of fixes) {
  const p = path.join(root, file);
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes(fixed) && !s.includes('})()async')) {
    console.log('Already OK:', file);
    continue;
  }
  if (s.includes('})()async')) {
    s = s.replace(/\}\)\(\)async/g, '})();async');
    fs.writeFileSync(p, s);
    console.log('Semicolon fix:', file);
    n++;
    continue;
  }
  if (!broken.test(s)) {
    // fallback: fix void(x();) pattern anywhere
    const alt = s.replace(
      /return void\((\w+\([^)]+\));\);/g,
      '{$1;return}'
    );
    if (alt !== s) {
      fs.writeFileSync(p, alt);
      console.log('Alt fix:', file);
      n++;
      continue;
    }
    console.warn('PATTERN NOT FOUND:', file);
    const m = s.match(/_sandReg\w+\(\)\{try\{[^}]+\}/);
    if (m) console.warn('  snippet:', m[0]);
    continue;
  }
  s = s.replace(broken, fixed);
  fs.writeFileSync(p, s);
  console.log('Fixed:', file);
  n++;
}

// Fix patch source so re-run does not re-break
const patchPath = path.join(root, 'tools/patch-sync-handlers-bootstrap.cjs');
let patch = fs.readFileSync(patchPath, 'utf8');
const badTpl =
  'const retry = `(function _sandReg${id}(){try{if(typeof ${regFn}==="function")return void(${innerCall});setTimeout(_sandReg${id},50)}catch(_e){console.warn("[SandraSync] register ${label}",_e);setTimeout(_sandReg${id},50)}})()`;';
const goodTpl =
  'const call = innerCall.replace(/;\\s*$/, "");\n  const retry = `(function _sandReg${id}(){try{if(typeof ${regFn}==="function"){${call};return}setTimeout(_sandReg${id},50)}catch(_e){console.warn("[SandraSync] register ${label}",_e);setTimeout(_sandReg${id},50)}})();`;';
if (patch.includes('return void(${innerCall})')) {
  patch = patch.replace(badTpl, goodTpl);
  fs.writeFileSync(patchPath, patch);
  console.log('Fixed patch-sync-handlers-bootstrap.cjs template');
}

// bump cache
const htmlPath = path.join(root, 'dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache to v=' + v);
}

console.log('\nFixed files:', n);
