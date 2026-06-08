const fs = require('fs');
const idx = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
const login = fs.readFileSync('dist/assets/Login-CPnslZnX.js', 'utf8');
const keys = [
  'offline-local',
  'navigator.onLine',
  'onAuthStateChanged',
  'loading',
  'isAuthenticated',
  'ProtectedRoute',
  '/login',
  'enablePersistence',
  'Firebase not initialized',
  'ce=!1',
  'ye=!1',
];
for (const k of keys) {
  const c = (idx.match(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (c) console.log('index', k, c);
}
// auth provider snippet
const i = idx.indexOf('onAuthStateChanged');
if (i >= 0) console.log('\nauth:', idx.slice(i, i + 1500));

const j = login.indexOf('signInWithEmailAndPassword');
console.log('\nlogin signIn at', j, j >= 0 ? login.slice(j, j + 600) : 'none');
