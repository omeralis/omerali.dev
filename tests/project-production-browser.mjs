import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
const modulePath=process.env.PLAYWRIGHT_MODULE_PATH;
const {chromium}=modulePath?await import(pathToFileURL(`${modulePath}/index.mjs`).href):await import('playwright');
const origin=process.env.BROWSER_ORIGIN||'http://127.0.0.1:3017';
const api=process.env.STRAPI_API_URL||'https://api.omerali.dev';
await fs.mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const results=[];
try{
 for(const locale of ['en','ar']){
  const response=await fetch(`${api}/api/projects?locale=${locale}&populate=*&sort=displayOrder:asc`);
  assert.equal(response.status,200);
  const {data}=await response.json();
  assert.equal(data.map(p=>p.slug).join(','),'grc-platform,cyber-imtithal,investor-vendor-portal');
  for(const width of [360,768,1280,1600]){
   await page.setViewportSize({width,height:1000});
   assert.equal((await page.goto(`${origin}/${locale}`,{waitUntil:'domcontentloaded'})).status(),200);
   await page.locator('#projects .project-preview').first().waitFor();
   assert.equal(await page.locator('html').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
   assert.equal(await page.locator('html').getAttribute('lang'),locale);
   assert.equal(await page.locator('#projects .project-preview').count(),3);
   assert.equal((await page.locator('#projects .project-summary h3').allTextContents()).join('|'),data.map(p=>p.title).join('|'));
   assert.equal(await page.locator('#projects .project-type-preview').count(),3);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(width===360||width===1280)await page.locator('#projects').screenshot({path:`test-results/${locale}-featured-${width}.png`});
   assert.equal((await page.goto(`${origin}/${locale}/projects`,{waitUntil:'domcontentloaded'})).status(),200);
   await page.locator('.project-preview').first().waitFor();
   assert.equal(await page.locator('.project-preview').count(),3);
   assert.equal(await page.locator('.project-filters a').count(),3);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   results.push({locale,width,featured:3,listing:3});
  }
  for(const project of data){
   await page.setViewportSize({width:360,height:1000});
   assert.equal((await page.goto(`${origin}/${locale}/projects/${project.slug}`,{waitUntil:'domcontentloaded'})).status(),200);
   await page.locator('.case-heading h1').waitFor();
   assert.equal(await page.locator('.case-heading h1').textContent(),project.title);
   assert.equal(await page.locator('.case-features li').count(),project.features.length);
   assert.equal(await page.locator('.case-heading .project-technologies li').count(),project.technologies.length);
   assert.equal(await page.locator('.case-cover .project-type-preview').count(),1);
   assert.equal(await page.locator('.case-links').count(),0);
   assert.equal(await page.locator('.case-facts div').count(),0);
   assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'),project.seo.metaTitle);
   assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),`${process.env.SITE_URL||origin}/${locale}/projects/${project.slug}`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(project.slug==='grc-platform')await page.screenshot({path:`test-results/${locale}-grc-mobile.png`,fullPage:true});
   const other=locale==='en'?'ar':'en';
   assert.ok((await page.locator(`link[rel="alternate"][hreflang="${other}"]`).getAttribute('href')).endsWith(`/${other}/projects/${project.slug}`));
   await page.locator(`.header-controls a[hreflang="${other}"]`).click();
   await page.waitForURL(`**/${other}/projects/${project.slug}`);
  }
  assert.equal((await page.goto(`${origin}/${locale}/projects/missing-project`,{waitUntil:'domcontentloaded'})).status(),404);
  await page.goto(`${origin}/${locale}/projects?type=Enterprise`,{waitUntil:'domcontentloaded'});
  await page.locator('.project-preview').first().waitFor();
  assert.equal(await page.locator('.project-preview').count(),1);
  await page.goto(`${origin}/${locale}/projects?type=Business`,{waitUntil:'domcontentloaded'});
  await page.locator('.project-preview').first().waitFor();
  assert.equal(await page.locator('.project-preview').count(),2);
  await page.goto(`${origin}/${locale}`,{waitUntil:'domcontentloaded'});
  const theme=await page.locator('html').getAttribute('data-theme');
  await page.locator('.theme-toggle').click();
  assert.notEqual(await page.locator('html').getAttribute('data-theme'),theme);
  await page.locator('.theme-toggle').click();
 }
 const sitemapResponse=await fetch(`${origin}/sitemap.xml`);assert.equal(sitemapResponse.status,200);
 const sitemap=await sitemapResponse.text();
 for(const locale of ['en','ar'])for(const slug of ['grc-platform','cyber-imtithal','investor-vendor-portal'])assert.ok(sitemap.includes(`/${locale}/projects/${slug}`));
 const unauthorized=await fetch(`${origin}/api/revalidate`,{method:'POST',body:'{}'});assert.ok([401,503].includes(unauthorized.status));
 assert.equal(errors.length,0,errors.join('\n'));
 const report={origin,results,detailPages:6,sitemap:true,metadata:true,languageSwitching:true,placeholders:true,consoleErrors:errors.length};
 await fs.writeFile('test-results/browser-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
