const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');

// find addToSyncQueue pattern - stores.PARTIES or "parties"
const terms = ['STORES.PARTIES', 'store:"parties"', 'parties"', 'syncItem', 'registerSyncCallback'];
for (const t of terms) {
  const i = s.indexOf(t);
  if (i >= 0) console.log(t, i, s.substring(i, i + 200));
}
