/**
 * Fix broken for-loop brace in party/item service (Unexpected token 'catch').
 */
const fs = require('fs');
const files = [
  'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js',
  'c:/project/Anna_sandra-main/dist/assets/itemService-sgFD7LVj.js',
];
const bad = 'if(Array.isArray(parsed))r=parsed}}}catch(_sk){}}';
const good = 'if(Array.isArray(parsed))r=parsed}}}}catch(_sk){}}';
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes(bad) && s.includes(good)) {
    console.log('OK:', f);
    continue;
  }
  if (!s.includes(bad)) {
    console.error('Pattern not found:', f);
    process.exit(1);
  }
  s = s.split(bad).join(good);
  fs.writeFileSync(f, s);
  require('child_process').execSync(`node --check "${f}"`, { stdio: 'inherit' });
  console.log('Fixed:', f);
}
