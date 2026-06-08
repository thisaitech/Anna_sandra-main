/**
 * Fix parties/sales/items lists always empty when Firebase is connected:
 * - Do not treat empty memory cache as a hit (stale [] blocked IDB/local reads)
 * - Fall back to localStorage/IDB when merged cloud result is empty
 * - Stronger companyId resolution from user + app_offline_company_id
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const partyPath = path.join(root, 'dist/assets/partyService-Wzcg7Wjf.js');
const itemPath = path.join(root, 'dist/assets/itemService-sgFD7LVj.js');
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

const companyK =
  'K=()=>{try{const _id=Ci();if(_id)return _id}catch(_e){}try{return localStorage.getItem("app_offline_company_id")}catch(_e){return null}}';
const companyKNew =
  'K=()=>{try{const _id=Ci();if(_id)return _id}catch(_e){}try{const _ls=localStorage.getItem("app_offline_company_id");if(_ls)return _ls}catch(_e){}try{const _u=JSON.parse(localStorage.getItem("user")||"null");if(_u&&_u.companyId)return _u.companyId}catch(_e){}return null}';

const companyW =
  'w=()=>{try{const _id=Ci();if(_id)return _id}catch(_e){}try{return localStorage.getItem("app_offline_company_id")}catch(_e){return null}}';
const companyWNew =
  'w=()=>{try{const _id=Ci();if(_id)return _id}catch(_e){}try{const _ls=localStorage.getItem("app_offline_company_id");if(_ls)return _ls}catch(_e){}try{const _u=JSON.parse(localStorage.getItem("user")||"null");if(_u&&_u.companyId)return _u.companyId}catch(_e){}return null}';

rep(partyPath, companyK, companyKNew, 'partyService K() full companyId fallback');
rep(itemPath, companyW, companyWNew, 'itemService w() full companyId fallback');

rep(
  partyPath,
  'const a=t?`parties_${t}_${e}`:`parties_all_${e}`,r=St(a,e);if(r)return r;',
  'const a=t?`parties_${t}_${e}`:`parties_all_${e}`,r=St(a,e);if(r&&r.length)return r;',
  'partyService: skip empty cache hit'
);

rep(
  partyPath,
  'const y=w.sort((m,C)=>(m.companyName||"").localeCompare(C.companyName||""));return wt(a,y,c),y}catch(s){return console.warn("Firebase fetch failed, returning local data:",s),o}',
  'let y=w.sort((m,C)=>(m.companyName||"").localeCompare(C.companyName||""));if(!y.length){const _loc=ct(t);if(_loc.length)y=_loc.sort((m,C)=>(m.companyName||"").localeCompare(C.companyName||""))}return wt(a,y,c),y}catch(s){const _loc=ct(t);if(_loc.length)return _loc;return console.warn("Firebase fetch failed, returning local data:",s),o.length?o:_loc}',
  'partyService: local fallback when cloud empty'
);

rep(
  itemPath,
  'const t=`items_all_${e}`,r=te(t,e);if(r)return r;',
  'const t=`items_all_${e}`,r=te(t,e);if(r&&r.length)return r;',
  'itemService: skip empty cache hit'
);

rep(
  itemPath,
  'const s=h.sort((l,L)=>new Date(L.createdAt).getTime()-new Date(l.createdAt).getTime());return re(t,s,c),s}catch(o){return console.warn("Firebase fetch failed, returning local data:",o),n}',
  'let s=h.sort((l,L)=>new Date(L.createdAt).getTime()-new Date(l.createdAt).getTime());if(!s.length){const _loc=P();if(_loc.length)s=_loc.sort((l,L)=>new Date(L.createdAt).getTime()-new Date(l.createdAt).getTime())}return re(t,s,c),s}catch(o){const _loc=P();return _loc.length?_loc:(console.warn("Firebase fetch failed, returning local data:",o),n)}',
  'itemService: local fallback when cloud empty'
);

rep(
  invoicePath,
  'const n=_(),r=W();if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];',
  'let n=_();if(!n)try{n=localStorage.getItem("app_offline_company_id")}catch(_e){}if(!n)try{const _u=JSON.parse(localStorage.getItem("user")||"null");if(_u&&_u.companyId)n=_u.companyId}catch(_e){}const r=W();if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];',
  'getInvoices: companyId fallback when online'
);

rep(
  invoicePath,
  'i=e?`invoices_${e}_${n}_${c}`:`invoices_all_${n}_${c}`,s=Xe(i,n);if(s)return u("[getInvoices] Cache hit:",s.length,"invoices"),T(s,r);',
  'i=e?`invoices_${e}_${n}_${c}`:`invoices_all_${n}_${c}`,s=Xe(i,n);if(s&&s.length)return u("[getInvoices] Cache hit:",s.length,"invoices"),T(s,r);',
  'getInvoices: skip empty cache hit'
);

rep(
  invoicePath,
  'const D=o?N.slice(0,o):N;return Ze(i,D,n),y.forEach(I=>{F(p.INVOICES,I).catch(()=>{})}),u("☁️ Retrieved:",D.length,"invoices (server:",y.length,", local-only:",E.length,")"),D}catch(l){',
  'let D=o?N.slice(0,o):N;if(!D.length){let _ls=ee(e,t);_ls=R(_ls,n),_ls=T(_ls,r),D=o?_ls.slice(0,o):_ls,u("[getInvoices] Cloud empty — using",D.length,"local invoices")}return Ze(i,D,n),y.forEach(I=>{F(p.INVOICES,I).catch(()=>{})}),u("☁️ Retrieved:",D.length,"invoices (server:",y.length,", local-only:",E.length,")"),D}catch(l){',
  'getInvoices: local fallback when cloud empty'
);

let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped index bundle cache to v=' + v);
}

console.log('\nTotal patches:', total);
