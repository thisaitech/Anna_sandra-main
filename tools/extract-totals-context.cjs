const fs = require('fs');
const q = fs.readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const i = q.indexOf('children:"Subtotal:"}),e.jsxs("span",{className:"font-medium text-gray-900",children:["₹",k.subtotal.toFixed(2)]');
console.log(q.slice(i - 200, i + 2500));
