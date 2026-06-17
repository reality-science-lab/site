#!/usr/bin/env python3
"""
v3 LP に対する要素編集（2026-06-08 受領の PDF/CSV フィードバック反映）。

CSV 番号と編集内容:
  1. #editBtn を削除
  2. Hero の UTUTU 大ロゴ（.hero__mark）を背景模様レベルまで弱める
  3. Footer のロゴ表記を「UTUTU」から「現実科学研究所」（漢字7文字）に差し替え
  4. .hero__reading（"U・T・U・T・U ／ うつつ ＝ 現実"）を削除
  5. .hero__strip（うつつ＝現実 / 現実科学研究所 / 学長 藤井直敬）と
     .hero__jomon（背景の縄文モチーフ）を削除
  6. 5 の strip 削除に含まれる
  7. .hero__line のローテータを固定「現実は、編集できる。」化

使い方:
  python3 docs/lp-v3-element-edits.py
  python3 docs/lp-v3-element-edits.py --dry-run
"""

import json
import re
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("pip install --break-system-packages beautifulsoup4")

ROOT = Path(__file__).resolve().parent.parent
HTML_PATH = ROOT / "apps" / "lp" / "v3" / "index.html"
DRY_RUN = "--dry-run" in sys.argv


def apply_edits(soup: BeautifulSoup) -> list:
    log = []

    # 1. Edit ボタン削除
    btn = soup.select_one("#editBtn")
    if btn:
        btn.decompose()
        log.append("1: #editBtn removed")

    # 2. Hero UTUTU 大ロゴを背景模様レベルに弱める (idempotent)
    mark = soup.select_one(".hero__mark")
    if mark:
        bg_style = "opacity: 0.16; pointer-events: none;"
        mark["style"] = bg_style
        log.append("2: .hero__mark muted to background pattern level (opacity 0.16)")

    # 4. Reading 削除
    reading = soup.select_one(".hero__reading")
    if reading:
        reading.decompose()
        log.append("4: .hero__reading removed")

    # 5+6. hero__strip と hero__jomon 削除
    strip = soup.select_one(".hero__strip")
    if strip:
        strip.decompose()
        log.append("5: .hero__strip removed (うつつ＝現実 / 現実科学研究所 / 学長 藤井直敬)")
    jomon = soup.select_one(".hero__jomon")
    if jomon:
        jomon.decompose()
        log.append("5: .hero__jomon (縄文背景) removed")

    # 7. Rotator を固定化
    rotator = soup.select_one("#rotator")
    if rotator:
        rotator.clear()
        rotator.append("現実")
        if "id" in rotator.attrs:
            del rotator["id"]
        if "aria-live" in rotator.attrs:
            del rotator["aria-live"]
        if "class" in rotator.attrs:
            del rotator["class"]
        log.append("7: rotator made static (現実は、編集できる。 fixed)")

    # 3. Footer のロゴを「現実科学研究所」（漢字7文字）に差し替え
    foot_name = soup.select_one(".foot__name")
    if foot_name:
        foot_name.clear()
        foot_name.append("現実科学研究所")
        foot_name.append(soup.new_tag("br"))
        sub = soup.new_tag("span")
        sub.string = "REALITY SCIENCE INSTITUTE"
        foot_name.append(sub)
        log.append("3: .foot__name → 現実科学研究所（漢字7文字）, UTUTU は foot__mark の背景として保持")

    # apply.py の set_text 制限で残ってしまう editing/values の chap__body を強制再構築。
    # 「現実編集」「意志と責任」の strong 強調は維持。

    editing_body = soup.select_one("#editing .chap__body")
    if editing_body:
        editing_body.clear()
        editing_body.append("「動かない」と思い込まれてきた前提や境界を、意識的に見直し、別のかたちへと組み直す実践 ― これを本研究所では")
        em = soup.new_tag("strong", attrs={"class": "red"})
        em.string = "現実編集"
        editing_body.append(em)
        editing_body.append("と呼ぶ。天才や名匠が直感で行ってきたこの編集を、誰もが学び、実践できる技術へ引き上げる。")
        log.append("cleanup: #editing .chap__body を再構築 (現実編集 strong 維持)")

    values_body = soup.select_one("#values .chap__body")
    if values_body:
        values_body.clear()
        values_body.append("三つの行動指針に通底する一つの軸が")
        em2 = soup.new_tag("strong", attrs={"class": "red"})
        em2.string = "意志と責任"
        values_body.append(em2)
        values_body.append("である。現実は編集できる。だからこそ、編集する意志を持ち、結果に責任を引き受ける。意志なき自由は流され、責任なき編集は他者の現実を傷つける。")
        log.append("cleanup: #values .chap__body を再構築 (意志と責任 strong 維持)")

    # 2nd round (2026-06-08 follow-up):
    # 8. Hero kanji を「現実」→「現実科学研究所」(漢字7文字) に
    # 9. 7 文字に合わせて hero__kanji の font-size を縮小
    # 10. プロジェクト順序を反転 (PPP → シンギュラボ → セキュリティ → 高校)
    #     + chap__body の自己→文化方向の説明を更新
    # 11. P-02 など apply.py で残ってた pcard 旧内容を全面書き直し

    # 8. Hero kanji 文字差し替え
    kanji = soup.select_one(".hero__kanji")
    if kanji:
        kanji.clear()
        kanji.append("現実科学研究所")
        log.append("8: .hero__kanji → 現実科学研究所 (漢字7文字)")

    # 9. CSS 上書き (style 要素を追加 / 既にあれば内容を更新)
    head = soup.select_one("head")
    if head:
        css = (
            "/* 2026-06-08 hero / footer / vcard tuning */\n"
            "/* Hero を border 込みで初回ビューポートに収める (margin:12px ×上下 ＝ 24px を差し引く) */\n"
            ".hero { min-height: 0 !important; height: calc(100svh - 24px); padding-top: clamp(4rem, 9vh, 6rem) !important; padding-bottom: clamp(1.5rem, 4vh, 3rem) !important; }\n"
            ".hero__kanji { font-size: clamp(2.4rem, 8.6vw, 7rem); letter-spacing: .06em; margin-top: 0; line-height: 1.05; }\n"
            ".hero__stage { display: grid; grid-template-areas: 'stack'; place-items: center; }\n"
            ".hero__stage > * { grid-area: stack; }\n"
            ".hero__mark { width: min(620px, 80%); }\n"
            ".hero__line { margin-top: .8rem; margin-bottom: 0; font-size: clamp(1.4rem, 3.4vw, 2.6rem); }\n"
            "/* Footer の UTUTU 痕跡を消す */\n"
            ".foot__mark { display: none !important; }\n"
            ".foot__base span:first-child { opacity: 0; pointer-events: none; }\n"
            "/* vcard h3 が CJK 中折りで崩れる対策 */\n"
            ".vcard h3 { word-break: keep-all; overflow-wrap: anywhere; text-wrap: balance; font-size: clamp(1.2rem, 2.3vw, 1.5rem); }\n"
        )
        existing = soup.select_one("#hero-tuning-css")
        if existing:
            existing.string = css
            log.append("9: tuning CSS 更新 (hero / footer UTUTU 非表示 / vcard h3 word-break)")
        else:
            style = soup.new_tag("style", id="hero-tuning-css")
            style.string = css
            head.append(style)
            log.append("9: tuning CSS 追加 (hero / footer UTUTU 非表示 / vcard h3 word-break)")

    # 10. Portfolio chap__body — 外側→内側 (文化→自己) の順に書き換え
    portfolio_body = soup.select_one("#portfolio .chap__body")
    if portfolio_body:
        portfolio_body.clear()
        portfolio_body.append(
            "設立時に取り組む四つの旗艦プロジェクト。"
            "文化 → 創発 → 境界 → 自己 という異なるスケールで現実編集を担い、"
            "外側から内側へ領域を絞っていく。"
            "「現実編集とは何か」を社会に示すショーケースだ。"
        )
        log.append("10: #portfolio .chap__body 順序説明を 文化→自己 に更新")

    # 12. lp-copy 上の markdown link 記法を LP では平文化する
    #     (apply.py は set_text で素の文字列を流し込むため、`[label](mailto:..)` が
    #      そのまま見えてしまう。footer 連絡先 / form の email placeholder が該当)
    import re as _re
    md_link = _re.compile(r"\[([^\]]+)\]\((?:mailto:)?([^)]+)\)")

    # Footer 連絡先 (3列目の <p>)
    foot_p = soup.select_one(".foot__cols > div:nth-of-type(3) p")
    if foot_p:
        old = foot_p.get_text()
        new = md_link.sub(r"\1", old)
        if new != old:
            foot_p.clear()
            for i, segment in enumerate(new.split(" ")):
                if i > 0:
                    foot_p.append(" ")
                foot_p.append(segment)
            log.append("12: footer 連絡先 のマークダウンリンクを平文化")

    # Email placeholder (input#f-email の placeholder)
    email_input = soup.select_one("#f-email")
    if email_input:
        ph = email_input.get("placeholder", "")
        new_ph = md_link.sub(r"\1", ph)
        if new_ph != ph:
            email_input["placeholder"] = new_ph
            log.append("12: #f-email placeholder のマークダウンリンクを平文化")

    # 11. pcards を新順序で完全に書き直す
    new_cards = [
        {
            "no": "P-01",
            "scale": "文化 · CULTURE",
            "title": "Pop Power Project",
            "body": "アニメ・マンガ・ゲーム・音楽、産業規模で行われてきた現実編集の最大の成功例。本研究所はPPP事務局を担い、コンテンツ産業を「現実編集産業」として再定義。日本のクリエイターが編集した現実を、世界を満たすコンテンツとして流通させる。",
            "meta": "PPP 事務局 ／ コンテンツ産業各社",
            "glow": "var(--c-blue)",
        },
        {
            "no": "P-02",
            "scale": "創発 · EMERGENCE",
            "title": "シンギュラボ 連携",
            "body": "スペースデータ社（佐藤航陽氏）主催のシンギュラボとの連携。研究者・起業家・アーティスト・市民が境界を越え、ボトムアップで課題を発見し解決する創発コミュニティ。研究機関の知とコミュニティの即興力を接合する。",
            "meta": "スペースデータ ／ シンギュラボ",
            "glow": "var(--c-yellow)",
        },
        {
            "no": "P-03",
            "scale": "境界 · BORDER",
            "title": "能動的セキュリティ学",
            "body": "田中悠斗特任教授を中心に立ち上げるサイバーセキュリティ研究の新領域。「システム内外両方からの視点も持たずにシステム防御は困難」。これは現実科学の核心と重なる。これまでの防御中心であったサイバーセキュリティのあり方を編集し、ワールド・スタンダードな学問と実践へ昇華させる。",
            "meta": "田中悠斗 特任教授 ／ サイバーセキュリティ ハブ",
            "glow": "var(--c-pink)",
        },
        {
            "no": "P-04",
            "scale": "自己 · SELF",
            "title": "雨にも負けず高校 連携",
            "body": "2027年4月開校予定の雨にも負けず高校との高大連携。最も自己定義が硬化しやすい15〜18歳に、可動域を保ったまま大人になる訓練を提供する。レジリエンス教育を「自己定義を更新し続ける力」として再定義。",
            "meta": "雨にも負けず高校 ／ DHU 高大接続",
            "glow": "var(--c-teal)",
        },
    ]
    grid = soup.select_one("#portfolio .grid2.pf")
    if grid:
        existing = grid.select("article.pcard")
        delays = [pc.get("data-delay", "1") for pc in existing[:4]] + ["1", "2", "1", "2"]
        for pc in existing:
            pc.decompose()
        for i, card in enumerate(new_cards):
            article = soup.new_tag(
                "article",
                attrs={
                    "class": "pcard reveal",
                    "data-delay": delays[i],
                    "style": f"--glow:{card['glow']}",
                },
            )
            top = soup.new_tag("div", attrs={"class": "pcard__top"})
            no_span = soup.new_tag("span", attrs={"class": "pcard__no"})
            no_span.string = card["no"]
            top.append(no_span)
            pill = soup.new_tag("span", attrs={"class": "pill pill--sm"})
            pill.string = card["scale"]
            top.append(pill)
            article.append(top)
            h3 = soup.new_tag("h3")
            h3.string = card["title"]
            article.append(h3)
            p = soup.new_tag("p")
            p.string = card["body"]
            article.append(p)
            meta = soup.new_tag("span", attrs={"class": "pcard__meta"})
            meta.string = card["meta"]
            article.append(meta)
            grid.append(article)
        log.append("11: #portfolio pcards 4件を新順序 (PPP→シンギュラボ→セキュリティ→高校) で再構築")

    return log


def main():
    if not HTML_PATH.exists():
        sys.exit(f"missing: {HTML_PATH}")

    content = HTML_PATH.read_text(encoding="utf-8")
    script_pat = re.compile(r'(<script(?:\s[^>]*)?>)([\s\S]*?)(</script>)')
    target = None
    for m in script_pat.finditer(content):
        body = m.group(2).strip()
        if body.startswith('"<!DOCTYPE') or body.startswith('"<!doctype'):
            target = m
            break
    if not target:
        sys.exit("no embedded HTML script")

    raw_body = target.group(2)
    leading = raw_body[:len(raw_body) - len(raw_body.lstrip())]
    trailing = raw_body[len(raw_body.rstrip()):]
    raw_html = json.loads(raw_body.strip())

    soup = BeautifulSoup(raw_html, "html.parser")
    log = apply_edits(soup)
    print(f"=== applied {len(log)} edits ===")
    for line in log:
        print(f"  {line}")

    new_html = str(soup)
    new_json = json.dumps(new_html, ensure_ascii=False).replace("</", "<\\u002F")
    new_body = leading + new_json + trailing
    new_content = content[:target.start(2)] + new_body + content[target.end(2):]

    if DRY_RUN:
        print(f"[DRY] would write {len(new_content)} bytes (diff {len(new_content) - len(content):+d})")
        return

    HTML_PATH.write_text(new_content, encoding="utf-8")
    print(f"OK: {HTML_PATH} updated ({len(new_content)} bytes)")


if __name__ == "__main__":
    main()
