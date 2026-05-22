/**
 * Remove duplicate _cacheOfflineData definitions left by re-running patch-offline-fix-v2.cjs
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let s = fs.readFileSync(indexPath, 'utf8');

const debounced =
  '_cacheOfflineData=async()=>{if(_cacheOfflineData._p)return _cacheOfflineData._p;_cacheOfflineData._p=(async()=>{try{if(typeof navigator!=="undefined"&&!navigator.onLine)return;if(!qt())return;const[{getItems:_gi},{getParties:_gp},{g:_giv}]=await Promise.all([import("./itemService-sgFD7LVj.js"),import("./partyService-Wzcg7Wjf.js"),import("./invoiceService-wndk85Fv.js")]);const[_it,_pa,_in]=await Promise.all([_gi(),_gp(),_giv()]);await Promise.all([Vi(_it),Qi(_pa),Hi(_in)])}catch(_e){console.warn("[offline-cache] bootstrap failed",_e)}finally{_cacheOfflineData._p=null}})();return _cacheOfflineData._p},';

const simple =
  '_cacheOfflineData=async()=>{try{if(typeof navigator!=="undefined"&&!navigator.onLine)return;const[{getItems:_gi},{getParties:_gp},{g:_giv}]=await Promise.all([import("./itemService-sgFD7LVj.js"),import("./partyService-Wzcg7Wjf.js"),import("./invoiceService-wndk85Fv.js")]);const[_it,_pa,_in]=await Promise.all([_gi(),_gp(),_giv()]);await Promise.all([Vi(_it),Qi(_pa),Hi(_in)])}catch(_e){console.warn("[offline-cache] bootstrap failed",_e)}},';

let removed = 0;
while (s.split(debounced).length > 2) {
  const idx = s.indexOf(debounced);
  const idx2 = s.indexOf(debounced, idx + 1);
  if (idx2 === -1) break;
  s = s.slice(0, idx2) + s.slice(idx2 + debounced.length);
  removed++;
}
while (s.includes(simple)) {
  s = s.replace(simple, '');
  removed++;
}

if (!s.includes(debounced)) {
  console.error('ERROR: debounced _cacheOfflineData missing after dedupe');
  process.exit(1);
}

const count = (s.match(/_cacheOfflineData=async/g) || []).length;
if (count !== 1) {
  console.error('ERROR: expected 1 _cacheOfflineData, found', count);
  process.exit(1);
}

fs.writeFileSync(indexPath, s);

let html = fs.readFileSync(htmlPath, 'utf8');
const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (verMatch) {
  const next = String(Number(verMatch[1]) + 1);
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache version to', next);
}

console.log('Removed', removed, 'duplicate cache definition(s)');
process.exit(0);
