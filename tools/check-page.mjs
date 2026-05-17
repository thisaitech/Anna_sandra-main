import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:3002/'
const errors = []
const logs = []

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}`))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`)
  logs.push(`${msg.type()}: ${msg.text()}`)
})

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(5000)

const rootHtml = await page.locator('#root').innerHTML()
const title = await page.title()

console.log('URL:', url)
console.log('Title:', title)
console.log('Root innerHTML length:', rootHtml.length)
console.log('Root preview:', rootHtml.slice(0, 200) || '(empty)')
console.log('\nErrors:', errors.length ? errors.join('\n') : '(none)')
console.log('\nLast logs:', logs.slice(-8).join('\n'))

await browser.close()
process.exit(errors.length && rootHtml.length < 50 ? 1 : 0)
