/**
 * Fix blank pages after offline -> online:
 * - Keep local/offline user session when Firebase auth is null (don't wipe localStorage)
 * - Treat companyId / offline-local user as authenticated for routing
 * - Clear stuck sync lock (ke) on reconnect
 * - xa: don't leave syncing/error state when sync skipped (offline-local user)
 * - Sales: re-open POS create mode on /pos?action=new when browser goes online
 */
const fs = require('fs');
const path = require('path');

const root = 'c:/project/Anna_sandra-main';
const indexPath = path.join(root, 'dist/assets/index-jCsVk30s.js');
const salesPath = path.join(root, 'dist/assets/Sales-DxyuXk9a.js');
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

// --- Auth: keep offline-first local user when Firebase session is null ---
rep(
  indexPath,
  '}else{if(localStorage.getItem("devAuth")==="1"){const _devU=localStorage.getItem("user");if(_devU)try{r(JSON.parse(_devU))}catch{r(null)}else r(null)}else r(null);d(null),u(Pe),localStorage.getItem("devAuth")!=="1"&&localStorage.removeItem("user"),await ya()}',
  '}else{const _lsU=localStorage.getItem("user");let _parsed=null;try{_parsed=_lsU?JSON.parse(_lsU):null}catch{_parsed=null}if(localStorage.getItem("devAuth")==="1"||(_parsed&&(_parsed.companyId||_parsed.uid==="offline-local"||_parsed.uid==="dev-local-user"))){if(_parsed)r(_parsed);else r(null)}else r(null);d(null),u(Pe);if(!(localStorage.getItem("devAuth")==="1"||(_parsed&&_parsed.companyId)))localStorage.removeItem("user");await ya()}',
  'auth: preserve local user when Firebase null'
);

rep(
  indexPath,
  'isAuthenticated:!!t||localStorage.getItem("devAuth")==="1"',
  'isAuthenticated:!!t||localStorage.getItem("devAuth")==="1"||(()=>{try{const _u=JSON.parse(localStorage.getItem("user")||"null");return!!(_u&&(_u.companyId||_u.uid==="offline-local"||_u.uid==="dev-local-user"))}catch{return!1}})()',
  'auth: isAuthenticated includes local company user'
);

// --- Route guard: allow stored user online (offline-first) ---
rep(
  indexPath,
  'if(!s){try{const _or=typeof navigator!=="undefined"&&!navigator.onLine;const _ur=localStorage.getItem("user");if(_or&&_ur){const _pu=JSON.parse(_ur);_pu&&(_pu.uid||_pu.email)&&(s=_pu)}}catch(_e){}if(!s)return n.jsx(bn,{to:"/login",replace:!0});}',
  'if(!s){try{const _ur=localStorage.getItem("user");if(_ur){const _pu=JSON.parse(_ur);if(_pu&&(_pu.uid||_pu.email)&&(_pu.companyId||_pu.uid==="offline-local"||_pu.uid==="dev-local-user"||(typeof navigator!=="undefined"&&!navigator.onLine)))(s=_pu)}}catch(_e){}if(!s)return n.jsx(bn,{to:"/login",replace:!0});}',
  'route guard: local user allowed when online'
);

// --- Sync: clear lock on reconnect; skip sync without stuck syncing state ---
rep(
  indexPath,
  ',Tr=async()=>{ce=!0,ye=!0,W({isOnline:!0})',
  ',Tr=async()=>{ke=!1,window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{},window.__SANDRA_OFFLINE__.syncing=!1,ce=!0,ye=!0,W({isOnline:!0})',
  'Tr: clear sync lock on online'
);

rep(
  indexPath,
  'function Bs(){window.addEventListener("online",()=>{ye=!0,Rq().finally(()=>{xa(),setTimeout(()=>xa(),2e3),setTimeout(()=>xa(),6e3)})})',
  'function Bs(){window.addEventListener("online",()=>{ke=!1,window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{},window.__SANDRA_OFFLINE__.syncing=!1,ye=!0,Rq().finally(()=>{xa(),setTimeout(()=>xa(),2e3),setTimeout(()=>xa(),6e3)})})',
  'Bs: clear sync lock on online'
);

rep(
  indexPath,
  'if(!_su||!_su.uid||_su.uid==="offline-local"){pa("error","Sign in with your real account while online to sync offline data to the cloud");pe({pendingSyncCount:e.length,syncStatus:"error",lastSyncError:"Not signed in to Firebase"});return}',
  'if(!_su||!_su.uid||_su.uid==="offline-local"){ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"));pe({pendingSyncCount:e.length,syncStatus:"idle",lastSyncError:"Sign in while online to sync to cloud"});return}',
  'xa: skip sync without error/syncing lock for offline-local'
);

rep(
  indexPath,
  'if(At.size===0){console.warn("[SandraSync] No sync handlers registered yet");return};',
  'if(At.size===0){console.warn("[SandraSync] No sync handlers registered yet");ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"));return};',
  'xa: clear lock when handlers missing'
);

// --- Sales: restore POS new mode after reconnect ---
rep(
  salesPath,
  ',[te.pathname,te.search]),l.useEffect(()=>{if(Wr.current)',
  ',[te.pathname,te.search]),l.useEffect(()=>{const _restorePosOnOnline=()=>{try{const _s=new URLSearchParams(window.location.search).get("action");if(window.location.pathname==="/pos"&&_s==="new"){qe("pos"),Ce(!0),ue("create"),localStorage.removeItem("pos_viewMode")}}catch(_e){}};window.addEventListener("online",_restorePosOnOnline);return()=>window.removeEventListener("online",_restorePosOnOnline)},[]),l.useEffect(()=>{if(Wr.current)',
  'Sales: restore /pos?action=new on online'
);

// Bump cache buster
let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped index bundle cache to v=' + v);
}

console.log('\nTotal patches applied:', total);
