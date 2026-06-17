/* ============================================================
   現実科学研究所 — sections (Hero, Concept, Mission)
   ============================================================ */

// ════════════════════════════════════════════════════════════
// § 00 HERO — Indigo / 等高線レイヤー
// ════════════════════════════════════════════════════════════
function Hero() {
  const cycleWords = [
    { text: "現実" },
    { text: "境界" },
    { text: "自己" },
    { text: "文化" },
    { text: "産業" },
    { text: "世界" }
  ];
  return (
    <section className="hero grain" id="top">
      <div className="contour">
        <ContourField
          N={11}
          baseR={150} step={68}
          cx={-30} cy={10}
          cxDrift={9} cyDrift={-7}
          stroke="var(--crema)"
          accentStroke="var(--vermilion)"
          accentIndex={6}
          innerFill="var(--vermilion)"
          innerR={42}
          baseOp={0.5}
          seed={1.3}
        />
      </div>

      <div className="rule t"></div>
      <div className="rule b"></div>
      <div className="rule l"></div>
      <div className="rule r"></div>

      <div className="meta-band band-top">
        <span>R.S.I. ／ REALITY SCIENCE INSTITUTE</span>
        <span>VOL. 001 · ISSUE 2026 / 07</span>
        <span>FIG. 01 — CONTOUR OF EDITING</span>
      </div>
      <div className="meta-band band-bottom">
        <span>DIGITAL HOLLYWOOD UNIVERSITY</span>
        <span>世界を満たせ ／ FILL THE WORLD</span>
        <span>p. 001 / 014</span>
      </div>
      <div className="meta-band band-left vert">
        2026 / 07 / 01 · TOKYO · 御茶ノ水 ／ DHU
      </div>
      <div className="meta-band band-right vert">
        DIR. NAOTAKA FUJII · 設立趣意書 第二版 ・ デザイン v0.2
      </div>

      <div className="stage">
        <div className="top">
          <div className="marker">
            <span className="num">§ <span className="red">00</span></span>
            <span className="lbl">CHAPTER ZERO<br/>MANIFESTO ／ 思想</span>
          </div>
          <span className="cartouche crema">FIG. 01 — EDITING TOPOGRAPHY</span>
        </div>

        <h1>
          Reality is<br/>
          <em>editable.</em>
          <span className="ja">
            <WordCycle words={cycleWords} />は<span className="com">、</span>編集できる<span className="com">。</span>
          </span>
        </h1>

        <div className="bot">
          <div className="lede">
            脳が組み立てる主観こそが現実である ― この立脚点から、研究・教育・産業・行政を一つの机に集める、新しい実験場。<br/>
            2026年7月、デジタルハリウッド大学に設立予定。
          </div>
          <div className="key">
            <div><span className="swatch" style={{background:"var(--crema)"}}></span>EDITED LAYER</div>
            <div><span className="swatch" style={{background:"var(--vermilion)"}}></span>CURRENT EDIT</div>
            <div><span className="swatch" style={{background:"var(--indigo)", border:"1px solid var(--crema)"}}></span>DEEP / NIGHT</div>
          </div>
          <div className="plate-c">
            <span className="pt">PORTRAIT<br/>藤井直敬<br/>168 × 200</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 01 CONCEPT — Crema / 4命題
// ════════════════════════════════════════════════════════════
function Concept() {
  const cells = [
    {
      ord: "— 01 ／ 認識",
      glyph: "壱",
      lbl: "Subjective construction",
      title: "現実は、内側に立ち上がる。",
      body: "脳は世界を客観的に受け取っていない。過去の経験から構築した予測モデルで、世界がどう見えるかを能動的に組み立てている。"
    },
    {
      ord: "— 02 ／ 流動",
      glyph: "弐",
      lbl: "Impermanence",
      title: "一切皆空、ゆえに一切皆楽。",
      body: "固定して見える物事も、瞬間ごとに変わり続けている。仕事の役割も、人間関係も、自分らしさも、文脈次第で姿を変える。だから組み直せる。"
    },
    {
      ord: "— 03 ／ 協働",
      glyph: "参",
      lbl: "Consciousness & subconscious",
      title: "意識と無意識の協働。",
      body: "判断のほとんどは意識化される前に準備されている。しかし意識は観察し、気づき、わずかな調整を加えられる。その往復こそが創造的な自由である。"
    },
    {
      ord: "— 04 ／ 勇気",
      glyph: "四",
      lbl: "Reality update",
      title: "現実を更新する勇気。",
      body: "「これが正解だ」と思っているものを、「いまの仮の姿」として見直す。必要なときだけ軽く外せるしなやかさ ― それが幸福の最小単位だ。"
    }
  ];
  return (
    <section className="section concept grain" id="concept">
      <div className="wrap">
        <ChapterMark num="01" label="CHAPTER ONE" sub="現実編集 ／ REALITY EDITING" />

        <div className="lede-wrap">
          <h2>
            Reality<br/>
            <em>is editable.</em>
            <span className="ja">
              <span className="red">現実編集</span>とは、<br/>動かないと思っていた前提を、<br/>組み直す技術である。
            </span>
          </h2>
          <p className="lede-r">
            「動かない」と思い込まれてきた前提や境界を、意識的に見直し、別のかたちへと組み直す実践 ― これを本研究所では <strong>現実編集</strong> と呼ぶ。
            一部の天才や名匠が直感で行ってきたこの編集を、誰もが学べる技術へと引き上げる。それが現実科学研究所の中心命題である。
          </p>
        </div>

        <div className="concept-grid">
          {cells.map((c, i) => (
            <div className="concept-cell" key={i}>
              <span className="ord">{c.ord}</span>
              <span className="glyph">{c.glyph}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <span className="lbl">— {c.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 02 MISSION — Crema, 世界を満たせ / Word cycle ＋ 背景の色面切替
// ════════════════════════════════════════════════════════════
function Mission() {
  const objWords = [
    { text: "世界", color: "var(--vermilion)", bg: "var(--crema)" },
    { text: "余白", color: "var(--teal)",      bg: "#EAF1ED" },
    { text: "未完", color: "var(--orange)",    bg: "#F6E9D2" },
    { text: "可能性",color: "var(--violet)",   bg: "#F0E6E9" }
  ];
  const [currentColor, setCurrentColor] = React.useState(objWords[0].color);
  const [currentBg, setCurrentBg] = React.useState(objWords[0].bg);

  return (
    <section className="section mission grain" id="mission">
      <div className="mission-bg" style={{ background: currentBg }}></div>

      <div className="wrap stage">
        <ChapterMark num="02" label="CHAPTER TWO" sub="MISSION ／ 世界を満たせ" />

        <div className="lede"><strong>SINCE 2026 — 藤井時代の旗印</strong></div>

        <h2>
          <WordCycle
            words={objWords}
            interval={3400}
            onChange={(w) => { setCurrentColor(w.color); setCurrentBg(w.bg); }}
          />
          <span className="com">を</span><br/>
          <span className="em" style={{ color: currentColor }}>満たせ</span>
          <span className="com">。</span>
        </h2>
        <div className="en">— Fill the World.</div>

        <div className="body">
          <p>
            自分のなかにある可能性、まだ世界に存在していない現実の色彩を ― 作品として、サービスとして、システムとして、コミュニティとして ― 世界に実装し循環させていく。
            それによって世界に新しい価値、新しい色、新しい現実を増やしていく。
          </p>
          <p>
            <strong>「世界を満たせ」は、個人の挑戦ではない、<span className="red">連鎖反応の宣言</span>である。</strong>
            誰か一人の作品が誰かの希望と未来になり、それがさらに次の誰かの現実を更新し、その更新が世界の見え方を編み直していく。
          </p>
        </div>

        <div className="quote">
          <div className="v">継承と拡張 ・ INHERITED & EXTENDED</div>
          <div className="text">
            <em>「すべてをエンタテインメントにせよ」</em>という DHU 創立精神を継承しながら、その領域を <em>人間の可能性そのもの</em> へと押し広げる。
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Concept, Mission });
