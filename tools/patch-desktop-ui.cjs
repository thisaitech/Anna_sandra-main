/**
 * Desktop UI parity: show left sidebar at lg+ (not only xl), Electron window defaults.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cssPath = path.join(root, 'dist/dashboard-layout.css');
const mainPath = path.join(root, 'electron-build/electron/main.js');

let css = fs.readFileSync(cssPath, 'utf8');
const block = `
/* Desktop/Electron: match web sidebar from 1024px (lg), not only 1280px (xl) */
@media (min-width: 1024px) {
  .hidden.xl\\:flex.fixed.left-0.top-0.bottom-0 {
    display: flex !important;
  }
}
body.sandra-desktop-app .hidden.xl\\:flex.fixed.left-0.top-0.bottom-0 {
  display: flex !important;
}
`;

if (!css.includes('Desktop/Electron: match web sidebar')) {
  css += block;
  fs.writeFileSync(cssPath, css);
  console.log('Patched: dashboard-layout.css sidebar visibility');
}

let main = fs.readFileSync(mainPath, 'utf8');
main = main.replace(
  /width: 1400,\s*height: 900,/,
  'width: 1536,\n    height: 960,'
);
main = main.replace(
  /minWidth: 1024,\s*minHeight: 600,/,
  'minWidth: 1280,\n    minHeight: 720,'
);
if (main.includes('openDevTools()')) {
  main = main.replace(
    /  \/\/ Open DevTools in development only\s*if \(!app\.isPackaged\) \{\s*mainWindow\.webContents\.openDevTools\(\)\s*\}/,
    '  // DevTools off by default so layout matches web (sidebar needs full width)'
  );
}
if (!main.includes('sandra-desktop-app')) {
  main = main.replace(
    "mainWindow.webContents.on('did-finish-load', () => {",
    `mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(
      "document.body&&document.body.classList.add('sandra-desktop-app')",
      true
    ).catch(() => {})`
  );
}
fs.writeFileSync(mainPath, main);
console.log('Patched: electron/main.js window + desktop class');
