/**
 * Generate PNG icons required for Chrome PWA install (192 + 512).
 */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const svgPath = path.join(dist, 'icon.svg');

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('Installing sharp...');
    require('child_process').execSync('npm install sharp@0.33 --no-save', {
      cwd: path.join(__dirname),
      stdio: 'inherit',
    });
    sharp = require('sharp');
  }

  const svg = fs.readFileSync(svgPath);
  const sizes = [
    [192, 'icon-192x192.png'],
    [512, 'icon-512x512.png'],
    [180, 'icon-192x192.png'], // apple-touch uses 192 file
    [32, 'icon-32x32.png'],
    [16, 'icon-16x16.png'],
    [152, 'icon-152x152.png'],
    [144, 'icon-144x144.png'],
    [128, 'icon-128x128.png'],
    [72, 'icon-72x72.png'],
  ];

  for (const [size, name] of sizes) {
    const out = path.join(dist, name);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log('Wrote', name);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
