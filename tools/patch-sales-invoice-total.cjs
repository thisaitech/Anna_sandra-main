const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js';
let s = fs.readFileSync(path, 'utf8');

const helper = `function _billTotal(inv){if(!inv)return 0;const g=Number(inv.grandTotal??inv.total??0),sub=Number(inv.subtotal??inv.taxableAmount??0),tax=Number(inv.totalTaxAmount??inv.tax??0),cgst=Number(inv.cgstAmount??0),sgst=Number(inv.sgstAmount??0),igst=Number(inv.igstAmount??0),split=cgst+sgst+igst,computed=sub+(tax>0?tax:split),items=inv.items||inv.itemsList||[];let sum=0;if(Array.isArray(items))items.forEach(it=>{sum+=Number(it.total??it.amount??0)});const best=Math.max(g,computed,sum);return Math.round(best*100)/100}`;

if (!s.includes('function _billTotal')) {
  const anchor = 'import{o as rn,D as on}from"./localJsonStore-CVmiFbPM.js"';
  if (!s.includes(anchor)) throw new Error('anchor not found for helper inject');
  s = s.replace(anchor, anchor + ';' + helper);
  console.log('Injected _billTotal helper');
}

const re = /Number\((\w+)\?\.grandTotal\|\|\1\?\.total\|\|0\)/g;
const matches = s.match(re) || [];
console.log('Replacing', matches.length, 'grandTotal patterns');
s = s.replace(re, '_billTotal($1)');

fs.writeFileSync(path, s);
console.log('Done');
