function _lineItemTotal(it) {
  const qty = Number(it?.quantity ?? it?.qty ?? 1) || 1;
  const price = Number(it?.rate ?? it?.price ?? 0);
  const saved = Number(it?.total ?? it?.amount ?? 0);
  const taxRate = Number(it?.tax ?? it?.taxRate ?? it?.gst ?? 0) || 0;
  const taxMode = it?.taxMode || 'exclusive';
  const lineTax = Number(it?.taxAmount ?? 0) || Number(it.cgstAmount ?? 0) + Number(it.sgstAmount ?? 0) + Number(it.igstAmount ?? 0);
  if (saved > 0) {
    if (taxRate > 0 && taxMode === 'exclusive' && lineTax < 0.01) {
      const base = Math.round(price * qty * 100) / 100;
      if (Math.abs(saved - base) < 0.02) return Math.round(base * (1 + taxRate / 100) * 100) / 100;
    }
    return saved;
  }
  if (taxMode === 'inclusive') return Math.round(price * qty * 100) / 100;
  const base = Math.round(price * qty * 100) / 100;
  return taxRate > 0 ? Math.round(base * (1 + taxRate / 100) * 100) / 100 : base;
}

const inv = {
  grandTotal: 710,
  total: 710,
  items: [{ quantity: 1, rate: 710, amount: 710, taxRate: 5, taxMode: 'exclusive' }],
};
const sum = inv.items.reduce((a, it) => a + _lineItemTotal(it), 0);
console.log('line total', sum, 'expected 746');
console.assert(Math.abs(sum - 746) < 0.01, 'FAIL');
