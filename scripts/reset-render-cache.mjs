import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Release overlays retain runtime HTML under this directory. Invalidate only
// generated route responses; keep fetch/image caches and application files.
export function resetRenderCache(root, { checkOnly = false } = {}) {
  const app = fs.realpathSync(root);
  const next = path.join(app, '.next');
  const server = path.join(next, 'server');
  for (const directory of [next, server]) {
    if (fs.lstatSync(directory).isSymbolicLink() || fs.realpathSync(directory) !== directory) throw new Error('Refusing render-cache reset through a symlink');
  }
  const target = path.join(server, 'route-cache');
  if (!fs.existsSync(target)) return { cleared: false, checkOnly };
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Refusing unexpected render-cache target');
  if (!checkOnly) fs.rmSync(target, { recursive: true, force: false });
  return { cleared: !checkOnly, checkOnly };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(resetRenderCache(process.cwd(), { checkOnly: process.argv.includes('--check') }))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
