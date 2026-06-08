/**
 * Validate Windows installer integrity (MZ header + minimum size).
 * Usage: node tools/validate-installer.cjs [path-to-exe]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MIN_BYTES = 50 * 1024 * 1024; // 50 MB — real NSIS build is ~77 MB
const defaultPath = path.join(
  __dirname,
  '..',
  'electron-build',
  'release',
  'Sandra ERP Setup 1.0.0.exe'
);

const filePath = path.resolve(process.argv[2] || defaultPath);

if (!fs.existsSync(filePath)) {
  console.error('Installer not found:', filePath);
  process.exit(1);
}

const stat = fs.statSync(filePath);
const fd = fs.openSync(filePath, 'r');
const magic = Buffer.alloc(2);
fs.readSync(fd, magic, 0, 2, 0);
fs.closeSync(fd);

const errors = [];
if (stat.size < MIN_BYTES) {
  errors.push(`Size ${stat.size} bytes is below minimum ${MIN_BYTES}`);
}
if (magic[0] !== 0x4d || magic[1] !== 0x5a) {
  errors.push(`Invalid PE magic (expected MZ, got ${magic.toString('ascii') || '??'})`);
}

const hash = crypto.createHash('sha256');
hash.update(fs.readFileSync(filePath));
const sha256 = hash.digest('hex');

if (errors.length) {
  console.error('INVALID installer:', filePath);
  errors.forEach((e) => console.error(' -', e));
  process.exit(1);
}

console.log('VALID installer');
console.log('  path:', filePath);
console.log('  size:', stat.size);
console.log('  sha256:', sha256);
console.log('  magic: MZ');
