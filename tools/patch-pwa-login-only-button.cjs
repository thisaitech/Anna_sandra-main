/**
 * PWA install button: show only on /login (not dashboard, POS, etc.)
 */
const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, '..', 'dist', 'pwa-install-controller.js');
const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

let s = fs.readFileSync(controllerPath, 'utf8');

if (s.includes('function isLoginPage()')) {
  console.log('Already patched: login-only install button');
} else {
  const anchor = '  function updateButton() {\n    var btn = document.getElementById(BTN_ID);\n    if (!btn) return;\n    if (api.state === \'standalone\') {';
  const insert =
    '  function isLoginPage() {\n    try {\n      var p = (window.location.pathname || \'\').replace(/\\/$/, \'\') || \'/\';\n      return p === \'/login\';\n    } catch (e) {\n      return false;\n    }\n  }\n\n  function hookSpaNavigation() {\n    if (window.__PWA_LOGIN_ROUTE_HOOK__) return;\n    window.__PWA_LOGIN_ROUTE_HOOK__ = true;\n    var push = history.pushState;\n    var replace = history.replaceState;\n    history.pushState = function () {\n      var r = push.apply(history, arguments);\n      updateButton();\n      return r;\n    };\n    history.replaceState = function () {\n      var r = replace.apply(history, arguments);\n      updateButton();\n      return r;\n    };\n    window.addEventListener(\'popstate\', updateButton);\n  }\n\n  function updateButton() {\n    var btn = document.getElementById(BTN_ID);\n    if (!btn) return;\n    if (!isLoginPage()) {\n      btn.style.display = \'none\';\n      return;\n    }\n    if (api.state === \'standalone\') {';

  if (!s.includes(anchor)) {
    console.error('MISSING: updateButton anchor in pwa-install-controller.js');
    process.exit(1);
  }
  s = s.replace(anchor, insert);
  s = s.replace('  function boot() {\n    injectButton();', '  function boot() {\n    hookSpaNavigation();\n    injectButton();');
  fs.writeFileSync(controllerPath, s);
  console.log('Patched: login-only install button');
}

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/pwa-install-controller\.js\?v=\d+/, 'pwa-install-controller.js?v=5');
fs.writeFileSync(indexPath, html);
console.log('Bumped pwa-install-controller cache to v=5');
