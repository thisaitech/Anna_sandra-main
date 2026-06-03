/**
 * Full offline-first + PWA setup for dist/
 * Run: node tools/setup-offline-first.cjs
 */
const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

const steps = [
  'node tools/generate-pwa-icons.cjs',
  'node tools/patch-offline-fix-v2.cjs',
  'node tools/patch-offline-sync.cjs',
  'node tools/patch-offline-company-id.cjs',
  'node tools/patch-offline-services.cjs',
  'node tools/dedupe-offline-cache.cjs',
  'node tools/dedupe-rq.cjs',
  'node tools/patch-offline-persist.cjs',
  'node tools/patch-offline-read.cjs',
  'node tools/fix-party-syntax.cjs',
  'node tools/patch-offline-status.cjs',
  'node tools/patch-offline-critical.cjs',
  'node tools/patch-offline-reconnect-ui.cjs',
  'node tools/patch-dashboard-ui.cjs',
  'node tools/patch-pwa-login-delegate.cjs',
  'node tools/generate-sw.cjs',
];

console.log('Sandra ERP — offline-first + PWA setup\n');
for (const cmd of steps) {
  try {
    run(cmd);
  } catch (e) {
    console.log('(skip or already applied)', cmd);
  }
}
console.log('\nDone. Deploy: firebase deploy --only hosting');
console.log('Local test: http://localhost:3002/login?pwa-reset=1&fresh=1');
