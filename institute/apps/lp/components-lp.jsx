/* ============================================================
   現実科学研究所 — shared components (design.md v0.2)
   Exports: TopBar, Footer, ContourField, WordCycle, ChapterMark
   ============================================================ */
const { useState, useEffect, useRef, useMemo } = React;

// ─── Reg mark ⌖ ───────────────────────────────────────────
function RegMark({ size = 16, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.2" />
      <line x1="12" y1="0" x2="12" y2="24" stroke={color} strokeWidth="1.2" />
      <line x1="0" y1="12" x2="24" y2="12" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

// ─── Top navigation ───────────────────────────────────────
function TopBar() {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="mark"><RegMark size={14} color="var(--vermilion)" /></span>
        <span>現実科学研究所</span>
        <span style={{ opacity: 0.45 }}>· Reality Science Institute</span>
      </div>
      <nav>
        <a href="#concept">§ 01 現実編集</a>
        <a href="#mission">§ 02 ミッション</a>
        <a href="#projects">§ 03 プロジェクト</a>
        <a href="#values">§ 04 行動指針</a>
        <a href="manifesto/">趣意書</a>
        <a href="press/">リリース</a>
        <a href="#contact" className="cta-mini">§ 05 参画する</a>
      </nav>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────
function Footer() {
  return (
    <footer className="foot">
      <div className="col">
        <h5>Reality Science Institute</h5>
        <p className="ja">
          （仮称）現実科学研究所<br/>
          c/o デジタルハリウッド大学<br/>
          東京都千代田区 御茶ノ水（仮）
        </p>
      </div>
      <div className="col">
        <h5>Director</h5>
        <p className="ja">
          学長 ・ 藤井直敬<br/>
          Naotaka Fujii, Ph.D.<br/>
          President, DHU
        </p>
      </div>
      <div className="col">
        <h5>Contact</h5>
        <p className="ja">
          info@reality-science.jp（仮）<br/>
          press@reality-science.jp（仮）
        </p>
      </div>
      <div className="copy">
        <span><span className="mark">⌖</span> 現実科学研究所 ／ Reality Science Institute</span>
        <span>EST. 2026.07 — 設立趣意書 v.2 ／ デザイン原則 v0.2</span>
        <span>© 2026 RSI · All Editable</span>
      </div>
    </footer>
  );
}

// ─── ContourField (§2.3 等高線レイヤー) ───────────────────
// reusable contour layers, parameterized by stroke / opacity
function ContourField({
  N = 9,
  baseR = 180,
  step = 70,
  cx = 0, cy = 0,
  cxDrift = 8, cyDrift = -6,
  stroke = "var(--crema)",
  accentStroke = "var(--vermilion)",
  accentIndex = 5,
  innerFill = "var(--vermilion)",
  innerR = 38,
  baseOp = 0.55,
  segs = 64,
  seed = 1,
  size = 1500
}) {
  const paths = useMemo(() => {
    const layers = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const r0 = baseR + i * step;
      const xc = cx + i * cxDrift;
      const yc = cy + i * cyDrift;
      const op = 0.16 + (1 - t) * baseOp;
      const pts = [];
      for (let s = 0; s < segs; s++) {
        const a = (s / segs) * Math.PI * 2;
        // structured fluctuation: harmonics
        const r = r0
          + Math.sin(a * 2 + i * 0.7 + seed) * (10 + i * 2.5)
          + Math.sin(a * 3 + i * 1.1 + seed * 0.5) * (4 + i * 1.2);
        pts.push([xc + Math.cos(a) * r, yc + Math.sin(a) * r]);
      }
      const d = pts.map((p, idx) => (idx === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + " Z";
      layers.push({ d, op, accent: i === accentIndex });
    }
    return layers;
  }, [N, baseR, step, cx, cy, cxDrift, cyDrift, baseOp, segs, seed]);

  const half = size / 2;
  return (
    <svg viewBox={`${-half} ${-half} ${size} ${size}`} aria-hidden="true">
      {paths.map((l, i) => (
        <path
          key={i} d={l.d} fill="none"
          stroke={l.accent ? accentStroke : stroke}
          strokeWidth={l.accent ? 2.4 : 1.4}
          opacity={l.op}
        />
      ))}
      {innerFill && (
        <circle cx={cx} cy={cy} r={innerR} fill={innerFill} stroke={stroke} strokeWidth="2" />
      )}
    </svg>
  );
}

// ─── WordCycle (§5.2-1) ───────────────────────────────────
// 3秒ごとに語が差し替わる。インクが滲んで次の語が浮き出る
function WordCycle({ words, interval = 3200, onChange }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null);
  useEffect(() => {
    const t = setInterval(() => {
      setPrev(idx);
      const next = (idx + 1) % words.length;
      setIdx(next);
      onChange && onChange(words[next], next);
      setTimeout(() => setPrev(null), 700);
    }, interval);
    return () => clearInterval(t);
  }, [idx, words, interval, onChange]);

  return (
    <span className="wc">
      <span className="wc-track">
        <span className="wc-word in" key={idx}>{words[idx].text || words[idx]}</span>
        {prev !== null && (
          <span className="wc-word out" key={"p-" + prev}>{words[prev].text || words[prev]}</span>
        )}
      </span>
    </span>
  );
}

// ─── ChapterMark (§ 0X — title) ───────────────────────────
function ChapterMark({ num, label, sub }) {
  return (
    <div className="ch-mark">
      <div className="num">§ <span className="red">{num}</span></div>
      <div className="lbl">{label}<br/>{sub}</div>
    </div>
  );
}

Object.assign(window, { TopBar, Footer, ContourField, WordCycle, ChapterMark, RegMark });
