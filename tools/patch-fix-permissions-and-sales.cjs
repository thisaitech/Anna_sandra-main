/**
 * Sales disappear when online because:
 * 1) Firestore permission-denied — sync fails (needs users/{uid} doc + matching companyId)
 * 2) getInvoices filters IDB with strict companyId (offline sales use old cid)
 * 3) Cloud partial result cached / merged without all local rows
 *
 * Fixes:
 * - Loose companyId filter on all IDB reads (like parties)
 * - On permission-denied: return full local+IDB merge, never cache empty/partial cloud-only
 * - Always union localStorage into final list before return
 * - Sync handlers: preload + retry; permission-denied => defer retry not hard fail
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const invoicePath = path.join(root, 'dist/assets/invoiceService-wndk85Fv.js');
const partyPath = path.join(root, 'dist/assets/partyService-Wzcg7Wjf.js');
const itemPath = path.join(root, 'dist/assets/itemService-sgFD7LVj.js');
const indexPath = path.join(root, 'dist/assets/index-jCsVk30s.js');
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

// Loose IDB companyId filter (online path was still strict)
rep(
  invoicePath,
  'd=d.filter(l=>{const m=!e||l.type===e,f=l.companyId===n;return m&&f})',
  'd=d.filter(l=>{const m=!e||l.type===e,f=!l.companyId||l.companyId===n;return m&&f})',
  'getInvoices online IDB loose companyId'
);

// After building N from cloud+localOnly, always fold in localStorage (party-style safety net)
rep(
  invoicePath,
  'let N=R([...y,...E],n);N.sort((I,C)=>{',
  'let _locMerge=ee(e,t);let N=R([...y,...E,..._locMerge],n);N.sort((I,C)=>{',
  'getInvoices: always merge localStorage into list'
);

// permission-denied / failed-precondition: return full local, do not cache bad cloud slice
rep(
  invoicePath,
  '}catch(l){if(l?.code==="failed-precondition"||l?.message?.includes("index"))return console.warn("[getInvoices] Index missing, falling back to client-side filtering"),It(e,t);console.warn("[getInvoices] Firebase fetch failed, returning local data:",l);let _loc=ee(e,t);if(_loc.length)d=_loc;const m=R(d,n);return o?m.slice(0,o):m}',
  '}catch(l){if(l?.code==="failed-precondition"||l?.message?.includes("index"))return console.warn("[getInvoices] Index missing, falling back to client-side filtering"),It(e,t);const _perm=l?.code==="permission-denied"||String(l?.message||"").includes("permission");console.warn("[getInvoices] Firebase fetch failed, returning local data:",l);let _loc=ee(e,t);try{const _idb=await Ue(p.INVOICES);_idb.forEach(x=>{if(!e||x.type===e)if(!x.companyId||x.companyId===n)_loc.push(x)})}catch(_e){}_loc=R(_loc,n);if(_perm)u("[getInvoices] permission-denied — showing",_loc.length,"local invoices only");return o?_loc.slice(0,o):_loc}',
  'getInvoices catch: permission-denied full local'
);

// createInvoice: stamp companyId from K() always
rep(
  invoicePath,
  'y={...f,id:n,createdAt:t,updatedAt:t,...o?{companyId:o}:{},',
  'y={...f,id:n,createdAt:t,updatedAt:t,companyId:o,',
  'createInvoice: always set companyId'
);

// Sync: permission-denied => retry later (not false)
const syncFailReturn =
  'return console.error("Failed to sync invoice to server:",r),!1}}He(p.INVOICES,vt)';
const syncFailRetry =
  'return console.error("Failed to sync invoice to server:",r),(r?.code==="permission-denied"||String(r?.message||"").includes("permission"))?(console.warn("[SandraSync] invoices: permission denied — check Firestore user doc + rules"),"retry"):!1}}He(p.INVOICES,vt)';
rep(invoicePath, syncFailReturn, syncFailRetry, 'invoice sync permission-denied retry');

const partySyncFail =
  'return console.error("Failed to sync party to server:",e),!1}}vt(p.PARTIES';
const partySyncRetry =
  'return console.error("Failed to sync party to server:",e),(e?.code==="permission-denied"||String(e?.message||"").includes("permission"))?"retry":!1}}vt(p.PARTIES';
// party may use different ending - grep first
let party = fs.readFileSync(partyPath, 'utf8');
const partyIdx = party.indexOf('Failed to sync party to server');
if (partyIdx >= 0) {
  const snippet = party.slice(partyIdx - 50, partyIdx + 120);
  if (snippet.includes('permission-denied') && snippet.includes('"retry"')) {
    console.log('Already: party sync permission retry');
  } else if (party.includes('return console.error("Failed to sync party to server:",e),!1}')) {
    party = party.replace(
      'return console.error("Failed to sync party to server:",e),!1}',
      'return console.error("Failed to sync party to server:",e),(e?.code==="permission-denied"||String(e?.message||"").includes("permission"))?"retry":!1}'
    );
    fs.writeFileSync(partyPath, party);
    console.log('Patched: party sync permission-denied retry');
    total++;
  } else {
    console.warn('MISSING: party sync fail pattern');
  }
}

let item = fs.readFileSync(itemPath, 'utf8');
if (item.includes('Failed to sync item to server')) {
  if (!item.includes('permission-denied","') || !item.includes('item to server:",e),(e?.code')) {
    if (item.includes('return console.error("Failed to sync item to server:",e),!1}')) {
      item = item.replace(
        'return console.error("Failed to sync item to server:",e),!1}',
        'return console.error("Failed to sync item to server:",e),(e?.code==="permission-denied"||String(e?.message||"").includes("permission"))?"retry":!1}'
      );
      fs.writeFileSync(itemPath, item);
      console.log('Patched: item sync permission-denied retry');
      total++;
    }
  } else {
    console.log('Already: item sync permission retry');
  }
}

// xa: retry when sync handlers not registered yet
rep(
  indexPath,
  'if(At.size===0){console.warn("[SandraSync] No sync handlers registered yet");ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"));return};',
  'if(At.size===0){console.warn("[SandraSync] No sync handlers registered yet — retry in 3s");ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"));if(ye)setTimeout(()=>xa(),3e3);return};',
  'xa: retry when handlers missing'
);

// On login user blob: keep app_offline_company_id in sync (index bootstrap in html already partial)
let html = fs.readFileSync(htmlPath, 'utf8');
const bootSync =
  "if (u && u.companyId) {\n            cid = u.companyId;\n            localStorage.setItem('app_offline_company_id', cid);\n          }";
if (!html.includes('cid = u.companyId')) {
  html = html.replace(
    "if (u && u.companyId) {\n            localStorage.setItem('app_offline_company_id', cid);\n          }",
    bootSync
  );
  fs.writeFileSync(htmlPath, html);
  console.log('Patched: index.html sync companyId from user');
  total++;
}

// Bump cache
html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  html = html.replace(/invoiceService-wndk85Fv\.js(\?v=\d+)?/g, `invoiceService-wndk85Fv.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache to v=' + v);
}

// IDB: include invoices saved under any companyId seen on this device (offline cid drift)
const idbFilterOld =
  'd=d.filter(l=>{const m=!e||l.type===e,f=!l.companyId||l.companyId===n;return m&&f})';
const idbFilterNew =
  'd=d.filter(l=>{const m=!e||l.type===e;if(!m)return!1;if(!l.companyId||l.companyId===n)return!0;try{const _ls=localStorage.getItem("app_offline_company_id");if(_ls&&l.companyId===_ls)return!0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf("thisai_crm_invoices_")===0&&l.companyId===k.slice(22))return!0}}catch(_e){}return!1})';
rep(invoicePath, idbFilterOld, idbFilterNew, 'getInvoices IDB multi-companyId on device');

// Never cache cloud-only slice when local has more rows
rep(
  invoicePath,
  'if(D.length){return Ze(i,D,n),y.forEach(I=>{F(p.INVOICES,I).catch(()=>{})}),u("☁️ Retrieved:",D.length,"invoices (server:",y.length,", local-only:",E.length,")"),D}u("[getInvoices] No invoices (not caching empty)");return[]}',
  'if(D.length){try{const _all=ee(e,t);if(_all.length>D.length){let _m=R([...D,..._all],n);D=o?_m.slice(0,o):_m,u("[getInvoices] Merged",D.length,"invoices (local+cloud)")}}catch(_mE){}return Ze(i,D,n),y.forEach(I=>{F(p.INVOICES,I).catch(()=>{})}),u("☁️ Retrieved:",D.length,"invoices (server:",y.length,", local-only:",E.length,")"),D}u("[getInvoices] No invoices (not caching empty)");return[]}',
  'getInvoices: never return smaller list than localStorage'
);

// xa: surface permission errors in sync banner
rep(
  indexPath,
  'const _msg=_errs.length?_errs.join(" · "):"Sync failed — check internet and sign-in, then wait for auto-retry";pa("error",_msg);',
  'const _perm=_errs.some(x=>String(x).includes("permission"));const _msg=_errs.length?_errs.join(" · "):(_perm?"Cloud permission denied — log in and ensure users/{uid} exists in Firestore with matching companyId":"Sync failed — check internet and sign-in, then wait for auto-retry");pa("error",_msg);pe({pendingSyncCount:s.total,syncStatus:"error",lastSyncError:_msg});',
  'xa: permission-denied error message'
);

// Avoid double pe() if old string had only pa - check current xa end
let index = fs.readFileSync(indexPath, 'utf8');
if (index.includes('pa("error",_msg);if(ye&&s.total>0)') && !index.includes('lastSyncError:_msg});if(ye')) {
  index = index.replace(
    'pa("error",_msg);if(ye&&s.total>0)',
    'pa("error",_msg);pe({pendingSyncCount:s.total,syncStatus:"error",lastSyncError:_msg});if(ye&&s.total>0)'
  );
  fs.writeFileSync(indexPath, index);
  console.log('Patched: xa persist lastSyncError');
  total++;
}

// ee(): load from every thisai_crm_invoices_* key on device
rep(
  invoicePath,
  'if(!o.length){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k==="thisai_crm_invoices_"+n){const raw=localStorage.getItem(k);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))o=parsed.map(a=>P(a))}}}}catch(_sk){}}',
  'if(!o.length){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf("thisai_crm_invoices_")===0){const raw=localStorage.getItem(k);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))o=o.concat(parsed.map(a=>P(a)))}}}}catch(_sk){}}',
  'ee(): scan all invoice localStorage keys'
);

console.log('\nTotal patches:', total);
