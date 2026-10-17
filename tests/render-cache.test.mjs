import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resetRenderCache } from '../scripts/reset-render-cache.mjs';

test('release reset removes retained old HTML without touching build seeds, data cache or environment', () => {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cache-')));
  try {
    const files = {
      '.next/server/route-cache/APP_PAGE/stable-key/$/en.html': '<button class="theme-toggle">Old release</button>',
      '.next/server/app/en.html': '<select class="theme-toggle">New release</select>',
      '.next/cache/fetch-cache/published-projects': 'existing data cache',
      '.env.production': 'fixture only',
      'server.js': 'existing application',
    };
    for (const [file, value] of Object.entries(files)) { const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, value); }
    resetRenderCache(root, { checkOnly: true });
    assert.equal(fs.existsSync(path.join(root, '.next/server/route-cache')), true);
    assert.equal(resetRenderCache(root).cleared, true);
    assert.equal(fs.existsSync(path.join(root, '.next/server/route-cache')), false);
    for (const [file, value] of Object.entries(files).slice(1)) assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), value);
    assert.equal(resetRenderCache(root).cleared, false);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('release reset refuses a cache path that points outside the build', () => {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cache-')));
  const outside = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cache-outside-')));
  try {
    fs.mkdirSync(path.join(root, '.next/server'), { recursive: true });
    fs.writeFileSync(path.join(outside, 'keep'), 'safe');
    fs.symlinkSync(outside, path.join(root, '.next/server/route-cache'), 'junction');
    assert.throws(() => resetRenderCache(root), /Refusing/);
    assert.equal(fs.readFileSync(path.join(outside, 'keep'), 'utf8'), 'safe');
  } finally { fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});
