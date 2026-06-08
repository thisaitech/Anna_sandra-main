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
const outDir = path.join(root, 'dist', 'downloads');
const outExe = path.join(outDir, 'Sandra_ERP_Setup.exe');
const manifestPath = path.join(outDir, 'installer-manifest.json');
const electronOutDir = path.join(root, 'electron-build', 'dist', 'downloads');
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

const apkSrc = path.join(electronOutDir, 'Sandra_ERP.apk');
const manifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  windows: {
    fileName: 'Sandra_ERP_Setup.exe',
    sizeBytes: stat.size,
    sha256,
    minSizeBytes: 50 * 1024 * 1024,
    localPath: '/downloads/Sandra_ERP_Setup.exe',
    storageUrl: STORAGE_URL,
  },
  android: {
    fileName: 'Sandra_ERP.apk',
    localPath: '/downloads/Sandra_ERP.apk',
    available: fs.existsSync(apkSrc) && fs.statSync(apkSrc).size > 1024 * 1024,
  },
  hostingNote:
    'Firebase Hosting (Spark) cannot serve .exe files. Live site must use storageUrl; local/Electron use localPath.',
};

const manifestJson = JSON.stringify(manifest, null, 2) + '\n';
fs.writeFileSync(manifestPath, manifestJson);
fs.writeFileSync(path.join(electronOutDir, 'installer-manifest.json'), manifestJson);

console.log('Copied installer to:');
console.log(' ', outExe);
console.log(' ', electronOutExe);
console.log('Wrote manifest:', manifestPath);
console.log('SHA256:', sha256);
