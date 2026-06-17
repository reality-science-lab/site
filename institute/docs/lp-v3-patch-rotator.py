#!/usr/bin/env python3
"""
v3/index.html の bundler manifest 内 JS (700588d0-...) にある
hero__line ローテーター (CATCHES × setInterval) を無効化する。

理由:
  hero subtitle は「現実は、編集できる。」で固定したいが、JS が 3.4 秒ごとに
  innerHTML を ["前提", "組み直せる"] 等で上書きしているため、HTML だけ
  書き換えても元に戻されていた。

  applyCatch を no-op に、setInterval(editReality) も外す。
  UTUTU の recolor / hover 効果は editReality の `full` パスで動くので、
  そちらは温存。
"""
import base64, gzip, json, re, sys
from pathlib import Path

HTML_PATH = Path("/Users/chiakikato/Projects/studiosaitama/clients/dhw-lab/apps/lp/v3/index.html")
JS_UUID = "700588d0-7997-47e3-87bb-565b6e1dc96b"

content = HTML_PATH.read_text(encoding="utf-8")
m_pat = re.compile(r'(<script[^>]*type="__bundler/manifest"[^>]*>)([\s\S]*?)(</script>)')
m = m_pat.search(content)
if not m:
    sys.exit("manifest script not found")
manifest = json.loads(m.group(2))

entry = manifest[JS_UUID]
raw = base64.b64decode(entry["data"])
if entry.get("compressed"):
    js = gzip.decompress(raw).decode("utf-8")
else:
    js = raw.decode("utf-8")

orig_len = len(js)

# Patch 1: applyCatch 関数を no-op に。
#   function applyCatch(idx) { ... 複数行 ... } をネスト含めて括弧マッチで切り出す。
def replace_function_body(src: str, fname: str, new_body: str) -> str:
    sig = f"function {fname}("
    i = src.find(sig)
    if i < 0:
        return src
    # find first `{` after signature
    brace_open = src.find("{", i)
    if brace_open < 0:
        return src
    depth = 0
    j = brace_open
    while j < len(src):
        c = src[j]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return src[:brace_open + 1] + new_body + src[j:]
        j += 1
    return src

js_new = replace_function_body(
    js, "applyCatch",
    " /* disabled: hero line is fixed at 「現実は、編集できる。」 */ return; "
)

# Patch 2: 自動編集 setInterval を停止
js_new = re.sub(
    r"if \(!reduce\) setInterval\(\(\) => editReality\(false\), 3400\);",
    "/* auto-rotation disabled */",
    js_new,
    count=1,
)

# Patch 3: applyCatch を呼んでいる editReality 側も applyCatch を抜く
js_new = re.sub(
    r"try \{ applyCatch\(ci\); \} catch \(e\) \{\}",
    "/* applyCatch disabled */",
    js_new,
    count=1,
)

if js_new == js:
    sys.exit("no patches applied — JS pattern changed?")

print(f"JS: {orig_len} → {len(js_new)} chars")
for label, before, after in [
    ("applyCatch", "lineEl.innerHTML" in js, "lineEl.innerHTML" in js_new),
    ("setInterval", "setInterval(() => editReality(false), 3400)" in js, "setInterval(() => editReality(false), 3400)" in js_new),
]:
    print(f"  {label}: before={before} after={after}")

# Re-compress + re-encode
new_raw = gzip.compress(js_new.encode("utf-8"))
entry["data"] = base64.b64encode(new_raw).decode("ascii")

new_manifest_json = json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))
# Escape </script for safe embedding in <script>
new_manifest_json = new_manifest_json.replace("</", "<\\/")
new_content = content[:m.start(2)] + new_manifest_json + content[m.end(2):]
HTML_PATH.write_text(new_content, encoding="utf-8")
print(f"OK: wrote {len(new_content)} bytes")
