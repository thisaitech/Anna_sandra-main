/**
 * Fix offline-first sync for desktop/Electron:
 * - syncService was marking queue items "completed" without syncing (action vs type field)
 * - offline IDs like invoice_* were not recognized (only offline_*)
 * - silentBackgroundSync skipped when sync callbacks not loaded yet
 * - re-queue local _pendingSync records missing from sync queue
 */
const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
let s = fs.readFileSync(path, 'utf8');
let n = 0;

function rep(old, neu, label) {
  if (s.includes(old)) {
    s = s.replace(old, neu);
    n++;
    console.log('Patched:', label);
    return true;
  }
  if (s.includes(neu)) {
    console.log('Already patched:', label);
    return true;
  }
  console.warn('MISSING:', label);
  return false;
}

// 1) Recognize all offline-generated entity IDs (not only offline_*)
rep(
  'kr=e=>e.startsWith("offline_")',
  'kr=e=>typeof e=="string"&&(e.startsWith("offline_")||e.startsWith("invoice_")||e.startsWith("party_")||e.startsWith("item_")||e.startsWith("expense_"))',
  'isOfflineId (kr)'
);

// 2) syncOperation: queue items use "type", legacy syncService used "action"
rep(
  'switch(e.action){case"create":',
  'switch(e.action||e.type){case"create":',
  'syncOperation action/type switch'
);

// 3) Do not let syncService "complete" items owned by offlineSyncService (type-only queue rows)
rep(
  'const a=await fe.getPending();if(a.length===0){W({pendingCount:0,lastSyncTime:Date.now()});return}',
  'let a=await fe.getPending();a=a.filter(c=>c.action!=null);if(a.length===0){W({pendingCount:0,lastSyncTime:Date.now()});return}',
  'syncPendingOperations filter type-only queue items'
);

// 4) On reconnect: preload entity services, reset failed queue rows, run both sync engines
rep(
  'Tr=()=>{ce=!0,W({isOnline:!0}),O.success("Back online! Syncing data...",{duration:3e3}),Ze()}',
  'Tr=async()=>{ce=!0,ye=!0,W({isOnline:!0}),O.success("Back online! Syncing data...",{duration:3e3});try{await Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")])}catch(e){console.warn("preload sync modules",e)}try{const _q=await Ls();for(const _i of _q)_i.status==="failed"&&(_i.status="pending",_i.retryCount=0,await te(y.SYNC_QUEUE,_i))}catch(e){}await Rq(),Ze(!1),setTimeout(()=>xa(),400),setTimeout(()=>xa(),2500),setTimeout(()=>xa(),8e3)}',
  'handleOnline (Tr)'
);

// 5) Background check also runs offlineSyncService when queue has work
rep(
  '_r=async()=>{if(ce&&!Fe)try{(await fe.getCount()).pending>0&&Ze(!1)}catch(e){console.warn("Background sync check failed:",e)}}',
  '_r=async()=>{if(ce&&!Fe)try{const _c=await fe.getCount();(_c.pending>0||_c.failed>0)&&Ze(!1),ye&&!ke&&(await Ls()).length>0&&xa()}catch(e){console.warn("Background sync check failed:",e)}}',
  'checkAndSync (_r)'
);

// 6) Improved silentBackgroundSync: preload callbacks, sort stores, finally unlock, retry leftovers
const xaOld =
  'async function xa(){if(ke||!ye||At.size===0)return;const e=await Ls();if(e.length===0)return;ke=!0;let t=0,a=0;for(const r of e){if(!ye)break;const o=At.get(r.store);if(o)try{if(await o(r)){if(await Ms(r.id),t+=1,r.data?.id){const c=await Ma(r.store,r.data.id);c&&(c._pendingSync=!1,c._syncedAt=new Date().toISOString(),await te(r.store,c))}window.dispatchEvent(new CustomEvent("offline-sync-completed",{detail:{store:r.store,id:r.data?.id||null}})),r.store===y.INVOICES&&window.dispatchEvent(new CustomEvent("invoice-synced",{detail:{id:r.data?.id}}))}else a+=1,await ha(r.id)}catch{a+=1,await ha(r.id),r.id}}ke=!1;const s=await Wt();if(a>0||s.failed>0){pa("error","Some offline changes could not sync to cloud");return}if(t>0){pa("success"),pe({pendingSyncCount:s.total});return}pe({pendingSyncCount:s.total,syncStatus:s.total>0?"idle":"success"})}';

const xaNew =
  'async function xa(){if(ke||!ye)return;let e=[];try{e=await Ls()}catch(err){console.warn("sync queue read failed",err);return}if(e.length===0)return;if(At.size===0){try{await Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")])}catch(err){console.warn("preload sync modules",err)}}if(At.size===0)return;const ps={parties:0,items:1,invoices:2,expenses:3,quotations:4,payments:5,deliveryChallans:6};e=e.slice().sort((a,b)=>(ps[a.store]??99)-(ps[b.store]??99));ke=!0;let t=0,a=0;try{for(const r of e){if(!ye)break;const o=At.get(r.store);if(!o)continue;try{if(await o(r)){if(await Ms(r.id),t+=1,r.data?.id){const c=await Ma(r.store,r.data.id);c&&(c._pendingSync=!1,c._syncedAt=new Date().toISOString(),await te(r.store,c))}window.dispatchEvent(new CustomEvent("offline-sync-completed",{detail:{store:r.store,id:r.data?.id||null}})),r.store===y.INVOICES&&window.dispatchEvent(new CustomEvent("invoice-synced",{detail:{id:r.data?.id}}))}else a+=1,await ha(r.id)}catch{a+=1,await ha(r.id)}}}finally{ke=!1}const s=await Wt();if(a>0||s.failed>0){pa("error","Some offline changes could not sync to cloud");return}if(t>0){pa("success"),pe({pendingSyncCount:s.total});return}pe({pendingSyncCount:s.total,syncStatus:s.total>0?"idle":"success"});if(s.total>0&&ye)setTimeout(()=>xa(),2e3)}';

rep(xaOld, xaNew, 'silentBackgroundSync (xa)');

// 7) Network listeners: set online flag, requeue, sync sooner and more often when pending
rep(
  'function Bs(){window.addEventListener("online",()=>{ye=!0,setTimeout(()=>{xa()},2e3)}),window.addEventListener("offline",()=>{ye=!1,ke=!1}),setInterval(()=>{ye&&!ke&&xa()},3e4)}',
  'function Bs(){window.addEventListener("online",()=>{ye=!0,Rq().finally(()=>{xa(),setTimeout(()=>xa(),2e3),setTimeout(()=>xa(),6e3)})}),window.addEventListener("offline",()=>{ye=!1,ke=!1}),setInterval(()=>{ye&&!ke&&xa()},15e3)}',
  'initNetworkListeners (Bs)'
);

// 8) Re-queue local rows still marked _pendingSync but missing from sync queue (recovery)
const rqFn =
  'async function Rq(){try{const st=[y.PARTIES,y.ITEMS,y.INVOICES,y.EXPENSES];const q=await xe(y.SYNC_QUEUE);const ids=new Set(q.map(i=>i.data?.id).filter(Boolean));for(const stn of st){const rows=await xe(stn);for(const row of rows){if(!row||!row._pendingSync||!row.id||ids.has(row.id))continue;const op=kr(row.id)?"create":"update";await Yi(op,stn,row),ids.add(row.id)}}}catch(e){console.warn("requeue pending local records",e)}}';
if (!s.includes('async function Rq(){try{const st=[y.PARTIES')) {
  rep(
    '$t().catch(console.error);Bs();',
    rqFn + '$t().catch(console.error);Bs();Rq();',
    'requeue pending local records (Rq)'
  );
} else if (!s.includes('$t().catch(console.error);Bs();Rq();')) {
  rep('$t().catch(console.error);Bs();', '$t().catch(console.error);Bs();Rq();', 'Rq bootstrap call');
} else {
  console.log('Already patched: requeue pending local records (Rq)');
}

// 9) initSyncService: preload modules on startup and requeue
rep(
  'Ar=()=>{window.addEventListener("online",Tr),window.addEventListener("offline",Dr),ce=navigator.onLine,W({isOnline:ce}),setInterval(_r,6e4),ce&&setTimeout(()=>Ze(!1),3e3)',
  'Ar=()=>{window.addEventListener("online",Tr),window.addEventListener("offline",Dr),ce=navigator.onLine,ye=navigator.onLine,W({isOnline:ce}),setInterval(_r,6e4),Promise.all([import("./invoiceService-wndk85Fv.js"),import("./partyService-Wzcg7Wjf.js"),import("./itemService-sgFD7LVj.js"),import("./expenseService-C2uEJ3jV.js")]).catch(()=>{}).finally(()=>{Rq().finally(()=>{Ze(!1),xa()})}),ce&&setTimeout(()=>Ze(!1),3e3)',
  'initSyncService (Ar)'
);

if (n > 0) {
  fs.writeFileSync(path, s);
  console.log('Wrote', path, '(' + n + ' patches)');
}

let html = fs.readFileSync(htmlPath, 'utf8');
const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (verMatch) {
  const next = String(Number(verMatch[1]) + 1);
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache version to', next);
}

process.exit(n > 0 ? 0 : 1);
