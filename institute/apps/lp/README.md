# 現実科学研究所 LP（プロトタイプ実装）

design.md v0.2 に厳密準拠した LP のプロトタイプ実装。
Claude Design からハンドオフされたバンドルを apps/lp/ に配置したもの。

## デザインバリエーション

| パス | バージョン | 性質 | 特徴 |
|---|---|---|---|
| `/` | v0 | JSX プロトタイプ | クリーム × 5色限定多色 × 三声部対位法 × ポスター組版 |
| `/v1/` | v1（[v1/README.md](v1/README.md)） | JSX プロトタイプ | 紙・墨・朱・燐光（禁欲的明朝） |
| `/v2/` | v2（[v2/README.md](v2/README.md)） | JSX プロトタイプ | UTUTU JSX 試作（ベージュ紙＋縄文＋濃グレー） |
| `/v3/` | **v3**（[v3/README.md](v3/README.md)） — sandbox | standalone 単一 HTML | LP standalone bundle (実験編集の場) |
| `/v4/` | **v4**（[v4/README.md](v4/README.md)） | standalone 単一 HTML | UTUTU standalone bundle |
| `/v5/` | **v5**（[v5/README.md](v5/README.md)） — 公開版スナップショット | standalone 単一 HTML | 2026-06-08 クライアントレビュー反映版を固定 |
| `/v6/` | **v6**（[v6/README.md](v6/README.md)） | standalone 単一 HTML | 2026-06-08 受領の新ビルド (Claude Design 再ハンドオフ) |
| `/v7/` | **v7**（[v7/README.md](v7/README.md)） — **公開版（最新）** | standalone 単一 HTML | 2026-06-09 PDF フィードバック反映版 |

→ v0/v1/v2 は JSX + Babel CDN のプロトタイプ。v3/v4/v5/v6/v7 は外部依存ゼロの自己完結 HTML。
→ 2026-06-05 第4回 MTG で確定した UTUTU 視覚言語（[docs/utut.md](../../docs/utut.md)）反映版が **v4**。
→ 2026-06-08 のクライアントレビュー (PDF/CSV 7項目 + ローテーター停止 + Hero 主役入れ替え + プロジェクト順序反転 + 趣意書 v2 確定版) を手作業パッチで固定したスナップショットが **v5**。
→ 同日 22:57 に Claude Design から再ハンドオフされた、上記知見を全て織り込み済みの新ビルドが **v6**。spectrum・kicker・SCROLL インジケータ等の hero 構成も追加されている。
→ 2026-06-09 の PDF フィードバック (§-numbered ナビ削除・CTA「仲間募集」化・hero subtitle 句読点削除・§03 タイトル変更・§05 背景空五倍子色化 等) を全て織り込み済みの新ビルドが **v7**。

GitHub Pages 公開後:
- v0: https://studiosaitama-llc.github.io/dhw-lab/
- v1: https://studiosaitama-llc.github.io/dhw-lab/v1/
- v2: https://studiosaitama-llc.github.io/dhw-lab/v2/
- v3: https://studiosaitama-llc.github.io/dhw-lab/v3/
- v4: https://studiosaitama-llc.github.io/dhw-lab/v4/
- v5: https://studiosaitama-llc.github.io/dhw-lab/v5/
- v6: https://studiosaitama-llc.github.io/dhw-lab/v6/
- **v7: https://studiosaitama-llc.github.io/dhw-lab/v7/** ← 公開版（最新）

## 構成

| ファイル | 役割 |
|---|---|
| `index.html` | エントリ。フォント読み込み・CSS / JSX のロード |
| `styles/rsi-tokens.css` | デザイントークン（design.md §4 パレット、§3 タイポ三声部） |
| `styles/lp.css` | LP 全セクションのレイアウト・コンポーネント CSS |
| `components-lp.jsx` | 共有コンポーネント（TopBar / Footer / ContourField / WordCycle / ChapterMark） |
| `sections-1.jsx` | § 00 Hero ／ § 01 Concept ／ § 02 Mission |
| `sections-2.jsx` | § 03 Projects ／ § 04 Values ／ § 05 Contact |
| `app-lp.jsx` | App コンポジション（全セクションの組み立て） |

## 技術スタック

- **React 18.3.1**（CDN／UMD ビルド）
- **Babel Standalone**（ブラウザ内 JSX 変換）
- **Google Fonts**：DM Serif Display, Cormorant Garamond, Zen Old Mincho, Zen Kaku Gothic Antique, Shippori Mincho B1, JetBrains Mono
- ビルド不要のプロトタイプ。本実装は Vite + React or Astro への移行を想定

## ローカル起動

Babel Standalone が JSX ファイルを fetch するため、`file://` ではなく HTTP サーバ経由で開く必要がある。

```bash
# 方法1: Python（macOS 標準）
cd /Users/chiakikato/Projects/studiosaitama/clients/dhw-lab/apps/lp
python3 -m http.server 5173

# 方法2: Node.js（npx）
npx serve .

# その後ブラウザで
open http://localhost:5173/
```

## design.md v0.2 との対応

| design.md 章 | 実装箇所 |
|---|---|
| §4.2 基盤パレット（Crema / Ink / Vermilion / Teal / Indigo） | `styles/rsi-tokens.css` :root |
| §4.3 スケール別カラー（Pink / Violet / Yellow / Orange） | `styles/rsi-tokens.css` :root |
| §3.2 三声部書体（voice-1/2/3） | `styles/rsi-tokens.css` --voice-* |
| §5.2-1 WordCycle（Hero テキスト差し替え） | `components-lp.jsx` WordCycle |
| §2.3 等高線レイヤー（構造的揺らぎ） | `components-lp.jsx` ContourField |
| §2.4 カルーシュ（§ 章番号の色面化） | `components-lp.jsx` ChapterMark, `styles/lp.css` .cartouche |
| §2.5 印刷の温度（グレイン） | `styles/lp.css` .grain::after |
| §8.1 LP 章立て（§00〜§05） | `sections-1.jsx` / `sections-2.jsx` |
| §8.1 色の物語（Crema → 色面 → Vermilion → Ink） | 各セクションの background |

## セクション構成

| § | セクション | コンポーネント | 主背景色 |
|---|---|---|---|
| § 00 | Hero | `Hero` (sections-1) | Indigo `#2D3B8C` |
| § 01 | Concept（現実編集 4命題） | `Concept` (sections-1) | Crema `#F4E9D2` |
| § 02 | Mission（世界を満たせ） | `Mission` (sections-1) | Crema → 色相循環 |
| § 03 | Projects（4スケール） | `Projects` (sections-2) | Pink / Violet / Yellow / Orange |
| § 04 | Values（三柱） | `Values` (sections-2) | Ink `#1A1A18` |
| § 05 | Contact（参画フォーム） | `Contact` (sections-2) | Vermilion `#E54B2A` |
| Footer | フッター | `Footer` (components) | Ink |

## 次工程

1. **クライアントレビュー** ― 藤井学長 / 学長室 / DHU 広報
2. **本番ビルド移行** ― Vite + React (TS) or Astro 静的サイトへ
3. **コンテンツ更新** ― press-release-v0.5 / 趣意書 v2 の最終確定版を反映
4. **応募フォーム実装** ― 現在は alert モック。Tally / Google Forms / 自前 API に差し替え
5. **写真ディレクション** ― §08 学長ポートレート、その他キービジュアル
6. **アクセシビリティ検証** ― キーボード操作 / prefers-reduced-motion / コントラスト比

## ハンドオフ元

- Claude Design バンドル: `wO1i5nZPnQzO25Nk2eHxfw`
- 受領日: 2026-05-29
- 上位文脈: `../../docs/design.md` v0.2 / `../../docs/press-release-v0.5.md`
