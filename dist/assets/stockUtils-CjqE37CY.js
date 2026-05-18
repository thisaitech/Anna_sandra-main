const e=t=>{const r=Number(t);return Number.isNaN(r)?0:r},n=t=>{const r=e(t.reorderPoint),o=e(t.lowStockAlert);return r>0?r:o>0?o:0},s=t=>{const r=e(t.stock),o=n(t);return r>0&&o>0&&r<=o},c=t=>t.filter(s);export{c as g};
//# sourceMappingURL=stockUtils-CjqE37CY.js.map
