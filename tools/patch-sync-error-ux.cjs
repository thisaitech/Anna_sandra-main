/**
 * Softer sync error UX: permission failures => retry message, dedupe banner text
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'dist/assets/index-jCsVk30s.js');
const barPath = path.join(root, 'dist/offline-status-bar.js');

let n = 0;
function rep(file, oldStr, newStr, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(file, s);
  console.log('Patched:', label);
  n++;
}

// When sync fails only with permission/retry, show helpful message not "sync returned false"
rep(
  indexPath,
  'await ha(r.id,"sync returned false")}}catch(_syncErr)',
  'await ha(r.id,"cloud sync blocked — data kept on device")}}catch(_syncErr)',
  'xa: softer sync-false message'
);

// Dedupe repeated store prefix in lastSyncError when saving
rep(
  indexPath,
  'pe({pendingSyncCount:s.total,syncStatus:"error",lastSyncError:_msg})',
  'pe({pendingSyncCount:s.total,syncStatus:"error",lastSyncError:(_msg||"").replace(/^(\\w+:\\s*)+/,"$1").slice(0,120)})',
  'xa: dedupe sync error string'
);

// Status bar: show single line, strip duplicate prefixes
let bar = fs.readFileSync(barPath, 'utf8');
const oldBar =
  "el.innerHTML = '<span>⚠ Sync issue</span><span>' + (cfg.lastSyncError || 'Retrying…') + '</span>';";
const newBar = `var _err = (cfg.lastSyncError || 'Retrying…').replace(/^(\\\\w+:\\\\s*){2,}/, '').replace(/ - /g, ' · ');
      el.innerHTML = '<span>⚠ Sync issue</span><span>' + _err + '</span>';`;
if (!bar.includes('_err = (cfg.lastSyncError')) {
  if (bar.includes(oldBar)) {
    bar = bar.replace(oldBar, newBar);
    fs.writeFileSync(barPath, bar);
    console.log('Patched: offline-status-bar dedupe');
    n++;
  } else {
    console.warn('MISSING: status bar pattern');
  }
} else {
  console.log('Already: status bar');
}

const htmlPath = path.join(root, 'dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/offline-status-bar\.js\?v=\d+/, (m) => {
  const v = parseInt(m.match(/\d+/)[0], 10) + 1;
  return `offline-status-bar.js?v=${v}`;
});
fs.writeFileSync(htmlPath, html);
console.log('Bumped offline-status-bar cache');
console.log('Total:', n);
