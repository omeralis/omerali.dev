import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = modulePath ? await import(pathToFileURL(`${modulePath}/index.mjs`).href) : await import("playwright");
const origin = "http://localhost:3017";
const webhookSecret = "fixture-webhook-secret-32-characters-long";
async function invalidate() {
 const response = await fetch(`${origin}/api/revalidate`, { method: "POST", headers: { "x-webhook-secret": webhookSecret }, body: JSON.stringify({ event: "entry.unpublish", model: "project" }) });
 assert.equal(response.status, 200);
}
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
// The synthetic CMS deliberately repeats headline text. It must not produce duplicate React keys.
page.on("console", message => { if (/same key|hydrat|mismatch/i.test(message.text())) errors.push(message.text()); });
try {
 for (const locale of ["en", "ar"]) for (const width of [360, 768, 1280, 1600]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(`${origin}/${locale}`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("#projects .project-preview").count(), 3);
  assert.equal(await page.locator(".capability-row").count(), 6);
  assert.equal(await page.locator(".career-entry").count(), 7);
  assert.equal(await page.locator("html").getAttribute("dir"), locale === "ar" ? "rtl" : "ltr");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.goto(`${origin}/${locale}/projects`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator(".project-preview").count(), 12);
  assert.equal(await page.locator(".project-filters a").count(), 4);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  console.log(`${locale} ${width}: featured/listing layouts passed`);
 }
 await page.goto(`${origin}/en/projects?type=Government`, { waitUntil: "domcontentloaded" });
 assert.equal(await page.locator(".project-preview").count(), 5);
 assert.equal(await page.locator('.project-filters a[aria-current="page"]').innerText(), "Government");
 await page.goto(`${origin}/en/projects?page=2`, { waitUntil: "domcontentloaded" });
 assert.equal(await page.locator(".project-preview").count(), 2);
 for (const locale of ["en", "ar"]) {
  await page.setViewportSize({width:360,height:1000});
  await page.goto(`${origin}/${locale}/projects/test-fixture-0`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator(".case-section").count(), 5);
  assert.equal(await page.locator(".case-gallery img").count(), 1);
  assert.equal(await page.locator(".case-links").count(), 0);
  assert.equal(await page.locator(".related-projects .project-preview").count(), 3);
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute("content"), "Test metadata title");
  assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(`/${locale}/projects/test-fixture-0`));
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.locator(".case-cover img").evaluate(image => image.decode());
  assert.equal(await page.locator(".case-cover img").evaluate(image => image.naturalWidth > 0), true);
  await page.locator(`.header-controls a[hreflang="${locale === "en" ? "ar" : "en"}"]`).click();
  await page.waitForURL(`**/${locale === "en" ? "ar" : "en"}/projects/test-fixture-0`);
 }
 const missing = await page.goto(`${origin}/ar/projects/missing-project`, {waitUntil:"domcontentloaded"});
 assert.equal(missing.status(),404);
 assert.ok((await page.locator("main").innerText()).includes("المشروع غير موجود"));
 const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
 assert.ok(sitemap.includes("/en/projects/test-fixture-0"));
 assert.ok(sitemap.includes("/ar/projects/test-fixture-0"));
 assert.equal((await fetch(`${origin}/api/revalidate`, {method:"POST",body:"{}"})).status,401);
 const html = await (await fetch(`${origin}/en/projects/test-fixture-0`)).text();
 assert.equal(html.includes("fixture-read-token"),false);
 await fetch('http://localhost:3016/mode?value=different-slugs',{method:'POST'});await invalidate();
 await page.goto(`${origin}/en/projects/test-fixture-0`,{waitUntil:'domcontentloaded'});
 assert.ok((await page.locator('link[rel="alternate"][hreflang="ar"]').getAttribute('href')).endsWith('/ar/projects/ar-test-fixture-0'));
 await page.locator('.header-controls a[hreflang="ar"]').click();await page.waitForURL('**/ar/projects/ar-test-fixture-0');
 assert.equal(await page.locator('.case-heading h1').innerText(),'مشروع اختبار 0');
 for (const mode of ["outage", "empty", "malformed", "missing-translation"]) {
  await fetch(`http://localhost:3016/mode?value=${mode}`, {method:"POST"});
  await invalidate();
  await page.goto(`${origin}/en`, {waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("#hero-heading").count(),1);
  if(mode !== "missing-translation") assert.equal(await page.locator("#projects .project-state").count(),1);
  if(mode === "empty") assert.ok((await page.locator("#projects").innerText()).includes("No projects have been published"));
  if(mode === "missing-translation") {
   assert.equal((await page.goto(`${origin}/ar/projects/test-fixture-0`, {waitUntil:"domcontentloaded"})).status(),404);
   await page.goto(`${origin}/en/projects/test-fixture-0`,{waitUntil:'domcontentloaded'});
   await page.locator('.header-controls a[hreflang="ar"]').click();await page.waitForURL('**/ar/projects');
  }
 }
 await fetch("http://localhost:3016/mode?value=normal", {method:"POST"}); await invalidate();
 await page.goto(`${origin}/ar`, {waitUntil:"domcontentloaded"});
 await page.emulateMedia({reducedMotion:"reduce"});
 assert.equal(await page.locator(".project-image").first().evaluate(image=>getComputedStyle(image).transitionDuration),"0s");
 assert.equal(errors.length,0,errors.join("\n"));
 console.log("Filters, pagination, detail sections, media, translation switch, 404s, metadata, sitemap, webhook authorization, invalidation and outage isolation passed");
} finally { await browser.close(); }
