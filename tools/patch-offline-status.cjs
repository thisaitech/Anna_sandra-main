/**
 * Offline status events + global API for status bar.
 */
const fs = require('fs');
const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let s = fs.readFileSync(indexPath, 'utf8');
let n = 0;

function rep(old, neu, label) {
  if (!s.includes(old)) {
    if (s.includes(neu)) {
      console.log('Already:', label);
      return;
    }
    console.warn('MISSING:', label);
    return;
  }
  s = s.replace(old, neu);
  n++;
  console.log('Patched:', label);
}

rep(
  'if(e.length===0)return;if(At.size===0){try{await Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")])}catch(err){console.warn("preload sync modules",err)}}if(At.size===0)return;const ps={parties:0,items:1,invoices:2,expenses:3,quotations:4,payments:5,deliveryChallans:6};e=e.slice().sort((a,b)=>(ps[a.store]??99)-(ps[b.store]??99));ke=!0;',
  'if(e.length===0)return;if(At.size===0){try{await Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")])}catch(err){console.warn("preload sync modules",err)}}if(At.size===0)return;const ps={parties:0,items:1,invoices:2,expenses:3,quotations:4,payments:5,deliveryChallans:6};e=e.slice().sort((a,b)=>(ps[a.store]??99)-(ps[b.store]??99));pa("syncing");window.dispatchEvent(new CustomEvent("offline-sync-started"));window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!0;ke=!0;',
  'xa: dispatch syncing started'
);

rep(
  '}finally{ke=!1}const s=await Wt();if(a>0||s.failed>0){pa("error","Some offline changes could not sync to cloud");return}if(t>0){pa("success"),pe({pendingSyncCount:s.total});return}pe({pendingSyncCount:s.total,syncStatus:s.total>0?"idle":"success"});if(s.total>0&&ye)setTimeout(()=>xa(),2e3)}',
  '}finally{ke=!1;window.__SANDRA_OFFLINE__=window.__SANDRA_OFFLINE__||{};window.__SANDRA_OFFLINE__.syncing=!1;window.dispatchEvent(new CustomEvent("offline-sync-finished"))}const s=await Wt();if(a>0||s.failed>0){pa("error","Some offline changes could not sync to cloud");return}if(t>0){pa("success"),pe({pendingSyncCount:s.total});return}pe({pendingSyncCount:s.total,syncStatus:s.total>0?"idle":"success"});if(s.total>0&&ye)setTimeout(()=>xa(),2e3)}',
  'xa: dispatch syncing finished'
);

const bootstrap =
  'window.__SANDRA_OFFLINE__={getSettings:typeof me==="function"?me:null,isOnline:()=>typeof ye!=="undefined"?ye:navigator.onLine,syncing:false,triggerSync:typeof xa==="function"?xa:null};';

if (!s.includes('window.__SANDRA_OFFLINE__={getSettings')) {
  rep(
    '$t().catch(console.error);Bs();Rq();',
    bootstrap + '$t().catch(console.error);Bs();Rq();',
    'expose __SANDRA_OFFLINE__ API'
  );
}

if (n > 0) {
  fs.writeFileSync(indexPath, s);
}

let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('offline-status-bar.js')) {
  html = html.replace(
    '<script src="/pwa-install-controller.js',
    '<script src="/offline-status-bar.js?v=1"></script>\n    <script src="/pwa-install-controller.js'
  );
  fs.writeFileSync(htmlPath, html);
  console.log('Patched: index.html offline-status-bar');
}

const ver = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (ver) {
  html = fs.readFileSync(htmlPath, 'utf8');
  const next = Number(ver[1]) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped index to v=' + next);
}

require('child_process').execSync(`node --check "${indexPath}"`, { stdio: 'inherit' });
console.log('Done', n, 'index patch(es)');
