# reality-science-site — 現実科学ラボ 静的サイト

WordPress + Elementor の「現実科学ラボ」(reality-science.com) を **Astro + Markdown** で再構築した静的サイト。記事は `src/content/articles/*.md` で1記事1ファイル、CMS 不要。外枠デザインは旧 Elementor の **忠実ミラー**。GitHub Actions → Pages にデプロイ（staging: https://reality-science-lab.github.io/site/ ）。

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

## HOME は現実科学研究所LP、LECTUREがラボの旧HOME相当（自動生成・忠実ミラー）

- **`/` と `/manifest/` は `institute/apps/lp/v7`（現実科学研究所LP）が source**。`scripts/build-home.mjs` が astro build 後にそのまま流し込む（`npm run build`/`build:pages` に組み込み済み。ビルド時の加工なし）。ヘッダーナビ・遷移先は `institute/apps/lp/v7/index.html`（`__bundler/template` 内のHTML文字列）を直接編集する。他のページは既存の Elementor-mirror ヘッダー（BaseLayout）がナビを持つ。
- **`/lecture/` の NEWS / NEXT LECTURE / LECTURE 一覧はコレクション駆動**。`src/pages/lecture/index.astro` が記事から生成して `src/mirror/home.body.html` の該当領域を差し替え、`src/mirror/archive.shell.html` の一覧を末尾に結合する。**`home.body.html` のこの領域を手編集しない**（記事 `.md` を足せば自動で並ぶ）。
- 差し替えは `home.body.html` 内の安定 text anchor を使い、**anchor 不一致時は build を止める**。`scripts/mirror-chrome.mjs` で mirror を撮り直したら、`lecture/index.astro` の anchor 文字列を新スナップショットに合わせて更新すること。
- `/event/` は `astro.config.mjs` の `redirects` で `/lecture/` へ転送（重複コンテンツを残さない）。
- `src/mirror/`・`public/wp-content`・vendored CSS/JS/font は旧サイトの忠実ミラー。**自分のセンスで markup を作り直さず、元の class/構造/挙動をそのまま保つ**（CSS は元の Elementor class に依存している）。

## 画像の落とし穴（NFD/NFC）

macOS は日本語ファイル名を NFD で保持するが Pages(Linux) はバイト厳密一致。濁点付きファイル名は **ローカル 200 でもライブ 404**。**画像周りの不具合はローカルでなくライブ URL で確認する**。ファイル名は英数字推奨。対処は `node scripts/normalize-nfc.mjs`。

## デプロイ / base-path / 独自ドメイン

- `main` への push で `.github/workflows/deploy.yml` が `npm run build:pages` → Pages。project-page 配信のため root 絶対パスに `/site` を前置する（`scripts/rebase.mjs`）。canonical/OG は env（`SITE_ORIGIN`/`BASE_PATH`）で出し分けるので、**本番ドメイン URL を原稿やコードに直書きしない**。
- 独自ドメイン `reality-science.com` への DNS カットオーバーは**本番を止める操作＝明示 GO 後のゲート**。そのとき `build:pages` を `build` に戻し `public/CNAME` を追加する。

## 問い合わせフォーム（GAS 経由でメール送信）

静的サイトにサーバーはないため、フォームは **Google Apps Script の Web App** に POST し、
GAS が `reality-science@dhw.ac.jp` へメールを送る。外部のフォーム代行サービスは使っていない。

- 入口は2つ。どちらも同じ GAS エンドポイントに送り、`_source` で送信元を区別する。
  - `/`（研究所LP・`institute/apps/lp/v7/index.html`）の `joinForm`
  - `/contact/`（`src/mirror/contact.body.html`）の `rsContactForm`
- `mode:"cors"` で送信し、**返却 JSON の `result` を検証**してから成功表示を出す
  （`no-cors` だとサーバー側が失敗しても成功に見えるため）。
- スパム対策は **ハニーポット（`_hp`）＋共有トークン（`_token`）**。トークンはページのソースに
  出るので万能ではない（無差別ボットと URL 直叩きを止める層）。
- **GAS 側のコードは [docs/contact-form-gas.gs](docs/contact-form-gas.gs) に写しを置いている**。
  本番反映は GAS 側での更新＋再デプロイが必要。再デプロイは「デプロイを管理」→既存デプロイを
  編集→「新バージョン」。**「新しいデプロイ」を作ると URL が変わりフォームが壊れる**。
- 疎通確認は `_ping=1` を POST（メールを送らずに応答だけ返る）。

## Git

- **`main` に直接 push しない。必ずブランチ → PR。** コミット/PR には「なぜ」を書く。
- 無関係な変更は別 PR。関連する変更は1つにまとめる。

## コミットしないもの

- `_dump/`（WordPress ダンプ。ビルド入力のローカル専用、2.77GB）
- `dist/`（ビルド成果物）
- `/public/institute/`（旧 `scripts/embed-lp.mjs` の生成物。**現在ビルドでは使っていない** —
  LP は `build-home.mjs` が `/` と `/manifest/` に出力し、旧 URL `/institute/lp/` は
  `astro.config.mjs` の `redirects` で `/` へ転送する）

## ディレクトリ早見

| パス | 中身 |
|---|---|
| `src/content/articles/*.md` | 記事本体（1記事1ファイル・SSoT） |
| `scripts/build-home.mjs` | `/` と `/manifest/`（現実科学研究所LP）を astro build 後に流し込む |
| `src/pages/lecture/index.astro` | LECTURE（旧ラボHOME相当。NEWS/NEXT LECTURE領域をコレクションから生成して mirror に差し込む） |
| `src/mirror/` | 旧サイトから carve した header/footer/HOME 等の HTML フラグメント |
| `src/layouts/` `src/lib/posts.ts` | レイアウトと記事の取得・並び替え |
| `public/wp-content/` | 記事が参照するメディア（静的配信コンテンツとして同居） |
| `institute/docs/` `institute/apps/lp/` | 現実科学研究所(RSI)資材。LP(v7)は `build-home.mjs` が `/` と `/manifest/` に配信 |
| `docs/contact-form-gas.gs` | 問い合わせフォームの受信スクリプト（GAS側で稼働。**記録用の写し**） |
| `scripts/` | 雛形生成・移行・mirror・NFC 正規化などのツール |
| `docs/adding-articles.md` | 記事追加の正本 SOP |
