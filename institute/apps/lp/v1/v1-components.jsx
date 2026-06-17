/* ========== v1 shared components ========== */
const { useState: useV1State, useRef: useV1Ref, useEffect: useV1Effect } = React;

function EditableSpan({ options, defaultValue, onChange, label = "EDIT", className = "" }) {
  const [val, setVal] = useV1State(defaultValue ?? options[0]);
  const [open, setOpen] = useV1State(false);
  const [flicker, setFlicker] = useV1State(false);
  const [edited, setEdited] = useV1State(false);
  const ref = useV1Ref(null);

  useV1Effect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function pick(v) {
    if (v !== val) {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 560);
      setEdited(true);
    }
    setVal(v);
    setOpen(false);
    onChange && onChange(v);
  }

  return (
    <span
      ref={ref}
      className={`edt ${edited ? "edited" : ""} ${flicker ? "flicker" : ""} ${open ? "open" : ""} ${className}`}
      onClick={() => setOpen(o => !o)}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); } }}
    >
      {val}
      {open && (
        <span className="edt-menu" onClick={(e) => e.stopPropagation()}>
          <span className="hdr">
            <span>{label}</span>
            <span>{options.length} 選択肢</span>
          </span>
          {options.map((o) => (
            <button
              key={o}
              className={`opt ${o === val ? "active" : ""}`}
              onClick={() => pick(o)}
            >{o}</button>
          ))}
        </span>
      )}
    </span>
  );
}

function Console({ editsCount, noiseOn, onToggleNoise }) {
  return (
    <div className="console">
      <span className="dot"></span>
      <span><span className="k">REALITY</span> <span className="v">EDITABLE</span></span>
      <span><span className="k">SESSION</span> <span className="v">{String(editsCount).padStart(3, "0")} EDITS</span></span>
      <span><span className="k">v.0.1</span> <span className="v">PROTOTYPE</span></span>
      <button onClick={onToggleNoise}>{noiseOn ? "■ NOISE" : "□ NOISE"}</button>
    </div>
  );
}

function Noise({ on }) {
  return (
    <div className={`noise ${on ? "on" : ""}`} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="v1-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#v1-noise)" />
      </svg>
    </div>
  );
}
function ScanLines({ on }) {
  return <div className={`scanlines ${on ? "on" : ""}`}></div>;
}

function RegMark({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function TopBar() {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="reg-mark"><RegMark size={16} /></span>
        <span>現実科学研究所</span>
        <span style={{ opacity: 0.4 }}>/ Reality Science Institute</span>
      </div>
      <nav>
        <a href="#concept">現実編集</a>
        <a href="#mission">ミッション</a>
        <a href="#projects">プロジェクト</a>
        <a href="#values">行動指針</a>
        <a href="manifesto/">趣意書</a>
        <a href="press/">リリース</a>
        <a href="#contact" className="cta-mini">問い合わせ</a>
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div>
        <span className="reg-mark" style={{ marginRight: 8 }}>⌖</span>
        <span className="logo">現実科学研究所 — Reality Science Institute</span>
        <span style={{ marginLeft: 14 }}>/ Digital Hollywood University</span>
        <span style={{ marginLeft: 14 }}>/ Est. 2026.07 (planned)</span>
      </div>
      <div>© 2026 RSI / All Editable</div>
    </footer>
  );
}

function KanjiBg({ char, top, left, right, bottom, size = "32vw" }) {
  return <div className="kanji-bg" style={{ top, left, right, bottom, fontSize: size }}>{char}</div>;
}

Object.assign(window, { EditableSpan, Console, Noise, ScanLines, RegMark, TopBar, Footer, KanjiBg });
