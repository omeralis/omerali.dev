import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { portfolioFixture } from './portfolio-fixtures.mjs';
const root = fileURLToPath(new URL('../', import.meta.url)), require = createRequire(import.meta.url), loaded = new Map();
function load(file) { file = path.resolve(file); if (loaded.has(file)) return loaded.get(file); const exports = {}; loaded.set(file, exports); const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText; const local = id => id === 'server-only' ? {} : id === 'react' ? { cache: fn => fn } : id.startsWith('@/') ? load(path.join(root, id.slice(2) + '.ts')) : id.startsWith('.') ? load(path.resolve(path.dirname(file), id + '.ts')) : require(id); vm.runInNewContext(code, { exports, require: local, process, URL, URLSearchParams, AbortSignal, Intl, Date, fetch: (...args) => global.fetch(...args) }); return exports; }
const api = load(path.join(root, 'lib/cms/portfolio.ts')), client = load(path.join(root, 'lib/cms/client.ts'));
test('published bilingual content parses without local professional content fallbacks', () => {
  for (const locale of ['en', 'ar']) { const fixture = portfolioFixture(locale); assert.equal(api.parseGlobal(fixture.global, locale).name, 'Synthetic fixture'); assert.equal(api.parseAbout(fixture.about, locale).stack[0].primary[0], 'Test technology'); assert.equal(api.parseServices(fixture.services, locale).length, 6); assert.equal(api.parseExperiences(fixture.experiences, locale).length, 7); }
});
test('missing, disabled, unpublished and wrong-locale records fail closed', () => {
  const fixture = portfolioFixture();
  for (const global of [null, { ...fixture.global, enabled: false }, { ...fixture.global, publishedAt: null }, { ...fixture.global, locale: 'ar' }]) assert.throws(() => api.parseGlobal(global, 'en'));
  assert.throws(() => api.parseAbout({}, 'en'));
  assert.equal(api.parseServices([], 'en').length, 0);
  assert.equal(api.parseExperiences([], 'en').length, 0);
});
test('services preserve editorial order and overlapping career dates remain independent', () => {
  const fixture = portfolioFixture();
  assert.equal(api.parseServices([...fixture.services].reverse(), 'en').map(r => r.number).join(','), '1,2,3,4,5,6');
  const parsed = api.parseExperiences(fixture.experiences, 'en');
  assert.equal(parsed.filter(r => r.employmentType === 'part-time').length, 1);
  assert.equal(parsed[0].startDate, parsed[6].startDate);
  assert.equal(parsed[0].endDate, '2022-01');
});
test('unsafe social/media URLs are discarded while disabled links stay hidden', () => {
  const fixture = portfolioFixture(); fixture.global.socialLinks.push({ key: 'github', label: 'test', url: 'javascript:alert(1)', enabled: true }, { key: 'other', label: 'test', url: 'https://example.com/hidden', enabled: false }); fixture.global.resume = { url: 'https://private.example/resume.pdf' };
  const parsed = api.parseGlobal(fixture.global, 'en');
  assert.equal(parsed.socialLinks.length, 1); assert.equal(parsed.hero.links.resume, undefined); assert.equal(parsed.hero.links.github, undefined);
});
test('CMS reads enforce published locale, enabled filtering, server auth and 300-second tagged cache', async () => {
  const original = global.fetch; let observed;
  try { global.fetch = async (url, options) => { observed = { url, options }; return { ok: true, json: async () => ({ data: portfolioFixture().global }) }; }; const result = await client.getContent('global', 'en', { status: 'draft', locale: 'ar', 'filters[enabled][$eq]': 'false' }); assert.equal(result.ok, true); assert.equal(observed.url.searchParams.get('status'), 'published'); assert.equal(observed.url.searchParams.get('locale'), 'en'); assert.equal(observed.url.searchParams.get('filters[enabled][$eq]'), 'true'); assert.equal(observed.options.next.revalidate, 300); assert.ok(observed.options.next.tags.includes('portfolio')); assert.equal(observed.options.redirect, 'error'); global.fetch = async () => { throw Error('private failure'); }; assert.equal((await api.getGlobal('en')).ok, false); }
  finally { global.fetch = original; }
});
test('actual published bilingual portfolio parses through production populate queries', { skip: process.env.TEST_LIVE_CMS !== '1' }, async () => {
  for (const locale of ['en', 'ar']) {
    const global = await api.getGlobal(locale), about = await api.getAbout(locale), services = await api.getServices(locale), experiences = await api.getExperiences(locale);
    assert.equal(global.ok, true, `global/${locale}`); assert.equal(about.ok, true, `about/${locale}`); assert.equal(services.ok, true, `services/${locale}`); assert.equal(experiences.ok, true, `experiences/${locale}`);
    assert.equal(global.value.careerStart, '2018-11'); assert.equal(global.value.socialLinks.length, 1);
    assert.equal(services.value.services.length, 6); assert.equal(experiences.value.entries.length, 7);
    assert.equal(about.value.stack.reduce((count, group) => count + group.primary.length + group.supporting.length, 0), 14);
    assert.equal(global.value.hero.links.resume, undefined); assert.equal(global.value.hero.links.github, undefined);
  }
});

test('contact destinations accept confirmed addresses and international numbers without URI injection', () => {
  const { emailDestination, phoneDestination, publicIdentity } = load(path.join(root, 'lib/public-identity.ts'));
  assert.equal(publicIdentity.github, 'https://github.com/omeralis');
  assert.equal(emailDestination('hello@example.test'), 'mailto:hello@example.test');
  for (const invalid of [undefined, '', 'not-an-email', 'hello@example.test?bcc=other@example.test', 'hello@example.test\nBcc:other@example.test', 'javascript:alert(1)']) assert.equal(emailDestination(invalid), undefined);
  assert.equal(phoneDestination('+966 (50) 123-4567'), 'tel:+966501234567');
  assert.equal(phoneDestination('+966 (50) 123-4567', true), 'https://wa.me/966501234567');
  for (const invalid of [undefined, '', '0501234567', '+123', '+966501234567;ext=4', '+966501234567?text=secret', '+1234567890123456']) assert.equal(phoneDestination(invalid), undefined);
});

test('optional contact numbers come only from CMS and remain missing when unconfigured', () => {
  const fixture = portfolioFixture();
  assert.equal(api.parseGlobal(fixture.global, 'en').contact.phone, undefined);
  assert.equal(api.parseGlobal(fixture.global, 'en').contact.whatsapp, undefined);
  fixture.global.contact.phone = '+12025550123'; fixture.global.contact.whatsapp = '+12025550124';
  const parsed = api.parseGlobal(fixture.global, 'en');
  assert.equal(parsed.contact.phone, fixture.global.contact.phone);
  assert.equal(parsed.contact.whatsapp, fixture.global.contact.whatsapp);
});
