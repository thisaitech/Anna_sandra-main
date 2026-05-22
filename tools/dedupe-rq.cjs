/**
 * Remove duplicate `async function Rq` declarations (patch-offline-sync re-apply bug).
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

const rqFn =
  'async function Rq(){try{const st=[y.PARTIES,y.ITEMS,y.INVOICES,y.EXPENSES];const q=await xe(y.SYNC_QUEUE);const ids=new Set(q.map(i=>i.data?.id).filter(Boolean));for(const stn of st){const rows=await xe(stn);for(const row of rows){if(!row||!row._pendingSync||!row.id||ids.has(row.id))continue;const op=kr(row.id)?"create":"update";await Yi(op,stn,row),ids.add(row.id)}}}catch(e){console.warn("requeue pending local records",e)}}';

let s = fs.readFileSync(indexPath, 'utf8');
const before = (s.match(/async function Rq\(/g) || []).length;

while (s.includes(rqFn + rqFn)) {
  s = s.replace(rqFn + rqFn, rqFn);
}

const after = (s.match(/async function Rq\(/g) || []).length;
if (after !== 1) {
  console.error('ERROR: expected 1 Rq after dedupe, found', after);
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

console.log('Removed', before - after, 'duplicate Rq declaration(s)');
process.exit(0);
