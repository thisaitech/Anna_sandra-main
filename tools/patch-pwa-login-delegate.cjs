/**
 * Delegate Login PWA UI to pwa-install-controller.js — no fake install button.
 */
const fs = require('fs');
const path = require('path');

const loginPath = path.join(__dirname, '..', 'dist', 'assets', 'Login-CPnslZnX.js');
const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

let s = fs.readFileSync(loginPath, 'utf8');

// Replace PWA useEffect + V handler with thin delegate
const pwaBlockStart = 'a.useEffect(()=>{const I=window;if(!I.__PWA_INSTALL__)';
const pwaBlockEnd =
  'catch(t){console.warn("[PWA install]",t),d.error("Install failed. Use the install icon in the address bar or Menu → Install app.")}},O=s=>';

const i0 = s.indexOf(pwaBlockStart);
const i1 = s.indexOf(pwaBlockEnd);
if (i0 < 0 || i1 < 0) {
  console.error('Could not find PWA block in Login');
  process.exit(1);
}

const newBlock =
  '[tt,nt]=a.useState(()=>window.__PWA__?window.__PWA__.state:"checking"),a.useEffect(()=>{const h=()=>{const w=window.__PWA__;w&&nt(w.state)};window.addEventListener("pwa-state-change",h);window.__PWA__&&window.__PWA__.refresh&&window.__PWA__.refresh();return()=>window.removeEventListener("pwa-state-change",h)},[]);const V=()=>{console.log("[PWA] Login Install click");const w=window.__PWA__||window.__PWA_INSTALL__;w&&w.install?w.install():console.warn("[PWA] install() not available")},O=s=>';

s = s.slice(0, i0) + newBlock + s.slice(i1);

// Replace install button + banner section
const oldUi =
  '!_pwaInstalled()&&e.jsxs(r.button,{type:"button",initial:{opacity:0,x:20},animate:{opacity:1,x:0},whileHover:{scale:1.05},whileTap:{scale:.95},onClick:s=>{s.preventDefault(),s.stopPropagation(),V()},className:"fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-primary border border-primary/20 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer pointer-events-auto touch-manipulation",style:{isolation:"isolate"},title:_pwaCan()?"Install Sandra ERP":"Click for install steps — or use the address-bar install icon",children:[e.jsx(ee,{size:20,weight:"bold"}),e.jsx("span",{className:"text-sm font-semibold hidden sm:inline",children:"Install App"})]}),e.jsxs(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"w-full max-w-md relative z-10 mt-14 sm:mt-0",children:[Ke&&!_pwaInstalled()&&e.jsxs(r.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:"mb-4 p-4 pr-10 rounded-2xl bg-white/90 border border-primary/20 shadow-sm relative z-20",children:[e.jsx("button",{type:"button","aria-label":"Dismiss install banner",onClick:s=>{s.stopPropagation(),(()=>{try{localStorage.setItem("pwa_banner_dismissed","1")}catch(e){}Je(!1)})()},className:"absolute top-2 right-2 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer z-10",children:e.jsx(M,{size:18})}),e.jsxs("div",{className:"flex gap-3 items-start",children:[e.jsx(ee,{size:28,weight:"duotone",className:"text-primary shrink-0 mt-0.5"}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"font-semibold text-slate-800 text-sm",children:"Install Sandra ERP"}),e.jsx("p",{className:"text-xs text-slate-600 mt-1",children:_pwaCan()?"Works offline. Tap Install now or use Install App (top right).":"Use the install / Open in app icon in your browser address bar, or click Install now for steps."}),e.jsx("button",{type:"button",onClick:s=>{s.stopPropagation(),V()},className:"mt-3 w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 cursor-pointer pointer-events-auto",children:"Install now"})]})]})]}),';

const newUi =
  'tt==="installable"&&e.jsxs(r.button,{type:"button",initial:{opacity:0,x:20},animate:{opacity:1,x:0},whileHover:{scale:1.05},whileTap:{scale:.95},onClick:s=>{s.preventDefault(),s.stopPropagation(),V()},className:"fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-primary border border-primary/20 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer pointer-events-auto touch-manipulation",style:{isolation:"isolate"},title:"Install Sandra ERP",children:[e.jsx(ee,{size:20,weight:"bold"}),e.jsx("span",{className:"text-sm font-semibold hidden sm:inline",children:"Install App"})]}),(tt==="already_installed"||tt==="needs_browser_ui")&&Ke&&e.jsxs(r.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:"fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[9998] p-4 pr-10 rounded-2xl bg-amber-50 border border-amber-200 shadow-md",children:[e.jsx("button",{type:"button","aria-label":"Dismiss",onClick:()=>{try{localStorage.setItem("pwa_banner_dismissed","1")}catch(e){}Je(!1)},className:"absolute top-2 right-2 p-1.5 rounded-lg text-amber-800 hover:bg-amber-100 cursor-pointer",children:e.jsx(M,{size:18})}),e.jsx("p",{className:"text-sm text-amber-950 font-medium pr-4",children:tt==="already_installed"?"App already installed — click Open in app in the address bar (next to the URL).":"Use the install or Open in app icon in the address bar, or Chrome menu → Install Sandra ERP."})]}),e.jsxs(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"w-full max-w-md relative z-10 "+(tt==="installable"||tt==="already_installed"||tt==="needs_browser_ui"?"mt-14 sm:mt-0":""),children:[';

if (!s.includes(oldUi)) {
  console.error('MISSING: Login install UI block');
  process.exit(1);
}
s = s.replace(oldUi, newUi);

// Remove unused state/helpers if still present
s = s.replace(/,\[Ze,et\]=a\.useState\(0\)/, '');
s = s.replace(/const _pwaInstalled=\(\)=>[^,]+,_pwaCan=\(\)=>[^,]+,/, '');

// Add tt,nt state if not present - we added in newBlock as [tt,nt]
// Remove Ke banner inside card - already handled above

fs.writeFileSync(loginPath, s);
console.log('Patched Login → delegates to __PWA__.install()');

let html = fs.readFileSync(indexPath, 'utf8');

const controllerTag = '<script src="/pwa-install-controller.js"></script>';

if (!html.includes('pwa-install-controller.js')) {
  html = html.replace(
    '<script>\n      /* PWA: capture install prompt before React loads */',
    controllerTag + '\n    <script>\n      /* PWA: legacy shim */'
  );
}

// Remove duplicate small bootstrap or replace with comment only
html = html.replace(
  /    <script>\s*\/\* PWA: capture install prompt[\s\S]*?appinstalled[\s\S]*?<\/script>\s*/,
  ''
);

// Register SW immediately (not only on load)
const oldReg =
  '      /* Register service worker (required for PWA install — localhost + production) */\n      (function () {\n        if (!(\'serviceWorker\' in navigator)) return;\n        window.addEventListener(\'load\', function () {\n          navigator.serviceWorker.register(\'/sw.js\', { scope: \'/\' }).then(function (reg) {\n            console.log(\'[PWA] Service worker registered\', reg.scope);\n          }).catch(function (e) {\n            console.warn(\'[PWA] Service worker registration failed\', e);\n          });\n        });\n      })();';

const newReg =
  `      /* Register service worker early (PWA installability) */
      (function () {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (reg) {
          console.log('[PWA] Service worker registered', reg.scope);
        }).catch(function (e) {
          console.warn('[PWA] Service worker registration failed', e);
        });
      })();`;

if (html.includes("window.addEventListener('load', function () {\n          navigator.serviceWorker.register")) {
  html = html.replace(oldReg, newReg);
}

html = html.replace(/index-jCsVk30s\.js\?v=\d+/, (m) => {
  const n = parseInt(m.match(/\d+/)[0], 10) + 1;
  return `index-jCsVk30s.js?v=${n}`;
});

fs.writeFileSync(indexPath, html);
console.log('Patched index.html');

require('child_process').execSync(`node --check "${loginPath}"`, { stdio: 'inherit' });
