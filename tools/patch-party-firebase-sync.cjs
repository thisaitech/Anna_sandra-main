/**
 * Ensure billing/shipping/gst fields sync to Firebase from Parties page (same as Sales).
 */
const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js';

let s = fs.readFileSync(path, 'utf8');

const normalizeFn = `function kt(t){const e=W(t)||{},a=e;if(a.gstin&&!e.gstDetails?.gstin){const n=String(a.gstin).toUpperCase();e.gstDetails={gstin:n,gstType:"Regular",stateCode:n.length>=2?n.substring(0,2):""},delete a.gstin}if(a.state&&(!e.billingAddress||!e.billingAddress.state)){const n=e.billingAddress||{};e.billingAddress={street:n.street||n.line1||"",city:n.city||"",state:a.state,pinCode:n.pinCode||n.pincode||"",country:n.country||"India"},delete a.state}const r=e.billingAddress||{};e.billingAddress={street:r.street||r.line1||"",city:r.city||"",state:r.state||"",pinCode:r.pinCode||r.pincode||"",country:r.country||"India"};return e.sameAsShipping!==!1&&(e.shippingAddress={...e.billingAddress}),e.sameAsShipping===void 0&&(e.sameAsShipping=!0),e}`;

if (!s.includes('function kt(t)')) {
  const anchor = 'function W(t){if(t==null)return t;';
  if (!s.includes(anchor)) {
    console.error('MISSING: function W anchor');
    process.exit(1);
  }
  s = s.replace(anchor, normalizeFn + anchor);
  console.log('Added normalizePartyServerPayload (kt)');
}

const createOld =
  'const u=W({...t,createdAt:e,updatedAt:e,...r?{companyId:r}:{}}),E=await Pt(L(_,T.PARTIES),u)';
const createNew =
  'const u=kt({...t,createdAt:e,updatedAt:e,...r?{companyId:r}:{}}),E=await Pt(L(_,T.PARTIES),u)';

if (s.includes(createOld)) {
  s = s.replace(createOld, createNew);
  console.log('Patched createParty Firebase payload');
} else if (s.includes(createNew)) {
  console.log('Already: createParty Firebase payload');
} else {
  console.warn('MISSING: createParty pattern');
}

const syncOld = 'f=W({...E,updatedAt:r})';
const syncNew = 'f=kt({...E,updatedAt:r})';

if (s.includes(syncOld)) {
  s = s.replace(syncOld, syncNew);
  console.log('Patched syncPartyToServer payload');
}

const updateOld =
  'const s=W({...e,updatedAt:a}),c=G(_,T.PARTIES,t);await mt(c,s),o._pendingSync=!1';
const updateNew =
  'const s=kt({...r,...e,updatedAt:a,id:void 0,_pendingSync:void 0,_savedAt:void 0,_syncedAt:void 0}),c=G(_,T.PARTIES,t);await mt(c,s),o._pendingSync=!1';

if (s.includes(updateOld)) {
  s = s.replace(updateOld, updateNew);
  console.log('Patched updateParty Firebase payload (full merge)');
} else if (s.includes(updateNew)) {
  console.log('Already: updateParty Firebase payload');
} else {
  console.warn('MISSING: updateParty pattern');
}

// Parties UI: add shippingAddress on create (align with Sales)
const partiesPath = 'c:/project/Anna_sandra-main/dist/assets/Parties-BmJMIjfc.js';
let p = fs.readFileSync(partiesPath, 'utf8');
const partiesOld =
  'billingAddress:{street:Re?.trim()||"",city:"",state:Oe?.trim()||"",pinCode:"",country:"India"},sameAsShipping:!0';
const partiesNew =
  'billingAddress:{street:Re?.trim()||"",city:"",state:Oe?.trim()||"",pinCode:"",country:"India"},shippingAddress:{street:Re?.trim()||"",city:"",state:Oe?.trim()||"",pinCode:"",country:"India"},sameAsShipping:!0';

if (p.includes(partiesOld)) {
  p = p.replace(partiesOld, partiesNew);
  console.log('Patched Parties create payload with shippingAddress');
} else if (p.includes(partiesNew)) {
  console.log('Already: Parties shippingAddress');
} else {
  console.warn('MISSING: Parties billingAddress pattern');
}

fs.writeFileSync(path, s);
fs.writeFileSync(partiesPath, p);
console.log('Done');
