/**
 * Fix infinite "[SandraSync] No sync handlers registered yet":
 * - Deferred handler registration (circular import with index bundle)
 * - Eager preload on app boot
 * - Cap handler-missing retries; await preload in xa()
 * - Broader permission-denied => retry (not false)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'dist/assets/index-jCsVk30s.js');
const partyPath = path.join(root, 'dist/assets/partyService-Wzcg7Wjf.js');
const itemPath = path.join(root, 'dist/assets/itemService-sgFD7LVj.js');
const invoicePath = path.join(root, 'dist/assets/invoiceService-wndk85Fv.js');
const expensePath = path.join(root, 'dist/assets/expenseService-C2uEJ3jV.js');
const htmlPath = path.join(root, 'dist/index.html');

let total = 0;

function rep(file, oldStr, newStr, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  total++;
  return true;
}

/** Retry until register fn (Xi) is defined — circular import leaves it undefined at module eval. */
const retryReg = (file, oldDeferred, label, id) => {
  const m = oldDeferred.match(/^typeof (\w+)==="function"&&setTimeout\(\(\)=>\{try\{([^}]+)\}catch\(_e\)\{console\.warn\("\[SandraSync\] register [^"]+",_e\)\}\},0\)$/);
  if (!m) {
    console.warn('MISSING deferred pattern:', label);
    return false;
  }
  const regFn = m[1];
  const innerCall = m[2];
  const call = innerCall.replace(/;\s*$/, "");
  const retry = `(function _sandReg${id}(){try{if(typeof ${regFn}==="function"){${call};return}setTimeout(_sandReg${id},50)}catch(_e){console.warn("[SandraSync] register ${label}",_e);setTimeout(_sandReg${id},50)}})()`;
  return rep(file, oldDeferred, retry, `retry register ${label}`);
};

retryReg(
  partyPath,
  'typeof vt==="function"&&setTimeout(()=>{try{vt(p.PARTIES,$t);}catch(_e){console.warn("[SandraSync] register parties",_e)}},0)',
  'parties',
  'P'
);
retryReg(
  itemPath,
  'typeof ee==="function"&&setTimeout(()=>{try{ee(u.ITEMS,ye);}catch(_e){console.warn("[SandraSync] register items",_e)}},0)',
  'items',
  'I'
);
retryReg(
  invoicePath,
  'typeof He==="function"&&setTimeout(()=>{try{He(p.INVOICES,vt);}catch(_e){console.warn("[SandraSync] register invoices",_e)}},0)',
  'invoices',
  'V'
);
retryReg(
  expensePath,
  'typeof W==="function"&&setTimeout(()=>{try{W(c.EXPENSES,H);}catch(_e){console.warn("[SandraSync] register expenses",_e)}},0)',
  'expenses',
  'E'
);

// Broader permission retry in party sync catch
rep(
  partyPath,
  '(e?.code==="permission-denied"||String(e?.message||"").includes("permission"))?"retry":!1}}',
  '(e?.code==="permission-denied"||String(e?.message||e?.code||"").toLowerCase().includes("permission")||String(e?.message||"").includes("insufficient"))?"retry":!1}}',
  'party permission retry broader'
);

rep(
  invoicePath,
  '(r?.code==="permission-denied"||String(r?.message||"").includes("permission"))?(console.warn("[SandraSync] invoices: permission denied — check Firestore user doc + rules"),"retry"):!1}}He',
  '(r?.code==="permission-denied"||String(r?.message||r?.code||"").toLowerCase().includes("permission")||String(r?.message||"").includes("insufficient"))?(console.warn("[SandraSync] invoices: permission denied — check Firestore user doc + rules"),"retry"):!1}}He',
  'invoice permission retry broader'
);

// Hq preload + xa improvements
const hqFn = `async function Hq(){if(At.size>=4)return At.size;const seq=["./partyService-Wzcg7Wjf.js","./itemService-sgFD7LVj.js","./expenseService-C2uEJ3jV.js","./invoiceService-wndk85Fv.js"];for(const mod of seq){try{await import(mod)}catch(e){console.warn("[SandraSync] preload",mod,e)}}for(let i=0;i<40&&At.size<4;i++){await new Promise(r=>setTimeout(r,100))}return console.log("[SandraSync] handlers ready:",At.size),At.size}`;

if (!fs.readFileSync(indexPath, 'utf8').includes('async function Hq()')) {
  rep(
    indexPath,
    'function Xi(e,t){At.set(e,t)}async function xa()',
    `function Xi(e,t){At.set(e,t)}${hqFn}async function xa()`
  );
} else {
  rep(
    indexPath,
    'for(let i=0;i<10&&At.size<4;i++){await new Promise(r=>setTimeout(r,300))}',
    'for(let i=0;i<40&&At.size<4;i++){await new Promise(r=>setTimeout(r,100))}',
    'Hq: longer handler wait'
  );
}

rep(
  indexPath,
  'if(At.size===0){try{await Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")])}catch(err){console.warn("preload sync modules",err)}}if(At.size===0){console.warn("[SandraSync] No sync handlers registered yet — retry in 3s");ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"));if(ye)setTimeout(()=>xa(),3e3);return};',
  'if(At.size<4){await Hq()}if(At.size===0){window.__SANDRA_HANDLER_MISS__=(window.__SANDRA_HANDLER_MISS__||0)+1;console.warn("[SandraSync] No sync handlers registered yet (attempt",window.__SANDRA_HANDLER_MISS__,")");ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"));if(ye&&window.__SANDRA_HANDLER_MISS__<8)setTimeout(()=>xa(),3e3);else if(window.__SANDRA_HANDLER_MISS__>=8)pe({syncStatus:"error",lastSyncError:"Sync modules failed to load — refresh the page"});return};',
  'xa: await Hq + cap handler retries'
);

rep(
  indexPath,
  'function Bs(){window.addEventListener("online"',
  'function Bs(){Hq().catch(()=>{});window.addEventListener("online"',
  'Bs: preload handlers on boot'
);

// Fix duplicate error prefix in sync loop
rep(
  indexPath,
  'await ha(r.id,(r.store||"?")+": sync returned false")',
  'await ha(r.id,"sync returned false")',
  'xa: fix duplicate sync error prefix'
);

// index.html: eager sync module preload
let html = fs.readFileSync(htmlPath, 'utf8');
const preloadScript = `    <script type="module">
      /* Register offline sync handlers early (party/item/expense/invoice) */
      (function () {
        var seq = [
          '/assets/partyService-Wzcg7Wjf.js',
          '/assets/itemService-sgFD7LVj.js',
          '/assets/expenseService-C2uEJ3jV.js',
          '/assets/invoiceService-wndk85Fv.js'
        ];
        seq.forEach(function (u) { import(u).catch(function () {}); });
      })();
    </script>`;
if (!html.includes('Register offline sync handlers early')) {
  html = html.replace('<div id="root"></div>', preloadScript + '\n    <div id="root"></div>');
  fs.writeFileSync(htmlPath, html);
  console.log('Patched: index.html sync handler preload');
  total++;
}

const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache to v=' + v);
}

console.log('\nTotal patches:', total);
