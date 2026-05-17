import fs from 'node:fs'
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8')
console.log('patched isAuthenticated:', s.includes('isAuthenticated:!!t||localStorage.getItem("devAuth")==="1"'))
console.log('old isAuthenticated:', s.includes('isAuthenticated:!!t,'))
const i = s.indexOf('const w={user:t,userData:s')
console.log('provider value:', s.substring(i, i + 200))
