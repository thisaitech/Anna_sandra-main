import fs from 'node:fs'

const indexPath = 'c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js'
const loginPath = 'c:/project/Anna_sandra-main/dist/assets/Login-CPnslZnX.js'
let s = fs.readFileSync(indexPath, 'utf8')

const authPatch = 'isAuthenticated:!!t||localStorage.getItem("devAuth")==="1"'
if (!s.includes(authPatch)) {
  if (!s.includes('isAuthenticated:!!t')) {
    console.error('isAuthenticated pattern not found')
    process.exit(1)
  }
  s = s.replace('isAuthenticated:!!t', authPatch)
}

// Keep dev session when Firebase has no user
const clearUser =
  'else r(null),d(null),u(Pe),localStorage.removeItem("user"),await ya()'
const clearUserPatched =
  'else{if(localStorage.getItem("devAuth")==="1"){const h=localStorage.getItem("user");if(h)try{r(JSON.parse(h))}catch(e){r(null)}else r(null)}else r(null);d(null),u(Pe),localStorage.getItem("devAuth")!=="1"&&localStorage.removeItem("user"),await ya()}}'

const clearUserPatchedMarker = 'localStorage.getItem("devAuth")!=="1"&&localStorage.removeItem("user")'
if (!s.includes(clearUserPatchedMarker)) {
  if (s.includes(clearUser)) {
    s = s.replace(clearUser, clearUserPatched)
  } else {
    console.warn('clear user branch not found; auth may still sign out dev user')
  }
}

fs.writeFileSync(indexPath, s)

// Patch login: inject dev check at start of submit handler - patch Login bundle
let login = fs.readFileSync(loginPath, 'utf8')
const devLoginFn = `async function devLocalLogin(email,password){const e=email.trim().toLowerCase(),p=password;if(e!=="dev@sandra.local"||p!=="dev123456")return null;const u={uid:"dev-local-user",email:e,displayName:"Dev User",companyName:"Sandra Software",companyId:"dev-company-local",role:"admin",status:"active",createdAt:new Date().toISOString()};localStorage.setItem("devAuth","1");localStorage.setItem("user",JSON.stringify(u));return u}`
if (!login.includes('dev@sandra.local')) {
  login = devLoginFn + login
  login = login.replace(
    'try{const t=n.trim().toLowerCase(),I=await me(t,l);',
    'try{const t=n.trim().toLowerCase();const devUser=await devLocalLogin(t,l);if(devUser){d.success(`Welcome back, ${devUser.displayName}!`),localStorage.setItem("user",JSON.stringify(devUser)),L?localStorage.setItem("rememberedEmail",t):localStorage.removeItem("rememberedEmail"),x("/");return}const I=await me(t,l);'
  )
  fs.writeFileSync(loginPath, login)
}

console.log('Dev auth patched. Use dev@sandra.local / dev123456')
