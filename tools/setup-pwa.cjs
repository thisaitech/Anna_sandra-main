/**
 * Prepare dist for installable offline PWA. Run before firebase deploy.
 *   node tools/setup-pwa.cjs
 */
const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
execSync('node tools/generate-pwa-icons.cjs', { cwd: root, stdio: 'inherit' });
execSync('node tools/generate-sw.cjs', { cwd: root, stdio: 'inherit' });
try {
  execSync('node tools/patch-pwa-login-delegate.cjs', { cwd: root, stdio: 'inherit' });
} catch {
  console.log('PWA login delegate patch already applied.');
}
try {
  execSync('node tools/patch-offline-persist.cjs', { cwd: root, stdio: 'inherit' });
} catch {
  console.log('Offline persist patches already applied.');
}
console.log('\nPWA ready. Deploy with: firebase deploy --only hosting');
