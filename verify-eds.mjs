import { createRequire } from 'node:module'

const require = createRequire('/usr/local/lib/node_modules/')
const { chromium } = require('playwright')

const URL = 'http://localhost:8000/drafts/e2e.html'

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newContext({ ignoreHTTPSErrors: true }).then((c) => c.newPage())
page.on('console', (m) => console.log('  [page]', m.text()))
page.on('pageerror', (e) => console.log('  [pageerror]', e.message))

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForSelector('.form.block .tfs-form', { timeout: 10000 })

const summary = await page.evaluate(() => {
  const forms = [...document.querySelectorAll('.form.block .tfs-form')]
  return forms.map((f) => ({
    title: f.querySelector('.tfs-form-title')?.textContent,
    inputs: [...f.querySelectorAll('[name]')].map((el) => el.name),
    submit: f.querySelector('button[type="submit"]')?.textContent,
  }))
})
console.log('Forms on page:', JSON.stringify(summary, null, 2))

await page.screenshot({ path: 'verify-eds-screenshot.png', fullPage: true })

await browser.close()
