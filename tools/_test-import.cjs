const files = [
  'partyService-Wzcg7Wjf.js',
  'itemService-sgFD7LVj.js',
  'invoiceService-wndk85Fv.js',
  'expenseService-C2uEJ3jV.js',
];
(async () => {
  for (const f of files) {
    try {
      await import('../dist/assets/' + f);
      console.log(f, 'OK');
    } catch (e) {
      console.error(f, 'FAIL', e.message);
    }
  }
})();
