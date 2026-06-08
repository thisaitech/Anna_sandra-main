/**
 * Fix POS cash sale: list shows 71.40 + Partial when customer paid 68 in full.
 * Cause: item.amount = price*qty + taxAmount (71.40) but grandTotal/paid = 68.
 * Fix: _billTotal trusts grandTotal when payment matches; save uses item.total from POS.
 */
const fs = require('fs');
const path = require('path');

const salesPath = path.join(__dirname, '../dist/assets/Sales-DxyuXk9a.js');
const htmlPath = path.join(__dirname, '../dist/index.html');

let total = 0;

function rep(file, oldStr, newStr, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  total++;
  return true;
}

const billTotalOld =
  'function _billTotal(inv){if(!inv)return 0;const g=Number(inv.grandTotal??inv.total??0),sub=Number(inv.subtotal??inv.taxableAmount??0),tax=Number(inv.totalTaxAmount??inv.tax??0),cgst=Number(inv.cgstAmount??0),sgst=Number(inv.sgstAmount??0),igst=Number(inv.igstAmount??0),split=cgst+sgst+igst,computed=sub+(tax>0?tax:split),items=inv.items||inv.itemsList||[];let sum=0;if(Array.isArray(items))items.forEach(it=>{sum+=_lineItemTotal(it)});const best=Math.max(g,computed,sum);const ro=Number(inv.roundOffAmount??0);const withRo=ro?Math.round((best+ro)*100)/100:best;return Math.round(withRo*100)/100}';

const billTotalNew =
  'function _billTotal(inv){if(!inv)return 0;const g=Number(inv.grandTotal??inv.total??0),paid=Number(inv.payment?.paidAmount??inv.paidAmount??0),due=Number(inv.payment?.dueAmount??inv.dueAmount??0);if(g>0){if(Math.abs(paid+due-g)<0.05)return Math.round(g*100)/100;if(paid>0&&paid>=g-0.01&&(due<0.02||Math.abs(paid-g)<0.05))return Math.round(g*100)/100}const sub=Number(inv.subtotal??inv.taxableAmount??0),tax=Number(inv.totalTaxAmount??inv.tax??0),cgst=Number(inv.cgstAmount??0),sgst=Number(inv.sgstAmount??0),igst=Number(inv.igstAmount??0),split=cgst+sgst+igst,computed=sub+(tax>0?tax:split),items=inv.items||inv.itemsList||[];let sum=0;if(Array.isArray(items))items.forEach(it=>{sum+=_lineItemTotal(it)});const best=Math.max(g,computed,sum);const ro=Number(inv.roundOffAmount??0);const withRo=ro?Math.round((best+ro)*100)/100:best;return Math.round(withRo*100)/100}';

rep(salesPath, billTotalOld, billTotalNew, '_billTotal: trust POS grandTotal when paid in full');

// POS create: use line total from checkout, not price+tax double-count
rep(
  salesPath,
  'amount:i.price*i.quantity+i.taxAmount})),subtotal:n,discountAmount:t.discount.discountAmount',
  'amount:Number(i.total??i.amount??0)>0?Number(i.total??i.amount):(i.taxMode==="inclusive"?Math.round(i.price*i.quantity*100)/100:Math.round((i.price*i.quantity+(i.taxAmount||0))*100)/100)})),subtotal:n,discountAmount:t.discount.discountAmount',
  'POS create: item amount from checkout total'
);

// Split-payment create (ic)
rep(
  salesPath,
  'amount:i.price*i.quantity+i.taxAmount})),subtotal:n,discountAmount:t.discount.discountAmount,totalTaxAmount:o,grandTotal:t.grandTotal,paymentMode:',
  'amount:Number(i.total??i.amount??0)>0?Number(i.total??i.amount):(i.taxMode==="inclusive"?Math.round(i.price*i.quantity*100)/100:Math.round((i.price*i.quantity+(i.taxAmount||0))*100)/100)})),subtotal:n,discountAmount:t.discount.discountAmount,totalTaxAmount:o,grandTotal:t.grandTotal,paymentMode:',
  'POS split create: item amount from checkout total'
);

// Invoice update path (vl) item map
rep(
  salesPath,
  'amount:y.price*y.quantity+j}}),subtotal:n,discountAmount:r',
  'amount:Number(y.total??y.amount??0)>0?Number(y.total??y.amount):(y.taxMode==="inclusive"?Math.round(y.price*y.quantity*100)/100:Math.round((y.price*y.quantity+j)*100)/100)}}),subtotal:n,discountAmount:r',
  'POS update: item amount from checkout total'
);

let html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (m) {
  const v = parseInt(m[1], 10) + 1;
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${v}`);
  if (!html.includes('Sales-DxyuXk9a.js?v=')) {
    html = html.replace(/Sales-DxyuXk9a\.js/g, `Sales-DxyuXk9a.js?v=${v}`);
  } else {
    html = html.replace(/Sales-DxyuXk9a\.js\?v=\d+/g, `Sales-DxyuXk9a.js?v=${v}`);
  }
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped cache to v=' + v);
}

console.log('\nTotal patches:', total);
