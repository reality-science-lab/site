// Publish the RSI landing page into the site: copy the current public LP
// (institute/apps/lp/v7) into public/institute/lp/ so `astro build` serves it at
// /institute/lp/. Source of truth stays in institute/apps/lp/; public/institute/ is
// generated (gitignored) so the 22MB bundle isn't duplicated in git history.
//   node scripts/embed-lp.mjs   (run before astro build)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'institute/apps/lp/v7'); // 公開版（最新）
const DST = path.join(ROOT, 'public/institute/lp');

if (!fs.existsSync(SRC)) {
  console.error(`LP source not found: ${SRC}`);
  process.exit(1);
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.name === 'README.md' || e.name === '.DS_Store') continue;
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(DST, { recursive: true, force: true });
copyDir(SRC, DST);
console.log('embedded LP v7 -> public/institute/lp/ (served at /institute/lp/)');
