/**
 * Point Sandra ERP dist bundle at a Firebase project.
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

const TARGET =
  'apiKey:"AIzaSyDmnRrdEbC6Haf7Ts45AgCRKoZ6Ty3hI9U",authDomain:"petshop-9dee5.firebaseapp.com",projectId:"petshop-9dee5",storageBucket:"petshop-9dee5.firebasestorage.app",messagingSenderId:"842935437870",appId:"1:842935437870:web:6f0ff75c5f196a80ba6dbf",measurementId:"G-MHC5TM97EH"';

const KNOWN_BLOCKS = [
  'apiKey:"AIzaSyCzl-322O1K_fHw5u1vVcsamjQx9hMG3Fo",authDomain:"sandra-erp.firebaseapp.com",projectId:"sandra-erp",storageBucket:"sandra-erp.firebasestorage.app",messagingSenderId:"635709018781",appId:"1:635709018781:web:8b9d53a5219f2d8220fa74"',
  'apiKey:"AIzaSyB_uM-_gAR4TXyafBPuVo5jQUEpzqTBADk",authDomain:"dail-app.firebaseapp.com",databaseURL:"https://dail-app-default-rtdb.firebaseio.com",projectId:"dail-app",storageBucket:"dail-app.firebasestorage.app",messagingSenderId:"32705960161",appId:"1:32705960161:web:ad46420559198c0a027fa0",measurementId:"G-KDEDZMJEWF"',
];

let s = fs.readFileSync(indexPath, 'utf8');
let replaced = false;

for (const old of KNOWN_BLOCKS) {
  if (s.includes(old)) {
    s = s.split(old).join(TARGET);
    replaced = true;
    console.log('Replaced known config block');
    break;
  }
}

if (!replaced && s.includes('petshop-9dee5')) {
  console.log('Already on petshop-9dee5');
  replaced = true;
}

if (!replaced) {
  const m = s.match(/apiKey:"[^"]+",authDomain:"[^"]+"(?:,databaseURL:"[^"]+")?,projectId:"[^"]+",storageBucket:"[^"]+",messagingSenderId:"[^"]+",appId:"[^"]+"(?:,measurementId:"[^"]+")?/);
  if (m) {
    s = s.replace(m[0], TARGET);
    replaced = true;
    console.log('Replaced via regex match');
  }
}

if (!s.includes('petshop-9dee5')) {
  console.error('ERROR: petshop-9dee5 config not found after patch');
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

console.log('Firebase config set to petshop-9dee5');
