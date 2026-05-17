import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text())
})

await page.goto('http://localhost:3002/', { waitUntil: 'networkidle', timeout: 60000 })
await page.evaluate(() => {
  localStorage.setItem('devAuth', '1')
  localStorage.setItem('user', JSON.stringify({
    uid: 'dev-local-user',
    email: 'dev@sandra.local',
    displayName: 'Dev User',
    companyName: 'Sandra Software',
    companyId: 'dev-company-local',
    role: 'super_admin',
    status: 'active',
  }))
})
await page.reload({ waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(8000)

const rootLen = (await page.locator('#root').innerHTML()).length
const text = (await page.locator('body').innerText()).slice(0, 400)
console.log('root len:', rootLen)
console.log('body:', text.replace(/\s+/g, ' ').trim())
console.log('errors:', errors.slice(0, 15).join('\n') || '(none)')

await browser.close()
process.exit(rootLen < 500 ? 1 : 0)
