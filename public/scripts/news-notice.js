(() => {
  // Resolve from this script so the LP needs only one stable script tag.
  const script = document.currentScript;
  if (!script) return;
  const root = new URL('../', script.src);
  if (location.pathname !== root.pathname && location.pathname !== `${root.pathname}index.html`) return;
  const storageKey = 'rsi-news-dismissed-slug';
  const ready = new Promise((resolve) => {
    const delay = () => setTimeout(resolve, 1500);
    if (document.readyState === 'complete') delay();
    else window.addEventListener('load', delay, { once: true });
  });

  async function init() {
    const [news] = await Promise.all([
      fetch(new URL('news/latest.json', root), { cache: 'no-cache' }).then((response) => {
        if (!response.ok) throw new Error('News unavailable');
        return response.json();
      }),
      ready,
    ]);
    if (!news || typeof news.slug !== 'string' || typeof news.title !== 'string') return;
    try { if (localStorage.getItem(storageKey) === news.slug) return; } catch { /* Storage is optional. */ }
    if (document.getElementById('rsi-news-notice')) return;

    const style = document.createElement('style');
    style.textContent = `
      #rsi-news-notice, #rsi-news-notice * { box-sizing: border-box; }
      #rsi-news-notice {
        position: fixed; right: 24px; bottom: 24px; z-index: 40;
        width: 400px; max-width: calc(100% - 48px); max-height: 30vh;
        border: 1px solid #C9C2B0; border-radius: 14px; background: #FAF7EE;
        color: #2A2A28; box-shadow: 0 8px 32px #2a2a2826;
        overflow: auto; font-family: 'Zen Kaku Gothic New', sans-serif;
        animation: rsi-news-arrive .3s ease-out;
      }
      #rsi-news-notice[hidden] { display: none !important; }
      #rsi-news-notice .rsi-news-notice__link {
        display: flex; align-items: center; gap: 16px; padding: 20px 52px 20px 20px;
        color: inherit; text-decoration: none; min-width: 0;
      }
      #rsi-news-notice .rsi-news-notice__copy { min-width: 0; flex: 1; }
      #rsi-news-notice .rsi-news-notice__meta {
        display: flex; flex-wrap: wrap; gap: 6px 12px; font: 11px/1.5 'JetBrains Mono', monospace;
        margin-bottom: 8px; color: #6E6C66;
      }
      #rsi-news-notice .rsi-news-notice__label { color: #D6422E; font-weight: 700; }
      #rsi-news-notice .rsi-news-notice__title {
        display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;
        overflow: hidden; overflow-wrap: anywhere; font-size: 15px; font-weight: 500; line-height: 1.6;
      }
      #rsi-news-notice .rsi-news-notice__image { width: 64px; height: 64px; flex: none; object-fit: contain; border-radius: 6px; }
      #rsi-news-notice .rsi-news-notice__close {
        position: absolute; right: 4px; top: 4px; width: 44px; height: 44px; padding: 0;
        border: 0; border-radius: 10px; background: transparent; color: #6E6C66;
        font: 24px/1 sans-serif; cursor: pointer;
      }
      #rsi-news-notice .rsi-news-notice__close:hover { color: #D6422E; background: #E8E2D3; }
      #rsi-news-notice a:hover .rsi-news-notice__title { color: #D6422E; }
      #rsi-news-notice :focus-visible { outline: 3px solid #D6422E; outline-offset: -4px; }
      @keyframes rsi-news-arrive { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      @media (max-width: 599px) {
        #rsi-news-notice { left: 16px; right: 16px; bottom: 16px; width: auto; max-width: none; max-height: 30vh; max-height: 30dvh; }
        #rsi-news-notice .rsi-news-notice__image { display: none; }
        #rsi-news-notice .rsi-news-notice__link { padding: 16px 52px 16px 16px; }
      }
      @media (prefers-reduced-motion: reduce) { #rsi-news-notice { animation: none; } }
    `;
    const card = document.createElement('aside');
    card.id = 'rsi-news-notice';
    card.setAttribute('aria-label', '最新ニュース');
    card.hidden = true;
    const link = document.createElement('a');
    link.className = 'rsi-news-notice__link';
    link.href = new URL(news.url.replace(/^\//, ''), root).href;
    const copy = document.createElement('span');
    copy.className = 'rsi-news-notice__copy';
    const meta = document.createElement('span');
    meta.className = 'rsi-news-notice__meta';
    const label = document.createElement('span');
    label.className = 'rsi-news-notice__label';
    label.textContent = 'NEWS';
    const date = document.createElement('time');
    date.dateTime = news.date;
    date.textContent = news.displayDate;
    meta.append(label, date);
    const title = document.createElement('span');
    title.className = 'rsi-news-notice__title';
    title.textContent = news.title;
    copy.append(meta, title);
    link.append(copy);
    if (news.image) {
      const image = document.createElement('img');
      image.className = 'rsi-news-notice__image';
      image.src = new URL(news.image.replace(/^\//, ''), root).href;
      image.alt = news.imageAlt || '';
      link.append(image);
    }
    const close = document.createElement('button');
    close.className = 'rsi-news-notice__close';
    close.type = 'button';
    close.setAttribute('aria-label', '閉じる');
    close.textContent = '×';
    card.append(link, close);

    let observer;
    const join = document.getElementById('join');
    const update = () => {
      const rect = join?.getBoundingClientRect();
      card.hidden = !!rect && rect.top < window.innerHeight && rect.bottom > 0;
    };
    close.addEventListener('click', () => {
      card.remove();
      style.remove();
      observer?.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      try { localStorage.setItem(storageKey, news.slug); } catch { /* Closing still works. */ }
    });
    document.head.append(style);
    document.body.append(card);
    update(); // Also covers a direct visit to /#join before the first observer callback.
    if (join && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => { card.hidden = entry.isIntersecting; });
      observer.observe(join);
    } else if (join) {
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    }
  }
  init().catch(() => { /* Fetch/JSON failure: leave the LP untouched. */ });
})();
