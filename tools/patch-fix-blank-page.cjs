/**
 * Fix blank page + React removeChild error after login:
 * - Stop SW from hard-reloading during navigation
 * - Defer SW registration until app is stable
 * - Remove StrictMode double-mount (portal/toast conflicts)
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let total = 0;

function rep(path, oldStr, newStr, label) {
  let s = fs.readFileSync(path, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(path, s);
  console.log('Patched:', label);
  total++;
  return true;
}

rep(
  indexPath,
  'c.addEventListener("activated",m=>{(m.isUpdate||m.isExternal)&&window.location.reload()})',
  'c.addEventListener("activated",()=>{})',
  'disable SW reload on activate'
);

rep(
  indexPath,
  'function ko(e={}){const{immediate:t=!0,onNeedRefresh:a',
  'function ko(e={}){const{immediate:t=!1,onNeedRefresh:a',
  'defer SW register (immediate:false)'
);

rep(
  indexPath,
  'createRoot(document.getElementById("root")).render(n.jsx(Ge.StrictMode,{children:n.jsx(ti,{})}))',
  'createRoot(document.getElementById("root")).render(n.jsx(ti,{}))',
  'remove StrictMode (fixes removeChild crash)'
);

rep(
  indexPath,
  'return await G(o,u,{merge:!0}),u}catch(o){return console.warn("Firestore user sync failed after successful auth:",o),r}',
  'try{u.companyId&&localStorage.setItem("app_offline_company_id",u.companyId)}catch(_cid){}return await G(o,u,{merge:!0}),u}catch(o){try{r.companyId&&localStorage.setItem("app_offline_company_id",r.companyId)}catch(_cid2){}return console.warn("Firestore user sync failed after successful auth:",o),r}',
  'persist app_offline_company_id on login'
);

// Defer SW registration after first paint
rep(
  indexPath,
  'const[c,d]=l.useState(!1),[p,u]=l.useState(!1),[m]=l.useState(()=>Co({immediate:t,onOfflineReady(){u(!0),s?.()},onNeedRefresh(){d(!0),a?.()},onRegistered:r,onRegisteredSW:o,onRegisterError:i}));',
  'const[c,d]=l.useState(!1),[p,u]=l.useState(!1),[m]=l.useState(()=>{const _reg=()=>Co({immediate:!0,onOfflineReady(){u(!0),s?.()},onNeedRefresh(){d(!0),a?.()},onRegistered:r,onRegisteredSW:o,onRegisterError:i});if(typeof window!=="undefined"){if(document.readyState==="complete")setTimeout(_reg,2500);else window.addEventListener("load",()=>setTimeout(_reg,2500),{once:!0})}return _reg});',
  'defer SW register 2.5s after load'
);

let html = fs.readFileSync(htmlPath, 'utf8');

// Manifest credentials mode breaks install on some hosts
html = html.replace(
  '<link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />',
  '<link rel="manifest" href="/manifest.json" />'
);

// Remove duplicate install bar (conflicts with Login page + React)
if (html.includes('id="pwa-install-bar"')) {
  html = html.replace(
    /    <div id="pwa-install-bar"[\s\S]*?<\/div>\r?\n/,
    ''
  );
  html = html.replace(
    /    <script>\r?\n      \/\* Install to desktop[\s\S]*?<\/script>\r?\n/,
    ''
  );
  console.log('Patched: remove pwa-install-bar from index.html');
  total++;
}

if (total > 0 || html !== fs.readFileSync(htmlPath, 'utf8')) {
  fs.writeFileSync(htmlPath, html);
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
