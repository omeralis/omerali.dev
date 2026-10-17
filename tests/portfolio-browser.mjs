import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(`${process.env.PLAYWRIGHT_MODULE_PATH}/index.mjs`).href : 'playwright');
const origin = process.env.BROWSER_ORIGIN || 'http://127.0.0.1:3017';
const api = process.env.STRAPI_API_URL || 'https://api.omerali.dev';
const fixture = process.argv.includes('--fixture');
const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const page = await browser.newPage(), errors = [], evidence = [];
page.on('pageerror', e => errors.push(e.message));
const read = async (model, locale, params = {}) => { const url = new URL(`/api/${model}`, api); url.search = new URLSearchParams({ locale, status: 'published', 'pagination[pageSize]': '100', ...params }).toString(); const response = await fetch(url); assert.equal(response.status, 200); return (await response.json()).data; };
const invalidate = async model => { const response = await fetch(`${origin}/api/revalidate`, { method: 'POST', headers: { 'x-webhook-secret': 'fixture-webhook-secret-32-characters-long' }, body: JSON.stringify({ event: 'entry.publish', model }) }); assert.equal(response.status, 200); };
try {
  for (const locale of ['en', 'ar']) {
    const global = await read('global', locale, { 'populate[hero][populate][headline]': 'true', 'populate[contact]': 'true', 'populate[socialLinks]': 'true' });
    const about = await read('about', locale, { 'populate[paragraphs]': 'true', 'populate[stack][populate][items][populate][technology]': 'true' });
    const services = await read('services', locale, { 'sort[0]': 'displayOrder:asc', 'sort[1]': 'documentId:asc' });
    const experiences = await read('experiences', locale, { 'sort[0]': 'displayOrder:asc', 'sort[1]': 'documentId:asc' });
    await page.goto(`${origin}/${locale}`, { waitUntil: 'domcontentloaded' }); await page.locator('#hero-heading').waitFor();
    assert.equal(await page.locator('.brand-name').textContent(), global.siteName);
    assert.equal(await page.locator('.hero-identity').textContent(), global.hero.identity);
    assert.equal(await page.locator('.hero-intro').textContent(), global.hero.introduction);
    assert.deepEqual((await page.locator('#hero-heading > span').allTextContents()).map(t => t.trim()), global.hero.headline.map(t => t.value));
    assert.deepEqual(await page.locator('.about-biography p').allTextContents(), about.paragraphs.map(p => p.value));
    assert.deepEqual(await page.locator('.capability-row h3').allTextContents(), services.map(s => s.title));
    assert.deepEqual(await page.locator('.capability-row p').allTextContents(), services.map(s => s.description));
    const grouped = [...experiences.filter(e => e.employmentType === 'full-time'), ...experiences.filter(e => e.employmentType === 'part-time')];
    assert.deepEqual(await page.locator('.career-position h4').allTextContents(), grouped.map(e => e.role));
    assert.deepEqual(await page.locator('.career-company').allTextContents(), grouped.map(e => e.company));
    assert.equal(await page.locator('#contact h2').textContent(), global.contact.heading);
    assert.equal(await page.locator('#contact > div > p:not(.eyebrow)').first().textContent(), global.contact.introduction);
    assert.equal(await page.locator('#contact .button.primary').getAttribute('href'), global.socialLinks.find(l => l.key === 'linkedin' && l.enabled).url);
    assert.ok((await page.title()).includes(global.siteName));
    const drafts = await read('services', locale, { status: 'draft' });
    assert.ok(drafts.every(d => d.publishedAt));
    evidence.push({ locale, hero: global.documentId, about: about.documentId, services: services.length, experiences: experiences.length, contact: global.documentId, skills: about.stack.reduce((n, g) => n + g.items.length, 0), draftQueriesReturnPublishedOnly: true });
  }
  if (fixture) {
    await fetch(`${api}/mode?value=content-edit`, { method: 'POST' }); await invalidate('global'); await invalidate('about');
    await page.goto(`${origin}/en`, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('.hero-intro').textContent(), 'Edited synthetic fixture');
    assert.equal(await page.locator('.about-biography p').first().textContent(), 'Edited synthetic fixture');
    for (const mode of ['content-outage', 'content-empty']) {
      await fetch(`${api}/mode?value=${mode}`, { method: 'POST' }); await invalidate('service');
      await page.goto(`${origin}/en`, { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('#hero-heading').count(), 0);
      assert.equal(await page.locator('#about .project-state').count(), 1);
      assert.equal(await page.locator('#services .capability-row').count(), 0);
      assert.equal(await page.locator('#experience .career-entry').count(), 0);
      assert.equal(await page.locator('#contact .project-state').count(), 1);
      assert.equal(await page.locator('#projects .project-preview').count(), 3);
      assert.equal(await page.locator('.hero-intro').count(), 0); // Never substitute local personal facts.
    }
    await fetch(`${api}/mode?value=normal`, { method: 'POST' }); await invalidate('experience');
  }
  assert.deepEqual(errors, []);
  const report = { origin, api, evidence, cmsSourceVerified: true, consoleErrors: errors, cacheInvalidationFixture: fixture };
  await fs.mkdir('test-results/phase5', { recursive: true }); await fs.writeFile('test-results/phase5/content-verification.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report));
} finally { await browser.close(); }
