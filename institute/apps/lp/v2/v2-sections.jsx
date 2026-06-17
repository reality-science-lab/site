/* ============================================================
   UTUTU v2 — sections (Hero / Now / Concept / Scales / Projects /
                        WhyDHU / Director / Join)
   ============================================================ */

// ════════════════════════════════════════════════════════════
// § 00 — Hero（ベージュ＋縄文薄重ね＋UTUTUロゴ）
// ════════════════════════════════════════════════════════════
function Hero() {
  const cycleWords = ["現実", "境界", "自己", "文化", "産業", "世界"];
  return (
    <section className="hero grain" id="hero">
      <div className="jomon-bg">
        <JomonPattern color="var(--jomon-earth)" strokeWidth={1.2} density={4} />
      </div>
      <div className="stage">
        <UTUTULogo className="ututu-hero" height={180} gap={8} />
        <h1 className="tagline">
          <span className="cycle-word"><WordCycle words={cycleWords} /></span>
          <span>は、</span>
          <span className="red-underline">編集できる</span>
          <span>。</span>
        </h1>
        <div className="meta">
          <span>2026.07 設立予定</span>
          <span>·</span>
          <span>デジタルハリウッド大学</span>
          <span>·</span>
          <span>学長 藤井 直敬</span>
        </div>
      </div>
      <div className="scroll-cue">SCROLL ↓</div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 01 — なぜ、いま
// ════════════════════════════════════════════════════════════
function SectionNow() {
  return (
    <section className="section-now grain" id="now">
      <div className="wrap">
        <div>
          <div className="section-hd"><span className="num">§ 01</span>NOW</div>
          <h2>
            なぜ、いま。
            <span className="en">Why now</span>
          </h2>
        </div>
        <div className="body">
          <p className="lede">
            朝起きてニュースを見れば、戦争、AI の急進、不安定な経済 ― 昨日まで信じていた「正しさ」が、今日は通用しない。
            万人共通の正しさが失われた今、多くの人が「自分一人に何ができるのか」という無力感を抱えています。
          </p>
          <p>
            しかし、本当にそれで良いのでしょうか。
          </p>
          <p>
            <strong>「答えがない時代」は、見方を変えれば「自由な時代」でもあります。</strong>
            誰かが決めた正解に従う必要がない。会社の常識、業界の慣習、世代の物差し ― これらが揺らいでいる今こそ、自分のやり方で何かを始められる絶好のタイミングです。
          </p>
          <p>
            本研究所は、そうした新しい知に「手を伸ばす」「体験する」「循環させる」場として設計されています。
          </p>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 02 — 現実科学とは（透過バラバラ UTUTU + 訓読み引き込み）
// ════════════════════════════════════════════════════════════
function SectionConcept() {
  return (
    <section className="section-concept grain" id="concept">
      <div className="wrap">
        <div className="section-hd"><span className="num">§ 02</span>CONCEPT</div>
        <h2>
          現実科学とは。
          <span className="en">What is Reality Science</span>
        </h2>

        <div className="layer-stack" aria-label="重なり合う3つの UTUTU レイヤー — 現実は層である">
          <UTUTULayer className="layer-1" fill="var(--jomon-earth)" opacity={0.35} rotate={-2} />
          <UTUTULayer className="layer-2" fill="var(--ink-soft)" opacity={0.55} rotate={0} />
          <UTUTULayer className="layer-3" fill="var(--ink-charcoal)" opacity={1.0} rotate={2} />
          <span className="caption">FIG. 02 — Reality as layers</span>
        </div>

        <p className="lede">
          私たちの脳は世界を客観的に受け取っているのではない。過去の経験からつくった予測モデルをもとに、
          「世界がどう見えるか」を能動的に組み立てている。
        </p>

        <div className="quote">
          だから、同じ場にいた二人が、まったく違う「現実」を生きていても不思議ではない。<br/>
          <strong>「現実は人によって違う」</strong>—— この当たり前の事実を直視し、それを扱える知として体系化する。
          それが、藤井学長が提唱する <strong>現実科学</strong> です。
        </div>

        <div className="ututu-reading">
          <div className="kanji">現実</div>
          <span className="ruby">うつつ — U T U T U</span>
          <UTUTULogo className="ututu-mark" height={56} gap={4} />
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 03 — 4スケール（U/T 文字を符号として割り当て）
// ════════════════════════════════════════════════════════════
function SectionScales() {
  const cells = [
    { letter: "U", code: "SCALE 01", name: "自己", en: "SELF",      dir: "→ 内向き" },
    { letter: "T", code: "SCALE 02", name: "境界", en: "BORDER",    dir: "→ 内向き" },
    { letter: "U", code: "SCALE 03", name: "創発", en: "EMERGENCE", dir: "← 外向き" },
    { letter: "T", code: "SCALE 04", name: "文化", en: "CULTURE",   dir: "← 外向き" }
  ];
  return (
    <section className="section-scales grain" id="scales">
      <div className="wrap">
        <div className="section-hd"><span className="num">§ 03</span>SCALES</div>
        <h2>
          現実編集の4スケール。
          <span className="en">Four scales of reality editing</span>
        </h2>
        <p className="lede">
          どの規模で、どちらの方向に、現実を編集するか。
          自己・境界・創発・文化の4層は、UTUTU の U と T を交互に編むように積み重なる。
        </p>

        <div className="scale-grid">
          {cells.map((c, i) => (
            <div className="scale-cell" key={i}>
              <span className="letter">
                <UTUTULetter char={c.letter} size={64} />
              </span>
              <div className="scale-name">{c.code}</div>
              <div className="scale-jp">{c.name}スケール</div>
              <div className="arrow">{c.dir}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 04 — 4つの旗艦プロジェクト
// ════════════════════════════════════════════════════════════
function SectionProjects() {
  const projs = [
    {
      letter: "U", id: "P-01", scale: "自己 ／ SELF — 内向き",
      h: "雨にも負けず高校 連携",
      body: "2027年4月開校予定（大﨑洋氏 校長）。15〜18歳という最も自己定義が硬化しやすい時期に、可動域を保ったまま大人になる訓練を提供する。レジリエンスを「逆境への耐性」ではなく「自己定義を常時更新し続ける力」として再定義する。",
      partners: "雨にも負けず高校 ／ DHU 教学"
    },
    {
      letter: "T", id: "P-02", scale: "境界 ／ BORDER — 内向き",
      h: "攻撃学",
      body: "田中悠斗教授を中心に立ち上げるサイバーセキュリティ研究の新領域。「攻撃を知らずして防御は無理」 ― この命題は現実科学の核心と完全に重なる。守ってきた現実の輪郭を、外から見直す勇気を技術として体系化する。",
      partners: "田中悠斗 教授 ／ 株式会社フォアー"
    },
    {
      letter: "U", id: "P-03", scale: "創発 ／ EMERGENCE — 外向き",
      h: "シンギュラボ 連携",
      body: "スペースデータ社（代表：佐藤航陽）が主催する創発的コミュニティとの連携。トップダウンの「正解」を疑い、現場の個別主観から立ち上がる解 ― 研究機関の知とコミュニティの即興力を接合する。2026年4月 戦略連携開始。",
      partners: "スペースデータ ／ シンギュラボ"
    },
    {
      letter: "T", id: "P-04", scale: "文化 ／ CULTURE — 外向き",
      h: "Pop Power Project（PPP）",
      body: "ポップカルチャー（アニメ・マンガ・ゲーム・音楽・キャラクター）は、産業規模で行われてきた現実編集の最も成功した例。本研究所は PPP の事務局を担い、コンテンツ産業を「現実編集産業」という視点で再定義する。",
      partners: "中村伊知哉 ／ 講談社・SEGA・コナミ・エイベックス 等"
    }
  ];

  return (
    <section className="section-projects grain" id="projects">
      <div className="wrap">
        <div className="section-hd"><span className="num">§ 04</span>FLAGSHIP PROJECTS</div>
        <h2>
          4つの旗艦プロジェクト。
          <span className="en">Four flagship projects</span>
        </h2>

        <div className="proj-list">
          {projs.map((p) => (
            <article className="proj-card" key={p.id}>
              <div className="letter-tag">
                <UTUTULetter char={p.letter} size={80} />
              </div>
              <div className="body">
                <div className="scale-meta">{p.scale}</div>
                <h3>{p.h}</h3>
                <p>{p.body}</p>
              </div>
              <div className="partners">
                <div className="pl-mark">{p.id}</div>
                <div>{p.partners}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 05 — なぜDHUか（縄文紋様 薄敷き）
// ════════════════════════════════════════════════════════════
function SectionWhyDHU() {
  return (
    <section className="section-why-dhu grain" id="why-dhu">
      <div className="jomon-bg-light">
        <JomonPattern color="var(--jomon-earth)" strokeWidth={1.0} density={6} />
      </div>
      <div className="wrap">
        <div>
          <div className="section-hd"><span className="num">§ 05</span>WHY DHU</div>
          <h2>
            なぜ、DHUか。
            <span className="en">Why this place</span>
          </h2>
          <p className="lede">
            研究者と、産業の現場で作品とサービスを生み続けるプロのクリエイターが、
            <strong> 同じ屋根の下に常駐している場</strong>。世界に数えるほどしかありません。
          </p>
          <p>
            設立以来30年余、論文と作品の両方を世に送り出してきた。理論を語る人と、それを実際に形にする人が同じ場にいて、
            互いの言葉を翻訳し合えるとき、はじめて新しい考えが産業や社会に届きます。
          </p>
        </div>
        <div>
          <div className="compare-list">
            MIT Media Lab<br/>
            Stanford d.school<br/>
            ETH Zürich<br/>
            東京大学 先端科学技術研究センター<br/>
          </div>
          <div className="pivot">
            ——それぞれが領域横断と社会実装を掲げる。<br/>
            しかし、研究者とプロのクリエイターが<br/>
            <strong>同じ屋根の下にいる場はほとんどない。</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 06 — 学長メッセージ（縄文土色背景 + 白 UTUTU）
// ════════════════════════════════════════════════════════════
function SectionDirector() {
  return (
    <section className="section-director" id="director">
      <div className="jomon-pattern-bg">
        <JomonPattern color="var(--paper-white)" strokeWidth={1.4} density={5} />
      </div>
      <div className="wrap">
        <div>
          <UTUTULogo className="ututu-white" fill="var(--paper-white)" height={80} gap={5} />
          <div className="director-meta">
            藤井 直敬<br/>
            DHU 学長 ／ RSI 所長<br/>
            ——<br/>
            Naotaka Fujii<br/>
            President, DHU<br/>
            Director, RSI
          </div>
        </div>
        <div>
          <div className="section-hd"><span className="num">§ 06</span>DIRECTOR'S WORDS</div>
          <h2>
            杉山から、藤井へ。
            <span className="en">Inheritance &amp; extension</span>
          </h2>

          <div className="quote-body">
            眼科医として「見る」を、脳科学者として「見えるのは目ではなく脳である」を辿ってきた。
            その先に、デジタルハリウッドで <strong>「どう見せるか」</strong> を実装する場と出会った。<br/><br/>
            創立者・杉山知之が問い続けた「どう見るか」と、私が探究してきた「どう見せるか」が、
            ここで初めて編まれる。<br/><br/>
            <strong>現実は編集できる。世界はまだ完成していない。</strong>
            だからこそ、人間の創造性には意味がある。<br/><br/>
            あなたの色で、あなたのやり方で、あなたの可能性で——世界を満たそう。
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 07 — 参画
// ════════════════════════════════════════════════════════════
function SectionJoin() {
  return (
    <section className="section-join grain" id="join">
      <div className="wrap">
        <div className="section-hd" style={{ textAlign: "center" }}>
          <span className="num">§ 07</span>JOIN
        </div>
        <h2>
          あなたは、<br/>
          何で、<span className="red-underline">世界を満たす</span>のか。
        </h2>

        <form className="join-form" onSubmit={(e) => { e.preventDefault(); alert("送信プレビュー：実装時はメール／CRM連携を行います。"); }}>
          <div className="field">
            <label>名前 ／ 所属（任意）</label>
            <input type="text" placeholder="お名前 ／ 株式会社○○" />
          </div>
          <div className="field">
            <label>メールアドレス</label>
            <input type="email" placeholder="you@example.jp" required />
          </div>
          <div className="field">
            <label>あなたが持ち込みたいものを、一言で。</label>
            <textarea placeholder="プロジェクト ／ 研究 ／ 問い ／ コミュニティ ／ 変革"></textarea>
          </div>
          <button type="submit" className="submit">
            送る<span className="en">→ start editing</span>
          </button>
        </form>

        <div className="aside">
          参画の形は、さまざまです。<br/>
          共同研究者として。プロジェクトリーダーとして。<br/>
          コミュニティとして。産業パートナーとして。<br/>
          まず、あなたの言葉で届けてください。
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  Hero, SectionNow, SectionConcept, SectionScales,
  SectionProjects, SectionWhyDHU, SectionDirector, SectionJoin
});
