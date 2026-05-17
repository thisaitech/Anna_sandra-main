import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('PAGE: ' + e.message + '\n' + (e.stack || '').slice(0, 500)))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text())
})

await page.goto('http://localhost:3002/login', { waitUntil: 'domcontentloaded' })
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
await page.goto('http://localhost:3002/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(15000)

console.log('root:', (await page.locator('#root').innerHTML()).length)
console.log('errors:\n', errors.join('\n---\n') || '(none)')

await browser.close()
