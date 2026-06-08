const fs = require('fs');
const inv = fs.readFileSync('dist/assets/invoiceService-wndk85Fv.js', 'utf8');
const sales = fs.readFileSync('dist/assets/Sales-DxyuXk9a.js', 'utf8');
const idx = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');

function extract(file, start, len, label) {
  const i = file.indexOf(start);
  console.log('\n===', label, 'at', i, '===');
  if (i < 0) return;
  console.log(file.slice(i, i + len));
}

extract(inv, 'async function pt', 3500, 'getInvoices pt');
extract(inv, 'async function vt', 1500, 'invoice sync vt');
extract(inv, 'function K()', 800, 'companyId K');

// find clear/delete patterns
['clearInvoices', 'deleteDatabase', 'removeItem', 'localStorage.removeItem', 'INVOICES'].forEach(k => {
  const c = (inv.match(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  console.log('invoice', k, 'count', c);
});

// Sales load
extract(sales, 'getInvoices', 2000, 'Sales getInvoices usage');
extract(sales, 'ed(', 1500, 'Sales ed fn');

// Rq refresh on online
extract(idx, 'async function Rq', 2500, 'Rq cache refresh');
