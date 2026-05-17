/**
 * Fix invoice list showing pre-tax total (710) while edit shows tax-inclusive (746).
 */
const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js';
let s = fs.readFileSync(path, 'utf8');
let changes = 0;

const helpers = `function _lineItemTotal(it){const qty=Number(it?.quantity??it?.qty??1)||1;const price=Number(it?.rate??it?.price??0);const saved=Number(it?.total??it?.amount??0);const taxRate=Number(it?.tax??it?.taxRate??it?.gst??0)||0;const taxMode=it?.taxMode||"exclusive";const lineTax=Number(it?.taxAmount??0)||Number(it?.cgstAmount??0)+Number(it?.sgstAmount??0)+Number(it?.igstAmount??0);if(saved>0){if(taxRate>0&&taxMode==="exclusive"&&lineTax<0.01){const base=Math.round(price*qty*100)/100;if(Math.abs(saved-base)<0.02)return Math.round(base*(1+taxRate/100)*100)/100}return saved}if(taxMode==="inclusive")return Math.round(price*qty*100)/100;const base=Math.round(price*qty*100)/100;return taxRate>0?Math.round(base*(1+taxRate/100)*100)/100:base}function _billTotal(inv){if(!inv)return 0;const g=Number(inv.grandTotal??inv.total??0),sub=Number(inv.subtotal??inv.taxableAmount??0),tax=Number(inv.totalTaxAmount??inv.tax??0),cgst=Number(inv.cgstAmount??0),sgst=Number(inv.sgstAmount??0),igst=Number(inv.igstAmount??0),split=cgst+sgst+igst,computed=sub+(tax>0?tax:split),items=inv.items||inv.itemsList||[];let sum=0;if(Array.isArray(items))items.forEach(it=>{sum+=_lineItemTotal(it)});const best=Math.max(g,computed,sum);const ro=Number(inv.roundOffAmount??0);const withRo=ro?Math.round((best+ro)*100)/100:best;return Math.round(withRo*100)/100}function _recalcItemsForEdit(a,sellerState,customerState){return a.map(n=>{const o=Number(n.tax)||0;if(!(o>0))return n;const d=Number(n.price)||0,r=Number(n.qty)||1,x=Number(n.discount)||0,u=n.taxMode||"exclusive";let c;u==="inclusive"?c=d/(1+o/100):c=d;c=Math.round(c*100)/100;const m=(c-c*x/100)*r,b=hs({taxableAmount:m,gstRate:o,sellerState,customerState}),h=u==="inclusive"?d*r:m+b.totalTaxAmount;return{...n,basePrice:c,cgstPercent:b.cgstPercent,cgstAmount:b.cgstAmount,sgstPercent:b.sgstPercent,sgstAmount:b.sgstAmount,igstPercent:b.igstPercent,igstAmount:b.igstAmount,taxAmount:b.totalTaxAmount,total:h,totalAmount:Math.round((h+Number.EPSILON)*100)/100,amount:Math.round((h+Number.EPSILON)*100)/100}})}`;

if (!s.includes('function _lineItemTotal')) {
  if (s.includes('function _billTotal(inv)')) {
    s = s.replace(/function _billTotal\(inv\)\{[\s\S]*?return Math\.round\(best\*100\)\/100\}/, helpers);
    changes++;
    console.log('Replaced _billTotal block');
  } else {
    const anchor = 'import{o as rn,D as on}from"./localJsonStore-CVmiFbPM.js"';
    if (!s.includes(anchor)) throw new Error('anchor not found');
    s = s.replace(anchor, anchor + ';' + helpers);
    changes++;
    console.log('Injected helpers after import');
  }
} else {
  console.log('Helpers already present');
}

const calcOld = 'const A=_.basePrice!==void 0?_.basePrice:_.price';
const calcNew = 'const tm=_.taxMode||"exclusive",tp=Number(_.tax)||0,A=_.basePrice!==void 0?_.basePrice:tm==="inclusive"&&tp>0?_.price/(1+tp/100):_.price';
if (s.includes(calcOld)) {
  s = s.replace(calcOld, calcNew);
  changes++;
  console.log('Patched calculateTotals for inclusive taxMode');
} else if (s.includes(calcNew)) {
  console.log('calculateTotals patch already applied');
} else {
  console.warn('calculateTotals pattern not found');
}

const editLoadOld = 'Re(d);const x=(s.paymentMode';
const editLoadNew = 'Re(_recalcItemsForEdit(d,E().state||"Tamil Nadu",s.partyState||s.partyAddress?.state||""));const x=(s.paymentMode';
if (s.includes(editLoadOld)) {
  s = s.replace(editLoadOld, editLoadNew);
  changes++;
  console.log('Patched handleEditInvoice line recalc on load');
} else if (s.includes(editLoadNew)) {
  console.log('handleEditInvoice patch already applied');
} else {
  console.warn('handleEditInvoice Re(d) pattern not found');
}

fs.writeFileSync(path, s);
console.log('Done. Changes:', changes);
