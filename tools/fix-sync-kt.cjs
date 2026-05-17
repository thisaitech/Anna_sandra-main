const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js';
let s = fs.readFileSync(path, 'utf8');
const old = 'f=W({...E,updatedAt:r})';
const neu = 'f=kt({...E,updatedAt:r})';
console.log('before includes old:', s.includes(old));
if (s.includes(old)) {
  s = s.replace(old, neu);
  fs.writeFileSync(path, s);
  console.log('Patched sync to kt');
} else {
  console.log('already kt?', s.includes(neu));
  const i = s.indexOf('...E,updatedAt:r');
  console.log('context:', s.slice(i - 20, i + 40));
}
