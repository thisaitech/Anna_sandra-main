import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

await page.goto('http://localhost:3002/login', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.evaluate(() => {
  localStorage.setItem('devAuth', '1')
  localStorage.setItem('user', JSON.stringify({
    uid: 'dev-local-user',
    email: 'dev@sandra.local',
    displayName: 'Dev User',
    companyId: 'dev-company-local',
    role: 'super_admin',
  }))
})
await page.goto('http://localhost:3002/', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(12000)

const state = await page.evaluate(() => ({
  devAuth: localStorage.getItem('devAuth'),
  isAuthCheck: localStorage.getItem('devAuth') === '1',
  url: location.href,
  rootLen: document.getElementById('root')?.innerHTML?.length ?? 0,
  hasSignIn: document.body?.innerText?.includes('Sign In') ?? false,
  hasDashboard: document.body?.innerText?.includes('Dashboard') ?? false,
}))
console.log(JSON.stringify(state, null, 2))

await browser.close()
