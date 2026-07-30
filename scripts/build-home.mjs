// Publish the RSI landing page (institute/apps/lp/v7) as the site's real HOME,
// per docs/site-map.md: / and /manifest/ come from the LP, /lecture/ (Astro,
// merged with the former HOME's NEWS/NEXT LECTURE) and every other route are
// already correct from the Astro build. Run AFTER `astro build`:
//   node scripts/build-home.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flatten, isBundlerExport } from './flatten-lp.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LP = path.join(ROOT, 'institute', 'apps', 'lp', 'v7');

if (!fs.existsSync(DIST)) {
  throw new Error('dist/ not found. Run the Astro build before building HOME.');
}

const readLp = (relativePath) => {
  const html = fs.readFileSync(path.join(LP, relativePath), 'utf8');
  return isBundlerExport(html) ? flatten(html) : html;
};

const write = (relativePath, html) => {
  const destination = path.join(DIST, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
};

write('index.html', readLp('index.html'));
write(path.join('manifest', 'index.html'), readLp(path.join('manifest', 'index.html')));

const lpAssets = path.join(LP, 'assets');
if (fs.existsSync(lpAssets)) {
  fs.cpSync(lpAssets, path.join(DIST, 'assets'), { recursive: true });
}

console.log('built HOME (/ and /manifest/) from institute/apps/lp/v7');
