# 現実科学研究所 v1（初稿版 — 紙・墨・朱・燐光）

design.md v0.2 とは別系統の代替トーン提案。
**紙（paper）・墨（ink）・朱（shu）・燐光（rin）** を中核とした、より禁欲的な日本的明朝ベースのデザイン。

## v0（ルート `/`）との違い

| 軸 | v0（`/`） | v1（`/v1/`） |
|---|---|---|
| 基底色 | Crema `#F4E9D2` | Paper `#F0EBE0`（より沈んだ紙） |
| 主インク | `#1A1A18`（インクの黒） | `#0B0B0C`（純度の高い墨） |
| 朱 | Editor's Vermilion `#E54B2A` | 朱 `#E63312`（より赤に寄った日本の朱） |
| 補助色 | Cognition Teal / Indigo / 4スケール色 | 燐光 `#7CFFB0` / Aqua `#1FB8C2`（極限定） |
| 書体方針 | 三声部対位法（DM Serif / Zen Old Mincho / JetBrains Mono） | 明朝中心（Shippori Mincho B1 / Zen Kaku Gothic New / JetBrains Mono） |
| トーン | 編集多幸感・ポスター組版・色面で語る | 禁欲・墨と紙・燐光の一閃 |

## 構成

| ファイル | 役割 |
|---|---|
| `index.html` | エントリ |
| `styles/v1-tokens.css` | デザイントークン |
| `styles/v1-app.css` | アプリ全体スタイル |
| `v1-components.jsx` | 共有コンポーネント |
| `v1-sections.jsx` | セクション群 |
| `v1-app.jsx` | App コンポジション |

## 起動

ルートの `apps/lp/` から HTTP サーバを起動し、`http://localhost:5173/v1/` にアクセス。

```bash
cd /Users/chiakikato/Projects/studiosaitama/clients/dhw-lab/apps/lp
python3 -m http.server 5173
# → http://localhost:5173/v1/
```

GitHub Pages 上では: **https://studiosaitama-llc.github.io/dhw-lab/v1/**

## ハンドオフ元

- Claude Design バンドル: `h5eHrXDx_7y-YUCEqlIDRw`
- 受領日: 2026-05-29
