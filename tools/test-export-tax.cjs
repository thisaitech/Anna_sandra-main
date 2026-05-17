// Simulate export line tax logic (mirrors exportUtils Nt inner loop)
function calcLine(r, n, companyState, u) {
  const S = n.isInterstate || (n.customerState || n.partyState) && String(n.customerState || n.partyState) !== String(companyState || 'Tamil Nadu');
  const invGst = Number(n.totalTaxAmount ?? n.tax ?? 0);
  const invCgst = Number(n.cgstAmount ?? 0);
  const invSgst = Number(n.sgstAmount ?? 0);
  const invIgst = Number(n.igstAmount ?? 0);

  let qtyN = Number(r.quantity ?? r.qty ?? NaN);
  let unit = String(r.unit || 'Nos').trim();
  if (!(qtyN > 0) && /^\d+(\.\d+)?$/.test(unit)) {
    qtyN = Number(unit);
    unit = String(r.rate || 'Nos').trim();
  }
  if (!(qtyN > 0)) {
    const _uq = unit.match(/^(\d+(?:\.\d+)?)\s*(.+)$/i);
    if (_uq) {
      qtyN = Number(_uq[1]);
      unit = _uq[2] || 'Nos';
    }
  }
  const qty = qtyN > 0 ? qtyN : 1;
  let rate = Number(r.rate ?? r.price ?? 0);
  let T = Number(r.gstRate ?? r.taxRate ?? r.tax ?? 0);
  let F = Number(r.taxableAmount ?? r.taxableValue);
  if (!(F > 0)) {
    const amt = Number(r.amount ?? r.total ?? 0);
    F = amt > 0 ? amt : qty * rate;
  }

  let cgstR = Number(r.cgstPercent || r.cgst || 0) || (S ? 0 : T > 0 ? T / 2 : 0);
  let sgstR = Number(r.sgstPercent || r.sgst || 0) || (S ? 0 : T > 0 ? T / 2 : 0);
  let igstR = Number(r.igstPercent || r.igst || 0) || (S && T > 0 ? T : 0);
  let cgstA = Number(r.cgstAmount ?? 0);
  let sgstA = Number(r.sgstAmount ?? 0);
  let igstA = Number(r.igstAmount ?? 0);
  let taxAmt = Number(r.taxAmount ?? r.gstAmount ?? 0);

  console.log('S', S, 'T', T, 'F', F, 'taxAmt before', taxAmt, 'cgstA', cgstA);

  if (u === 0 && cgstA + sgstA + igstA + taxAmt === 0 && invCgst + invSgst + invIgst + invGst > 0) {
    cgstA = invCgst;
    sgstA = invSgst;
    igstA = invIgst;
    taxAmt = invGst || invCgst + invSgst + invIgst;
  } else if (cgstA + sgstA + igstA + taxAmt === 0 && T > 0 && F > 0) {
    taxAmt = F * T / 100;
    cgstA = S ? 0 : taxAmt / 2;
    sgstA = S ? 0 : taxAmt / 2;
    igstA = S ? taxAmt : 0;
  } else taxAmt || (taxAmt = cgstA + sgstA + igstA);

  console.log('after branches taxAmt', taxAmt, 'cgstA', cgstA);

  if (!(taxAmt > 0) && F > 0 && T > 0) {
    const _inc = r.taxMode === 'inclusive' || n.taxMode === 'inclusive';
    taxAmt = _inc ? F - F / (1 + T / 100) : F * T / 100;
  }
  if (!S) {
    igstR = 0;
    if (T > 0 && cgstR + sgstR < T) {
      cgstR = T / 2;
      sgstR = T / 2;
    }
  } else if (T > 0) {
    cgstR = 0;
    sgstR = 0;
    igstR = T;
  }
  if (taxAmt > 0 && cgstA + sgstA + igstA < 0.01) {
    if (S) {
      igstA = taxAmt;
      cgstA = 0;
      sgstA = 0;
    } else {
      cgstA = taxAmt / 2;
      sgstA = taxAmt / 2;
      igstA = 0;
    }
  } else if (cgstA + sgstA + igstA < 0.01 && F > 0) {
    cgstA = (F * (cgstR || 0)) / 100;
    sgstA = (F * (sgstR || 0)) / 100;
    igstA = (F * (igstR || 0)) / 100;
    if (!(taxAmt > 0)) taxAmt = cgstA + sgstA + igstA;
  }

  console.log('final', { cgstR, sgstR, cgstA, sgstA, igstA, taxAmt });
}

// User scenario: total tax 2.14, rates 2.5/2.5, taxable 45
calcLine(
  {
    name: 'Everest Turmeric Powder 100g',
    unit: '1 KGS',
    rate: 45,
    price: 45,
    tax: 5,
    taxRate: 5,
    taxableAmount: 45,
    total: 45,
    taxAmount: 2.14,
    cgstPercent: 2.5,
    sgstPercent: 2.5,
    igstPercent: 5,
    cgstAmount: 0,
    sgstAmount: 0,
  },
  { customerState: 'Tamil Nadu', totalTaxAmount: 2.14 },
  'Tamil Nadu',
  0
);

// Interstate flag?
calcLine(
  { unit: '1 KGS', rate: 45, tax: 5, taxableAmount: 45, taxAmount: 2.14, cgstPercent: 2.5, sgstPercent: 2.5, igstPercent: 5 },
  { customerState: 'Karnataka', isInterstate: true },
  'Tamil Nadu',
  0
);
