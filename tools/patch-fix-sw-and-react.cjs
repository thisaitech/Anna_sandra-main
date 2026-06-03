/**
 * Fix SW CacheFirst error + React removeChild on login navigation.
 */
const fs = require('fs');
const { execSync } = require('child_process');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const loginPath = 'c:/project/Anna_sandra-main/dist/assets/Login-CPnslZnX.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let total = 0;

function rep(file, oldStr, newStr, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label, 'in', file);
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  total++;
  return true;
}

// Remove route toast killer + SW toast component (SW registered via fixed sw.js only)
rep(
  indexPath,
  'n.jsx(Eo,{}),n.jsx(Nr,{}),n.jsx(Ao,',
  'n.jsx(Ao,',
  'remove Eo and Nr from app shell'
);

// Disable automatic SW registration in app (broken workbox-window + duplicate); use static sw.js
rep(
  indexPath,
  'function ko(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:s,onRegistered:r,onRegisteredSW:o,onRegisterError:i}=e,[c,d]=l.useState(!1),[p,u]=l.useState(!1),[m]=l.useState(()=>{const run=()=>Co({immediate:!0,onOfflineReady(){u(!0),s?.()},onNeedRefresh(){d(!0),a?.()},onRegistered:r,onRegisteredSW:o,onRegisterError:i});return typeof window!=="undefined"&&setTimeout(run,2500),run});return{needRefresh:[c,d],offlineReady:[p,u],updateServiceWorker:m}}',
  'function ko(){return{needRefresh:[!1,()=>{}],offlineReady:[!1,()=>{}],updateServiceWorker:async()=>{}}}',
  'disable in-app SW hook (use index.html register)'
);

// Login: AnimatePresence mode=wait causes removeChild when navigating after login
rep(loginPath, 'mode:"wait"', 'mode:"sync"', 'Login AnimatePresence sync mode');

// index.html: register fixed SW after load + one-time broken SW cleanup
let html = fs.readFileSync(htmlPath, 'utf8');
const swBootstrap = `    <script>
      /* One-time: remove broken SW (CacheFirst bug), then register fixed sw.js */
      (function () {
        if (!('serviceWorker' in navigator)) return;
        var key = 'sw_fixed_v3';
        function registerSw() {
          navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function (e) {
            console.warn('[sw] register failed', e);
          });
        }
        try {
          if (localStorage.getItem(key) === '1') { registerSw(); return; }
        } catch (e) {}
        navigator.serviceWorker.getRegistrations().then(function (regs) {
          return Promise.all(regs.map(function (r) { return r.unregister(); }));
        }).then(function () {
          try { localStorage.setItem(key, '1'); } catch (e) {}
          registerSw();
        }).catch(registerSw);
      })();
    </script>
`;

if (!html.includes('sw_fixed_v3')) {
  const anchor = '<script type="module" crossorigin src="/assets/index-jCsVk30s.js';
  if (html.includes(anchor)) {
    html = html.replace(anchor, swBootstrap + '  ' + anchor);
    console.log('Patched: index.html SW register');
    total++;
  }
}

if (total > 0 || !html.includes('sw_v3_registered')) {
  fs.writeFileSync(htmlPath, html);
}

execSync('node tools/generate-sw.cjs', { cwd: 'c:/project/Anna_sandra-main', stdio: 'inherit' });

let html2 = fs.readFileSync(htmlPath, 'utf8');
const verMatch = html2.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (verMatch) {
  const next = String(Number(verMatch[1]) + 1);
  html2 = html2.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
  fs.writeFileSync(htmlPath, html2);
  console.log('Bumped cache version to', next);
}

execSync(`node --check "${indexPath}"`, { stdio: 'inherit' });
execSync(`node --check "${loginPath}"`, { stdio: 'inherit' });

console.log('Done,', total, 'patch(es)');
