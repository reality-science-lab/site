// Publish the RSI landing page into the site: copy the current public LP
// (institute/apps/lp/v7) into public/institute/lp/ so `astro build` serves it at
// /institute/lp/. Source of truth stays in institute/apps/lp/; public/institute/ is
// generated (gitignored) so the 22MB bundle isn't duplicated in git history.
//
// v7 は Claude Design の rehydration エクスポート（初回に #__bundler_thumbnail を出して
// から ~22MB を読んで再構築する＝初回スプラッシュ）。そのままだと遅い・スプラッシュが
// 出るので、build 時に flatten-lp で静的なフラット HTML に変換して配信する。フラット版は
// 巨大で git に置きたくないため、コミットせず build のたびに v7 から生成する。
//   node scripts/embed-lp.mjs   (run before astro build)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flatten, isBundlerExport } from './flatten-lp.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'institute/apps/lp/v7'); // 公開版（最新）
const DST = path.join(ROOT, 'public/institute/lp');

if (!fs.existsSync(SRC)) {
  console.error(`LP source not found: ${SRC}`);
  process.exit(1);
}

// ルートの index.html が bundler エクスポートならフラット化して書き出す。それ以外の
// ファイル・サブディレクトリ（manifest/ 等）はそのままコピー。
function copyDir(src, dst, isRoot = false) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.name === 'README.md' || e.name === '.DS_Store') continue;
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d, false);
    else if (isRoot && e.name === 'index.html') {
      const html = fs.readFileSync(s, 'utf8');
      fs.writeFileSync(d, isBundlerExport(html) ? flatten(html) : html);
    } else fs.copyFileSync(s, d);
  }
}

fs.rmSync(DST, { recursive: true, force: true });
copyDir(SRC, DST, true);
console.log('embedded LP v7 (flattened) -> public/institute/lp/ (served at /institute/lp/)');
