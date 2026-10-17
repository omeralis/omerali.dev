import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(`${process.env.PLAYWRIGHT_MODULE_PATH}/index.mjs`).href : 'playwright');
const origin = process.env.BROWSER_ORIGIN || 'http://127.0.0.1:3017';
const output = process.env.THEME_ARTIFACT_DIR || 'test-results/themes';
const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const errors = [], results = [];
await fs.mkdir(output, { recursive: true });
try {
  for (const theme of ['dark', 'light']) for (const locale of ['en', 'ar']) {
    const context = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && /hydrat|mismatch/i.test(message.text())) errors.push(message.text()); });
    let releaseScripts;
    const scriptsReady = new Promise(resolve => { releaseScripts = resolve; });
    await page.route('**/*.js', async route => { await scriptsReady; await route.continue(); });
    await page.goto(`${origin}/${locale}`, { waitUntil: 'commit' });
    await page.locator('#projects .project-preview').first().waitFor();
    await page.waitForFunction(() => document.querySelector('.theme-toggle')?.value === 'system');
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    // Live OS changes affect System only, without a reload.
    const opposite = theme === 'dark' ? 'light' : 'dark';
    await page.emulateMedia({ colorScheme: opposite });
    releaseScripts();
    await page.waitForFunction(t => document.documentElement.dataset.theme === t, opposite);
    await page.unroute('**/*.js');
    await page.locator('.theme-toggle').selectOption(theme);
    await page.emulateMedia({ colorScheme: opposite });
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${origin}/${locale}`, { waitUntil: 'domcontentloaded' });
      await page.locator('#projects .project-preview').first().waitFor();
      assert.equal(await page.locator('#projects .project-preview').count(), 3);
      assert.equal(await page.locator('.capability-row').count(), 6);
      assert.equal(await page.locator('.career-entry').count(), 7);
      assert.equal(await page.locator('#contact a').getAttribute('href'), 'https://www.linkedin.com/in/omeraliabdallh');
      assert.equal(await page.locator('html').getAttribute('dir'), locale === 'ar' ? 'rtl' : 'ltr');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${theme}/${locale}/${width} homepage overflow`);
      const palette = await page.evaluate(() => {
        const color = name => { const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return /^#[\da-f]{3}$/i.test(value) ? `#${value.slice(1).split('').map(c => c + c).join('')}` : value; };
        return { bg: color('--bg'), surface: color('--surface'), brand: color('--brand'), accent: color('--accent') };
      });
      assert.equal(palette.bg, theme === 'dark' ? '#101113' : '#fafaf8');
      assert.equal(palette.surface, theme === 'dark' ? '#1c1d21' : '#ffffff');
      assert.equal(palette.brand, '#facc15');
      assert.equal(palette.accent, theme === 'dark' ? '#facc15' : '#854d0e');
      if (width !== 768) {
        await page.screenshot({ path: `${output}/${theme}-${locale}-${width}.png`, fullPage: true });
        await page.screenshot({ path: `${output}/${theme}-${locale}-${width}-hero.png` });
      }
      if (width === 360) {
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.locator('#main-nav a').nth(1).click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }
      await page.goto(`${origin}/${locale}/projects`, { waitUntil: 'domcontentloaded' });
      await page.locator('.project-preview').first().waitFor();
      assert.equal(await page.locator('.project-preview').count(), 3);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      for (const slug of ['grc-platform', 'cyber-imtithal', 'investor-vendor-portal']) {
        assert.equal((await page.goto(`${origin}/${locale}/projects/${slug}`, { waitUntil: 'domcontentloaded' })).status(), 200);
        await page.locator('.case-heading h1').waitFor();
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.equal(await page.locator('.case-heading .project-technologies li').count(), slug === 'grc-platform' ? 1 : 0);
        if (slug === 'grc-platform' && width === 360) await page.screenshot({ path: `${output}/${theme}-${locale}-detail-mobile.png`, fullPage: true });
      }
      results.push({ theme, locale, width, home: true, listing: 3, details: 3 });
    }
    await page.locator('.theme-toggle').selectOption('system');
    assert.equal(await page.evaluate(() => localStorage.getItem('theme')), null);
    assert.equal(await page.locator('html').getAttribute('data-theme'), opposite);
    await context.close();
  }
  assert.deepEqual(errors, []);
  const report = { origin, results, themePersistence: true, systemPreferenceChanges: true, hydrationErrors: errors };
  await fs.writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
