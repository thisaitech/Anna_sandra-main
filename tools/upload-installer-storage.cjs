/**
 * Upload Sandra_ERP_Setup.exe to Firebase Storage (public downloads/ path).
 * Requires: npm install in tools/ (firebase-admin), and Application Default Credentials
 *   e.g. set GOOGLE_APPLICATION_CREDENTIALS or run: gcloud auth application-default login
 *
 * Usage: node tools/upload-installer-storage.cjs
 */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const exe = path.join(root, 'dist', 'downloads', 'windows', 'Sandra_ERP_Setup.exe');
const bucket = 'petshop-9dee5.firebasestorage.app';
const dest = 'downloads/windows/Sandra_ERP_Setup.exe';

if (!fs.existsSync(exe)) {
  console.error('Run copy-desktop-installer.cjs first:', exe);
  process.exit(1);
}

execSync(`node "${path.join(__dirname, 'validate-installer.cjs')}" "${exe}"`, {
  stdio: 'inherit',
  cwd: root,
});

async function main() {
  const admin = require(path.join(__dirname, 'node_modules', 'firebase-admin'));
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: 'petshop-9dee5',
      storageBucket: bucket,
    });
  }

  const bucketRef = admin.storage().bucket();
  await bucketRef.upload(exe, {
    destination: dest,
    metadata: {
      contentType: 'application/vnd.microsoft.portable-executable',
      cacheControl: 'public, max-age=3600',
    },
    public: true,
  });

  const file = bucketRef.file(dest);
  try {
    await file.makePublic();
  } catch (_) {
    /* public read may already be allowed via storage.rules */
  }

  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(dest)}?alt=media`;
  console.log('Upload complete.');
  console.log('Public URL:', publicUrl);
  console.log('Deploy storage rules: firebase deploy --only storage');
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  console.error(
    'Alternative: Firebase Console → Storage → upload to downloads/Sandra_ERP_Setup.exe'
  );
  process.exit(1);
});
