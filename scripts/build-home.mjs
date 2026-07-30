// Publish the RSI landing page (institute/apps/lp/v7) as the site's real HOME,
// per docs/site-map.md: / and /manifest/ come from the LP, /lecture/ (Astro,
// merged with the former HOME's NEWS/NEXT LECTURE) and every other route are
// already correct from the Astro build. Run AFTER `astro build`:
//   node scripts/build-home.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flatten, isBundlerExport } from './flatten-lp.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LP = path.join(ROOT, 'institute', 'apps', 'lp', 'v7');

if (!fs.existsSync(DIST)) {
  throw new Error('dist/ not found. Run the Astro build before building HOME.');
}

const readLp = (relativePath) => {
  const html = fs.readFileSync(path.join(LP, relativePath), 'utf8');
  return isBundlerExport(html) ? flatten(html) : html;
};

const write = (relativePath, html) => {
  const destination = path.join(DIST, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
};

// The LP is a single long page + a linked manifesto with no page-to-page nav of
// its own (only the / <-> /manifest/ link). This menu is the only way to reach
// the rest of the site from HOME. Every other route keeps the existing
// Elementor-mirror header (BaseLayout), so it isn't needed there.
const MENU_STYLE = `<style id="site-menu-style">
.site-menu {
  position: fixed;
  z-index: 10000;
  top: 92px;
  right: 24px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.site-menu__toggle {
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
.site-menu__icon,
.site-menu__icon::before,
.site-menu__icon::after {
  display: block;
  width: 19px;
  height: 1px;
  background: currentColor;
  transition: transform .2s ease, opacity .2s ease;
}
.site-menu__icon { position: relative; }
.site-menu__icon::before,
.site-menu__icon::after {
  position: absolute;
  left: 0;
  content: "";
}
.site-menu__icon::before { top: -6px; }
.site-menu__icon::after { top: 6px; }
.site-menu.is-open .site-menu__icon { background: transparent; }
.site-menu.is-open .site-menu__icon::before { top: 0; transform: rotate(45deg); }
.site-menu.is-open .site-menu__icon::after { top: 0; transform: rotate(-45deg); }
.site-menu__panel {
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
.site-menu__panel[hidden] { display: none; }
.site-menu__panel a {
  display: flex;
  justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid rgba(232, 226, 211, .16);
  color: #e8e2d3;
  font-size: .76rem;
  letter-spacing: .1em;
  text-decoration: none;
}
.site-menu__panel a:last-child { border-bottom: 0; }
@media (max-width: 860px) {
  .site-menu { top: 86px; right: 16px; }
  .site-menu__toggle { width: 44px; height: 44px; }
  .site-menu__panel { top: 52px; }
}
</style>`;

const MENU_MARKUP = `<div class="site-menu" id="siteMenu">
<button class="site-menu__toggle" type="button" aria-controls="siteMenuPanel" aria-expanded="false" aria-label="サイトメニューを開く">
<span class="site-menu__icon" aria-hidden="true"></span>
</button>
<nav class="site-menu__panel" id="siteMenuPanel" aria-label="サイトメニュー" hidden>
<a href="/">HOME</a>
<a href="/lecture/">LECTURE</a>
<a href="/about/">ABOUT</a>
<a href="/news/">NEWS</a>
<a href="/join/">JOIN</a>
<a href="/contact/">CONTACT</a>
</nav>
</div>
<script id="site-menu-script">
(function () {
  var menu = document.getElementById('siteMenu');
  if (!menu) return;
  var button = menu.querySelector('.site-menu__toggle');
  var panel = document.getElementById('siteMenuPanel');
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

function injectMenu(html) {
  let decorated = html;
  if (!decorated.includes('site-menu-style')) {
    decorated = decorated.replace(/<\/head>/i, `${MENU_STYLE}\n</head>`);
  }
  if (!decorated.includes('site-menu-script')) {
    decorated = decorated.replace(/<\/body>/i, `${MENU_MARKUP}\n</body>`);
  }
  return decorated;
}

write('index.html', injectMenu(readLp('index.html')));
write(path.join('manifest', 'index.html'), injectMenu(readLp(path.join('manifest', 'index.html'))));

const lpAssets = path.join(LP, 'assets');
if (fs.existsSync(lpAssets)) {
  fs.cpSync(lpAssets, path.join(DIST, 'assets'), { recursive: true });
}

console.log('built HOME (/ and /manifest/) from institute/apps/lp/v7');
