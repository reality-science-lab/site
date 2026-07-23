// Build the revised information architecture as an unlisted preview under
// /sample/, while leaving the currently published root site unchanged.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flatten, isBundlerExport } from './flatten-lp.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LP = path.join(ROOT, 'institute', 'apps', 'lp', 'v7');
const SAMPLE_PATH = '/sample';
const SAMPLE_DIR = path.join(DIST, SAMPLE_PATH.slice(1));
const PRODUCTION_ORIGIN = 'https://reality-science.com';
const SAMPLE_ORIGIN = `${PRODUCTION_ORIGIN}${SAMPLE_PATH}`;

if (!fs.existsSync(DIST)) {
  throw new Error('dist/ not found. Run the Astro build before building /sample/.');
}

const sampleUrl = (pathname = '/') =>
  `${SAMPLE_PATH}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

const writeSample = (relativePath, html) => {
  const destination = path.join(SAMPLE_DIR, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
};

const readLp = (relativePath) => {
  const html = fs.readFileSync(path.join(LP, relativePath), 'utf8');
  return isBundlerExport(html) ? flatten(html) : html;
};

// Copy only content that is already part of the public site. The institute
// source tree remains private except for the selected LP and its manifesto.
fs.rmSync(SAMPLE_DIR, { recursive: true, force: true });
fs.mkdirSync(SAMPLE_DIR, { recursive: true });

const excludedRootEntries = new Set([
  SAMPLE_PATH.slice(1),
  'institute',
  'CNAME',
  '.nojekyll',
]);

for (const entry of fs.readdirSync(DIST, { withFileTypes: true })) {
  if (excludedRootEntries.has(entry.name)) continue;
  const source = path.join(DIST, entry.name);
  const destination = path.join(SAMPLE_DIR, entry.name);
  fs.cpSync(source, destination, { recursive: entry.isDirectory() });
}

let home = readLp('index.html');
home = home.replace(
  /href=(["'])(?:\.\/)?manifest\/\1/,
  `href="${sampleUrl('/manifest/')}"`
);
writeSample('index.html', home);

let manifest = readLp(path.join('manifest', 'index.html'));
manifest = manifest.replace(
  /<a class="back" href="\.\.\/">/,
  `<a class="back" href="${sampleUrl('/')}">`
);
writeSample(path.join('manifest', 'index.html'), manifest);

const lpAssets = path.join(LP, 'assets');
if (fs.existsSync(lpAssets)) {
  fs.cpSync(lpAssets, path.join(SAMPLE_DIR, 'assets'), { recursive: true });
}

const redirect = (from, to) => {
  const target = sampleUrl(to);
  writeSample(
    path.join(from, 'index.html'),
    `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0;url=${target}">
<link rel="canonical" href="${SAMPLE_ORIGIN}${to}">
<title>移動しました</title>
</head>
<body><p><a href="${target}">${target}</a> へ移動しました。</p></body>
</html>`
  );
};

redirect('event', '/lecture/');

const sampleSegment = SAMPLE_PATH.slice(1);
const negative = `(?!\\/|${sampleSegment}(?:\\/|["']))`;

function rewriteReferences(content, isCss) {
  let rewritten = content.replace(
    new RegExp(`${PRODUCTION_ORIGIN.replaceAll('.', '\\.')}\\/(?!${sampleSegment}(?:\\/|$))`, 'g'),
    `${SAMPLE_ORIGIN}/`
  );

  if (isCss) {
    return rewritten.replace(
      new RegExp(`url\\((['"]?)\\/${negative}`, 'g'),
      `url($1${SAMPLE_PATH}/`
    );
  }

  rewritten = rewritten.replace(
    new RegExp(`(\\s(?:href|src|action|poster)=(["']))\\/${negative}`, 'gi'),
    `$1${SAMPLE_PATH}/`
  );
  rewritten = rewritten.replace(/(\ssrcset=(["']))([^"']*)\2/gi, (_, prefix, quote, value) => {
    const fixed = value.replace(
      new RegExp(`(^|,\\s*)\\/${negative}`, 'g'),
      `$1${SAMPLE_PATH}/`
    );
    return `${prefix}${fixed}${quote}`;
  });
  rewritten = rewritten.replace(
    new RegExp(`url\\((['"]?)\\/${negative}`, 'g'),
    `url($1${SAMPLE_PATH}/`
  );
  rewritten = rewritten.replace(
    /\\\/(wp-content|wp-includes|assets)\\\//g,
    `\\/${sampleSegment}\\/$1\\/`
  );
  return rewritten;
}

const MENU_STYLE = `<style id="sample-site-menu-style">
.elementor-widget-nav-menu { display: none !important; }
.sample-site-menu {
  position: fixed;
  z-index: 10000;
  top: 92px;
  right: 24px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.sample-site-menu__toggle {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid rgba(42, 42, 40, .72);
  border-radius: 50%;
  color: #2a2a28;
  background: rgba(232, 226, 211, .92);
  box-shadow: 0 6px 22px rgba(42, 42, 40, .14);
  backdrop-filter: blur(8px);
  cursor: pointer;
}
.sample-site-menu__icon,
.sample-site-menu__icon::before,
.sample-site-menu__icon::after {
  display: block;
  width: 19px;
  height: 1px;
  background: currentColor;
  transition: transform .2s ease, opacity .2s ease;
}
.sample-site-menu__icon { position: relative; }
.sample-site-menu__icon::before,
.sample-site-menu__icon::after {
  position: absolute;
  left: 0;
  content: "";
}
.sample-site-menu__icon::before { top: -6px; }
.sample-site-menu__icon::after { top: 6px; }
.sample-site-menu.is-open .sample-site-menu__icon { background: transparent; }
.sample-site-menu.is-open .sample-site-menu__icon::before { top: 0; transform: rotate(45deg); }
.sample-site-menu.is-open .sample-site-menu__icon::after { top: 0; transform: rotate(-45deg); }
.sample-site-menu__panel {
  position: absolute;
  top: 56px;
  right: 0;
  width: min(310px, calc(100vw - 32px));
  padding: 18px;
  border: 1px solid rgba(232, 226, 211, .22);
  border-radius: 4px;
  background: rgba(42, 42, 40, .97);
  box-shadow: 0 18px 50px rgba(42, 42, 40, .28);
}
.sample-site-menu__panel[hidden] { display: none; }
.sample-site-menu__panel a {
  display: flex;
  justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid rgba(232, 226, 211, .16);
  color: #e8e2d3;
  font-size: .76rem;
  letter-spacing: .1em;
  text-decoration: none;
}
.sample-site-menu__panel a:last-child { border-bottom: 0; }
.sample-site-menu__panel a::after { content: "↗"; color: #d6422e; }
@media (max-width: 860px) {
  .sample-site-menu { top: 86px; right: 16px; }
  .sample-site-menu__toggle { width: 44px; height: 44px; }
  .sample-site-menu__panel { top: 52px; }
}
</style>`;

const MENU_MARKUP = `<div class="sample-site-menu" id="sampleSiteMenu">
<button class="sample-site-menu__toggle" type="button" aria-controls="sampleSiteMenuPanel" aria-expanded="false" aria-label="サイトメニューを開く">
<span class="sample-site-menu__icon" aria-hidden="true"></span>
</button>
<nav class="sample-site-menu__panel" id="sampleSiteMenuPanel" aria-label="サイトメニュー" hidden>
<a href="${sampleUrl('/')}">HOME</a>
<a href="${sampleUrl('/lecture/')}">LECTURE</a>
<a href="${sampleUrl('/about/')}">ABOUT</a>
<a href="${sampleUrl('/news/')}">NEWS</a>
<a href="${sampleUrl('/join/')}">JOIN</a>
<a href="${sampleUrl('/contact/')}">CONTACT</a>
</nav>
</div>
<script id="sample-site-menu-script">
(function () {
  var menu = document.getElementById('sampleSiteMenu');
  if (!menu) return;
  var button = menu.querySelector('.sample-site-menu__toggle');
  var panel = document.getElementById('sampleSiteMenuPanel');
  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    panel.hidden = !open;
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.setAttribute('aria-label', open ? 'サイトメニューを閉じる' : 'サイトメニューを開く');
  }
  button.addEventListener('click', function () {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setOpen(false);
      button.focus();
    }
  });
})();
</script>`;

function decorateHtml(html) {
  let decorated = html;
  if (!decorated.includes('name="robots"')) {
    decorated = decorated.replace(
      /<head([^>]*)>/i,
      '<head$1>\n<meta name="robots" content="noindex,nofollow,noarchive">'
    );
  }
  if (!decorated.includes('sample-site-menu-style')) {
    decorated = decorated.replace(/<\/head>/i, `${MENU_STYLE}\n</head>`);
  }
  if (!decorated.includes('sample-site-menu-script')) {
    decorated = decorated.replace(/<\/body>/i, `${MENU_MARKUP}\n</body>`);
  }
  return decorated;
}

function transformSampleTree(directory) {
  let transformed = 0;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      transformed += transformSampleTree(target);
      continue;
    }
    const extension = path.extname(entry.name).toLowerCase();
    if (extension !== '.html' && extension !== '.css') continue;
    const before = fs.readFileSync(target, 'utf8');
    let after = rewriteReferences(before, extension === '.css');
    if (extension === '.html') after = decorateHtml(after);
    if (after !== before) {
      fs.writeFileSync(target, after);
      transformed += 1;
    }
  }
  return transformed;
}

const transformed = transformSampleTree(SAMPLE_DIR);

// The merged lecture source is an implementation detail for /sample/. Remove
// its root build output so the current public URL structure does not change.
fs.rmSync(path.join(DIST, 'lecture'), { recursive: true, force: true });

console.log(
  `built unlisted preview at ${SAMPLE_PATH}/ (${transformed} HTML/CSS files transformed)`
);
