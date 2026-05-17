const fs = require('fs');
const p = 'c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js';
let q = fs.readFileSync(p, 'utf8');
let n = 0;

if (q.includes('className:"flex gap-1 items-end mb-1"')) {
  q = q.split('className:"flex gap-1 items-end mb-1"').join('className:"hidden"');
  console.log('Hidden mobile tax row');
  n++;
}

const i = q.indexOf('return t>0?e.jsxs(e.Fragment,{children:[e.jsxs("motion.div",{className:"flex justify-between mb-1 text-xs"');
if (i < 0) {
  const i2 = q.indexOf('return t>0?e.jsxs(e.Fragment,{children:[e.jsxs("motion.div"');
  const i3 = q.indexOf('return t>0?e.jsxs(e.Fragment,{children:[e.jsxs("motion.div",{className:"flex justify-between mb-1 text-xs",children:[e.jsx("span",{children:"CGST:"})');
  const i4 = q.indexOf('return t>0?e.jsxs(e.Fragment');
  console.log('cgst search', i2, i3, i4);
  if (i4 >= 0) {
    const end = q.indexOf(':null})()', i4) + ':null})()'.length;
    const old = q.substring(i4, end);
    console.log('OLD:', old.slice(0, 200));
    q = q.substring(0, i4) + 'return null})()' + q.substring(end);
    n++;
  }
} else {
  const end = q.indexOf(':null})()', i) + ':null})()'.length;
  q = q.substring(0, i) + 'return null})()' + q.substring(end);
  n++;
}

fs.writeFileSync(p, q);
console.log('Patches:', n);
