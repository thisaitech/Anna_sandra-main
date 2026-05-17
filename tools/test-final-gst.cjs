function _finalGst(F, T, taxAmt, cgstA, sgstA, igstA, cgstR, sgstR, igstR, isInterstate, inclusive) {
  const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
  F = r2(F);
  T = r2(T);
  let t = r2(taxAmt),
    cA = r2(cgstA),
    sA = r2(sgstA),
    iA = r2(igstA),
    cR = r2(cgstR),
    sR = r2(sgstR),
    iR = r2(igstR);
  if (!T && t > 0 && F > 0) T = r2((t / F) * 100);
  if (!t && F > 0 && T > 0) t = inclusive ? r2(F - F / (1 + T / 100)) : r2((F * T) / 100);
  if (isInterstate) {
    cR = 0;
    sR = 0;
    iR = iR > 0 ? iR : T;
    if (t > 0 && (iA < 0.01 || cA + sA > 0)) {
      iA = t;
      cA = 0;
      sA = 0;
    } else if (F > 0 && iR > 0 && iA < 0.01) iA = r2((F * iR) / 100);
    if (t < 0.01 && iA > 0) t = iA;
  } else {
    iR = 0;
    cR = cR > 0 ? cR : T > 0 ? T / 2 : 0;
    sR = sR > 0 ? sR : T > 0 ? T / 2 : 0;
    if (t > 0 && cA + sA < 0.01) {
      cA = r2(t / 2);
      sA = r2(t - cA);
      iA = 0;
    } else if (F > 0 && (cR > 0 || sR > 0) && cA + sA < 0.01) {
      cA = r2((F * cR) / 100);
      sA = r2((F * sR) / 100);
      iA = 0;
      t = r2(cA + sA);
    } else if (t > 0 && cA + sA < 0.01) {
      cA = r2(t / 2);
      sA = r2(t - cA);
    }
  }
  if (t < 0.01) t = r2(cA + sA + iA);
  return { cgstR: cR, sgstR: sR, igstR: iR, cgstA: cA, sgstA: sA, igstA: iA, taxAmt: t };
}

const cases = [
  { name: 'Turmeric 5% inclusive', F: 45, T: 5, tax: 2.14, S: false, inc: true },
  { name: '12% exclusive 300', F: 300, T: 12, tax: 0, S: false, inc: false },
  { name: 'Zero tax', F: 100, T: 0, tax: 0, S: false, inc: false },
];

for (const c of cases) {
  const g = _finalGst(c.F, c.T, c.tax, 0, 0, 0, 2.5, 2.5, 5, c.S, c.inc);
  console.log(c.name, g);
}
