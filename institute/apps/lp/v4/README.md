# 現実科学研究所 UTUTU — v4（standalone bundle）

UTUTU 視覚言語を全面適用した standalone な単一 HTML（外部 CDN・JS フェッチに依存しない自己完結版）。

## v0 / v1 / v2 / v3 / v4 の位置付け

| 版 | パス | 性質 | 用途 |
|---|---|---|---|
| v0 | `/` | プロトタイプ（JSX + Babel CDN） | エディトリアル組版実験 |
| v1 | `/v1/` | プロトタイプ（JSX + Babel CDN） | 紙・墨・朱・燐光 |
| v2 | `/v2/` | プロトタイプ（JSX + Babel CDN） | UTUTU JSX 試作 |
| v3 | `/v3/` | **standalone 単一 HTML** | LP 本番候補 |
| **v4** | `/v4/`（本ディレクトリ） | **standalone 単一 HTML** | **UTUTU 本番候補** |

## 構成

| ファイル | サイズ | 内容 |
|---|---|---|
| `index.html` | 約 20MB | 完全自己完結（CSS / JS / フォント / 画像すべて埋込） |

## 公開URL（マージ後）

https://studiosaitama-llc.github.io/dhw-lab/v4/

## 元素材

`現実科学研究所 UTUTU (standalone).html`（2026-06-05 受領）。元 HTML をそのまま `index.html` にリネームして配置。

## 設計の出典

- [[utut.md]] — UTUTU 視覚言語仕様（採用ページ p.2 / p.3 / p.7 / p.8 / p.9-12）
- [[intent-statement-v2.md]] — 設立趣意書 v2（コピー正本）

## 注意

- ファイルサイズが大きい（20MB）。git diff レビューは差分が見えにくい点に注意
- 内容更新は元の素材で行い、書き出しを再配置する運用が想定される
