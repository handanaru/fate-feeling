import { chromium } from 'playwright';

const pages = [
  ['home', 'http://localhost:3200/'],
  ['test', 'http://localhost:3200/test.html'],
  ['result', 'http://localhost:3200/result.html'],
  ['experts', 'http://localhost:3200/experts.html'],
  ['ai', 'http://localhost:3200/ai.html'],
  ['community', 'http://localhost:3200/community.html'],
  ['ziwei', 'http://localhost:3200/ziwei.html'],
  ['philosophy', 'http://localhost:3200/philosophy.html']
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 2200 } });

for (const [name, url] of pages) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `/Users/joowon/.openclaw/media/outbound/fate-recap-${name}.png`, fullPage: true });
  await page.close();
}

await browser.close();
console.log('done');
