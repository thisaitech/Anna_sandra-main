/**
 * Generate dist/sw.js — must only use APIs exported by workbox-b51dd497.js:
 * precacheAndRoute, cleanupOutdatedCaches, NavigationRoute, createHandlerBoundToURL,
 * registerRoute, NetworkFirst, ExpirationPlugin, clientsClaim
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const distDir = path.join(__dirname, '..', 'dist');
const indexHtml = path.join(distDir, 'index.html');
const swPath = path.join(distDir, 'sw.js');

function hashFile(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

function walk(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'local-dev') continue;
      out.push(...walk(full, rel));
    } else {
      out.push({ rel: rel.replace(/\\/g, '/'), full });
    }
  }
  return out;
}

const skipExt = new Set(['.map', '.disabled']);
const skipNames = new Set(['sw.js', 'sw.js.map']);

const entries = [];
for (const { rel, full } of walk(distDir)) {
  const ext = path.extname(rel).toLowerCase();
  if (skipExt.has(ext) || skipNames.has(path.basename(rel))) continue;
  if (rel.startsWith('local-dev/') || rel === 'dev-login.html') continue;
  const entry = { url: rel, revision: null };
  if (
    rel === 'index.html' ||
    rel === 'pwa-install-controller.js' ||
    rel === 'offline-status-bar.js' ||
    rel === 'offline-sync-bridge.js' ||
    rel.startsWith('assets/Login-') ||
    (rel.startsWith('assets/') && /\.(js|css)$/.test(rel))
  ) {
    entry.revision = hashFile(full);
  }
  entries.push(entry);
}
entries.sort((a, b) => a.url.localeCompare(b.url));

// Match sw.js.disabled format (object entries with url/revision keys)
const precache = entries.map((e) =>
  e.revision ? `{url:"${e.url}",revision:"${e.revision}"}` : `{url:"${e.url}",revision:null}`
);

const sw = `if(!self.define){let s,e={};const l=(l,i)=>(l=new URL(l+".js",i).href,e[l]||new Promise(e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()}).then(()=>{let s=e[l];if(!s)throw new Error(\`Module \${l} didn't register its module\`);return s}));self.define=(i,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let t={};const u=s=>l(s,r),o={module:{uri:r},exports:t,require:u};e[r]=Promise.all(i.map(s=>o[s]||u(s))).then(s=>(n(...s),t))}}
define(["./workbox-b51dd497"],function(s){"use strict";
self.skipWaiting();
s.clientsClaim();
s.precacheAndRoute([${precache.join(',')}],{});
s.cleanupOutdatedCaches();
s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")));
});
`;

fs.writeFileSync(swPath, sw);
console.log('Wrote', swPath, 'with', entries.length, 'precached files');
console.log('index.html revision:', entries.find((e) => e.url === 'index.html')?.revision);
