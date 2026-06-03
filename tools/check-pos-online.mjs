import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3002';
const errors = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}`));

await page.goto(`${base}/dev-signin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(1500);

await page.goto(`${base}/pos?action=new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);

const text = await page.locator('#root').innerText();
const hasPos = /POS|Loading POS|Customer|Add to cart|Token/i.test(text);
const rootLen = text.trim().length;

console.log('root text length:', rootLen);
console.log('looks like POS:', hasPos);
if (errors.length) console.log('errors:', errors.slice(0, 5));

await browser.close();
process.exit(hasPos && rootLen > 20 && errors.length === 0 ? 0 : 1);
