/* ============================================================
   現実科学研究所 — sections (Projects, Values, Contact)
   ============================================================ */

// ════════════════════════════════════════════════════════════
// § 03 PROJECTS — 4スケール色面
// ════════════════════════════════════════════════════════════
function Projects() {
  const items = [
    {
      cls: "pink",
      id: "P-01",
      scale: "SCALE 01 ／ 自己 ・ SELF",
      h: "雨にも負けず高校 連携",
      en: "— Inward.",
      body: "来年4月開校予定の雨にも負けず高校との高大連携。15〜18歳という、最も自己定義が硬化しやすい時期に、可動域を保ったまま大人になる訓練を提供する。レジリエンス教育を「逆境への耐性」ではなく「自己定義を常時更新し続ける力」として再定義する。",
      partners: "雨にも負けず高校 ／ DHU 教学"
    },
    {
      cls: "violet",
      id: "P-02",
      scale: "SCALE 02 ／ 境界 ・ BORDER",
      h: "攻撃学",
      en: "— Across.",
      body: "田中悠斗教授を中心に立ち上げるサイバーセキュリティ研究の新領域。「攻撃を知らずして防御は無理」― この命題は現実科学の核心と完全に重なる。学長の SR（代替現実）研究が「現実は差し替え可能だ」と被験者に体感させたように、攻撃学は「あなたが守っているシステムは差し替え可能だ」と防御者に体感させる学問になる。",
      partners: "田中悠斗 教授 ／ サイバーセキュリティ ハブ"
    },
    {
      cls: "yellow",
      id: "P-03",
      scale: "SCALE 03 ／ 創発 ・ EMERGENCE",
      h: "シンギュラボ 連携",
      en: "— Swarm.",
      body: "スペースデータ社が主催するシンギュラボとの連携。研究者・起業家・アーティスト・市民が境界を越えて集まり、ボトムアップで課題を発見し解決する創発的コミュニティ。研究機関の知と、コミュニティの即興力を接合し、現場の個別主観から立ち上がる解 ― 意識と無意識のあいだのダイナミクスを社会規模で再現する試み。",
      partners: "スペースデータ ／ シンギュラボ コミュニティ"
    },
    {
      cls: "orange",
      id: "P-04",
      scale: "SCALE 04 ／ 文化 ・ CULTURE",
      h: "Pop Power Project（PPP）",
      en: "— Outward.",
      body: "アニメ・マンガ・ゲーム・音楽・キャラクター ― 産業規模で行われてきた「現実編集」の最も成功した例。本研究所はPPPの事務局を担い、コンテンツ産業を「現実編集産業」という視点で再定義する。日本のクリエイターが編集した新しい現実を、世界を満たすコンテンツとして流通させる。",
      partners: "Pop Power Project 事務局 ／ コンテンツ産業 各社"
    }
  ];

  return (
    <section className="section projects grain" id="projects">
      <div className="wrap">
        <ChapterMark num="03" label="CHAPTER THREE" sub="FLAGSHIP PORTFOLIO ／ 4つの旗艦プロジェクト" />

        <div className="hd">
          <h2>
            Four scales,<br/>
            <em>one editor's table.</em>
            <span className="ja">自己 → 境界 → 創発 → 文化。</span>
          </h2>
          <p className="hd-r">
            設立時に取り組む四つの旗艦プロジェクト。それぞれ <strong>自己 → 境界 → 創発 → 文化</strong> という異なるスケールで現実編集を担い、内側から外側へと領域を広げる。
            「現実編集とは具体的に何か」を社会に示すショーケース・ポートフォリオである。
          </p>
        </div>

        <div className="proj-grid">
          {items.map((p, i) => (
            <article className={`proj-card ${p.cls}`} key={p.id}>
              <div className="top">
                <span className="id">{p.id}</span>
                <span className="scale">{p.scale}</span>
              </div>
              <div className="name">
                <h3>{p.h}</h3>
                <span className="en">{p.en}</span>
              </div>
              <p>{p.body}</p>
              <div className="ftr">
                <span className="partners">— {p.partners}</span>
                <div className="pl-mini">
                  <div>PL.0{i+1}</div>
                  <div className="pf"></div>
                  <div>{p.cls.toUpperCase()}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 04 VALUES — Ink 全面 / 三柱
// ════════════════════════════════════════════════════════════
function Values() {
  const items = [
    {
      vk: "VALUE 01 ／ TRUST",
      title: "信頼から、始めよ。",
      en: "Begin in trust.",
      body: "自分を信頼し、仲間を信頼し、未来を信頼する。共同幻想が崩れた今、信頼は自動的に与えられるものではなく、自分から選び取って始める態度である。未知の領域へ一歩踏み出すための勇気は、自分への信頼から生まれる。",
      glyph: "信"
    },
    {
      vk: "VALUE 02 ／ SCIENCE",
      title: "科学的に、生きよ。",
      en: "Live as a scientist.",
      body: "仮説を立て、つくり、検証し、更新し続ける。研究室の作法を、日々の仕事や生き方にも持ち込む。仮説には意志が必要で、検証には責任が伴う。",
      glyph: "実"
    },
    {
      vk: "VALUE 03 ／ RESPONSIBILITY",
      title: "プロフェッショナルたれ。",
      en: "Stay professional.",
      body: "自己満足ではなく、受け手のことを考え、最後までやりきる。自分の作品が誰かの世界に影響することへの責任を、引き受けるという意味である。",
      glyph: "責"
    }
  ];

  return (
    <section className="section values grain" id="values">
      <div className="wrap">
        <div className="hd">
          <ChapterMark num="04" label="CHAPTER FOUR" sub="VALUES ／ 三つの行動指針" />
          <p className="hd-r">
            三つを通底する一つの軸 ― <strong style={{color:"var(--vermilion)"}}>意志と責任</strong>。現実は編集できる。だからこそ、編集する意志を持ち、編集した結果に責任を引き受ける。
            意志のない自由は流される現実をもたらし、責任のない編集は他者の現実を傷つける。
          </p>
        </div>

        <h2 style={{marginBottom: 40}}>
          Will <em>×</em> Responsibility.
          <span className="ja">意志と責任を、<span className="em">貫く軸</span>。</span>
        </h2>

        <div className="val-grid">
          {items.map((v, i) => (
            <div className="val-col" key={v.vk}>
              <div className="vk">— {v.vk}</div>
              <h3>{v.title}</h3>
              <div className="en">{v.en}</div>
              <p>{v.body}</p>
              <div className="glyph">{v.glyph}</div>
            </div>
          ))}
        </div>

        <div className="axis">
          <div className="word">意志 × 責任</div>
          <div className="core">WILL × RESPONSIBILITY — 本研究所のあらゆる活動の土台</div>
          <div className="tail">All is experiment.</div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// § 05 CTA — Vermilion 全面 / 参画フォーム
// ════════════════════════════════════════════════════════════
function Contact() {
  const [interests, setInterests] = React.useState([]);
  const toggle = (k) => setInterests(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const opts = ["共同研究", "PoC ／ 実証実験", "ジョイントイベント", "客員研究員", "資本連携", "政策連携", "メディア取材"];

  return (
    <section className="section cta grain" id="contact">
      <div className="wrap">
        <ChapterMark num="05" label="CHAPTER FIVE" sub="JOIN ／ 参画する" />

        <h2>
          What color<br/>
          <em>will you fill the world with?</em>
          <span className="ja">あなたは、<span style={{color: "var(--ink)"}}>何色で</span><span className="com">、</span><br/>世界を満たすのか<span className="com">。</span></span>
        </h2>
        <p className="lede">
          研究者・クリエイター・行政が一つの机に集う、実装インターフェース。
          XR・ブレインテック・生成 AI・コンテンツはもちろん、医療・教育・労働・都市・観光・ガバナンスまで、
          人間の現実感覚に関わるあらゆる領域で、ご一緒に編集していく相手を募集しています。
        </p>

        <div className="cta-grid">
          <form className="cta-form" onSubmit={(e) => { e.preventDefault(); alert("送信プレビュー：実装時はメール／CRM連携を行います。"); }}>
            <div className="formHd">
              <div className="ttl">共同研究・パートナーシップ受付</div>
              <div className="mt">FORM 01 ／ INQUIRY</div>
            </div>
            <div className="field">
              <span className="lbl">所属</span>
              <input type="text" placeholder="株式会社○○ ／ ○○省 ／ ○○大学" />
            </div>
            <div className="field">
              <span className="lbl">ご担当者</span>
              <input type="text" placeholder="お名前" />
            </div>
            <div className="field">
              <span className="lbl">Email</span>
              <input type="email" placeholder="you@example.jp" />
            </div>
            <div className="field" style={{alignItems:"start"}}>
              <span className="lbl" style={{paddingTop: 8}}>関心領域</span>
              <div className="options">
                {opts.map(o => (
                  <span
                    key={o}
                    className={`chip ${interests.includes(o) ? "on" : ""}`}
                    onClick={() => toggle(o)}
                  >{o}</span>
                ))}
              </div>
            </div>
            <div className="field" style={{alignItems:"start"}}>
              <span className="lbl" style={{paddingTop: 8}}>メッセージ</span>
              <textarea placeholder="想定している連携イメージや、編集したい『現実』のテーマをご記入ください。"></textarea>
            </div>
            <button type="submit" className="submit">
              <span>送信する</span>
              <span className="en">— start editing →</span>
            </button>
          </form>

          <aside className="cta-aside">
            <h4>その他の関わり方</h4>
            <p className="ja">
              ・ 趣意書（v.2 平易版）の PDF ダウンロード<br/>
              ・ レクチャーシリーズの定期参加<br/>
              ・ 学生プロジェクトへのメンタリング<br/>
              ・ 国際カンファレンスでの登壇・共催
            </p>

            <h4>事務局</h4>
            <p className="ja">
              （仮称）現実科学研究所 事務局<br/>
              c/o デジタルハリウッド大学<br/>
              東京都千代田区 御茶ノ水（仮）
            </p>

            <a className="pdf" href="#" onClick={(e) => e.preventDefault()}>
              ↓ 趣意書 V.2 ／ PDF
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Projects, Values, Contact });
