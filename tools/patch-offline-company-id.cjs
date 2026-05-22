/**
 * Route party/item services through index _e() for companyId resolution
 * (derive from email/companyName when user.companyId is missing — common offline blocker).
 */
const fs = require('fs');

const patches = [
  {
    path: 'c:/project/Anna_sandra-main/dist/assets/partyService-Wzcg7Wjf.js',
    importOld:
      'import{r as Rt,S as p,t as b,v as D,n as _,C as T,w as v,x as It,D as at,z as $,y as rt,A as vt}from"./index-jCsVk30s.js"',
    importNew:
      'import{r as Rt,S as p,t as b,v as D,n as _,C as T,w as v,x as It,D as at,z as $,y as rt,A as vt,o as Ci}from"./index-jCsVk30s.js"',
    getterOld:
      'K=()=>{try{const t=localStorage.getItem("user");return t&&JSON.parse(t).companyId||null}catch{return null}}',
    getterNew: 'K=()=>{try{return Ci()}catch{return null}}',
    label: 'partyService companyId (K)',
  },
  {
    path: 'c:/project/Anna_sandra-main/dist/assets/itemService-sgFD7LVj.js',
    importOld:
      'import{r as Z,S as u,t as S,v as g,n as f,C as y,w as I,x as j,D as H,z as D,y as z,A as ee}from"./index-jCsVk30s.js"',
    importNew:
      'import{r as Z,S as u,t as S,v as g,n as f,C as y,w as I,x as j,D as H,z as D,y as z,A as ee,o as Ci}from"./index-jCsVk30s.js"',
    getterOld:
      'w=()=>{try{const e=localStorage.getItem("user");return e&&JSON.parse(e).companyId||null}catch{return null}}',
    getterNew: 'w=()=>{try{return Ci()}catch{return null}}',
    label: 'itemService companyId (w)',
  },
];

let total = 0;
for (const p of patches) {
  let s = fs.readFileSync(p.path, 'utf8');
  let n = 0;
  if (s.includes(p.importOld)) {
    s = s.replace(p.importOld, p.importNew);
    n++;
    console.log('Patched import:', p.label);
  } else if (s.includes(p.importNew)) {
    console.log('Already import:', p.label);
  } else {
    console.warn('MISSING import:', p.label);
  }
  if (s.includes(p.getterOld)) {
    s = s.replace(p.getterOld, p.getterNew);
    n++;
    console.log('Patched getter:', p.label);
  } else if (s.includes(p.getterNew)) {
    console.log('Already getter:', p.label);
  } else {
    console.warn('MISSING getter:', p.label);
  }
  if (n > 0) {
    fs.writeFileSync(p.path, s);
    total += n;
  }
}

// Remove duplicate Rq() from offline sync bootstrap
const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
let index = fs.readFileSync(indexPath, 'utf8');
if (index.includes('$t().catch(console.error);Bs();Rq();Rq();')) {
  index = index.replace(
    '$t().catch(console.error);Bs();Rq();Rq();',
    '$t().catch(console.error);Bs();'
  );
  fs.writeFileSync(indexPath, index);
  total++;
  console.log('Patched: remove duplicate Rq() bootstrap');
}

const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
if (total > 0) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
  if (verMatch) {
    const next = String(Number(verMatch[1]) + 1);
    html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
    fs.writeFileSync(htmlPath, html);
    console.log('Bumped cache version to', next);
  }
}

// Optional: bootstrap companyId in index.html before app loads
const htmlPath2 = 'c:/project/Anna_sandra-main/dist/index.html';
const bootstrapMarker = 'Ensure user.companyId exists for offline';
let html2 = fs.readFileSync(htmlPath2, 'utf8');
if (!html2.includes(bootstrapMarker)) {
  const inject =
    `    <script>
      /* Ensure user.companyId exists for offline/local services (mirrors index _e()) */
      (function () {
        try {
          var raw = localStorage.getItem('user');
          if (!raw) return;
          var u = JSON.parse(raw);
          if (u && u.companyId) return;
          var name = (u.companyName || '').trim();
          var email = (u.email || '').trim().toLowerCase();
          var slug = name;
          if (!slug && email) {
            var parts = email.split('@');
            slug = parts[0] && parts[1] ? parts[0] + '-' + parts[1] : email;
          }
          slug = (slug || 'default-company').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          u.companyId = slug;
          localStorage.setItem('user', JSON.stringify(u));
        } catch (e) {}
      })();
    </script>
`;
  const anchor = '    <script>\n      /* Local dev: block stale service worker';
  if (html2.includes(anchor)) {
    html2 = html2.replace(anchor, inject + anchor);
    fs.writeFileSync(htmlPath2, html2);
    total++;
    console.log('Patched: index.html companyId bootstrap');
  }
}

console.log('Done,', total, 'changes');
process.exit(total > 0 ? 0 : 1);
