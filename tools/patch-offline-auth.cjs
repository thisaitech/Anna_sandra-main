/**
 * Fix offline app: keep cached user when Firestore profile unavailable;
 * skip cloud user fetch offline; faster auth bootstrap offline.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'dist/assets/index-jCsVk30s.js');
const loginPath = path.join(root, 'dist/assets/Login-CPnslZnX.js');
const htmlPath = path.join(root, 'dist/index.html');

let n = 0;
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
  n++;
  return true;
}

// 1) Do not clear local user when Firestore profile missing (offline / permission)
rep(
  indexPath,
  'const U=await ws(M.uid);U?(r(U),localStorage.setItem("user",JSON.stringify(U)),U.companyId&&(Ds(U.companyId),["admin","org_admin","super_admin"].includes(U.role)&&_s(U.companyId),await L(U.companyId,U.role))):(console.warn("[Auth] User data missing - clearing stored user"),r(null),localStorage.removeItem("user"))',
  'let U=null;try{if(typeof navigator!=="undefined"&&navigator.onLine)U=await ws(M.uid)}catch(_wE){console.warn("[Auth] Firestore user fetch failed — using cache",_wE)}if(!U){try{const _cu=localStorage.getItem("user");if(_cu){const _cp=JSON.parse(_cu);_cp&&(!_cp.uid||_cp.uid===M.uid)&&(U=_cp)}}catch(_cE){}}U?(r(U),localStorage.setItem("user",JSON.stringify(U)),U.companyId&&(localStorage.setItem("app_offline_company_id",U.companyId),Ds(U.companyId),["admin","org_admin","super_admin"].includes(U.role)&&_s(U.companyId),typeof navigator!=="undefined"&&navigator.onLine&&await L(U.companyId,U.role))):(console.warn("[Auth] User data missing - clearing stored user"),r(null),localStorage.removeItem("user"))',
  'auth: keep cached user when offline'
);

// 2) Faster auth loading when offline + cached session exists
rep(
  indexPath,
  'const k=window.setTimeout(()=>{v||(console.warn("Auth loading timeout: continuing without auth state"),i(!1))},8e3)',
  'const k=window.setTimeout(()=>{v||(console.warn("Auth loading timeout: continuing without auth state"),i(!1))},typeof navigator!=="undefined"&&!navigator.onLine?1500:8e3)',
  'auth: shorter timeout offline'
);

rep(
  indexPath,
  'if(h)try{r(JSON.parse(h))}catch(M){console.error("Failed to parse stored user data:",M)}let v=!1',
  'if(h)try{r(JSON.parse(h))}catch(M){console.error("Failed to parse stored user data:",M)}if(typeof navigator!=="undefined"&&!navigator.onLine&&h){i(!1)}let v=!1',
  'auth: stop loading spinner offline when cached user'
);

// 3) index.html: offline login skip (handled in dist/index.html bootstrap)
const loginSkip = "if (path === '/login' && localStorage.getItem('user'))";
if (!fs.readFileSync(htmlPath, 'utf8').includes(loginSkip)) {
  console.warn('MISSING: index.html offline login redirect — add manually');
} else {
  console.log('Already: index.html offline login redirect');
}

// bump caches
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/index-jCsVk30s\.js\?v=\d+/, (m) => {
  const v = parseInt(m.match(/\d+/)[0], 10) + 1;
  return `index-jCsVk30s.js?v=${v}`;
});
html = html.replace(/Login-CPnslZnX\.js/g, 'Login-CPnslZnX.js?v=49');
fs.writeFileSync(htmlPath, html);
console.log('Bumped index.html caches');

console.log('Total patches:', n);
