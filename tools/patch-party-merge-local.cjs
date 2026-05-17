const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js';
let s = fs.readFileSync(path, 'utf8');

const mergeFn = `function Ht(t,e){if(!e)return t;if(!t)return e;const a=n=>{const r=t[n]||{},o=e[n]||{};return{street:r.street||r.line1||o.street||o.line1||"",city:r.city||o.city||"",state:r.state||o.state||"",pinCode:r.pinCode||r.pincode||o.pinCode||o.pincode||"",country:r.country||o.country||"India"}};return{...e,...t,billingAddress:a("billingAddress"),shippingAddress:a("shippingAddress"),gstDetails:t.gstDetails?.gstin?t.gstDetails:e.gstDetails}}`;

if (!s.includes('function Ht(t,e)')) {
  const anchor = 'function kt(t){';
  if (!s.includes(anchor)) {
    console.error('MISSING kt anchor');
    process.exit(1);
  }
  s = s.replace(anchor, mergeFn + anchor);
  console.log('Added mergePartyWithLocal (Ht)');
}

const mergeOld =
  'const N=o.filter(m=>R(m.id)),w=[...f,...N];for(const m of f)v(p.PARTIES,m).catch(()=>{})';
const mergeNew =
  'const Gt=new Map(o.map(m=>[m.id,m])),f2=f.map(m=>{const C=Gt.get(m.id);return C?Ht(m,C):m});const N=o.filter(m=>R(m.id)),w=[...f2,...N];for(const m of f2)v(p.PARTIES,m).catch(()=>{})';

if (s.includes(mergeOld)) {
  s = s.replace(mergeOld, mergeNew);
  console.log('Patched getParties local/firebase merge');
} else if (s.includes('f2=f.map')) {
  console.log('Already: getParties merge');
} else {
  console.warn('MISSING getParties merge pattern');
}

fs.writeFileSync(path, s);
console.log('Done');
