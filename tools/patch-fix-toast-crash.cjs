/**
 * Fix React removeChild crash: duplicate toast libraries fighting on login redirect.
 * App had Sonner (In + Lr) + react-hot-toast (Po) + aggressive Nr route dismisser.
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let total = 0;

function rep(oldStr, newStr, label) {
  let s = fs.readFileSync(indexPath, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(indexPath, s);
  console.log('Patched:', label);
  total++;
  return true;
}

// Remove react-hot-toast Toaster (keep Sonner In only)
rep(
  'n.jsx(Lr,{position:"bottom-left"}),n.jsx(In,{position:"top-center"',
  'n.jsx(In,{position:"top-center"',
  'remove duplicate Sonner Lr toaster'
);

rep(
  'n.jsx(Po,{position:"top-center",toastOptions:{className:"font-medium",style:{background:"white",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"16px"},success:{iconTheme:{primary:"#10b981",secondary:"white"}}}}),',
  '',
  'remove react-hot-toast Po toaster'
);

// Nr: stop brutal dismissAll on route change (causes removeChild during login redirect)
rep(
  'Nr=()=>{const e=Ta(),t=l.useRef(!0);return l.useEffect(()=>{if(t.current){t.current=!1;return}O.dismiss(),Na.dismissAll();try{const a=require("react-hot-toast");a&&a.dismiss&&a.dismiss()}catch{}},[e.pathname]),l.useEffect(()=>()=>{O.dismiss(),Na.dismissAll()},[]),null}',
  'Nr=()=>{const e=Ta(),t=l.useRef(!0);return l.useEffect(()=>{if(t.current){t.current=!1;return}const id=setTimeout(()=>{try{O.dismiss()}catch(_e){}},100);return()=>clearTimeout(id)},[e.pathname]),null}',
  'Nr gentle dismiss on route change only'
);

// Eo: no sonner spam when SW registers right after login
rep(
  'return Ge.useEffect(()=>{e&&O.info("App is ready to work offline.")},[e]),Ge.useEffect(()=>{a&&O.info("New content available, click on reload button to update.",{action:{label:"Reload",onClick:()=>{r(!0)}},duration:1e4,onDismiss:()=>o()})},[a,r]),null}',
  'return null',
  'Eo disable SW toast side effects'
);

// Ir.withLoading: do not call dismissAll (clears DOM mid-animation)
rep(
  'if(this.activeToasts.has(t))return O.info("Operation already in progress...",{duration:2e3}),null;O.dismiss(),this.dismissAll();const r=O.loading(s.loading)',
  'if(this.activeToasts.has(t))return O.info("Operation already in progress...",{duration:2e3}),null;const r=O.loading(s.loading)',
  'Ir.withLoading skip dismissAll'
);

if (total > 0) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
  if (verMatch) {
    const next = String(Number(verMatch[1]) + 1);
    html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
    fs.writeFileSync(htmlPath, html);
    console.log('Bumped cache version to', next);
  }
}

console.log('Done,', total, 'patch(es)');
process.exit(total > 0 ? 0 : 1);
