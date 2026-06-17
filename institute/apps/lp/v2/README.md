# 現実科学研究所 LP — v2（UTUTU モチーフ）

[utut.md](../../../docs/utut.md) で確立した UTUTU 視覚言語を反映した、v0/v1 とは別系統の LP プロトタイプ。

## v0 / v1 / v2 の関係

| 版 | パス | デザイン軸 | カラー |
|---|---|---|---|
| **v0** | `apps/lp/` | クリーム × 5色限定多色 × ポスター組版 | crema / vermilion / teal / indigo |
| **v1** | `apps/lp/v1/` | 紙・墨・朱・燐光（禁欲的明朝ベース） | 白紙 / 墨 / 朱 |
| **v2** | `apps/lp/v2/`（本ディレクトリ） | **UTUTU ＋ ベージュ紙 ＋ 縄文紋様** | bg-cream / ink-charcoal / jomon-earth / edit-red |

→ v0/v1 はアーカイブとして保持。今後の主軸は v2。

## 設計の出典

| ソース | 反映箇所 |
|---|---|
| `docs/utut.md` §1「由来」 | UTUTU 5文字ロゴ（U-T-U-T-U） |
| `docs/utut.md` §4.1「公式ロゴ」 | Hero / Footer のベージュ＋濃グレー |
| `docs/utut.md` §4.2「透過レイヤー」 | §02 の「バラバラ」3層重ね |
| `docs/utut.md` §4.3「縄文紋様」 | Hero 背景薄重ね／§05 薄敷き／§06 学長メッセージ背景 |
| `docs/utut.md` §4.5「組み合わせ／バラバラ」 | §03 §04 で単一文字 U/T を符号化 |
| `docs/utut.md` §4.7「棄却案」 | カラフル3色／グリッチ／障子は不使用 |
| `docs/utut.md` §5「カラートークン」 | `styles/v2-tokens.css` に実装 |
| `docs/utut.md` §6.1「LP マッピング」 | セクション構成全体に反映 |
| `docs/intent-statement-v2.md` | コピー本文の正本 |

## セクション構成

| § | セクション | UTUTU 使い方 |
|---|---|---|
| § 00 | Hero | 公式 UTUTU ロゴ ＋ 縄文紋様 薄重ね背景 |
| § 01 | なぜ、いま | テキスト主体（UTUTU 装飾なし、白場を守る） |
| § 02 | 現実科学とは | **透過3層 UTUTU**（バラバラ）＋「現実＝うつつ＝UTUTU」訓読み引き込み |
| § 03 | 4スケール | 各セルに U / T 単独文字を符号として配置 |
| § 04 | 旗艦プロジェクト | 各カードに U / T 符号 |
| § 05 | なぜDHUか | 縄文紋様 薄敷き背景 |
| § 06 | 学長メッセージ | 縄文土色 全面背景 ＋ 白 UTUTU |
| § 07 | 参画 | フォーム中心、「世界を満たす」に赤下線 |

## 構成ファイル

| ファイル | 役割 |
|---|---|
| `index.html` | エントリ。フォント／CSS／JSX のロード |
| `styles/v2-tokens.css` | カラートークン（utut.md §5.1 準拠） |
| `styles/v2-app.css` | 全セクションのレイアウト・コンポーネント CSS |
| `v2-components.jsx` | `UTUTULogo` / `UTUTULetter` / `UTUTULayer` / `JomonPattern` / `TopBar` / `Footer` / `ScrollProgress` / `ChapterMarkFixed` / `WordCycle` |
| `v2-sections.jsx` | 全8セクション |
| `v2-app.jsx` | App コンポジション |

## 技術スタック

- React 18.3.1（CDN／UMD）
- Babel Standalone（ブラウザ内 JSX 変換）
- Google Fonts: Zen Old Mincho / Zen Kaku Gothic New / Shippori Mincho B1 / IBM Plex Mono
- ビルド不要のプロトタイプ。本実装は Vite + React (TS) or Astro 想定

## カラートークン

```
/* 公式パレット（utut.md §5.1） */
--bg-cream:      #E8E2D3   ベージュ／教科書紙
--ink-charcoal:  #2A2A28   濃グレー（黒の置換）
--paper-white:   #FAF7EE   紙の白（純白ではない）
--jomon-earth:   #6B4A2E   縄文土色
--edit-red:      #D6422E   編集の赤（1スクリーン1点）
--hairline:      #B8B0A0   罫線・キャプション用
--margin-gray:   #D8D2C2   セクション分割
```

## 棄却された方向（参照）

utut.md §4.7 の棄却案は v2 でも踏襲：
- ❌ カラフル3色アクセント（黄／ティール／ピンク）
- ❌ 純黒背景
- ❌ グリッチ装飾
- ❌ 障子背景
- ❌ 鳥イラスト（LP本体では未使用、SNS／教育用に限定）

## ローカル起動

```bash
cd /Users/chiakikato/Projects/studiosaitama/clients/dhw-lab/apps/lp
python3 -m http.server 5173
# その後ブラウザで
open http://localhost:5173/v2/
```

## 残課題

- UTUTU 文字パスは手描き感を簡略化した SVG。Keiko 原本の Illustrator データから精緻な版へ差し替え可能
- 縄文紋様は SVG プロシージャル生成。Keiko 提案 PDF p.3 の実物テクスチャに差し替えるオプションあり
- Adobe Stock の元素材（縄文土器写真等）の利用権確認後、`assets/utut/` から実画像を読み込む選択肢あり
- 学長メッセージのコピーは藤井学長レビュー前の暫定版
- フォーム実装は alert モック。Tally / Google Forms / 自前 API へ差し替え

## 関連

- `docs/utut.md` — UTUTU 視覚言語仕様
- `docs/intent-statement-v2.md` — 設立趣意書 v2（コピー正本）
- `docs/lp-wireframe.md` — LP ワイヤーフレーム（v0 基準だが構造は v2 でも参照）
- `docs/assets/utut/UTUTU_v1_2026-06-05.pdf` — Keiko 提案 PDF（採用ページ：p.2 / p.3 / p.7 / p.8 / p.9-12）
