/**
 * Make sales/invoices work offline+online like parties:
 * - Same companyId resolver (K) with full fallbacks
 * - No staff-only list filtering (parties show all company records)
 * - IDB-first + localStorage fallback on offline / Firebase-not-ready
 * - Loose companyId on IDB rows (!companyId || match)
 * - Merge all local IDB invoices missing from cloud (not only invoice_* ids)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const invoicePath = path.join(root, 'dist/assets/invoiceService-wndk85Fv.js');
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

// K() — same as partyService
rep(
  invoicePath,
  'J=()=>be(ut,"company"),Fe=8e3',
  'J=()=>be(ut,"company"),K=()=>{try{const _id=_();if(_id)return _id}catch(_e){}try{const _ls=localStorage.getItem("app_offline_company_id");if(_ls)return _ls}catch(_e){}try{const _u=JSON.parse(localStorage.getItem("user")||"null");if(_u&&_u.companyId)return _u.companyId}catch(_e){}return null},Fe=8e3',
  'invoiceService K() companyId like parties'
);

// Fix accidental recursion if a prior run replaced _() inside K()
let inv = fs.readFileSync(invoicePath, 'utf8');
if (inv.includes('K=()=>{try{const _id=K()')) {
  inv = inv.replace('K=()=>{try{const _id=K()', 'K=()=>{try{const _id=_()');
  fs.writeFileSync(invoicePath, inv);
  console.log('Patched: fix K() recursion');
  total++;
}

// List reads: no staff filter (parties do not filter by createdByUserId)
rep(
  invoicePath,
  'T=(e,t)=>!t||t.role==="admin"||t.role==="org_admin"||t.role==="super_admin"||t.role==="manager"?e:t.role==="staff"||t.role==="cashier"||t.role==="sales"?Ge().staffInvoiceVisibility==="company"?e:e.filter(r=>{if(!t?.uid)return!0;if(r.createdByUserId===t.uid)return!0;if(r._pendingSync||j(String(r?.id||"")))return!0;const o=r.createdByUserId;return!o||o==="offline-local"||o==="dev-local-user"}):e',
  'T=(e,t)=>e',
  'invoice list: no staff filter (like parties)'
);

// IDB filter: allow rows without companyId (assigned on read)
rep(
  invoicePath,
  'd=d.filter(l=>{const m=!e||l.type===e,f=l.companyId===n;return m&&f})',
  'd=d.filter(l=>{const m=!e||l.type===e,f=!l.companyId||l.companyId===n;return m&&f})',
  'getInvoices IDB filter like parties'
);

// Firebase-not-ready branch: localStorage fallback like parties
rep(
  invoicePath,
  'if((typeof navigator!=="undefined"&&!navigator.onLine)||!V()||!B()){const l=T(d,r),m=R(l,n),f=o?m.slice(0,o):m;return u("📱 Offline mode: Returning",f.length,"invoices"),f}',
  'if((typeof navigator!=="undefined"&&!navigator.onLine)||!V()||!B()){let _loc=ee(e,t);if(_loc.length)d=_loc;else if(!d.length)d=_loc;let m=R(d,n),f=o?m.slice(0,o):m;return u("📱 Offline mode: Returning",f.length,"invoices"),f}',
  'getInvoices: LS fallback when Firebase not ready'
);

// Merge local IDB rows missing from cloud (any id, not only invoice_*)
rep(
  invoicePath,
  'E=d.filter(I=>{const C=String(I?.id||"");if(!j(C)||b.has(C))return!1;const k=le(I,n);return!g.has(k)});',
  'E=d.filter(I=>{const C=String(I?.id||"");if(b.has(C))return!1;const k=le(I,n);return!g.has(k)});',
  'getInvoices: merge all local IDB not in cloud'
);

// Firebase fetch failed — return local like parties
rep(
  invoicePath,
  'console.warn("[getInvoices] Firebase fetch failed, returning local data:",l);const m=R(T(d,r),n);return o?m.slice(0,o):m}',
  'console.warn("[getInvoices] Firebase fetch failed, returning local data:",l);let _loc=ee(e,t);if(_loc.length)d=_loc;const m=R(d,n);return o?m.slice(0,o):m}',
  'getInvoices catch: local fallback like parties'
);

// Offline block: mirror party (IDB + ee, no staff filter, full K)
const offlineSimplified =
  'if(typeof navigator!=="undefined"&&!navigator.onLine){const n=K();if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];let d=[];try{d=await Ue(p.INVOICES),d=d.filter(l=>{const m=!e||l.type===e,f=!l.companyId||l.companyId===n;return m&&f}),d.sort((l,m)=>new Date(m.invoiceDate||m.createdAt||0).getTime()-new Date(l.invoiceDate||l.createdAt||0).getTime()),d=R(d,n),u("[getInvoices] Offline IDB:",d.length)}catch(_idb){console.warn("[getInvoices] Offline IDB read failed",_idb)}if(!d.length)d=ee(e,t);const f=typeof t=="number"&&t>0?t:void 0;return f?d.slice(0,f):d}';
rep(
  invoicePath,
  offlineSimplified,
  offlineSimplified,
  'getInvoices offline block like parties'
);

rep(
  invoicePath,
  '}const n=K();if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];const r=W();',
  '}const n=K();if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];const r=W();',
  'getInvoices online: K() companyId'
);

// Cache hit / cloud fallbacks without staff filter
rep(
  invoicePath,
  'if(s&&s.length)return u("[getInvoices] Cache hit:",s.length,"invoices"),T(s,r);',
  'if(s&&s.length)return u("[getInvoices] Cache hit:",s.length,"invoices"),s;',
  'getInvoices cache hit without staff filter'
);

rep(
  invoicePath,
  '_ls=R(_ls,n),_ls=T(_ls,r),D=o?_ls.slice(0,o):_ls',
  '_ls=R(_ls,n),D=o?_ls.slice(0,o):_ls',
  'getInvoices cloud-empty fallback without staff filter'
);

rep(
  invoicePath,
  'let _idb=T(R(d,n),r);D=o?_idb.slice(0,o):_idb',
  'let _idb=R(d,n);D=o?_idb.slice(0,o):_idb',
  'getInvoices IDB fallback without staff filter'
);

rep(
  invoicePath,
  'r&&(y=T(y,r)),y=R(y,n);',
  'y=R(y,n);',
  'getInvoices firebase merge without staff filter'
);

// createInvoice: K() for companyId
rep(
  invoicePath,
  'o=String(e?.companyId||"").trim()||_()',
  'o=String(e?.companyId||"").trim()||K()',
  'createInvoice K() companyId'
);

// Bump cache
let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  const invMatch = html.match(/invoiceService-wndk85Fv\.js(\?v=\d+)?/);
  if (invMatch) {
    html = html.replace(/invoiceService-wndk85Fv\.js(\?v=\d+)?/, `invoiceService-wndk85Fv.js?v=${v}`);
  } else {
    html = html.replace(
      'invoiceService-wndk85Fv.js',
      `invoiceService-wndk85Fv.js?v=${v}`
    );
  }
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache to v=' + v);
}

console.log('\nTotal patches:', total);
