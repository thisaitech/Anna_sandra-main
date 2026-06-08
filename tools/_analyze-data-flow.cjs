const fs = require('fs');

function extract(file, names) {
  const s = fs.readFileSync(file, 'utf8');
  for (const n of names) {
    const re = new RegExp(`(async function ${n}|function ${n}|const ${n}=|${n}=async)`, 'g');
    let m;
    while ((m = re.exec(s)) !== null) {
      console.log('\n===', file.split(/[/\\]/).pop(), n, '@', m.index, '===');
      console.log(s.slice(m.index, m.index + 2500));
      break;
    }
  }
}

extract('c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js', [
  'getParties',
  'createParty',
  'updateParty',
]);
extract('c:/project/Anna_sandra-main/dist/assets/invoiceService-wndk85Fv.js', [
  'getInvoices',
  'createInvoice',
  'getSales',
]);
extract('c:/project/Anna_sandra-main/dist/assets/localJsonStore-CVmiFbPM.js', [
  'saveLocal',
  'getLocal',
  'loadLocal',
]);
