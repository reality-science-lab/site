/* ============================================================
   UTUTU v2 — shared components
   UTUTULogo / UTUTULetter / JomonPattern / TopBar / Footer / WordCycle
   ============================================================ */
const { useState, useEffect, useRef, useMemo } = React;

// ─── UTUTU 文字パス（手描き感のあるカット紙アウトライン） ───
// 各文字は viewBox 100x140 内で定義。後で並べる際にスケール合わせ。
const UTUTU_PATHS = {
  U: "M 18,18 L 18,98 Q 18,124 50,124 Q 82,124 82,98 L 82,18 L 66,18 L 66,96 Q 66,108 50,108 Q 34,108 34,96 L 34,18 Z",
  T: "M 8,18 L 92,18 L 92,34 L 58,34 L 58,124 L 42,124 L 42,34 L 8,34 Z"
};

function UTUTULetter({ char, fill = "var(--ink-charcoal)", size = 60 }) {
  const path = UTUTU_PATHS[char];
  if (!path) return null;
  const w = size * (100 / 140);
  return (
    <svg viewBox="0 0 100 140" width={w} height={size} aria-hidden="true">
      <path d={path} fill={fill} />
    </svg>
  );
}

// ─── UTUTU ロゴ（5文字並び） ────────────────────────────
function UTUTULogo({ fill = "var(--ink-charcoal)", height = 80, gap = 4, className = "" }) {
  const letters = ["U", "T", "U", "T", "U"];
  return (
    <span
      className={`ututu-logo ${className}`}
      style={{ display: "inline-flex", alignItems: "flex-end", gap: gap + "px", height: height + "px" }}
      role="img"
      aria-label="UTUTU — 現実科学研究所"
    >
      {letters.map((c, i) => (
        <UTUTULetter key={i} char={c} fill={fill} size={height} />
      ))}
    </span>
  );
}

// ─── UTUTU 透過レイヤー（§02 で使う「バラバラ」表現） ───
function UTUTULayer({ fill, opacity = 1, rotate = 0, className = "" }) {
  return (
    <div
      className={`ututu-layer ${className}`}
      style={{ opacity, transform: `rotate(${rotate}deg)` }}
    >
      <UTUTULogo fill={fill} height={140} gap={6} />
    </div>
  );
}

// ─── 縄文紋様（渦巻きパターン） SVG ────────────────────
function JomonPattern({ color = "var(--jomon-earth)", strokeWidth = 1.5, density = 5, className = "" }) {
  const spirals = useMemo(() => {
    const arr = [];
    const cols = density;
    const rows = Math.ceil(density * 0.75);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = (c + 0.5) * (1000 / cols) + (r % 2 ? 50 : 0);
        const cy = (r + 0.5) * (1000 / rows);
        const dir = (r + c) % 2 === 0 ? 1 : -1;
        arr.push({ cx, cy, dir, key: `${r}-${c}` });
      }
    }
    return arr;
  }, [density]);

  // 渦巻きパスを生成（中心から外へ伸びるアルキメデス螺旋）
  const spiralPath = (cx, cy, dir = 1, turns = 3.5, maxR = 80) => {
    const segs = 80;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const a = t * turns * Math.PI * 2 * dir;
      const r = t * maxR;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  };

  return (
    <svg
      viewBox="0 0 1000 750"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      {spirals.map((s) => (
        <path
          key={s.key}
          d={spiralPath(s.cx, s.cy, s.dir)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

// ─── TopBar ─────────────────────────────────────────────
function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="ututu-mark">
          <UTUTULogo height={18} gap={1.5} />
        </span>
        <span>現実科学研究所</span>
        <span className="en">REALITY SCIENCE INSTITUTE</span>
      </div>
      <nav>
        <a href="#concept">§ 02 現実科学</a>
        <a href="#scales">§ 03 4スケール</a>
        <a href="#projects">§ 04 プロジェクト</a>
        <a href="#director">§ 06 学長</a>
        <a href="#join" className="cta-mini">§ 07 参画する</a>
      </nav>
    </header>
  );
}

// ─── Footer ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="foot">
      <div className="ututu-foot">
        <UTUTULogo fill="var(--paper-white)" height={48} gap={4} />
      </div>
      <div className="foot-grid">
        <div>
          <h5>Reality Science Institute</h5>
          <p>
            （仮称）現実科学研究所<br/>
            c/o デジタルハリウッド大学<br/>
            東京都千代田区 御茶ノ水（仮）
          </p>
        </div>
        <div>
          <h5>Director</h5>
          <p>
            学長 ・ 藤井直敬<br/>
            Naotaka Fujii, Ph.D.<br/>
            President, DHU
          </p>
        </div>
        <div>
          <h5>Contact</h5>
          <p>
            info@reality-science.jp（仮）<br/>
            press@reality-science.jp（仮）
          </p>
        </div>
      </div>
      <div className="copy">
        <span>UTUTU ／ 現実科学研究所 — Reality Science Institute</span>
        <span>EST. 2026.07 — 設立趣意書 v.2 ／ UTUTU 視覚言語 v0.1</span>
        <span>© 2026 RSI · All Editable</span>
      </div>
    </footer>
  );
}

// ─── スクロール進行バー ────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setPct(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="bar" style={{ height: pct + "%" }}></div>
    </div>
  );
}

// ─── §章番号 固定マーカー（Intersection Observer 監視） ───
function ChapterMarkFixed({ chapters }) {
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    chapters.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [chapters]);

  const idx = current ? chapters.indexOf(current) : -1;
  const num = idx >= 0 ? String(idx + 1).padStart(2, "0") : null;
  const glyphChar = idx >= 0 ? (idx % 2 === 0 ? "U" : "T") : null;

  return (
    <div className={`chapter-mark-fixed ${num ? "visible" : ""}`} aria-hidden="true">
      <span className="ch-num">§ {num}</span>
      {glyphChar && (
        <span className="ch-glyph">
          <UTUTULetter char={glyphChar} size={16} />
        </span>
      )}
    </div>
  );
}

// ─── WordCycle — 取り消し線→差し替えアニメ ─────────────
function WordCycle({ words, interval = 3000, onChange }) {
  const [idx, setIdx] = useState(0);
  const [striking, setStriking] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setStriking(true);
      setTimeout(() => {
        const next = (idx + 1) % words.length;
        setIdx(next);
        setStriking(false);
        onChange && onChange(words[next], next);
      }, 600);
    }, interval);
    return () => clearInterval(t);
  }, [idx, words, interval, onChange]);

  const w = typeof words[idx] === "string" ? words[idx] : words[idx].text;
  return (
    <span className="cycle-word">
      <span className={striking ? "strike" : ""} key={idx + (striking ? "s" : "")}>
        {w}
      </span>
    </span>
  );
}

Object.assign(window, {
  UTUTULetter, UTUTULogo, UTUTULayer, JomonPattern,
  TopBar, Footer, ScrollProgress, ChapterMarkFixed, WordCycle
});
