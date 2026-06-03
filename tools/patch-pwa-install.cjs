/**
 * Fix PWA install on Login: capture prompt early, banner, hide when installed.
 */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const loginPath = path.join(dist, 'assets', 'Login-CPnslZnX.js');
const indexPath = path.join(dist, 'index.html');
const manifestPath = path.join(dist, 'manifest.json');
const webmanifestPath = path.join(dist, 'manifest.webmanifest');

let count = 0;

function rep(file, oldStr, newStr, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(newStr) && !oldStr) {
    console.log('Already:', label);
    return true;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return false;
  }
  fs.writeFileSync(file, s.replace(oldStr, newStr));
  console.log('Patched:', label);
  count++;
  return true;
}

const oldPwa =
  'a.useEffect(()=>{const s=t=>{t.preventDefault(),D(t)};return window.addEventListener("beforeinstallprompt",s),()=>{window.removeEventListener("beforeinstallprompt",s)}},[]);const V=async()=>{if(!P){d.info("To install: Click the install icon in your browser address bar, or use browser menu > Install App");return}P.prompt();const{outcome:s}=await P.userChoice;s==="accepted"&&d.success("App installed successfully!"),D(null)},';

const newPwa =
  'a.useEffect(()=>{const I=window;if(!I.__PWA_INSTALL__)I.__PWA_INSTALL__={deferred:null,installed:!1,bannerDismissed:!1};const w=I.__PWA_INSTALL__,Pn=()=>{try{return I.matchMedia("(display-mode: standalone)").matches||I.navigator.standalone===!0}catch(e){return!1}};w.installed=Pn();try{w.bannerDismissed=localStorage.getItem("pwa_banner_dismissed")==="1"}catch(e){}const s=t=>{t.preventDefault(),w.deferred=t,D(t),I.dispatchEvent(new Event("pwa-install-ready"))},r=()=>{w.deferred&&D(w.deferred)},o=()=>{w.installed=!0,w.deferred=null,D(null),Je(!1)},n=()=>{const t=Pn();w.installed=t,t&&(D(null),Je(!1))};w.deferred&&!P&&D(w.deferred),I.addEventListener("beforeinstallprompt",s),I.addEventListener("pwa-install-ready",r),I.addEventListener("appinstalled",o),I.addEventListener("pwa-installed",o),I.matchMedia&&I.matchMedia("(display-mode: standalone)").addEventListener("change",n);return()=>{I.removeEventListener("beforeinstallprompt",s),I.removeEventListener("pwa-install-ready",r),I.removeEventListener("appinstalled",o),I.removeEventListener("pwa-installed",o),I.matchMedia&&I.matchMedia("(display-mode: standalone)").removeEventListener("change",n)}},[]);const _pwaInstalled=()=>{try{return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0}catch(e){return!1}},_pwaCan=()=>!!P||!!(window.__PWA_INSTALL__&&window.__PWA_INSTALL__.deferred),V=async()=>{const s=P||(window.__PWA_INSTALL__&&window.__PWA_INSTALL__.deferred);if(!s){const ua=navigator.userAgent||"",ios=/iphone|ipad|ipod/i.test(ua);d.info(ios?"On iPhone/iPad: tap Share, then Add to Home Screen.":"Install: use the install icon in the address bar (Chrome/Edge), or Menu → Install app.",{duration:8e3});return}try{s.prompt();const{outcome:t}=await s.userChoice;t==="accepted"?(d.success("App installed successfully!"),window.__PWA_INSTALL__&&(window.__PWA_INSTALL__.installed=!0),D(null),Je(!1)):t==="dismissed"&&d.info("Install cancelled. You can try again anytime.")}catch(t){d.error("Install failed. Use browser menu → Install app.")}},';

rep(loginPath, oldPwa, newPwa, 'Login PWA handlers');

rep(
  loginPath,
  '[H,Q]=a.useState(!1),[o,j]=a.useState({});',
  '[H,Q]=a.useState(!1),[Ke,Je]=a.useState(()=>{try{return localStorage.getItem("pwa_banner_dismissed")!=="1"&&!window.matchMedia("(display-mode: standalone)").matches}catch(e){return!0}}),[o,j]=a.useState({});',
  'Login banner dismiss state'
);

const oldBtn =
  '}),e.jsxs(r.button,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},whileHover:{scale:1.05},whileTap:{scale:.95},onClick:V,className:"fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-primary border border-primary/20 rounded-xl shadow-lg hover:shadow-xl transition-all",title:"Install Desktop App",children:[e.jsx(ee,{size:20,weight:"bold"}),e.jsx("span",{className:"text-sm font-semibold hidden sm:inline",children:"Install App"})]}),e.jsxs(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"w-full max-w-md relative z-10",children:[e.jsxs("div",{className:"text-center mb-6",children:';

const newBtn =
  '}),!_pwaInstalled()&&e.jsxs(r.button,{type:"button",initial:{opacity:0,x:20},animate:{opacity:1,x:0},whileHover:{scale:1.05},whileTap:{scale:.95},onClick:s=>{s.preventDefault(),s.stopPropagation(),V()},className:"fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-primary border border-primary/20 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer pointer-events-auto touch-manipulation",style:{isolation:"isolate"},title:_pwaCan()?"Install Sandra ERP":"Click for install steps — or use the address-bar install icon",children:[e.jsx(ee,{size:20,weight:"bold"}),e.jsx("span",{className:"text-sm font-semibold hidden sm:inline",children:"Install App"})]}),e.jsxs(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"w-full max-w-md relative z-10 mt-14 sm:mt-0",children:[Ke&&!_pwaInstalled()&&e.jsxs(r.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:"mb-4 p-4 pr-10 rounded-2xl bg-white/90 border border-primary/20 shadow-sm relative",children:[e.jsx("button",{type:"button","aria-label":"Dismiss install banner",onClick:()=>{try{localStorage.setItem("pwa_banner_dismissed","1")}catch(e){}Je(!1)},className:"absolute top-2 right-2 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100",children:e.jsx(M,{size:18})}),e.jsxs("div",{className:"flex gap-3 items-start",children:[e.jsx(ee,{size:28,weight:"duotone",className:"text-primary shrink-0 mt-0.5"}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"font-semibold text-slate-800 text-sm",children:"Install Sandra ERP"}),e.jsx("p",{className:"text-xs text-slate-600 mt-1",children:"Works offline on your phone or desktop. Tap Install App (top right) or the button below."}),e.jsx("button",{type:"button",onClick:V,className:"mt-3 w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90",children:"Install now"})]})]})]}),e.jsxs("div",{className:"text-center mb-6",children:';

rep(loginPath, oldBtn, newBtn, 'Login install button + banner');

const bootstrap = `    <script>
      /* PWA: capture install prompt before React loads */
      (function () {
        if (!window.__PWA_INSTALL__) {
          window.__PWA_INSTALL__ = { deferred: null, installed: false, bannerDismissed: false };
        }
        function isStandalone() {
          try {
            return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
          } catch (e) {
            return false;
          }
        }
        window.__PWA_INSTALL__.installed = isStandalone();
        window.addEventListener(
          'beforeinstallprompt',
          function (e) {
            e.preventDefault();
            window.__PWA_INSTALL__.deferred = e;
            window.dispatchEvent(new Event('pwa-install-ready'));
          },
          { capture: true }
        );
        window.addEventListener('appinstalled', function () {
          window.__PWA_INSTALL__.installed = true;
          window.__PWA_INSTALL__.deferred = null;
          window.dispatchEvent(new Event('pwa-installed'));
        });
      })();
    </script>
`;

let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('capture install prompt before React')) {
  html = html.replace('<head>', '<head>\n' + bootstrap);
  fs.writeFileSync(indexPath, html);
  console.log('Patched: index.html PWA bootstrap');
  count++;
}

const manifestIcons = `  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]`;

for (const mp of [manifestPath, webmanifestPath]) {
  let m = fs.readFileSync(mp, 'utf8');
  if (m.includes('icon-192x192.png')) continue;
  m = m.replace(/"icons"\s*:\s*\[[\s\S]*?\]/, manifestIcons);
  fs.writeFileSync(mp, m);
  console.log('Patched:', path.basename(mp), 'icons');
  count++;
}

// Fix SW registration — don't unregister on every load after v3
const oldSwBlock = `      /* One-time: remove broken SW (CacheFirst bug), then register fixed sw.js */
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
      })();`;

const newSwBlock = `      /* Register service worker (required for PWA install) */
      (function () {
        if (!('serviceWorker' in navigator)) return;
        var host = location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') return;
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (reg) {
            console.log('[PWA] Service worker registered', reg.scope);
          }).catch(function (e) {
            console.warn('[PWA] Service worker registration failed', e);
          });
        });
      })();`;

if (html.includes('sw_fixed_v3')) {
  html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(oldSwBlock, newSwBlock);
  fs.writeFileSync(indexPath, html);
  console.log('Patched: index.html SW registration');
  count++;
}

const verMatch = fs.readFileSync(indexPath, 'utf8').match(/index-jCsVk30s\.js\?v=(\d+)/);
if (verMatch) {
  let h = fs.readFileSync(indexPath, 'utf8');
  const next = String(Number(verMatch[1]) + 1);
  h = h.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
  fs.writeFileSync(indexPath, h);
  console.log('Bumped cache version to', next);
}

require('child_process').execSync(`node --check "${loginPath}"`, { stdio: 'inherit' });
console.log('Done,', count, 'patch(es)');
