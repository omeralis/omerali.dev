import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function runtime({ dark = false, saved = null, blocked = false } = {}) {
  const document = { documentElement: { dataset: {} } };
  let stored = saved;
  const handlers = new Map();
  const media = { matches: dark, addEventListener: (_, fn) => handlers.set('media', fn), removeEventListener: () => handlers.delete('media') };
  const window = { addEventListener: (name, fn) => handlers.set(name, fn), removeEventListener: name => handlers.delete(name), dispatchEvent: event => handlers.get(event.type)?.() };
  const context = { exports: {}, document, window, matchMedia: () => media, Event: class { constructor(type) { this.type = type; } }, localStorage: { getItem: () => { if (blocked) throw Error('blocked'); return stored; }, setItem: (_, value) => { if (blocked) throw Error('blocked'); stored = value; }, removeItem: () => { if (blocked) throw Error('blocked'); stored = null; } } };
  const source = ts.transpileModule(fs.readFileSync(new URL('../lib/theme.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.createContext(context); vm.runInContext(source, context);
  vm.runInContext(context.exports.themeScript, context);
  return { api: context.exports, document, media, handlers, stored: () => stored };
}

test('before-paint bootstrap follows system and honors explicit preferences', () => {
  for (const dark of [false, true]) for (const saved of [null, 'dark', 'light', 'invalid']) {
    const r = runtime({ dark, saved });
    assert.equal(r.document.documentElement.dataset.theme, ['dark', 'light'].includes(saved) ? saved : dark ? 'dark' : 'light');
  }
});
test('system follows live preference changes while explicit choices stay fixed', () => {
  const r = runtime(); const unsubscribe = r.api.subscribeTheme(() => {});
  r.media.matches = true; r.handlers.get('media')();
  assert.equal(r.document.documentElement.dataset.theme, 'dark');
  r.api.setThemePreference('light'); r.handlers.get('media')();
  assert.equal(r.document.documentElement.dataset.theme, 'light');
  assert.equal(r.stored(), 'light');
  r.api.setThemePreference('system');
  assert.equal(r.stored(), null); assert.equal(r.document.documentElement.dataset.theme, 'dark');
  unsubscribe(); assert.equal(r.handlers.size, 0);
});
test('theme remains usable when browser storage is unavailable', () => {
  const r = runtime({ blocked: true }); r.api.setThemePreference('dark');
  assert.equal(r.api.getThemePreference(), 'dark');
  assert.equal(r.document.documentElement.dataset.theme, 'dark');
});
test('system changes between head bootstrap and hydration are reconciled on subscription', () => {
  const r = runtime({ dark: false });
  assert.equal(r.document.documentElement.dataset.theme, 'light');
  r.media.matches = true; // OS changed before React registered the listener.
  const unsubscribe = r.api.subscribeTheme(() => {});
  assert.equal(r.document.documentElement.dataset.theme, 'dark');
  unsubscribe();
});
test('text and primary controls meet WCAG AA contrast in both palettes', () => {
  const css = fs.readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  const luminance = hex => {
    const channels = hex.match(/../g).map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return channels.reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
  };
  for (const selector of [':root', ':root[data-theme=light]']) {
    const block = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
    const colors = Object.fromEntries([...block.matchAll(/--([\w-]+):#([\da-f]{6});/g)].map(m => [m[1], m[2]]));
    for (const [a, b] of [['text', 'bg'], ['text', 'surface'], ['muted', 'bg'], ['muted', 'surface'], ['muted', 'soft'], ['accent', 'bg'], ['accent', 'surface'], ['accent', 'surface-raised'], ['accent', 'soft'], ['accent-ink', 'brand']]) {
      const values = [luminance(colors[a]), luminance(colors[b])].sort((x, y) => y - x);
      assert.ok((values[0] + .05) / (values[1] + .05) >= 4.5, `${selector}: ${a} on ${b}`);
    }
  }
});
