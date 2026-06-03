/**
 * Offline data must survive app close/reopen:
 * - Read localStorage first when offline (not empty IndexedDB)
 * - Resolve companyId from app_offline_company_id / storage keys
 * - Force durable localStorage write on every create
 * - Stronger index.html session + company bootstrap
 */
const fs = require('fs');

const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
const partyPath = 'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js';
const itemPath = 'c:/project/Anna_sandra-main/dist/assets/itemService-sgFD7LVj.js';
const invoicePath = 'c:/project/Anna_sandra-main/dist/assets/invoiceService-wndk85Fv.js';

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
  fs.writeFileSync(file, s.replace(oldStr, newStr));
  console.log('Patched:', label);
  total++;
  return true;
}

const cidFallback = `let e=K();if(!e)try{e=localStorage.getItem("app_offline_company_id")}catch(_x){}if(!e)try{for(let _i=0;_i<localStorage.length;_i++){const _k=localStorage.key(_i);if(_k&&_k.indexOf("thisai_crm_parties_")===0){e=_k.slice(18);break}}}catch(_x){}if(!e)return[]`;

rep(
  partyPath,
  'function ct(t){try{const e=K();if(!e)return[];',
  `function ct(t){try{${cidFallback};`,
  'party ct() companyId fallback'
);

const cidItems = cidFallback.replace(/let e=K\(\)/, 'let e=w()').replace(/parties/g, 'items').replace(/18/g, '17');
rep(
  itemPath,
  'function P(){try{const e=w();if(!e)return[];',
  `function P(){try{${cidItems};`,
  'item P() companyId fallback'
);

rep(
  partyPath,
  'async function it(t){const e=K();if(!e)return console.warn("[getParties] Missing companyId - returning empty list"),[];',
  'async function it(t){if(typeof navigator!=="undefined"&&!navigator.onLine){return ct(t)}const e=K();if(!e)return console.warn("[getParties] Missing companyId - returning empty list"),[];',
  'party getParties offline-first'
);

rep(
  itemPath,
  'async function ie(){const e=w();if(!e)return console.warn("[getItems] Missing companyId - returning empty list"),[];',
  'async function ie(){if(typeof navigator!=="undefined"&&!navigator.onLine){return P()}const e=w();if(!e)return console.warn("[getItems] Missing companyId - returning empty list"),[];',
  'item getItems offline-first'
);

rep(
  invoicePath,
  'async function pt(e,t){const n=_(),r=W();if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];',
  'async function pt(e,t){if(typeof navigator!=="undefined"&&!navigator.onLine){let n=_();if(!n)try{n=localStorage.getItem("app_offline_company_id")}catch(_e){}if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];let d=ee(e,t);return d=R(d,n),T(d,W())}const n=_(),r=W();if(!n)return console.warn("[getInvoices] Missing companyId - returning empty list"),[];',
  'invoice getInvoices offline-first'
);

rep(
  partyPath,
  'function z(t){try{const e=Q(),a=ot(e,[]);if(!Array.isArray(a))return;a.push(t),st(e)}catch(e){console.error("Error saving to local storage:",e)}}',
  'function z(t){try{const e=Q(),a=ot(e,[]);if(!Array.isArray(a))return;a.push(t),st(e);try{localStorage.setItem(e,JSON.stringify(a));const cid=t.companyId||K();cid&&localStorage.setItem("app_offline_company_id",cid)}catch(_bk){}}catch(e){console.error("Error saving to local storage:",e)}}',
  'party z() durable localStorage'
);

rep(
  itemPath,
  'function O(e){try{const t=M(),r=J(t,[]);if(!Array.isArray(r))return;r.push(e),U(t)}catch(t){console.error("Error saving item to local storage:",t)}}',
  'function O(e){try{const t=M(),r=J(t,[]);if(!Array.isArray(r))return;r.push(e),U(t);try{localStorage.setItem(t,JSON.stringify(r));const cid=e.companyId||w();cid&&localStorage.setItem("app_offline_company_id",cid)}catch(_bk){}}catch(t){console.error("Error saving items to local storage:",t)}}',
  'item O() durable localStorage'
);

// index.html — single bootstrap block
let html = fs.readFileSync(htmlPath, 'utf8');
const newBootstrap = `    <script>
      /* Offline: keep companyId + user session across app restarts */
      (function () {
        try {
          var PREFIX_PARTIES = 'thisai_crm_parties_';
          var PREFIX_ITEMS = 'thisai_crm_items_';
          var cid = localStorage.getItem('app_offline_company_id');
          var raw = localStorage.getItem('user');
          var u = raw ? JSON.parse(raw) : null;
          if (u && u.companyId) {
            cid = u.companyId;
            localStorage.setItem('app_offline_company_id', cid);
          }
          if (!cid) {
            for (var i = 0; i < localStorage.length; i++) {
              var k = localStorage.key(i);
              if (!k) continue;
              if (k.indexOf(PREFIX_PARTIES) === 0 || k.indexOf(PREFIX_ITEMS) === 0) {
                var p = k.indexOf(PREFIX_PARTIES) === 0 ? PREFIX_PARTIES : PREFIX_ITEMS;
                cid = k.slice(p.length);
                if (cid) break;
              }
            }
            if (cid) localStorage.setItem('app_offline_company_id', cid);
          }
          if (!u && cid) {
            localStorage.setItem('user', JSON.stringify({
              uid: 'offline-local',
              email: '',
              displayName: 'Offline User',
              companyId: cid,
              role: 'super_admin',
              status: 'active'
            }));
          } else if (u && cid && !u.companyId) {
            u.companyId = cid;
            localStorage.setItem('user', JSON.stringify(u));
          }
        } catch (e) {}
      })();
    </script>`;

const bootstrapStart = html.indexOf('/* Ensure user.companyId exists');
const bootstrapEnd = html.indexOf('/* Restore minimal session');
if (bootstrapStart > 0 && bootstrapEnd > bootstrapStart) {
  const endScript = html.indexOf('</script>', bootstrapEnd) + 9;
  const oldBlock = html.slice(bootstrapStart - 20, endScript);
  if (!html.includes('PREFIX_PARTIES')) {
    html = html.replace(oldBlock, newBootstrap + '\n');
    fs.writeFileSync(htmlPath, html);
    console.log('Patched: index.html unified offline bootstrap');
    total++;
  }
} else if (!html.includes('PREFIX_PARTIES')) {
  console.warn('MISSING: index.html bootstrap block');
}

if (total > 0) {
  html = fs.readFileSync(htmlPath, 'utf8');
  const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
  if (verMatch) {
    const next = String(Number(verMatch[1]) + 1);
    html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
    fs.writeFileSync(htmlPath, html);
    console.log('Bumped cache version to', next);
  }
}

require('child_process').execSync(`node --check "${partyPath}"`, { stdio: 'inherit' });
require('child_process').execSync(`node --check "${itemPath}"`, { stdio: 'inherit' });
require('child_process').execSync(`node --check "${invoicePath}"`, { stdio: 'inherit' });

console.log('Done,', total, 'patch(es)');
process.exit(total > 0 ? 0 : 1);
