// Test GSTR taxable logic (copy of patched ie)
function ie(l) {
  const items = l.items || l.itemsList || [];
  const hdr = Number(l.taxableAmount ?? l.subtotal ?? 0);
  if (!items.length) return hdr;
  let g = 0;
  for (const S of items) {
    const x = Number(S.quantity ?? S.qty ?? 1) || 1;
    const tax =
      Number(S.cgstAmount ?? 0) +
      Number(S.sgstAmount ?? 0) +
      Number(S.igstAmount ?? 0) +
      Number(S.taxAmount ?? 0);
    const tot = Number(S.amount ?? S.total ?? S.totalAmount ?? 0);
    const rate = Number(S.rate ?? S.price ?? S.basePrice ?? 0);
    const ta = Number(S.taxableAmount ?? 0);
    if (ta > 0) {
      g += ta;
      continue;
    }
    if (Number(S.basePrice) > 0) {
      g += Number(S.basePrice) * x;
      continue;
    }
    if (tot > 0 && tax > 0) {
      g += tot - tax;
      continue;
    }
    if (tot > 0) {
      const tr = Number(S.taxRate ?? S.tax ?? 0);
      if (S.taxMode === 'inclusive' && tr > 0) g += tot / (1 + tr / 100);
      else if (rate > 0) g += rate * x;
      else g += tot;
      continue;
    }
    if (rate > 0) g += rate * x;
  }
  if (g > 0) return Math.round(g * 100) / 100;
  if (hdr > 0) return hdr;
  const gt = Number(l.grandTotal ?? l.total ?? 0);
  const tx =
    Number(l.totalTaxAmount ?? l.tax ?? 0) ||
    Number(l.cgstAmount ?? 0) + Number(l.sgstAmount ?? 0) + Number(l.igstAmount ?? 0);
  return gt > tx ? Math.round((gt - tx) * 100) / 100 : 0;
}

// Typical saved sale invoice (rate + amount, no basePrice)
const inv = {
  grandTotal: 177,
  total: 177,
  totalTaxAmount: 27,
  items: [{ description: 'Oil', quantity: 1, rate: 150, amount: 177, taxRate: 18, taxMode: 'inclusive' }],
};
console.log('inclusive 177:', ie(inv), 'expected ~150');

const inv2 = {
  grandTotal: 194.7,
  totalTaxAmount: 29.7,
  items: [{ quantity: 1, rate: 165, amount: 194.7, taxRate: 18 }],
};
console.log('exclusive 194.7:', ie(inv2), 'expected ~165');

const inv3 = {
  grandTotal: 194.7,
  totalTaxAmount: 29.7,
  taxableAmount: 0,
  subtotal: 0,
  items: [{ quantity: 1, rate: 165, amount: 194.7, taxRate: 18, cgstAmount: 14.85, sgstAmount: 14.85 }],
};
console.log('with line tax:', ie(inv3), 'expected ~165');
