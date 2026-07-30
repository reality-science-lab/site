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
  // /event/ は LECTURE に統合済み（旧URLは新URLへ転送、重複コンテンツを残さない）
  redirects: {
    '/event': '/lecture/',
  },
  // 本文に含まれる生 HTML（YouTube iframe 等）をそのまま通す
  markdown: {
    // WP のクラシック HTML 由来のため、見出しの自動 ID 付与のみ有効化
    smartypants: false,
  },
});
