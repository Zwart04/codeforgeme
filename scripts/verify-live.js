#!/usr/bin/env node
// Live verification for CodeForge Me — catches what curl CANNOT
const { chromium } = require('playwright');

const base = process.argv[2] || process.env.VERIFY_BASE_URL || 'http://localhost:3000';
const routeArg = process.env.VERIFY_ROUTES;
const routes = routeArg
  ? routeArg.split(',').map((r) => (r.startsWith('/') ? r : '/' + r))
  : ['/', '/login', '/register', '/dashboard', '/rooms/', '/rooms/create/', '/editor', '/playground/', '/snapshots/', '/analytics', '/finance', '/settings'];

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  } catch (e) {
    console.log('LAUNCH_FAIL', e.message);
    process.exit(2);
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));

  let totalErrors = 0;
  for (const r of routes) {
    errors.length = 0;
    try {
      await page.goto(base + r, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1500);
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
      const stillLoading = bodyText.includes('Loading...') && bodyText.length < 50;
      const status = errors.length === 0 && !stillLoading ? 'OK' : 'FAIL';
      if (errors.length) totalErrors += errors.length;
      console.log(`${r} → ${status} errors=${errors.length}${stillLoading ? ' STILL_LOADING' : ''}`);
      if (errors.length) console.log('    ', errors.slice(0, 3).join(' | ').slice(0, 300));
    } catch (e) {
      console.log(`${r} → NAV_FAIL ${e.message.slice(0, 100)}`);
      totalErrors += 1;
    }
  }
  await browser.close();
  console.log(totalErrors === 0 ? 'VERIFY_PASS' : `VERIFY_FAIL total=${totalErrors}`);
  process.exit(totalErrors === 0 ? 0 : 1);
})().catch((e) => { console.log('LAUNCH_FAIL', e.message); process.exit(2); });
