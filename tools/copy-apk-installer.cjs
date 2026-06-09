/**
 * Copy Android APK into dist/downloads and update installer-manifest.json.
 * Usage: node tools/copy-apk-installer.cjs [path-to-apk]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const candidates = [
  process.argv[2],
  path.join(root, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'),
  path.join(root, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk'),
  path.join(root, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk'),
].filter(Boolean);

const apkSrc = candidates.find((p) => fs.existsSync(p) && fs.statSync(p).size > 1024 * 1024);
const outDir = path.join(root, 'dist', 'downloads', 'android');
const outApk = path.join(outDir, 'Sandra_ERP.apk');
const ebOut = path.join(root, 'electron-build', 'dist', 'downloads', 'android', 'Sandra_ERP.apk');
const manifestPath = path.join(root, 'dist', 'downloads', 'installer-manifest.json');

if (!apkSrc) {
  console.error('No APK found (need >1MB). Build with: .\\build-android-apk.ps1');
  process.exit(1);
}

const stat = fs.statSync(apkSrc);
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(apkSrc)).digest('hex');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(apkSrc, outApk);
fs.mkdirSync(path.dirname(ebOut), { recursive: true });
fs.copyFileSync(apkSrc, ebOut);

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : { version: '1.0.0', windows: {} };

manifest.android = {
  fileName: 'Sandra_ERP.apk',
  sizeBytes: stat.size,
  sha256,
  minSizeBytes: 5 * 1024 * 1024,
  localPath: '/downloads/android/Sandra_ERP.apk',
  storageUrl:
    'https://firebasestorage.googleapis.com/v0/b/petshop-9dee5.firebasestorage.app/o/downloads%2FSandra_ERP.apk?alt=media',
  available: true,
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(
  path.join(root, 'electron-build', 'dist', 'downloads', 'installer-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n'
);

console.log('APK copied:', outApk);
console.log('Size:', stat.size, 'SHA256:', sha256);
