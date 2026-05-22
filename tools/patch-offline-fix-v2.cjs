/**
 * Offline reliability fixes:
 * - Ji() must reflect navigator.onLine (not only ye flag)
 * - Dr() must clear ye on offline
 * - Protected route: allow cached localStorage user when offline
 * - Auto-cache items/parties/invoices after login when online
 * - Service reads: prefer local when offline (replace !b()||!D with !wl()||!D)
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
const servicePaths = [
  'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js',
  'c:/project/Anna_sandra-main/dist/assets/itemService-sgFD7LVj.js',
  'c:/project/Anna_sandra-main/dist/assets/expenseService-C2uEJ3jV.js',
];

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

// 1) Online detector used by services (Ji)
repIn(
  indexPath,
  'function Ji(){return ye}',
  'function Ji(){return(typeof navigator!=="undefined"?navigator.onLine:!0)&&ye}',
  'Ji() uses navigator.onLine'
);

// 2) Sync offline handler must clear ye
repIn(
  indexPath,
  'Dr=()=>{ce=!1,W({isOnline:!1}),O.info("You are offline. Changes will sync when connected.",{duration:5e3})}',
  'Dr=()=>{ce=!1,ye=!1,ke=!1,W({isOnline:!1}),O.info("You are offline. Changes will sync when connected.",{duration:5e3})}',
  'Dr() clears ye on offline'
);

// 3) Protected route: use cached user when offline instead of redirecting to login
const loginGuardOld = 'if(!s)return n.jsx(bn,{to:"/login",replace:!0});';
const loginGuardNew =
  'if(!s){try{const _or=typeof navigator!=="undefined"&&!navigator.onLine;const _ur=localStorage.getItem("user");if(_or&&_ur){const _pu=JSON.parse(_ur);_pu&&(_pu.uid||_pu.email)&&(s=_pu)}}catch(_e){}if(!s)return n.jsx(bn,{to:"/login",replace:!0});}';
if (!fs.readFileSync(indexPath, 'utf8').includes('const _or=typeof navigator')) {
  repIn(indexPath, loginGuardOld, loginGuardNew, 'offline auth uses cached user');
} else {
  console.log('Already patched: offline auth uses cached user');
}

// 4) Auto-cache helper + trigger after user companyId is persisted
const cacheHelperOld = '},_e=()=>{const e=qt(),t=Ps(e);return Cs(e,t),t}';
const cacheHelperNew =
  '},_cacheOfflineData=async()=>{try{if(typeof navigator!=="undefined"&&!navigator.onLine)return;const[{getItems:_gi},{getParties:_gp},{g:_giv}]=await Promise.all([import("./itemService-sgFD7LVj.js"),import("./partyService-Wzcg7Wjf.js"),import("./invoiceService-wndk85Fv.js")]);const[_it,_pa,_in]=await Promise.all([_gi(),_gp(),_giv()]);await Promise.all([Vi(_it),Qi(_pa),Hi(_in)])}catch(_e){console.warn("[offline-cache] bootstrap failed",_e)}},_e=()=>{const e=qt(),t=Ps(e);return Cs(e,t),t}';
if (!fs.readFileSync(indexPath, 'utf8').includes('_cacheOfflineData=async')) {
  repIn(indexPath, cacheHelperOld, cacheHelperNew, '_cacheOfflineData helper');
} else {
  console.log('Already patched: _cacheOfflineData helper');
}

const csHookOld =
  'Cs=(e,t)=>{if(!(!e||!t||e.companyId===t))try{localStorage.setItem("user",JSON.stringify({...e,companyId:t}))}catch{}}';
const csHookNew =
  'Cs=(e,t)=>{if(!(!e||!t||e.companyId===t))try{localStorage.setItem("user",JSON.stringify({...e,companyId:t})),_cacheOfflineData()}catch{}}';
repIn(indexPath, csHookOld, csHookNew, 'Cs triggers offline cache');

// 5) Debounce cache + run once on app startup when online
const cacheFnOld =
  '_cacheOfflineData=async()=>{try{if(typeof navigator!=="undefined"&&!navigator.onLine)return;const[{getItems:_gi},{getParties:_gp},{g:_giv}]=await Promise.all([import("./itemService-sgFD7LVj.js"),import("./partyService-Wzcg7Wjf.js"),import("./invoiceService-wndk85Fv.js")]);const[_it,_pa,_in]=await Promise.all([_gi(),_gp(),_giv()]);await Promise.all([Vi(_it),Qi(_pa),Hi(_in)])}catch(_e){console.warn("[offline-cache] bootstrap failed",_e)}}';
const cacheFnNew =
  '_cacheOfflineData=async()=>{if(_cacheOfflineData._p)return _cacheOfflineData._p;_cacheOfflineData._p=(async()=>{try{if(typeof navigator!=="undefined"&&!navigator.onLine)return;if(!qt())return;const[{getItems:_gi},{getParties:_gp},{g:_giv}]=await Promise.all([import("./itemService-sgFD7LVj.js"),import("./partyService-Wzcg7Wjf.js"),import("./invoiceService-wndk85Fv.js")]);const[_it,_pa,_in]=await Promise.all([_gi(),_gp(),_giv()]);await Promise.all([Vi(_it),Qi(_pa),Hi(_in)])}catch(_e){console.warn("[offline-cache] bootstrap failed",_e)}finally{_cacheOfflineData._p=null}})();return _cacheOfflineData._p}';
repIn(indexPath, cacheFnOld, cacheFnNew, '_cacheOfflineData debounce');

const arOld =
  '.finally(()=>{Rq().finally(()=>{Ze(!1),xa()})}),ce&&setTimeout(()=>Ze(!1),3e3)}';
const arNew =
  '.finally(()=>{Rq().finally(()=>{Ze(!1),xa(),_cacheOfflineData()})}),ce&&setTimeout(()=>Ze(!1),3e3)}';
repIn(indexPath, arOld, arNew, 'Ar startup offline cache');

// 6) Remove duplicate nested offline auth guard (re-patch safety)
const authDup =
  'if(!s){try{const _or=typeof navigator!=="undefined"&&!navigator.onLine;const _ur=localStorage.getItem("user");if(_or&&_ur){const _pu=JSON.parse(_ur);_pu&&(_pu.uid||_pu.email)&&(s=_pu)}}catch(_e){}if(!s){try{const _or=typeof navigator!=="undefined"&&!navigator.onLine;const _ur=localStorage.getItem("user");if(_or&&_ur){const _pu=JSON.parse(_ur);_pu&&(_pu.uid||_pu.email)&&(s=_pu)}}catch(_e){}if(!s)return n.jsx(bn,{to:"/login",replace:!0});}}';
const authSingle =
  'if(!s){try{const _or=typeof navigator!=="undefined"&&!navigator.onLine;const _ur=localStorage.getItem("user");if(_or&&_ur){const _pu=JSON.parse(_ur);_pu&&(_pu.uid||_pu.email)&&(s=_pu)}}catch(_e){}if(!s)return n.jsx(bn,{to:"/login",replace:!0});}';
repIn(indexPath, authDup, authSingle, 'dedupe offline auth guard');

// Bump cache buster
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
