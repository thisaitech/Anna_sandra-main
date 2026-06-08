const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
for (const needle of ['function Bs()', 'Tr=async', 'async function xa()', 'window.addEventListener("online"']) {
  const i = s.indexOf(needle);
  console.log('\n===', needle, '===', i);
  if (i >= 0) console.log(s.slice(i, i + 600));
}
