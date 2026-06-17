# 現実科学研究所 LP — v6（2026-06-08 受領 新版）

2026-06-08 に Claude Design から受領した新ビルド（現実科学研究所 LP（standalone）.html）を
ベースとした版。v5 の編集知見を全て織り込み済みの状態で配布された。

## 公開URL

- LP: https://studiosaitama-llc.github.io/dhw-lab/v6/
- 趣意書: https://studiosaitama-llc.github.io/dhw-lab/v6/manifest/

## v3 / v5 との関係

| 版 | パス | 役割 |
|---|---|---|
| v3 | `/v3/` | 実験編集の sandbox（apply.py + element-edits.py で書き換え続ける） |
| v5 | `/v5/` | 2026-06-08 確定版を固定したスナップショット（v3 の派生） |
| **v6** | `/v6/` | **新ビルド本体**（Claude Design から再受領、v5 と同等以上の状態を最初から含む） |

v6 はそのまま受領版の HTML を index.html にリネームしただけ。v3/v5 で手作業
パッチしていた以下は v6 では新ビルド側に組み込み済み:

1. Hero 主役を「現実科学研究所」(漢字7文字) に
2. Hero subtitle 「現実は、編集できる。」固定（rotator 動的書き換えロジックが
   そもそも含まれていない）
3. UTUTU は背景透かしのみ（.hero__utut）
4. プロジェクト順序 PPP → シンギュラボ → 能動的セキュリティ学 → 雨にも負けず高校
5. footer の UTUTU マーク非表示（うつつ＝現実 のワードマーク表記は opacity .55 で薄く保持）
6. EST. 2026.07（趣意書 V.2 表記なし）
7. vcard h3 (プロフェッショナルたれ等) の CJK 中折り対策

新たに加わった要素:
- `.hero__kicker` REALITY SCIENCE INSTITUTE の小見出し
- `.hero__spectrum` 編集の5色帯
- `.hero__scroll` SCROLL インジケーター
- `.hero__top` § 00 / REALITY SCIENCE INSTITUTE のメタ表示
- `.foot__base span:first-child{ opacity:.55 !important; }` で
  「UTUTU ／ うつつ ＝ 現実」のワードマークを意図的に薄く見せる版に

## レスポンシブ

新ビルドが想定するブレークポイント:

| 幅 | 適用 |
|---|---|
| 900px 以下 | `.nav__links` 非表示、`.nav__mark` 縮小 |
| 860px 以下 | `.join__grid` 1カラム |
| 820px 以下 | `.chap` / `.grid2` / `.grid3` 1カラム |
| 760px 以下 | rail 非表示、`.foot__cols` 1カラム、`.hero__kicker` 非表示、`.hero__foot` 縦並び |

## manifest/

v5 と同じ趣意書 v2（平易版）ページを `/v6/manifest/` にも配置。
内容は `apps/lp/data/manifesto.md` の v2 版と等価（草稿時点で手動転記済み）。

## 構成

| ファイル | サイズ | 内容 |
|---|---|---|
| `index.html` | 約 22MB | 完全自己完結 (CSS / JS / フォント / 画像すべて埋込) |
| `manifest/index.html` | — | 趣意書 v2 (平易版) の専用ページ |

## ソース

`/Users/chiakikato/Downloads/現実科学研究所 LP（standalone）.html`（2026-06-08 22:57 受領）
