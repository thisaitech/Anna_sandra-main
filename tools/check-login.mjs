import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3002'
const errors = []
const logs = []

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()
page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}`))
page.on('console', (msg) => {
  const t = msg.text()
  if (msg.type() === 'error') errors.push(`CONSOLE: ${t}`)
  if (t.includes('Auth') || t.includes('error') || t.includes('Error')) logs.push(t)
})

await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(2000)

await page.fill('input[type="email"], input[placeholder*="Email" i]', 'dev@sandra.local')
await page.fill('input[type="password"]', 'dev123456')
await page.click('button[type="submit"]')

await page.waitForTimeout(6000)
const url = page.url()
const rootLen = (await page.locator('#root').innerHTML()).length
const bodyText = (await page.locator('body').innerText()).slice(0, 300)

console.log('Final URL:', url)
console.log('Root HTML length:', rootLen)
console.log('Body preview:', bodyText.replace(/\s+/g, ' ').trim())
console.log('localStorage devAuth:', await page.evaluate(() => localStorage.getItem('devAuth')))
console.log('localStorage user:', await page.evaluate(() => localStorage.getItem('user')?.slice(0, 80)))
console.log('\nErrors:', errors.length ? errors.join('\n') : '(none)')
console.log('\nAuth logs:', logs.slice(0, 10).join('\n') || '(none)')

await browser.close()
process.exit(rootLen < 100 ? 1 : 0)
