/**
 * Critical offline-first fixes:
 * 1) Offline reads use IndexedDB first (not localStorage-only)
 * 2) Sync: detailed errors, more retries, auto-recover failed queue, no stuck "syncing"
 * 3) Sync callbacks skip when Firebase not ready (retry later, not fail permanently)
 * 4) Migrate localStorage business arrays into IndexedDB on startup
 */
const fs = require('fs');
const path = require('path');

const root = 'c:/project/Anna_sandra-main';
const indexPath = path.join(root, 'dist/assets/index-jCsVk30s.js');
const partyPath = path.join(root, 'dist/assets/partyService-Wzcg7Wjf.js');
const itemPath = path.join(root, 'dist/assets/itemService-sgFD7LVj.js');
const invoicePath = path.join(root, 'dist/assets/invoiceService-wndk85Fv.js');
const expensePath = path.join(root, 'dist/assets/expenseService-C2uEJ3jV.js');
const htmlPath = path.join(root, 'dist/index.html');
const statusBarPath = path.join(root, 'dist/offline-status-bar.js');

let total = 0;

function rep(file, oldStr, newStr, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label, 'in', path.basename(file));
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  total++;
  return true;
}

// --- 1) Offline list reads: IndexedDB first ---
const partyOfflineRead =
  'if(typeof navigator!=="undefined"&&!navigator.onLine){return ct(t)}';
const partyOfflineReadNew =
  'if(typeof navigator!=="undefined"&&!navigator.onLine){let _o=[];try{const _e=K();_o=await Rt(p.PARTIES),_e&&(_o=_o.filter(_x=>!_x.companyId||_x.companyId===_e)),t&&t!=="both"&&(_o=_o.filter(_x=>{const _ty=tt(_x.type);return _ty===t||_ty==="both"})),_o.sort((_a,_b)=>(_a.companyName||"").localeCompare(_b.companyName||""))}catch(_idb){console.warn("[getParties] IDB offline read",_idb)}if(!_o.length)_o=ct(t);return _o}';
rep(partyPath, partyOfflineRead, partyOfflineReadNew, 'partyService offline IDB-first read');

const itemOfflineRead =
  'if(typeof navigator!=="undefined"&&!navigator.onLine){return P()}';
const itemOfflineReadNew =
  'if(typeof navigator!=="undefined"&&!navigator.onLine){let _n=[];try{const _e=w();_n=await Z(u.ITEMS),_e&&(_n=_n.filter(_i=>!_i.companyId||_i.companyId===_e)),_n.sort((_a,_b)=>(_a.name||"").localeCompare(_b.name||""))}catch(_idb){console.warn("[getItems] IDB offline read",_idb)}if(!_n.length)_n=P();return _n}';
rep(itemPath, itemOfflineRead, itemOfflineReadNew, 'itemService offline IDB-first read');

// --- 2) Sync callback: Firebase not ready => defer (do not count as failure) ---
rep(
  partyPath,
  'if(t.store!==p.PARTIES||!D())return!1;',
  'if(t.store!==p.PARTIES)return!1;if(!D()){console.warn("[SandraSync] parties: Firebase not ready — retry later");return"retry"};',
  'partyService sync defer when Firebase not ready'
);

rep(
  invoicePath,
  'if(!n||!B())return!1;',
  'if(!n)return!1;if(!B()){console.warn("[SandraSync] invoices: Firebase not ready — retry later");return"retry"};',
  'invoiceService sync defer when Firebase not ready'
);

rep(
  itemPath,
  'if(e.store!==u.ITEMS||!g())return!1;',
  'if(e.store!==u.ITEMS)return!1;if(!g()){console.warn("[SandraSync] items: Firebase not ready — retry later");return"retry"};',
  'itemService sync defer when Firebase not ready'
);

rep(
  expensePath,
  'if(e.store!==c.EXPENSES||!O())return!1;',
  'if(e.store!==c.EXPENSES)return!1;if(!O()){console.warn("[SandraSync] expenses: Firebase not ready — retry later");return"retry"};',
  'expenseService sync defer when Firebase not ready'
);

// --- 3) ha: more retries + store lastError on queue item ---
rep(
  indexPath,
  'async function ha(e){const t=await Ma(y.SYNC_QUEUE,e);t&&(t.retryCount+=1,t.status=t.retryCount>=3?"failed":"pending",await te(y.SYNC_QUEUE,t));const a=await Wt();pe({pendingSyncCount:a.total})}',
  'async function ha(e,errMsg){const t=await Ma(y.SYNC_QUEUE,e);t&&(t.retryCount=(t.retryCount||0)+1,t.lastError=errMsg||t.lastError||"sync failed",t.status=t.retryCount>=12?"failed":"pending",await te(y.SYNC_QUEUE,t));const a=await Wt();pe({pendingSyncCount:a.total,syncStatus:a.failed>0?"error":"idle",lastSyncError:a.failed>0?(errMsg||"Pending sync failures"):null})}',
  'ha: 12 retries + lastError'
);

// --- 4) xa: auth gate + defer/retry + detailed errors ---
rep(
  indexPath,
  'if(e.length===0)return;if(At.size===0){try{await Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")])}catch(err){console.warn("preload sync modules",err)}}if(At.size===0)return;',
  'if(e.length===0)return;try{const _su=JSON.parse(localStorage.getItem("user")||"null");if(!_su||!_su.uid||_su.uid==="offline-local"){pa("error","Sign in with your real account while online to sync offline data to the cloud");pe({pendingSyncCount:e.length,syncStatus:"error",lastSyncError:"Not signed in to Firebase"});return}}catch(_auth){}if(At.size===0){try{await Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")])}catch(err){console.warn("preload sync modules",err)}}if(At.size===0){console.warn("[SandraSync] No sync handlers registered yet");return};',
  'xa: require real Firebase login'
);

const xaLoop =
  'try{for(const r of e){if(!ye)break;const o=At.get(r.store);if(!o)continue;try{if(await o(r)){if(await Ms(r.id),t+=1,r.data?.id){const c=await Ma(r.store,r.data.id);c&&(c._pendingSync=!1,c._syncedAt=new Date().toISOString(),await te(r.store,c))}window.dispatchEvent(new CustomEvent("offline-sync-completed",{detail:{store:r.store,id:r.data?.id||null}})),r.store===y.INVOICES&&window.dispatchEvent(new CustomEvent("invoice-synced",{detail:{id:r.data?.id}}))}else a+=1,await ha(r.id)}catch{a+=1,await ha(r.id)}}}finally{ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"))}const s=await Wt();if(a>0||s.failed>0){pa("error","Some offline changes could not sync to cloud");return}if(t>0){pa("success"),pe({pendingSyncCount:s.total});return}pe({pendingSyncCount:s.total,syncStatus:s.total>0?"idle":"success"});if(s.total>0&&ye)setTimeout(()=>xa(),2e3)}';
const xaLoopNew =
  'try{for(const r of e){if(!ye)break;const o=At.get(r.store);if(!o)continue;try{const _ok=await o(r);if(_ok==="retry"){console.warn("[SandraSync] deferred",r.store,r.type,r.data?.id);continue}if(_ok===true){if(await Ms(r.id),t+=1,r.data?.id){const c=await Ma(r.store,r.data.id);c&&(c._pendingSync=!1,c._syncedAt=new Date().toISOString(),await te(r.store,c))}window.dispatchEvent(new CustomEvent("offline-sync-completed",{detail:{store:r.store,id:r.data?.id||null}})),r.store===y.INVOICES&&window.dispatchEvent(new CustomEvent("invoice-synced",{detail:{id:r.data?.id}}))}else{a+=1;await ha(r.id,(r.store||"?")+": sync returned false")}}catch(_syncErr){console.error("[SandraSync] failed",r.store,r.type,r.data?.id,_syncErr);a+=1;await ha(r.id,(r.store||"?")+": "+(_syncErr?.message||String(_syncErr)))}}}finally{ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"))}try{const _fail=await xe(y.SYNC_QUEUE);for(const _it of _fail){if(_it.status==="failed"&&(_it.retryCount||0)<12){_it.status="pending";_it.retryCount=Math.min(_it.retryCount||0,11);await te(y.SYNC_QUEUE,_it)}}}catch(_rq){}const s=await Wt();if(a>0||s.failed>0){const _errs=[];try{(await xe(y.SYNC_QUEUE)).filter(x=>x.status==="failed"||x.status==="pending").slice(0,5).forEach(x=>_errs.push((x.store||"?")+": "+(x.lastError||x.type||"pending")))}catch(_e){}const _msg=_errs.length?_errs.join(" · "):"Sync failed — check internet and sign-in, then wait for auto-retry";pa("error",_msg);if(ye&&s.total>0)setTimeout(()=>xa(),8e3);return}if(t>0){pa("success"),pe({pendingSyncCount:s.total,lastSyncError:null});return}pe({pendingSyncCount:s.total,syncStatus:s.total>0?"idle":"success",lastSyncError:null});if(s.total>0&&ye)setTimeout(()=>xa(),2e3)}';
rep(indexPath, xaLoop, xaLoopNew, 'xa: defer/retry + detailed errors');

// --- 5) Migrate localStorage -> IndexedDB on boot ---
const migrateFn = `async function IdbMigrateFromLS(){try{const cid=localStorage.getItem("app_offline_company_id");if(!cid)return;const maps=[["thisai_crm_parties_",y.PARTIES],["thisai_crm_items_",y.ITEMS],["thisai_crm_invoices_",y.INVOICES],["thisai_crm_expenses_",y.EXPENSES]];for(const [pfx,st] of maps){const key=pfx+cid;const raw=localStorage.getItem(key);if(!raw)continue;let arr=[];try{arr=JSON.parse(raw)}catch{continue}if(!Array.isArray(arr)||!arr.length)continue;const existing=await xe(st);const ids=new Set(existing.map(r=>r.id));let n=0;for(const row of arr){if(!row||!row.id||ids.has(row.id))continue;await te(st,row);ids.add(row.id);n++}if(n)console.log("[SandraIDB] migrated",n,"rows from",key,"to",st)}}catch(e){console.warn("[SandraIDB] migrate",e)}}`;
if (!fs.readFileSync(indexPath, 'utf8').includes('async function IdbMigrateFromLS')) {
  rep(
    indexPath,
    'window.__SANDRA_OFFLINE__={getSettings:typeof me==="function"?me:null,isOnline:()=>typeof ye!=="undefined"?ye:navigator.onLine,syncing:false,triggerSync:typeof xa==="function"?xa:null};',
    migrateFn +
      'window.__SANDRA_OFFLINE__={getSettings:typeof me==="function"?me:null,isOnline:()=>typeof ye!=="undefined"?ye:navigator.onLine,syncing:false,triggerSync:typeof xa==="function"?xa:null,migrate:IdbMigrateFromLS};IdbMigrateFromLS().catch(()=>{});',
    'IDB migrate from localStorage on boot'
  );
}

// --- 6) Status bar: show exact error + pending count while syncing ---
let bar = fs.readFileSync(statusBarPath, 'utf8');
if (!bar.includes('Uploading')) {
  bar = bar.replace(
    "el.innerHTML = '<span>🔄 Synchronizing…</span><span>Uploading offline changes to server</span>';",
    "var pend = cfg.pendingSyncCount || 0; el.innerHTML = '<span>🔄 Synchronizing…</span><span>Uploading ' + (pend > 0 ? pend + ' pending record' + (pend === 1 ? '' : 's') : 'offline changes') + ' to server</span>';"
  );
  bar = bar.replace(
    '(cfg.lastSyncError || \'Some records need retry\')',
    "(cfg.lastSyncError || 'Some records need retry — open Console and filter SandraSync')"
  );
  bar = bar.replace(
    "else msg += '<span>· All changes synced</span>';",
    "else msg += '<span>✅ All data synced</span>';"
  );
  bar = bar.replace(
    "'<span>· Will sync automatically</span>';",
    "'<span>· Working offline — data saved on this device (IndexedDB)</span>';"
  );
  fs.writeFileSync(statusBarPath, bar);
  console.log('Patched: offline-status-bar.js');
  total++;
}

// --- 7) SW background sync registration stub in dist ---
const swEnhance = path.join(root, 'dist/offline-sync-bridge.js');
if (!fs.existsSync(swEnhance)) {
  fs.writeFileSync(
    swEnhance,
    `/* Notifies app to run sync when connectivity returns (SW postMessage). */
(function () {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.addEventListener('message', function (ev) {
    if (ev.data && ev.data.type === 'RUN_OFFLINE_SYNC') {
      window.dispatchEvent(new CustomEvent('offline-sync-requested'));
      if (window.__SANDRA_OFFLINE__ && window.__SANDRA_OFFLINE__.triggerSync) {
        window.__SANDRA_OFFLINE__.triggerSync();
      }
    }
  });
  window.addEventListener('online', function () {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLIENT_ONLINE' });
    }
  });
})();
`
  );
  total++;
  console.log('Wrote offline-sync-bridge.js');
}

let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('offline-sync-bridge.js')) {
  html = html.replace(
    '<script src="/offline-status-bar.js',
    '<script src="/offline-sync-bridge.js?v=1"></script>\n    <script src="/offline-status-bar.js'
  );
  fs.writeFileSync(htmlPath, html);
  console.log('Patched: index.html sync bridge');
  total++;
}

if (total > 0) {
  html = fs.readFileSync(htmlPath, 'utf8');
  const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
  if (verMatch) {
    const next = String(Number(verMatch[1]) + 1);
    html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
    html = html.replace(/offline-status-bar\.js\?v=\d+/, 'offline-status-bar.js?v=2');
    fs.writeFileSync(htmlPath, html);
    console.log('Bumped index v to', next);
  }
}

require('child_process').execSync(`node --check "${indexPath}"`, { stdio: 'inherit' });
require('child_process').execSync(`node --check "${partyPath}"`, { stdio: 'inherit' });
console.log('Done', total, 'critical patch(es)');
