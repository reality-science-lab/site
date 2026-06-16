// Fix the macOS NFD vs NFC filename bug. macOS stores filenames decomposed (NFD);
// GitHub Pages (Linux) matches request bytes exactly, so any upload whose name has
// a dakuten/handakuten (が, ボ, …) 404s because the HTML reference is composed (NFC).
// This can't be reproduced locally (macOS is normalization-insensitive) — verify on
// the live Linux deploy. Run, then rebuild + commit:  node scripts/normalize-nfc.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const UPLOADS = path.join(ROOT, 'public/wp-content/uploads');

// 1) force every NFD-named upload file to NFC bytes (rename via an ASCII temp, so
//    APFS — which treats NFD==NFC as the same entry — actually rewrites the name).
let renamed = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    const nfc = e.name.normalize('NFC');
    if (nfc !== e.name) {
      const tmp = path.join(dir, `__nfc_tmp_${renamed}_${Date.now()}${path.extname(e.name)}`);
      fs.renameSync(p, tmp);
      fs.renameSync(tmp, path.join(dir, nfc));
      renamed++;
    }
  }
}
walk(UPLOADS);

// 2) normalize every upload reference in content + mirror fragments to NFC, decoding
//    percent-encoded ones to literal NFC (the browser re-encodes consistently).
const files = [
  ...fs.readdirSync(path.join(ROOT, 'src/content/articles')).map((f) => path.join(ROOT, 'src/content/articles', f)),
  ...fs.readdirSync(path.join(ROOT, 'src/mirror')).filter((f) => f.endsWith('.html')).map((f) => path.join(ROOT, 'src/mirror', f)),
];
let touched = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  s = s.normalize('NFC'); // literal refs (featured_image) + body text
  s = s.replace(/\/wp-content\/uploads\/[^\s"')<>\\]+/g, (u) => {
    try { return decodeURIComponent(u).normalize('NFC'); } catch { return u.normalize('NFC'); }
  });
  if (s !== before) { fs.writeFileSync(f, s); touched++; }
}

console.log(`renamed ${renamed} NFD files to NFC; normalized refs in ${touched} files`);
