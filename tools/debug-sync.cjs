const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js', 'utf8');
const i = s.indexOf('...E,updatedAt:r');
const chunk = s.slice(i - 15, i + 55);
console.log(JSON.stringify(chunk));
const old = "const f=W({...E,updatedAt:r});if(t.type===\"create\"";
console.log('includes', s.includes(old), 'index', s.indexOf(old));
const short = 'f=W({...E,updatedAt:r})';
console.log('short', s.includes(short), s.indexOf(short));
const at = s.indexOf(short);
console.log('at slice', JSON.stringify(s.slice(at - 6, at + 45)));
const old2 = s.slice(at - 6, at + 45);
console.log('old len', old.length, 'old2 len', old2.length);
for (let k = 0; k < Math.max(old.length, old2.length); k++) {
  if (old[k] !== old2[k]) {
    console.log('diff at', k, JSON.stringify(old[k]), old.charCodeAt(k), JSON.stringify(old2[k]), old2.charCodeAt(k));
    break;
  }
}
for (let j = 0; j < chunk.length; j++) {
  const c = chunk[j];
  if (c === '.' || c === '"' || c === '{' || c === '}') {
    console.log(j, c, c.charCodeAt(0));
  }
}
