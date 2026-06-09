// Party data loss fix script
// Patches the V() and z() functions in the compiled partyService bundle
// to prevent stale temp-ID entries corrupting the localStorage array

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'assets', 'partyService-Wzcg7Wjf.js');
let content = fs.readFileSync(filePath, 'utf8');

// --- FIX 1: Patch z() to deduplicate by ID before pushing ---
// Old: a.push(t),st(e)
// New: deduplicate by id first, then save
const oldZ = 'a.push(t),st(e);';
const newZ = '/* PATCHED: deduplicate by id */const _pidx=a.findIndex(_item=>_item.id===t.id);if(_pidx!==-1){a[_pidx]={...a[_pidx],...t}}else{a.push(t)}st(e);';

if (content.includes(oldZ)) {
  content = content.replace(oldZ, newZ);
  console.log('✅ FIX 1 applied: z() deduplication patch');
} else {
  console.log('⚠️  FIX 1: Could not find target in z() — checking for unicode variant...');
  // Try unicode-escaped version
  const oldZUni = 'a.push(t),st(e)';
  const count = (content.match(/a\.push\(t\),st\(e\)/g) || []).length;
  console.log(`   Found ${count} occurrences of 'a.push(t),st(e)'`);
}

// --- FIX 2: Patch V() to also flush removal to raw localStorage ---
// Old: a.splice(r,1),st(e),!0
// New: also write to localStorage directly
const oldV = 'a.splice(r,1),st(e),!0';
const newV = 'a.splice(r,1),st(e);try{const _k=Q();localStorage.setItem(_k,JSON.stringify(a))}catch(_x){}return !0';

if (content.includes(oldV)) {
  content = content.replace(oldV, newV);
  console.log('✅ FIX 2 applied: V() localStorage flush patch');
} else {
  console.log('⚠️  FIX 2: Could not find target in V()');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done patching partyService-Wzcg7Wjf.js');
