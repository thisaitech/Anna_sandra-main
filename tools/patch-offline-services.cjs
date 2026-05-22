/**
 * Service-layer offline fixes:
 * - Skip Firebase when navigator.onLine is false (even if ye flag is stale)
 * - Auto-cache always writes to IndexedDB (bypass settings gate in Vi/Qi/Hi)
 * - Bootstrap cache enables offline settings before fetch
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
const partyPath = 'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js';
const itemPath = 'c:/project/Anna_sandra-main/dist/assets/itemService-sgFD7LVj.js';
const invoicePath = 'c:/project/Anna_sandra-main/dist/assets/invoiceService-wndk85Fv.js';

let total = 0;

function repIn(path, oldStr, newStr, label) {
  let s = fs.readFileSync(path, 'utf8');
  if (s.includes(oldStr)) {
    s = s.replace(oldStr, newStr);
    fs.writeFileSync(path, s);
    console.log('Patched:', label);
    total++;
    return true;
  }
  if (s.includes(newStr)) {
    console.log('Already patched:', label);
    return true;
  }
  console.warn('MISSING:', label, 'in', path);
  return false;
}

const navOff = '(typeof navigator!=="undefined"&&!navigator.onLine)||';

// Party + item: never hit Firebase when browser is offline
repIn(
  partyPath,
  'if(!b()||!D())return o.length,o',
  `if(${navOff}!b()||!D())return o.length,o`,
  'partyService getParties offline guard'
);
repIn(
  partyPath,
  'if(!b()||!D())return null',
  `if(${navOff}!b()||!D())return null`,
  'partyService getParty offline guard'
);
repIn(
  itemPath,
  'if(!S()||!g())return n.length,n',
  `if(${navOff}!S()||!g())return n.length,n`,
  'itemService getItems offline guard'
);
repIn(
  itemPath,
  'if(!S()||!g())return null',
  `if(${navOff}!S()||!g())return null`,
  'itemService getItem offline guard'
);
repIn(
  invoicePath,
  'if(!V()||!B())return',
  `if(${navOff}!V()||!B())return`,
  'invoiceService offline guard return'
);
repIn(
  invoicePath,
  'if(!V()||!B()){',
  `if(${navOff}!V()||!B()){`,
  'invoiceService offline guard block'
);

// Vi/Qi/Hi: always persist when invoked (auto-cache / manual cache)
repIn(
  indexPath,
  'async function Vi(e){if(me().cacheItems){await re(y.ITEMS)',
  'async function Vi(e){if(!0){await re(y.ITEMS)',
  'Vi always cache items'
);
repIn(
  indexPath,
  'async function Qi(e){if(me().cacheParties){await re(y.PARTIES)',
  'async function Qi(e){if(!0){await re(y.PARTIES)',
  'Qi always cache parties'
);
repIn(
  indexPath,
  'async function Hi(e){if(me().cacheInvoices){await re(y.INVOICES)',
  'async function Hi(e){if(!0){await re(y.INVOICES)',
  'Hi always cache invoices'
);

// _cacheOfflineData: enable settings + resolve companyId before fetch
const cacheStart =
  '_cacheOfflineData._p=(async()=>{try{if(typeof navigator!=="undefined"&&!navigator.onLine)return;if(!qt())return;';
const cacheStartNew =
  '_cacheOfflineData._p=(async()=>{try{if(typeof navigator!=="undefined"&&!navigator.onLine)return;try{pe({cacheItems:!0,cacheParties:!0,cacheInvoices:!0,enableOfflineMode:!0,offlineFirstMode:!0})}catch(_pe){}try{_e()}catch(_cid){}if(!qt())return;';
repIn(indexPath, cacheStart, cacheStartNew, '_cacheOfflineData enables cache settings');

if (total > 0) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
  if (verMatch) {
    const next = String(Number(verMatch[1]) + 1);
    html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
    fs.writeFileSync(htmlPath, html);
    console.log('Bumped cache version to', next);
  }
}

console.log('Done,', total, 'patch(es) applied');
process.exit(total > 0 ? 0 : 1);
