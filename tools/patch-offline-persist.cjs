/**
 * Fix offline data disappearing after app close:
 * 1) Flush localStorage immediately on every local save (no debounce-only writes)
 * 2) Persist stable companyId across sessions (app_offline_company_id fallback)
 * 3) pagehide flush for mobile PWA
 */
const fs = require('fs');

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js';
const storePath = 'c:/project/Anna_sandra-main/dist/assets/localJsonStore-CVmiFbPM.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';

let total = 0;

function rep(path, oldStr, newStr, label) {
  let s = fs.readFileSync(path, 'utf8');
  if (s.includes(newStr)) {
    console.log('Already:', label);
    return false;
  }
  if (!s.includes(oldStr)) {
    console.warn('MISSING:', label);
    return false;
  }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(path, s);
  console.log('Patched:', label);
  total++;
  return true;
}

// 1) Immediate localStorage flush on mutate
rep(
  storePath,
  'p=(e,n)=>{const t=l.get(e);if(!t)return;t.dirty=!0;const i=Number.isFinite(n?.debounceMs)?n.debounceMs:t.debounceMs;t.debounceMs=i,b(e,i)}',
  'p=(e,n)=>{const t=l.get(e);if(!t)return;t.dirty=!0;c(e)}',
  'localJsonStore immediate flush on mutate'
);

rep(
  storePath,
  'window.addEventListener("beforeunload",e),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&e()})',
  'window.addEventListener("beforeunload",e),window.addEventListener("pagehide",e),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&e()})',
  'localJsonStore pagehide flush'
);

// 2) Stable companyId across app restarts
rep(
  indexPath,
  '_e=()=>{const e=qt(),t=Ps(e);return Cs(e,t),t}',
  '_e=()=>{const e=qt(),t=Ps(e);Cs(e,t);if(t)try{localStorage.setItem("app_offline_company_id",t)}catch(_s){}return t||(()=>{try{return localStorage.getItem("app_offline_company_id")||null}catch{return null}})()}',
  'index _e persist app_offline_company_id'
);

rep(
  indexPath,
  'ks=(e,t="auto")=>{const a=qt(),s=_e(),r=t==="company"?s:t==="user"?a?.uid:s||a?.uid;return r?`${e}_${r}`:`${e}_anonymous`}',
  'ks=(e,t="auto")=>{const a=qt(),s=_e()||(()=>{try{return localStorage.getItem("app_offline_company_id")}catch{return null}})(),r=t==="company"?s:t==="user"?a?.uid:s||a?.uid;return r?`${e}_${r}`:`${e}_anonymous`}',
  'index ks fallback storage key'
);

// 3) Stronger bootstrap in index.html
let html = fs.readFileSync(htmlPath, 'utf8');
const bootstrapOld = `          u.companyId = slug;
          localStorage.setItem('user', JSON.stringify(u));
        } catch (e) {}`;
const bootstrapNew = `          u.companyId = slug;
          localStorage.setItem('user', JSON.stringify(u));
          localStorage.setItem('app_offline_company_id', slug);
        } catch (e) {}
      })();
    </script>
    <script>
      /* Restore minimal session for offline reopen when user blob was cleared */
      (function () {
        try {
          if (localStorage.getItem('user')) return;
          var cid = localStorage.getItem('app_offline_company_id');
          if (!cid) return;
          localStorage.setItem('user', JSON.stringify({
            uid: 'offline-local',
            email: '',
            displayName: 'Offline User',
            companyId: cid,
            role: 'super_admin',
            status: 'active'
          }));
        } catch (e) {}`;

if (html.includes('app_offline_company_id', html.indexOf('Ensure user.companyId'))) {
  console.log('Already: index.html offline bootstrap v2');
} else if (html.includes(bootstrapOld)) {
  html = html.replace(bootstrapOld, bootstrapNew);
  fs.writeFileSync(htmlPath, html);
  console.log('Patched: index.html offline bootstrap v2');
  total++;
} else {
  console.warn('MISSING: index.html bootstrap anchor');
}

if (total > 0) {
  const html2 = fs.readFileSync(htmlPath, 'utf8');
  const verMatch = html2.match(/index-jCsVk30s\.js\?v=(\d+)/);
  if (verMatch) {
    const next = String(Number(verMatch[1]) + 1);
    const bumped = html2.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
    fs.writeFileSync(htmlPath, bumped);
    console.log('Bumped cache version to', next);
  }
}

console.log('Done,', total, 'patch(es)');
process.exit(total > 0 ? 0 : 1);
