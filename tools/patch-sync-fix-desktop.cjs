/**
 * Fix sync handler registration + logging for web and Electron (same dist).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'dist/assets/index-jCsVk30s.js');
const htmlPath = path.join(root, 'dist/index.html');
const services = [
  'partyService-Wzcg7Wjf.js',
  'itemService-sgFD7LVj.js',
  'invoiceService-wndk85Fv.js',
  'expenseService-C2uEJ3jV.js',
];

let n = 0;

function rep(file, oldStr, newStr, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  n++;
}

rep(
  indexPath,
  'function Xi(e,t){At.set(e,t)}',
  'function Xi(e,t){At.set(e,t);console.log("[SandraSync] Sync module loaded:",e,"handlers:",At.size)}',
  'Xi: registration logging'
);

rep(
  indexPath,
  'return console.log("[SandraSync] handlers ready:",At.size),At.size}',
  'return console.log("[SandraSync] Sync service started, handlers ready:",At.size),At.size}',
  'Hq: started logging'
);

rep(
  indexPath,
  'else if(window.__SANDRA_HANDLER_MISS__>=8)pe({syncStatus:"error",lastSyncError:"Sync modules failed to load — refresh the page"});return};',
  'else if(window.__SANDRA_HANDLER_MISS__>=20){console.error("[SandraSync] Sync service failed: handlers still 0 after",window.__SANDRA_HANDLER_MISS__,"attempts");pe({syncStatus:"error",lastSyncError:"Sync modules failed to load — refresh the page"})}return};',
  'xa: more handler retries before error'
);

rep(
  indexPath,
  'if(ye&&window.__SANDRA_HANDLER_MISS__<8)setTimeout(()=>xa(),3e3)',
  'if(ye&&window.__SANDRA_HANDLER_MISS__<20)setTimeout(()=>xa(),2e3)',
  'xa: extend retry window'
);

for (const svc of services) {
  const p = path.join(root, 'dist/assets', svc);
  let s = fs.readFileSync(p, 'utf8');
  const re = /\(function _sandReg(\w)\(\)\{try\{if\(typeof (\w+)==="function"\)\{(\w+)\([^}]+\);return\}setTimeout\(_sandReg\1,50\)\}catch\(_e\)\{console\.warn\("\[SandraSync\] register [^"]+",_e\);setTimeout\(_sandReg\1,50\)\}\}\)\(\)/;
  const m = s.match(re);
  if (!m) {
    console.warn('No _sandReg in', svc);
    continue;
  }
  const id = m[1];
  const regFn = m[2];
  const call = m[3];
  const full = m[0];
  const inner = full.match(/\{([^}]+)\}/)[1];
  const callLine = inner.match(/(\w+)\([^)]+\);return/)[0];
  const replacement = `(function _sandReg${id}(n){n=n||0;try{if(typeof ${regFn}==="function"){${callLine}console.log("[SandraSync] Sync module loaded: ${svc.split('-')[0]}");return}if(n<240)setTimeout(()=>_sandReg${id}(n+1),50);else console.error("[SandraSync] Sync service failed: ${svc} register timeout")}catch(_e){console.warn("[SandraSync] register ${svc}",_e);if(n<240)setTimeout(()=>_sandReg${id}(n+1),50)}})(0)`;
  if (s.includes(replacement)) {
    console.log('Already: reg', svc);
    continue;
  }
  s = s.replace(full, replacement);
  fs.writeFileSync(p, s);
  console.log('Patched: reg retry', svc);
  n++;
}

let html = fs.readFileSync(htmlPath, 'utf8');
const cleanPreload = `    <script type="module">
      /* Register offline sync handlers early — same URLs as app imports (no ?v= duplicate modules) */
      (function () {
        var seq = [
          '/assets/partyService-Wzcg7Wjf.js',
          '/assets/itemService-sgFD7LVj.js',
          '/assets/expenseService-C2uEJ3jV.js',
          '/assets/invoiceService-wndk85Fv.js'
        ];
        seq.forEach(function (u) {
          import(u).then(function () {
            console.log('[SandraSync] Preloaded', u);
          }).catch(function (e) {
            console.warn('[SandraSync] Preload failed', u, e);
          });
        });
      })();
    </script>`;

if (html.includes('?v=') && html.includes('Register offline sync handlers early')) {
  html = html.replace(
    /    <script type="module">\s*\/\* Register offline sync handlers early[\s\S]*?    <\/script>/,
    cleanPreload
  );
  fs.writeFileSync(htmlPath, html);
  console.log('Patched: index.html sync preload URLs');
  n++;
}

console.log('\nSync desktop patches:', n);
