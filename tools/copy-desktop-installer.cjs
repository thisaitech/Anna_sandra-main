/**
 * Copy validated Windows installer into dist/downloads and write installer-manifest.json.
 * Usage: node tools/copy-desktop-installer.cjs
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const releaseExe = path.join(root, 'electron-build', 'release', 'Sandra ERP Setup 1.0.0.exe');
const outDir = path.join(root, 'dist', 'downloads', 'windows');
const outExe = path.join(outDir, 'Sandra_ERP_Setup.exe');
const manifestPath = path.join(root, 'dist', 'downloads', 'installer-manifest.json');
const electronOutDir = path.join(root, 'electron-build', 'dist', 'downloads', 'windows');
const electronOutExe = path.join(electronOutDir, 'Sandra_ERP_Setup.exe');

const STORAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/petshop-9dee5.firebasestorage.app/o/downloads%2FSandra_ERP_Setup.exe?alt=media';

execSync(`node "${path.join(__dirname, 'validate-installer.cjs')}" "${releaseExe}"`, {
  stdio: 'inherit',
  cwd: root,
});

const stat = fs.statSync(releaseExe);
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(releaseExe)).digest('hex');

for (const dir of [outDir, electronOutDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

fs.copyFileSync(releaseExe, outExe);
fs.copyFileSync(releaseExe, electronOutExe);

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : { version: '1.0.0' };

manifest.generatedAt = new Date().toISOString();
manifest.windows = {
  fileName: 'Sandra_ERP_Setup.exe',
  sizeBytes: stat.size,
  sha256,
  minSizeBytes: 50 * 1024 * 1024,
  localPath: '/downloads/windows/Sandra_ERP_Setup.exe',
  storageUrl: STORAGE_URL,
};

const apkSrc = path.join(root, 'dist', 'downloads', 'android', 'Sandra_ERP.apk');
if (!manifest.android) {
  manifest.android = {
    fileName: 'Sandra_ERP.apk',
  };
}
manifest.android.localPath = '/downloads/android/Sandra_ERP.apk';
manifest.android.available = fs.existsSync(apkSrc) && fs.statSync(apkSrc).size > 1024 * 1024;

const manifestJson = JSON.stringify(manifest, null, 2) + '\n';
fs.writeFileSync(manifestPath, manifestJson);

const electronDownloadsDir = path.join(root, 'electron-build', 'dist', 'downloads');
if (!fs.existsSync(electronDownloadsDir)) fs.mkdirSync(electronDownloadsDir, { recursive: true });
fs.writeFileSync(path.join(electronDownloadsDir, 'installer-manifest.json'), manifestJson);

console.log('Copied installer to:');
console.log(' ', outExe);
console.log(' ', electronOutExe);
console.log('Wrote manifest:', manifestPath);
console.log('SHA256:', sha256);
