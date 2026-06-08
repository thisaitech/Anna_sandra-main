const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
// find export default or function component end
const terms = ['pe==="list"', 'Ut&&', 'pos_viewMode', 'localStorage.getItem("pos', 'return e.jsx("div',{className:"flex flex-col h'];
for (const t of terms) {
  let i = 0;
  let n = 0;
  while ((i = s.indexOf(t, i)) !== -1 && n < 4) {
    console.log('\n', t, n, i);
    console.log(s.slice(Math.max(0, i - 30), i + 150).replace(/\n/g, ' '));
    i++;
    n++;
  }
}
