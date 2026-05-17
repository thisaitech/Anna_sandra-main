import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()
const errors = []

page.on('pageerror', (e) => errors.push(e.message))

// Simulate dev-signin (no full reload from login form)
await page.goto('http://localhost:3002/dev-signin', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(6000)

const url = page.url()
const rootLen = (await page.locator('#root').innerHTML()).length
console.log('dev-signin flow - URL:', url, 'root len:', rootLen)
console.log('errors:', errors.filter(e => e.includes('Language')).join('; ') || '(none lang)')

await browser.close()
process.exit(rootLen < 100 ? 1 : 0)
