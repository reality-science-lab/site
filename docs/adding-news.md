# 研究所ニュースの追加方法

`/news/` は **現実科学研究所のニュース**（プレスリリース等）の一覧。現実科学ラボの記事（`src/content/articles/`）とは別の仕組みで、2026-09-29 に切り替えた。

`src/content/news/<slug>.md` を1枚足すと、次の3か所が自動で更新される。LP（`institute/apps/lp/v7/index.html`）は触らない。

| 場所 | 中身 |
|---|---|
| 一覧 `/news/` | 配信日の新しい順（同じ日は slug 順） |
| 詳細 `/news/<slug>/` | 本文と配信元リンク |
| トップ（`/`）右下の通知カード | 最新の1本 |

## 手順

1. 画像を `public/uploads/news/<slug>/` に置く。ファイル名は英数字（例 `main.jpg`）。幅は 1600px 程度まで縮める。
2. 既存のニュース（例 `src/content/news/campus-portal.md`）を複製して `<slug>.md` を作り、frontmatter と本文を書き換える。
3. `npm run build` が通ることを確かめる。
4. ブランチを切って commit → PR。main にマージすると公開される。

## frontmatter

```yaml
---
title: "見出し（一覧・詳細に出る）"
short_title: "通知カード用の短い見出し（任意。無ければ title）"
date: 2026-09-02            # 配信日。並び順に使う
slug: campus-portal         # URL は /news/<slug>/
excerpt: "一覧の抜粋。description と OGP にも使う"
featured_image: /uploads/news/campus-portal/main.jpg   # 任意。一覧のサムネ・詳細の先頭・OGP
featured_image_alt: "画像の説明"                         # 任意
source_url: https://prtimes.jp/...   # 任意。あれば詳細の末尾に配信元リンクが出る
source_label: PR TIMES               # 任意。既定は PR TIMES
draft: false                         # true の間は一覧・詳細・通知のどれにも出ない
---
```

- slug は英小文字・数字・ハイフンだけ。**`pr` は使えない**（`/news/pr/` と衝突する）。重複するとビルドが止まる。
- 本文中の写真は `<figure class="news-figure">…<figcaption>…</figcaption></figure>`、人物の顔写真は `news-figure--portrait` を足すと小さく出る（既存の原稿を参照）。

## プレスリリースから起こすとき（2026-09-29 の3本で採った方針）

- 本文はリリースのまま載せる。
- 末尾の大学概要（【デジタルハリウッド大学［DHU］】の定型文）と、PR TIMES 固有のリンク（「ChatGPTで読む」等）は省く。
- 研究所サイト内へのリンクは相対パス（`/manifest/` `/#join` 等）にする。本番ドメインを直書きしない。
- 画像は PR TIMES から取得して上記の置き場所に置く（外部 URL を直接参照しない）。

## 通知カードの仕組み

- ビルド時に `/news/latest.json`（最新1本）を出し、LP が読み込む `/scripts/news-notice.js` がそれを表示する。トップ（`/`）でだけ動く。
- 閉じるとその slug をブラウザの `localStorage`（`rsi-news-dismissed-slug`）に記録し、同じニュースは再表示しない。**最新の slug が変わると再び出る**（過去日付のニュースを足しても最新が変わらなければ出ない）。
- お問い合わせ欄（`#join`）が画面に入っている間は隠れる。

## ラボの記事との関係

- ラボ記事の `news` カテゴリは `/news/` には出ない。これまでどおり `/lecture/` の NEWS 欄（新着4件）に出る。
- `/news/pr/`（ラボの `pr` カテゴリ一覧）は残している。どこからもリンクしていない。
