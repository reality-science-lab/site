# reality-science-site — 現実科学ラボ 静的サイト

WordPress + Elementor の「現実科学ラボ」(reality-science.com) を **Astro + Markdown** で再構築した静的サイト。記事は `src/content/articles/*.md` で1記事1ファイル、CMS 不要。外枠デザインは旧 Elementor の **忠実ミラー**。GitHub Actions → Pages にデプロイ（staging: https://studiosaitama-llc.github.io/reality-science-site/ ）。

---

## 作業を始めるとき（最初に同期チェック）

複数人が触る repo。**作業を始める前に必ずローカルがリモートの最新かを確認する**（古いまま作業すると競合・手戻り）。
- `git fetch origin` → `git status -sb`。クリーンで遅れていれば `git pull --ff-only`。
- 未コミットの変更・未プッシュのコミット・作業ブランチ・オープン PR があれば、**勝手に捨てず**内容を要約して報告し、続き／コミット／破棄を確認する。
- 「`main` が最新・クリーン」を確認してからブランチを切る（`main` 直 push 禁止）。
- メンバー向けの導入・運用ルールは Claude Code の **`/onboard` スキル**と **[docs/working-with-claude.md](docs/working-with-claude.md)**（モデル選択・GitHub 認証・公開の安全弁など）。

## 記事に関する操作（最重要）

**記事を追加・編集するときは、手で作らず必ず決まった入口を通す。**

- 追加は **`/add-article` スキル**（Claude Code）または **[docs/adding-articles.md](docs/adding-articles.md)** の手順に従う。雛形は `node scripts/new-article.mjs <slug> "<title>" <categories>` で作る（`.md` と写真フォルダ `public/wp-content/uploads/YYYY/MM/` を生成）。frontmatter を直書きで一から作らない。
- 画像は `public/wp-content/uploads/YYYY/MM/` に置き、本文では `/wp-content/uploads/...`（`public/` を除いたパス）で参照する。
- 公開は `draft: false` にして **ブランチ → PR**。main マージで自動デプロイ。
- frontmatter スキーマは `src/content.config.ts` が唯一の正。`title` / `date`（公開日＝permalink の年月）/ `slug` が必須。レクチャーはタイトルに `（YYYY/M/D開催）` を必ず入れる（NEXT LECTURE の並びがこの日付で決まる）。

## HOME と mirror は手で書き換えない（自動生成・忠実ミラー）

- **HOME の NEWS / NEXT LECTURE / LECTURE グリッドはコレクション駆動**。`src/pages/index.astro` が記事から生成して `src/mirror/home.body.html` の該当3領域を差し替える。**`home.body.html` のこの3領域を手編集しない**（記事 `.md` を足せば自動で並ぶ）。
- 差し替えは `home.body.html` 内の安定 text anchor を使い、**anchor 不一致時は build を止める**。`scripts/mirror-chrome.mjs` で mirror を撮り直したら、`index.astro` の anchor 文字列を新スナップショットに合わせて更新すること。
- `src/mirror/`・`public/wp-content`・vendored CSS/JS/font は旧サイトの忠実ミラー。**自分のセンスで markup を作り直さず、元の class/構造/挙動をそのまま保つ**（CSS は元の Elementor class に依存している）。

## 画像の落とし穴（NFD/NFC）

macOS は日本語ファイル名を NFD で保持するが Pages(Linux) はバイト厳密一致。濁点付きファイル名は **ローカル 200 でもライブ 404**。**画像周りの不具合はローカルでなくライブ URL で確認する**。ファイル名は英数字推奨。対処は `node scripts/normalize-nfc.mjs`。

## デプロイ / base-path / 独自ドメイン

- `main` への push で `.github/workflows/deploy.yml` が `npm run build:pages` → Pages。project-page 配信のため root 絶対パスに `/reality-science-site` を前置する（`scripts/rebase.mjs`）。canonical/OG は env（`SITE_ORIGIN`/`BASE_PATH`）で出し分けるので、**本番ドメイン URL を原稿やコードに直書きしない**。
- 独自ドメイン `reality-science.com` への DNS カットオーバーは**本番を止める操作＝明示 GO 後のゲート**。そのとき `build:pages` を `build` に戻し `public/CNAME` を追加する。

## Git

- **`main` に直接 push しない。必ずブランチ → PR。** コミット/PR には「なぜ」を書く。
- 無関係な変更は別 PR。関連する変更は1つにまとめる。

## コミットしないもの

- `_dump/`（WordPress ダンプ。ビルド入力のローカル専用、2.77GB）
- `dist/`（ビルド成果物）
- `/public/institute/`（`scripts/embed-lp.mjs` が build 時に生成する研究所 LP のコピー）

## ディレクトリ早見

| パス | 中身 |
|---|---|
| `src/content/articles/*.md` | 記事本体（1記事1ファイル・SSoT） |
| `src/pages/index.astro` | HOME（3領域をコレクションから生成して mirror に差し込む） |
| `src/mirror/` | 旧サイトから carve した header/footer/HOME 等の HTML フラグメント |
| `src/layouts/` `src/lib/posts.ts` | レイアウトと記事の取得・並び替え |
| `public/wp-content/` | 記事が参照するメディア（静的配信コンテンツとして同居） |
| `institute/docs/` `institute/apps/lp/` | 現実科学研究所(RSI)資材。LP は build 時 `/institute/lp/` に配信 |
| `scripts/` | 雛形生成・移行・mirror・NFC 正規化などのツール |
| `docs/adding-articles.md` | 記事追加の正本 SOP |
