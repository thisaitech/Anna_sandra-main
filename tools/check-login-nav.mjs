import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('PAGE:', e.message))

await page.goto('http://localhost:3002/login', { waitUntil: 'domcontentloaded' })
await page.fill('input[type="email"]', 'dev@sandra.local')
await page.fill('input[type="password"]', 'dev123456')
await page.click('button[type="submit"]')

for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(1000)
  const url = page.url()
  const rootLen = (await page.locator('#root').innerHTML()).length
  const hasDash = await page.locator('text=Dashboard').count()
  console.log(`t+${i + 1}s url=${url} root=${rootLen} dash=${hasDash}`)
  if (url === 'http://localhost:3002/' && rootLen > 10000) break
}

await browser.close()
