/* ========== v1 sections ========== */
const { useState: useV1S } = React;

function Hero({ onEdit }) {
  return (
    <section className="hero" id="top">
      <KanjiBg char="現" top="-12vw" right="-6vw" size="48vw" />

      <div className="top-meta">
        <div>趣意書 V.2 ／ 平易版</div>
        <div className="meta-c"><RegMark size={14} /><span>REALITY SCIENCE INSTITUTE</span><RegMark size={14} /></div>
        <div className="meta-r">学長 藤井直敬 ／ Naotaka FUJII</div>
      </div>

      <div className="hero-canvas">
        <div>
          <div className="hint-pill" style={{ marginBottom: 28 }}>▸ HIGHLIGHTED WORDS ARE EDITABLE</div>
          <h1 className="hero-stmt">
            <span className="line">
              <EditableSpan label="EDIT NOUN" defaultValue="現実" options={["現実","物語","自己","境界","文化","世界"]} onChange={onEdit} />
              <span className="punct">は、</span>
            </span>
            <span className="line">
              <EditableSpan label="EDIT VERB" defaultValue="編集できる" options={["編集できる","書き換えられる","組み直せる","満たせる","更新できる"]} onChange={onEdit} />
              <span className="punct">。</span>
            </span>
          </h1>
          <p className="hero-sub">
            脳が組み立てる主観こそが現実である ― この立脚点から、研究・教育・産業・行政を一つのテーブルに集める実験場。<br/>
            （仮称）現実科学研究所は、2026 年 7 月、デジタルハリウッド大学に設立されます。
          </p>
        </div>

        <aside className="hero-side">
          <div><div className="h">FOUNDED</div><p>2026 / 07 (PLANNED)<br/>Digital Hollywood University</p></div>
          <div><div className="h">DIRECTOR</div><p>Naotaka Fujii<br/>President, DHU</p></div>
          <div><div className="h">MISSION</div><p>Fill the World ／<br/>世界を満たせ</p></div>
          <div><div className="h">HYPOTHESIS</div><p>Reality is editable.<br/>それをどう見せるのか、<br/>どう見るのか。</p></div>
        </aside>
      </div>

      <div className="hero-bottom">
        <div className="scroll-cue"><span className="line"></span><span>SCROLL ／ 趣意書を読む</span></div>
        <div>※ HOVER & CLICK ANY 朱-COLORED WORD</div>
      </div>
    </section>
  );
}

function Concept({ onEdit }) {
  const cells = [
    { no: "01", vt: "壱", title: "現実は、内側に立ち上がる。", body: "脳は世界を客観的に受け取っていない。過去の経験からつくった予測モデルで、世界がどう見えるかを能動的に組み立てている。同じ場にいた二人がまったく違う『現実』を生きていても不思議ではない。" },
    { no: "02", vt: "弐", title: "一切皆空、ゆえに一切皆楽。", body: "固定して見える物事も、瞬間ごとに変わり続けている。揺るぎないと思っていた仕事の役割も、人間関係も、自分らしさも、文脈次第で姿を変える ― だからこそ、いつでも組み直していい。" },
    { no: "03", vt: "参", title: "意識と無意識の協働。", body: "判断のほとんどは意識化される前に準備されている。しかし意識は観察し、気づき、わずかな調整を加えることはできる。意識と無意識の往復こそ、人間に残された創造的な自由である。" },
    { no: "04", vt: "四", title: "現実を更新する勇気。", body: "『これは自分だ』『これが正解だ』と思っているものを、いったん『いまの仮の姿』として見直す。必要なときだけ軽く外せるしなやかさ ― それが現実科学が呼ぶ幸福の最小単位、レジリエンスの本質である。" }
  ];
  return (
    <section className="section paper" id="concept">
      <div className="wrap">
        <div className="sec-head">
          <div className="marker">
            <span className="no">No. 01 ／ 思想</span>
            CHAPTER<br/>REALITY EDITING
          </div>
          <div>
            <h2>
              <EditableSpan label="主語を編集" defaultValue="現実" options={["現実","輪郭","前提","境界"]} onChange={onEdit} />
              は<br/>編集できる構築物だ。
            </h2>
            <p className="lead">
              『動かない』と思い込まれてきた前提や境界を、意識的に見直し、別のかたちへと組み直す実践 ―
              これを本研究所では「<span style={{ color: "var(--shu)", fontWeight: 700 }}>現実編集</span>」と呼びます。
              一部の天才や名匠が直感で行ってきたこの編集を、誰もが学べる技術へと引き上げる。
            </p>
          </div>
        </div>

        <div className="concept-grid">
          {cells.map(c => (
            <div className="concept-cell" key={c.no}>
              <span className="no">— {c.no}</span>
              <div className="vt-num">{c.vt}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mission({ onEdit }) {
  return (
    <section className="section dark mission" id="mission">
      <KanjiBg char="満" top="10%" left="-8vw" size="50vw" />
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="sec-head">
          <div className="marker" style={{ color: "var(--ash-d)" }}>
            <span className="no">No. 02 ／ ミッション</span>
            MISSION<br/>FILL THE WORLD
          </div>
          <div>
            <div className="mission-mark">SINCE 2026 — 藤井時代</div>
            <h2>
              <EditableSpan label="OBJECT" defaultValue="世界" options={["世界","余白","未完","可能性"]} onChange={onEdit} />
              を<br/>
              <span className="accent">満たせ</span>
              <span style={{ color: "var(--ash-d)" }}>。</span>
            </h2>
            <div className="en">FILL ／ THE ／ WORLD</div>

            <div className="body">
              <p>
                自分のなかにある可能性、まだ世界に存在していない現実の色彩を ― 作品として、サービスとして、システムとして、コミュニティとして ― 世界に実装し循環させていく。
                それによって世界に新しい価値、新しい色、新しい現実を増やしていく。
              </p>
              <p>
                「世界を満たせ」は、個人の挑戦ではない、<strong style={{ color: "var(--rin)" }}>連鎖反応の宣言</strong>です。
                誰か一人の作品が誰かの希望と未来になり、それがさらに次の誰かの現実を更新し、その更新が世界の見え方を編み直していく。
              </p>
            </div>

            <div className="mission-quote">
              <div className="vt">継承と拡張</div>
              <div className="text">
                <em style={{ fontStyle: "normal", color: "var(--shu)" }}>「すべてをエンタテインメントにせよ」</em>という創立精神を継承しながら、<br/>
                その領域を<br/>
                <em style={{ fontStyle: "normal", color: "var(--rin)" }}>人間の可能性そのもの</em>へと押し広げます。
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScaleDiagram({ activeIndex }) {
  const rings = [
    { r: 50, label: "自己", short: "SELF" },
    { r: 100, label: "境界", short: "BORDER" },
    { r: 150, label: "創発", short: "EMERGENCE" },
    { r: 200, label: "文化", short: "CULTURE" }
  ];
  return (
    <svg viewBox="-240 -240 480 480">
      <g stroke="var(--ash-d)" strokeWidth="0.5" opacity="0.25">
        <line x1="-240" y1="0" x2="240" y2="0" />
        <line x1="0" y1="-240" x2="0" y2="240" />
      </g>
      {rings.map((ring, i) => {
        const isActive = i === activeIndex;
        return (
          <g key={ring.label}>
            <circle cx="0" cy="0" r={ring.r} fill="none"
              stroke={isActive ? "var(--shu)" : "var(--ash)"}
              strokeWidth={isActive ? 1.6 : 0.7}
              strokeDasharray={isActive ? "" : "2 4"}
              opacity={isActive ? 1 : 0.55} />
            <text x="0" y={-ring.r + 4} textAnchor="middle"
              fontFamily="var(--f-mono)" fontSize="10" letterSpacing="0.18em"
              fill={isActive ? "var(--shu)" : "var(--ash)"} opacity={isActive ? 1 : 0.6}>
              {ring.short} ／ {ring.label}
            </text>
          </g>
        );
      })}
      <circle cx="0" cy="0" r="3" fill="var(--rin)" />
      <circle cx="0" cy="0" r="8" fill="none" stroke="var(--rin)" strokeWidth="0.6" opacity="0.7">
        <animate attributeName="r" values="8;22;8" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
      </circle>
      <g fontFamily="var(--f-mono)" fontSize="9" letterSpacing="0.16em" fill="var(--ash)" opacity="0.6">
        <text x="215" y="-10" textAnchor="end">→ 外向き編集</text>
        <text x="-215" y="-10">内向き編集 ←</text>
      </g>
    </svg>
  );
}

function Projects() {
  const [active, setActive] = useV1S(0);
  const data = [
    { key: "ame", idx: "P-01", title: "雨にも負けず高校 連携", scale: "自己 ／ SELF", body: "来年4月開校予定の雨にも負けず高校との高大連携。15〜18歳という、最も自己定義が硬化しやすい時期に、可動域を保ったまま大人になる訓練を提供する。レジリエンス教育を『逆境への耐性』ではなく『自己定義を常時更新し続ける力』として再定義する。", partners: "雨にも負けず高校 ／ DHU 教学", ringIndex: 0 },
    { key: "atk", idx: "P-02", title: "攻撃学", scale: "境界 ／ BORDER", body: "田中悠斗教授が中心となって立ち上げるサイバーセキュリティ研究の新領域。『攻撃を知らずして防御は無理』― この命題は現実科学の核心と完全に重なる。学長のSR（代替現実）研究が『現実は差し替え可能だ』と被験者に体感させたように、攻撃学は『あなたが守っているシステムは差し替え可能だ』と防御者に体感させる学問になる。", partners: "田中悠斗 教授 ／ サイバーセキュリティ ハブ", ringIndex: 1 },
    { key: "sgl", idx: "P-03", title: "シンギュラボ 連携", scale: "創発 ／ EMERGENCE", body: "スペースデータ社が主催するシンギュラボとの連携。研究者・起業家・アーティスト・市民が境界を越えて集まり、ボトムアップで課題を発見し解決する創発的コミュニティ。研究機関の知と、コミュニティの即興力を接合し、現場の個別主観から立ち上がる解 ― 現実科学が描く『意識と無意識のあいだのダイナミクス』を社会規模で再現する試み。", partners: "スペースデータ ／ シンギュラボ コミュニティ", ringIndex: 2 },
    { key: "ppp", idx: "P-04", title: "Pop Power Project（PPP）", scale: "文化 ／ CULTURE", body: "アニメ・マンガ・ゲーム・音楽・キャラクター ― 産業規模で行われてきた『現実編集』の最も成功した例。本研究所はPPPの事務局を担い、コンテンツ産業を『現実編集産業』という視点で再定義する。日本のクリエイターたちが編集した新しい現実を、世界を満たすコンテンツとして流通させる。", partners: "Pop Power Project 事務局 ／ コンテンツ産業 各社", ringIndex: 3 }
  ];

  return (
    <section className="section paper-2" id="projects">
      <div className="wrap">
        <div className="sec-head">
          <div className="marker">
            <span className="no">No. 03 ／ 旗艦プロジェクト</span>
            FLAGSHIP<br/>PORTFOLIO
          </div>
          <div>
            <h2>4つのスケールで<br/>現実を編集する。</h2>
            <p className="lead">
              立ち上げ時に取り組む四つの旗艦プロジェクト。それぞれ <strong>自己 → 境界 → 創発 → 文化</strong> という異なるスケールで現実編集を担い、内側から外側へと領域を広げます。
              「現実編集とは具体的に何か」を社会に示す<strong>ショーケース・ポートフォリオ</strong>です。
            </p>
          </div>
        </div>

        <div className="proj-wrap">
          <div className="proj-scale"><ScaleDiagram activeIndex={data[active].ringIndex} /></div>
          <div className="proj-list">
            {data.map((p, i) => (
              <div key={p.key} className={`proj-row ${active === i ? "active" : ""}`} onClick={() => setActive(i)}>
                <div className="idx">{p.idx}</div>
                <div>
                  <h3>{p.title}</h3>
                  <div className="body">
                    <p>{p.body}</p>
                    <div className="partners">— {p.partners}</div>
                  </div>
                </div>
                <div className="scale-tag" style={{ color: active === i ? "var(--shu)" : "currentColor" }}>{p.scale}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    { vk: "VALUE 01", title: "信頼から始めよ", glyph: "信", body: "自分を信頼し、仲間を信頼し、未来を信頼する。共同幻想が崩れた今、信頼は自動的に与えられるものではなく、自分から選び取って始める態度です。未知の領域へ一歩踏み出すための勇気は、自分への信頼から生まれます。" },
    { vk: "VALUE 02", title: "科学的に生きよ", glyph: "実", body: "仮説を立て、つくり、検証し、更新し続ける。研究室の作法を、日々の仕事や生き方にも持ち込む。仮説には意志が必要で、検証には責任が伴います。" },
    { vk: "VALUE 03", title: "プロフェッショナルたれ", glyph: "責", body: "自己満足ではなく、受け手のことを考え、最後までやりきる。自分の作品が誰かの世界に影響することへの責任を、引き受けるという意味です。" }
  ];
  return (
    <section className="section ink" id="values">
      <div className="wrap">
        <div className="sec-head">
          <div className="marker" style={{ color: "var(--ash-d)" }}>
            <span className="no">No. 04 ／ 行動指針</span>
            VALUES<br/>THREE AXES
          </div>
          <div>
            <h2>意志と責任を、貫く軸。</h2>
            <p className="lead">
              三つを通底する一つの軸 ― <strong style={{ color: "var(--rin)" }}>意志と責任</strong>。
              現実は編集できる。だからこそ、編集する意志を持ち、編集した結果に責任を引き受ける。
              意志のない自由は流される現実をもたらし、責任のない編集は他者の現実を傷つけます。
            </p>
          </div>
        </div>

        <div className="val-grid">
          {items.map(v => (
            <div className="val-col" key={v.vk}>
              <div className="vk">{v.vk}</div>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
              <div className="glyph">{v.glyph}</div>
            </div>
          ))}
        </div>

        <div className="axis">
          <div className="tk">意志 × 責任</div>
          <div className="core">WILL × RESPONSIBILITY — 本研究所のあらゆる活動の土台</div>
          <div className="core" style={{ color: "var(--shu)" }}>すべては実験である</div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [interests, setInterests] = useV1S([]);
  const toggle = (k) => setInterests(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const opts = ["共同研究", "PoC ／ 実証実験", "ジョイントイベント", "客員研究員", "資本連携", "政策連携"];

  return (
    <section className="cta" id="contact">
      <KanjiBg char="編" top="-6%" right="-4vw" size="50vw" />
      <div className="cta-inner" style={{ position: "relative", zIndex: 2 }}>
        <div className="hint-pill" style={{ marginBottom: 28 }}>▸ CONTACT — 共同研究・パートナーシップ</div>
        <h2>
          一緒に、<br/>
          <EditableSpan label="EDIT NOUN" defaultValue="世界" options={["世界","産業","文化","未来","現実"]} />
          をつくろう。
        </h2>
        <p className="sub">
          研究者・クリエイター・行政が一つのテーブルに集う実装インターフェース。
          XR・ブレインテック・生成 AI・コンテンツはもちろん、医療・教育・労働・都市・観光・ガバナンスまで、
          人間の現実感覚に関わるあらゆる領域で、ご一緒に編集していきましょう。
        </p>

        <div className="cta-grid">
          <form className="cta-form" onSubmit={(e) => { e.preventDefault(); alert("送信プレビュー：実装時はメール送信／CRM連携を行います。"); }}>
            <div className="field"><span className="lbl">所属</span><input type="text" placeholder="株式会社○○ ／ ○○省 ／ ○○大学" /></div>
            <div className="field"><span className="lbl">ご担当者</span><input type="text" placeholder="お名前" /></div>
            <div className="field"><span className="lbl">Email</span><input type="email" placeholder="you@example.jp" /></div>
            <div className="field" style={{ alignItems: "start" }}>
              <span className="lbl" style={{ paddingTop: 8 }}>関心領域</span>
              <div className="options">
                {opts.map(o => (
                  <span key={o} className={`chip ${interests.includes(o) ? "on" : ""}`} onClick={() => toggle(o)}>{o}</span>
                ))}
              </div>
            </div>
            <div className="field" style={{ alignItems: "start" }}>
              <span className="lbl" style={{ paddingTop: 8 }}>メッセージ</span>
              <textarea placeholder="想定している連携イメージや、編集したい『現実』のテーマをご記入ください。"></textarea>
            </div>
            <button type="submit" className="submit">送信する ／ START EDITING</button>
          </form>

          <aside className="cta-aside">
            <h4>その他の関わり方</h4>
            <p>
              ・ 趣意書（V.2 平易版）のダウンロード<br/>
              ・ レクチャーシリーズの定期参加<br/>
              ・ 学生プロジェクトへのメンタリング<br/>
              ・ 国際カンファレンスでの登壇／共催
            </p>
            <h4>事務局</h4>
            <p>
              （仮称）現実科学研究所 事務局<br/>
              c/o デジタルハリウッド大学<br/>
              東京都千代田区 御茶ノ水（仮）<br/>
              info@reality-science.jp（仮）
            </p>
            <a className="pdf" href="#" onClick={(e) => e.preventDefault()}>↓ 趣意書 V.2 ／ PDF</a>
          </aside>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Concept, Mission, Projects, Values, Contact });
