// RSI LP の「フラット HTML 化」。Claude Design の standalone エクスポート
// (institute/apps/lp/v7) は rehydration 形式で、初回に #__bundler_thumbnail（プレース
// ホルダ）を出してから ~22MB の manifest を読んで本物のページを再構築する。これが
// 「初回スプラッシュ」の正体。本モジュールはそれを静的な単一 HTML に変換する。
//
// 使い方:
//   - import { flatten, isBundlerExport } from './flatten-lp.mjs'  （build 時に embed-lp が利用）
//   - CLI: node scripts/flatten-lp.mjs <src/index.html> <dst/index.html>   （単体確認用）
//
// 変換（内容は変えず構造のみ）:
//  1) <script type="__bundler/template"> から本番 HTML を取り出す
//  2) <script type="__bundler/manifest"> の全アセットを data: URI 化し url("<uuid>") を置換
//     （compressed:true は gzip/deflate/brotli を順に試して展開）
//  3) フォントの @font-face <style>（巨大）を <head> から </body> 直前へ移動
//     → head が軽くなり本文が即描画、フォントは font-display:swap で後差し替え
import fs from 'node:fs';
import zlib from 'node:zlib';

export const isBundlerExport = (html) => html.includes('<script type="__bundler/template">');

const decompress = (buf) => {
  for (const fn of [zlib.gunzipSync, zlib.inflateSync, zlib.inflateRawSync, zlib.brotliDecompressSync]) {
    try { return fn(buf); } catch { /* try next */ }
  }
  throw new Error('flatten-lp: cannot decompress asset');
};

// bundler エクスポート HTML → 自己完結のフラット HTML（スプラッシュ無し）
export function flatten(html) {
  const extract = (type) => {
    const tag = `<script type="__bundler/${type}">`;
    const i = html.indexOf(tag);
    if (i < 0) throw new Error(`flatten-lp: not a bundler export (missing ${type})`);
    const s = i + tag.length;
    return html.slice(s, html.indexOf('</script>', s)).trim();
  };

  const manifest = JSON.parse(extract('manifest'));
  let tpl = JSON.parse(extract('template')); // JSON 文字列 = 本番 HTML

  const dataUri = {};
  for (const [id, a] of Object.entries(manifest)) {
    const b64 = a.compressed ? decompress(Buffer.from(a.data, 'base64')).toString('base64') : a.data;
    dataUri[id] = `data:${a.mime};base64,${b64}`;
  }

  // 1) 全 url("<uuid>") を data: URI に置換
  const missing = new Set();
  tpl = tpl.replace(/url\("([0-9a-f-]{36})"\)/g, (m, id) => (dataUri[id] ? `url("${dataUri[id]}")` : (missing.add(id), m)));
  if (missing.size) throw new Error(`flatten-lp: unresolved asset refs: ${[...missing].slice(0, 3).join(', ')}…`);

  // 2) フォントの @font-face <style>（最初の <style>）を </body> 直前へ移動
  const sStart = tpl.indexOf('<style');
  const sEnd = tpl.indexOf('</style>', sStart) + '</style>'.length;
  const fontBlock = tpl.slice(sStart, sEnd);
  if (!fontBlock.includes('@font-face')) throw new Error('flatten-lp: first <style> is not the @font-face block');
  const rest = tpl.slice(0, sStart) + tpl.slice(sEnd);
  const bc = rest.lastIndexOf('</body>');
  const out = rest.slice(0, bc) + '\n' + fontBlock + '\n' + rest.slice(bc);

  if (/__bundler_thumbnail|__bundler\/manifest/.test(out)) throw new Error('flatten-lp: bundler artifacts still present');
  return out;
}

// CLI（単体確認用）: node scripts/flatten-lp.mjs <src/index.html> <dst/index.html>
if (import.meta.url === `file://${process.argv[1]}`) {
  const [src, dst] = process.argv.slice(2);
  if (!src || !dst) { console.error('usage: node scripts/flatten-lp.mjs <src/index.html> <dst/index.html>'); process.exit(1); }
  const out = flatten(fs.readFileSync(src, 'utf8'));
  fs.writeFileSync(dst, out);
  console.log(`flattened ${src} → ${dst} (${(Buffer.byteLength(out) / 1e6).toFixed(1)} MB, thumbnail removed)`);
}
