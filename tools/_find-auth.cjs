const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
for (const pat of ['isAuthenticated', 'setIsLoading', 'onAuthStateChanged', 'offline-local', 'userData']) {
  let i = 0;
  let n = 0;
  while ((i = s.indexOf(pat, i)) !== -1 && n < 6) {
    const ctx = s.slice(Math.max(0, i - 100), i + 150);
    if (pat === 'isAuthenticated' && (ctx.includes('useState') || ctx.includes('value:') || ctx.includes('Provider'))) {
      console.log('\n---', pat, i);
      console.log(ctx.replace(/\n/g, ' '));
      n++;
    } else if (pat !== 'isAuthenticated' && (ctx.includes('Auth') || ctx.includes('offline') || ctx.includes('loading'))) {
      console.log('\n---', pat, i);
      console.log(ctx.replace(/\n/g, ' '));
      n++;
    }
    i++;
  }
}
