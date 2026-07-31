// @ts-check
import { defineConfig } from 'astro/config';

// 現実科学ラボ — 静的サイト
// permalink 構造は WordPress と一致させる: /%year%/%monthnum%/%postname%/
// trailingSlash:'always' + build.format:'directory' で /2026/04/vol-73/ → dist/2026/04/vol-73/index.html
export default defineConfig({
  site: 'https://reality-science.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  // 旧URLは新URLへ転送し、重複コンテンツを残さない。
  // - /event/ は LECTURE に統合済み
  // - /institute/lp/ は LP が本番 TOP( / )に昇格した際の旧URL（本文は build-home.mjs が
  //   / と /manifest/ に出力する。embed-lp.mjs による public/institute/lp/ への複製は停止）
  redirects: {
    '/event': '/lecture/',
    '/institute/lp': '/',
    '/institute/lp/manifest': '/manifest/',
  },
  // 本文に含まれる生 HTML（YouTube iframe 等）をそのまま通す
  markdown: {
    // WP のクラシック HTML 由来のため、見出しの自動 ID 付与のみ有効化
    smartypants: false,
  },
});
