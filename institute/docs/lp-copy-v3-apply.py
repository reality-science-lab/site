#!/usr/bin/env python3
"""
docs/lp-copy-v3.md の編集内容を apps/lp/v3/index.html に反映する。

使い方:
  python3 docs/lp-copy-v3-apply.py            # 適用
  python3 docs/lp-copy-v3-apply.py --dry-run  # プレビュー

設計:
  - Markdown を `## section` / `### key` / 本文（複数行）でパース
  - 各キーを CSS セレクタにマップして HTML を更新
  - HTML は v3/index.html の script[3] に JSON 文字列として埋め込まれているので
    decode → 編集 → encode して書き戻す
"""

import json
import re
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup, NavigableString
except ImportError:
    sys.exit("beautifulsoup4 が必要: pip install --break-system-packages beautifulsoup4")

ROOT = Path(__file__).resolve().parent.parent  # dhw-lab/
MD_PATH = ROOT / "docs" / "lp-copy-v3.md"
HTML_PATH = ROOT / "apps" / "lp" / "v3" / "index.html"
DRY_RUN = "--dry-run" in sys.argv


# ============================================================================
# Markdown パーサ（H2/H3 → 階層 dict）
# ============================================================================
def parse_md(text: str) -> dict:
    """### key の下の本文をブロック単位で取り込む。"""
    out = {}
    current_section = None
    current_key = None
    buffer = []
    in_blockquote = False

    def flush():
        nonlocal buffer
        if current_section is None or current_key is None:
            buffer = []
            return
        val = "\n".join(buffer).strip()
        out.setdefault(current_section, {})[current_key] = val
        buffer = []

    for raw_line in text.split("\n"):
        line = raw_line.rstrip()
        # skip frontmatter quotes
        if line.startswith(">"):
            continue
        if line == "---":
            continue
        # H1 — ignore
        if line.startswith("# "):
            continue
        # H2 — new section
        if line.startswith("## "):
            flush()
            current_section = line[3:].strip()
            current_key = None
            continue
        # H3 — new key (`rail\_left` 等のエスケープを unescape)
        if line.startswith("### "):
            flush()
            current_key = line[4:].strip().replace("\\_", "_")
            buffer = []
            continue
        # otherwise: content line
        if current_key:
            buffer.append(line)

    flush()
    # Trim trailing empty values
    for sec, kvs in out.items():
        for k in list(kvs):
            kvs[k] = kvs[k].rstrip()
    return out


# ============================================================================
# 適用ヘルパ
# ============================================================================
def find(soup, sel, idx=0):
    els = soup.select(sel)
    return els[idx] if idx < len(els) else None


def set_text(tag, value):
    """要素内の最初のテキストノードのみ置換。子要素は保持。"""
    if tag is None or value is None:
        return False
    value = str(value).rstrip("\n")
    if not tag.find(True):
        tag.string = value
        return True
    for child in tag.children:
        if isinstance(child, NavigableString) and child.strip():
            child.replace_with(value)
            return True
    tag.string = value
    return True


def set_multiline(soup, tag, value):
    """改行を <br/> に変換して入れる。"""
    if tag is None:
        return False
    tag.clear()
    lines = value.rstrip("\n").split("\n")
    for i, line in enumerate(lines):
        if i > 0:
            tag.append(soup.new_tag("br"))
        tag.append(line)
    return True


# ============================================================================
# 適用本体
# ============================================================================
def apply_md(data: dict, soup: BeautifulSoup):
    ok = 0
    miss = 0

    def try_text(sel, value, idx=0):
        nonlocal ok, miss
        if value is None or value == "":
            return
        tag = find(soup, sel, idx)
        if tag is None:
            print(f"  MISS: {sel}[{idx}]")
            miss += 1
            return
        if set_text(tag, value):
            ok += 1
        else:
            miss += 1

    def try_multiline(sel, value, idx=0):
        nonlocal ok, miss
        if value is None or value == "":
            return
        tag = find(soup, sel, idx)
        if tag is None:
            print(f"  MISS: {sel}[{idx}]")
            miss += 1
            return
        if set_multiline(soup, tag, value):
            ok += 1
        else:
            miss += 1

    # === meta ===
    meta = data.get("meta", {})
    if meta.get("title"):
        soup.title.string = meta["title"]
        ok += 1
    if meta.get("description"):
        m = soup.find("meta", attrs={"name": "description"})
        if m:
            m["content"] = meta["description"]
            ok += 1

    # === nav ===
    nv = data.get("nav", {})
    try_text(".nav__name", nv.get("brand"))
    try_text('.nav__links a[href="#editing"]', nv.get("link_01"))
    try_text('.nav__links a[href="#mission"]', nv.get("link_02"))
    try_text('.nav__links a[href="#portfolio"]', nv.get("link_03"))
    try_text('.nav__links a[href="#values"]', nv.get("link_04"))
    try_text(".nav__cta", nv.get("cta"))

    # === hero ===
    hero = data.get("hero", {})
    try_text(".rail--l", hero.get("rail_left"))
    try_text(".rail--r", hero.get("rail_right"))
    try_text("#editBtn", hero.get("edit_button"))
    try_text(".hero__kanji", hero.get("kanji"))
    try_text(".hero__reading", hero.get("reading"))
    # bot
    bots = soup.select("#hero .hero__bot span")
    if not bots:
        # fallback by text
        targets = []
        for s in soup.select("#hero span"):
            txt = s.get_text(strip=True)
            if txt in ("うつつ ＝ 現実", "現実科学研究所", "学長 藤井直敬", "うつつ ＝ REALITY, EDITABLE", "DIR. 藤井直敬 · NAOTAKA FUJII"):
                targets.append(s)
        bots = targets
    for i, key in enumerate(["bot_left", "bot_center", "bot_right"]):
        if hero.get(key) and i < len(bots):
            set_text(bots[i], hero[key])
            ok += 1

    # === editing ===
    ed = data.get("editing", {})
    try_text("#editing .pill", ed.get("pill"))
    try_multiline("#editing .chap__title", ed.get("title"))
    try_text("#editing .chap__body", ed.get("body"))
    cards = soup.select("#editing .card")
    for i, c in enumerate(cards, 1):
        no = ed.get(f"card_{i}_no")
        ttl = ed.get(f"card_{i}_title")
        body = ed.get(f"card_{i}_body")
        if no:
            set_text(c.select_one(".card__no"), no); ok += 1
        if ttl:
            set_text(c.select_one("h3"), ttl); ok += 1
        if body:
            set_text(c.select_one("p"), body); ok += 1

    # === mission ===
    mi = data.get("mission", {})
    try_text("#mission .rule-label", mi.get("rule_label"))
    if mi.get("title_obj"):
        set_text(soup.select_one("#mission .mission__title .ink"), mi["title_obj"]); ok += 1
    if mi.get("title_particle"):
        set_text(soup.select_one("#mission .mission__title .g60"), mi["title_particle"]); ok += 1
    if mi.get("title_verb"):
        reds = soup.select("#mission .mission__title .red")
        if reds:
            set_text(reds[0], mi["title_verb"]); ok += 1
    try_text("#mission .mission__en", mi.get("en"))
    paras = soup.select("#mission .mission__cols p, #mission .grid2 p")
    if paras:
        if mi.get("body_1"):
            set_text(paras[0], mi["body_1"]); ok += 1
        if len(paras) >= 2:
            if mi.get("body_2_strong"):
                st = paras[1].select_one("strong")
                if st:
                    set_text(st, mi["body_2_strong"]); ok += 1
            if mi.get("body_2_rest"):
                for child in paras[1].children:
                    if isinstance(child, NavigableString) and child.strip():
                        child.replace_with(mi["body_2_rest"]); ok += 1
                        break
    # callout in mission
    if mi.get("callout_label"):
        try_multiline("#mission .callout__label", mi["callout_label"])
    callout_p = soup.select_one("#mission .callout p")
    if callout_p:
        strongs = callout_p.select("strong")
        if mi.get("callout_quote") and len(strongs) >= 1:
            set_text(strongs[0], mi["callout_quote"]); ok += 1
        if mi.get("callout_focus") and len(strongs) >= 2:
            set_text(strongs[1], mi["callout_focus"]); ok += 1

    # === portfolio ===
    pf = data.get("portfolio", {})
    try_text("#portfolio .pill", pf.get("pill"))
    try_multiline("#portfolio .chap__title", pf.get("title"))
    if pf.get("body"):
        # body is freeform; just replace text directly preserving structure may
        # be tricky if it has nested strong. Use simple set_text for now.
        bd = soup.select_one("#portfolio .chap__body")
        if bd:
            bd.clear()
            bd.append(pf["body"])
            ok += 1
    pcards = soup.select("#portfolio .pcard")
    for i, pc in enumerate(pcards, 1):
        for field, sel in [("no", ".pcard__no"), ("scale", ".pill"),
                           ("title", "h3"), ("body", "p"), ("meta", ".pcard__meta")]:
            key = f"proj_{i}_{field}"
            val = pf.get(key)
            if val:
                t = pc.select_one(sel)
                if t: set_text(t, val); ok += 1

    # === values ===
    vl = data.get("values", {})
    try_text("#values .pill", vl.get("pill"))
    if vl.get("title"):
        title_tag = soup.select_one("#values .chap__title")
        if title_tag:
            # Preserve the <em class="red"> structure
            em = title_tag.select_one("em.red")
            # The MD value is multi-line: "意志と責任を、\n貫く軸。"
            # Split by lines, last word in last line is in red usually
            lines = vl["title"].rstrip("\n").split("\n")
            title_tag.clear()
            # Reconstruct: line1 [br] line2 with last keyword highlighted
            for i, line in enumerate(lines):
                if i > 0:
                    title_tag.append(soup.new_tag("br"))
                # Find if the line has a keyword to highlight
                if em and line == lines[-1]:
                    # Highlight whole last line
                    em_new = soup.new_tag("em", attrs={"class": "red"})
                    em_new.string = line.rstrip("。、")
                    title_tag.append(em_new)
                    if line.endswith("。") or line.endswith("、"):
                        title_tag.append(line[-1])
                else:
                    title_tag.append(line)
            ok += 1
    try_text("#values .chap__body", vl.get("body"))
    vcards = soup.select("#values .vcard")
    for i, vc in enumerate(vcards, 1):
        for field, sel in [("label", ".vcard__label"), ("title", "h3"), ("body", "p")]:
            val = vl.get(f"value_{i}_{field}")
            if val:
                t = vc.select_one(sel)
                if t: set_text(t, val); ok += 1

    # === join ===
    jn = data.get("join", {})
    try_text("#join .pill", jn.get("pill"))
    if jn.get("title"):
        title_tag = soup.select_one("#join .chap__title")
        if title_tag:
            em = title_tag.select_one("em.red")
            lines = jn["title"].rstrip("\n").split("\n")
            # First line typically: "あなたは何色で、"
            title_tag.clear()
            for i, line in enumerate(lines):
                if i > 0:
                    title_tag.append(soup.new_tag("br"))
                # Highlight "何色" if present
                if "何色" in line and em is not None:
                    parts = line.split("何色", 1)
                    if parts[0]:
                        title_tag.append(parts[0])
                    em_new = soup.new_tag("em", attrs={"class": "red"})
                    em_new.string = "何色"
                    title_tag.append(em_new)
                    if parts[1]:
                        title_tag.append(parts[1])
                else:
                    title_tag.append(line)
            ok += 1
    try_text("#join .chap__body", jn.get("body"))
    try_text("#join .join__note", jn.get("note"))
    try_text("#join .join__formhead h3", jn.get("form_title"))
    labels = soup.select("#join .field label")
    label_keys = ["label_org", "label_name", "label_email", "label_interests", "label_msg"]
    for i, key in enumerate(label_keys):
        v = jn.get(key)
        if i < len(labels) and v:
            set_text(labels[i], v); ok += 1
    for sel, k in [("#f-org", "placeholder_org"), ("#f-name", "placeholder_name"),
                   ("#f-email", "placeholder_email"), ("#f-msg", "placeholder_msg")]:
        v = jn.get(k)
        t = soup.select_one(sel)
        if t and v:
            t["placeholder"] = v; ok += 1
    chips = soup.select("#join .chip")
    for i in range(1, 8):
        v = jn.get(f"chip_{i}")
        if i - 1 < len(chips) and v:
            set_text(chips[i - 1], v); ok += 1
    if jn.get("submit"):
        sb = soup.select_one('#join button[type="submit"]')
        if sb:
            # Has nested span.btn__sub? After my earlier edit, btn__sub was removed
            for child in sb.children:
                if isinstance(child, NavigableString) and child.strip():
                    child.replace_with(jn["submit"]); ok += 1
                    break
            else:
                sb.clear(); sb.append(jn["submit"]); ok += 1
    if jn.get("sent_msg"):
        t = soup.select_one("#joinSent")
        if t: set_text(t, jn["sent_msg"]); ok += 1

    # === footer ===
    ft = data.get("footer", {})
    fname = soup.select_one(".foot__name")
    if fname and (ft.get("brand_main") or ft.get("brand_sub")):
        fname.clear()
        if ft.get("brand_main"):
            fname.append(ft["brand_main"])
        fname.append(soup.new_tag("br"))
        if ft.get("brand_sub"):
            sub = soup.new_tag("span")
            sub.string = ft["brand_sub"]
            fname.append(sub)
        ok += 1
    foot_cols = soup.select(".foot__cols > div")
    for i, col in enumerate(foot_cols, 1):
        h = ft.get(f"col_{i}_h")
        body = ft.get(f"col_{i}_body")
        if h:
            t = col.select_one(".foot__h")
            if t: set_text(t, h); ok += 1
        if body:
            p = col.select_one("p")
            if p:
                set_multiline(soup, p, body); ok += 1
    base_spans = soup.select(".foot__base span")
    for i, key in enumerate(["base_1", "base_2", "base_3"]):
        v = ft.get(key)
        if i < len(base_spans) and v:
            set_text(base_spans[i], v); ok += 1

    return ok, miss


# ============================================================================
# main
# ============================================================================
def main():
    if not MD_PATH.exists():
        sys.exit(f"MD 未存在: {MD_PATH}")
    if not HTML_PATH.exists():
        sys.exit(f"v3 未存在: {HTML_PATH}")

    print(f"Loading MD: {MD_PATH}")
    md = MD_PATH.read_text(encoding="utf-8")
    data = parse_md(md)
    keys_total = sum(len(v) for v in data.values())
    print(f"  parsed: {len(data)} sections, {keys_total} keys")

    print(f"Loading HTML: {HTML_PATH}")
    content = HTML_PATH.read_text(encoding="utf-8")
    script_pat = re.compile(r'(<script(?:\s[^>]*)?>)([\s\S]*?)(</script>)')
    target = None
    for m in script_pat.finditer(content):
        body = m.group(2).strip()
        if body.startswith('"<!DOCTYPE') or body.startswith('"<!doctype'):
            target = m
            break
    if not target:
        sys.exit("v3 内に対象 script が見つからない")

    raw_body = target.group(2)
    leading = raw_body[:len(raw_body) - len(raw_body.lstrip())]
    trailing = raw_body[len(raw_body.rstrip()):]
    raw_html = json.loads(raw_body.strip())

    soup = BeautifulSoup(raw_html, "html.parser")
    print()
    ok, miss = apply_md(data, soup)
    print()
    print(f"=== 結果: {ok} 件 OK, {miss} 件 失敗 ===")

    new_html = str(soup)
    new_json = json.dumps(new_html, ensure_ascii=False).replace("</", "<\\u002F")
    new_body = leading + new_json + trailing
    new_content = content[:target.start(2)] + new_body + content[target.end(2):]

    if DRY_RUN:
        diff = len(new_content) - len(content)
        print(f"[DRY RUN] write skipped (diff {diff:+d} bytes)")
        return

    HTML_PATH.write_text(new_content, encoding="utf-8")
    print(f"OK: {HTML_PATH} を更新（{len(new_content)} bytes）")


if __name__ == "__main__":
    main()
