/**
 * Fix sales disappearing after offline → close → reopen → online:
 * - Offline getInvoices: IndexedDB first, then localStorage + key scan
 * - Staff filter: keep pending/offline-local device invoices for same company
 * - Never write empty memory cache over non-empty local/IDB data
 * - Bootstrap: recover companyId from invoice localStorage keys
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
    console.warn('MISSING:', label, 'in', path.basename(file));
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  total++;
  return true;
}

const offlineBlockOld =
  'if(typeof navigator!=="undefined"&&!navigator.onLine){let n=_();if(!n)try{n=localStorage.getItem("app_offline_company_id")}catch(_e){}if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];let d=ee(e,t);return d=R(d,n),T(d,W())}';
const offlineBlockNew =
  'if(typeof navigator!=="undefined"&&!navigator.onLine){let n=_();if(!n)try{n=localStorage.getItem("app_offline_company_id")}catch(_e){}if(!n)try{const _u=JSON.parse(localStorage.getItem("user")||"null");if(_u&&_u.companyId)n=_u.companyId}catch(_e){}if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];let d=[];try{d=await Ue(p.INVOICES),d=d.filter(l=>{const m=!e||l.type===e,f=!l.companyId||l.companyId===n;return m&&f}),d.sort((l,m)=>new Date(m.invoiceDate||m.createdAt||0).getTime()-new Date(l.invoiceDate||l.createdAt||0).getTime()),d=R(d,n),u("[getInvoices] Offline IDB:",d.length)}catch(_idb){console.warn("[getInvoices] Offline IDB read failed",_idb)}if(!d.length)d=ee(e,t);const r=W(),l=T(d,r),m=R(l,n),f=typeof t=="number"&&t>0?t:void 0;return f?m.slice(0,f):m}';

rep(invoicePath, offlineBlockOld, offlineBlockNew, 'getInvoices offline IDB-first');

const staffOld =
  'T=(e,t)=>!t||t.role==="admin"||t.role==="org_admin"||t.role==="super_admin"||t.role==="manager"?e:t.role==="staff"||t.role==="cashier"||t.role==="sales"?Ge().staffInvoiceVisibility==="company"?e:e.filter(r=>r.createdByUserId===t.uid):e';
const staffNew =
  'T=(e,t)=>!t||t.role==="admin"||t.role==="org_admin"||t.role==="super_admin"||t.role==="manager"?e:t.role==="staff"||t.role==="cashier"||t.role==="sales"?Ge().staffInvoiceVisibility==="company"?e:e.filter(r=>{if(!t?.uid)return!0;if(r.createdByUserId===t.uid)return!0;if(r._pendingSync||j(String(r?.id||"")))return!0;const o=r.createdByUserId;return!o||o==="offline-local"||o==="dev-local-user"}):e';

rep(invoicePath, staffOld, staffNew, 'staff filter keep offline/pending invoices');

const eeOld =
  'function ee(e,t){try{const n=_();if(!n)return[];const r=et(J(),[]);let o=Array.isArray(r)?r.map(a=>P(a)):[];return o=o.filter(a=>a.companyId===n),';
const eeNew =
  'function ee(e,t){try{let n=_();if(!n)try{n=localStorage.getItem("app_offline_company_id")}catch(_e){}if(!n)return[];let r=et(J(),[]);let o=Array.isArray(r)?r.map(a=>P(a)):[];if(!o.length){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k==="thisai_crm_invoices_"+n){const raw=localStorage.getItem(k);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))o=parsed.map(a=>P(a))}}}}catch(_sk){}}return o=o.filter(a=>!a.companyId||a.companyId===n),';

rep(invoicePath, eeOld, eeNew, 'ee() companyId fallback + LS key scan');

const cacheReturnOld =
  'if(!D.length){let _ls=ee(e,t);_ls=R(_ls,n),_ls=T(_ls,r),D=o?_ls.slice(0,o):_ls,u("[getInvoices] Cloud empty — using",D.length,"local invoices")}return Ze(i,D,n),y.forEach(I=>{F(p.INVOICES,I).catch(()=>{})}),u("☁️ Retrieved:",D.length,"invoices (server:",y.length,", local-only:",E.length,")"),D}catch(l){';
const cacheReturnNew =
  'if(!D.length){let _ls=ee(e,t);_ls=R(_ls,n),_ls=T(_ls,r),D=o?_ls.slice(0,o):_ls,u("[getInvoices] Cloud empty — using",D.length,"local invoices")}if(!D.length&&d.length){let _idb=T(R(d,n),r);D=o?_idb.slice(0,o):_idb,u("[getInvoices] Cloud empty — using",D.length,"IDB/local invoices")}if(D.length){return Ze(i,D,n),y.forEach(I=>{F(p.INVOICES,I).catch(()=>{})}),u("☁️ Retrieved:",D.length,"invoices (server:",y.length,", local-only:",E.length,")"),D}u("[getInvoices] No invoices (not caching empty)");return[]}catch(l){';

rep(invoicePath, cacheReturnOld, cacheReturnNew, 'getInvoices: no empty cache, IDB fallback');

// index.html: recover companyId from invoice keys too
let html = fs.readFileSync(htmlPath, 'utf8');
const scanOld =
  "var PREFIX_PARTIES = 'thisai_crm_parties_';\n          var PREFIX_ITEMS = 'thisai_crm_items_';";
const scanNew =
  "var PREFIX_PARTIES = 'thisai_crm_parties_';\n          var PREFIX_ITEMS = 'thisai_crm_items_';\n          var PREFIX_INVOICES = 'thisai_crm_invoices_';";
if (!html.includes('PREFIX_INVOICES')) {
  if (html.includes(scanOld)) {
    html = html.replace(scanOld, scanNew);
    html = html.replace(
      'if (k.indexOf(PREFIX_PARTIES) === 0 || k.indexOf(PREFIX_ITEMS) === 0) {\n                var p = k.indexOf(PREFIX_PARTIES) === 0 ? PREFIX_PARTIES : PREFIX_ITEMS;',
      'if (k.indexOf(PREFIX_PARTIES) === 0 || k.indexOf(PREFIX_ITEMS) === 0 || k.indexOf(PREFIX_INVOICES) === 0) {\n                var p = k.indexOf(PREFIX_PARTIES) === 0 ? PREFIX_PARTIES : (k.indexOf(PREFIX_ITEMS) === 0 ? PREFIX_ITEMS : PREFIX_INVOICES);'
    );
    fs.writeFileSync(htmlPath, html);
    console.log('Patched: index.html invoice prefix for companyId recovery');
    total++;
  } else {
    console.warn('MISSING: index.html bootstrap scan');
  }
} else {
  console.log('Already: index.html invoice prefix');
}

const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped index bundle cache to v=' + v);
}

console.log('\nTotal patches:', total);
