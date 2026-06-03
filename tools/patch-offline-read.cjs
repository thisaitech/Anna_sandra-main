/**
 * Fix offline reopen showing empty lists:
 * - getParties/getItems: prefer localStorage when offline and IndexedDB is empty
 * - ct()/P(): resolve companyId from app_offline_company_id + scan storage keys
 */
const fs = require('fs');

const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
const partyPath = 'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js';
const itemPath = 'c:/project/Anna_sandra-main/dist/assets/itemService-sgFD7LVj.js';

let total = 0;

function rep(path, oldStr, newStr, label) {
  let s = fs.readFileSync(path, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(path, s);
  console.log('Patched:', label);
  total++;
  return true;
}

rep(
  partyPath,
  'K=()=>{try{return Ci()}catch{return null}}',
  'K=()=>{try{const _id=Ci();if(_id)return _id}catch(_e){}try{return localStorage.getItem("app_offline_company_id")}catch(_e){return null}}',
  'partyService K() companyId fallback'
);

rep(
  itemPath,
  'w=()=>{try{return Ci()}catch{return null}}',
  'w=()=>{try{const _id=Ci();if(_id)return _id}catch(_e){}try{return localStorage.getItem("app_offline_company_id")}catch(_e){return null}}',
  'itemService w() companyId fallback'
);

rep(
  partyPath,
  'function ct(t){try{const e=K();if(!e)return[];const a=Z(Q(),[]);let r=Array.isArray(a)?a.slice():[];return r=r.filter(o=>o.companyId===e),',
  'function ct(t){try{const e=K();if(!e)return[];let a=Z(Q(),[]);let r=Array.isArray(a)?a.slice():[];if(!r.length){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k==="thisai_crm_parties_"+e){const raw=localStorage.getItem(k);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))r=parsed}}}}catch(_sk){}}return r=r.filter(o=>!o.companyId||o.companyId===e),',
  'partyService ct() localStorage scan fallback'
);

rep(
  itemPath,
  'function P(){try{const e=w();if(!e)return[];const t=ne(M(),[]);let r=Array.isArray(t)?t.slice():[];return r=r.filter(n=>n.companyId===e),',
  'function P(){try{const e=w();if(!e)return[];let t=ne(M(),[]);let r=Array.isArray(t)?t.slice():[];if(!r.length){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k==="thisai_crm_items_"+e){const raw=localStorage.getItem(k);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))r=parsed}}}}catch(_sk){}}return r=r.filter(n=>!n.companyId||n.companyId===e),',
  'itemService P() localStorage scan fallback'
);

rep(
  partyPath,
  'if((typeof navigator!=="undefined"&&!navigator.onLine)||!b()||!D())return o.length,o;',
  'if((typeof navigator!=="undefined"&&!navigator.onLine)||!b()||!D()){const _loc=ct(t);if(_loc.length)o=_loc;else if(!o.length)o=_loc;return o.length,o};',
  'partyService getParties offline localStorage fallback'
);

rep(
  itemPath,
  'if((typeof navigator!=="undefined"&&!navigator.onLine)||!S()||!g())return n.length,n;',
  'if((typeof navigator!=="undefined"&&!navigator.onLine)||!S()||!g()){const _loc=P();if(_loc.length)n=_loc;else if(!n.length)n=_loc;return n.length,n};',
  'itemService getItems offline localStorage fallback'
);

// index.html: always refresh app_offline_company_id when user exists
let html = fs.readFileSync(htmlPath, 'utf8');
const bootOld = `          if (u && u.companyId) {
            localStorage.setItem('app_offline_company_id', u.companyId);
            return;
          }`;
const bootNew = `          if (u && u.companyId) {
            localStorage.setItem('app_offline_company_id', u.companyId);
            return;
          }
          if (!raw && localStorage.getItem('app_offline_company_id')) return;`;
if (!html.includes("if (!raw && localStorage.getItem('app_offline_company_id'))")) {
  if (html.includes(bootOld)) {
    html = html.replace(bootOld, bootNew);
    fs.writeFileSync(htmlPath, html);
    console.log('Patched: index.html bootstrap');
    total++;
  }
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

console.log('Done,', total, 'patch(es)');
process.exit(total > 0 ? 0 : 1);
