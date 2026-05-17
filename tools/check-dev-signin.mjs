import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('PAGE: ' + e.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text().slice(0, 300))
})

await page.goto('http://localhost:3002/dev-signin', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(10000)

const url = page.url()
const rootLen = (await page.locator('#root').innerHTML()).length
const body = (await page.locator('body').innerText()).slice(0, 200)
const auth = await page.evaluate(() => ({
  devAuth: localStorage.getItem('devAuth'),
  user: !!localStorage.getItem('user'),
}))

console.log('URL:', url)
console.log('root len:', rootLen)
console.log('auth:', auth)
console.log('body:', body.replace(/\s+/g, ' '))
console.log('errors:\n', errors.join('\n') || '(none)')

await browser.close()
process.exit(rootLen < 500 ? 1 : 0)
