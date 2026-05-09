// 緑風農園 — broccoli farm site, main app

const { useState, useEffect, useMemo } = React;

const VARIETIES = [
  {
    id: 'midori',
    num: '01 / 06',
    name: '緑風',
    en: 'Midorikaze',
    desc: ' 主力品種。締まりのある花蕾と凛とした甘み。茹で上がりの色が冴え、店頭で一番人気。',
    tags: ['定番', '寒締め', '甘味◎'],
    seed: 1, hue: 145, l: 0.46,
    spec: { 産地: '長野・佐久', 旬: '11月〜2月', 重さ: '約 480g', 価格: '¥480' }
  },
  {
    id: 'yuki',
    num: '02 / 06',
    name: '雪ごもり',
    en: 'Yuki-gomori',
    desc: '雪の下でじっくり熟成。糖度がぐっと上がり、生でも食べられるほど。冬の限定品。',
    tags: ['冬限定', '糖度8°', '生食可'],
    seed: 7, hue: 150, l: 0.44,
    spec: { 産地: '長野・川上', 旬: '12月〜1月', 重さ: '約 520g', 価格: '¥620' }
  },
  {
    id: 'tsubomi',
    num: '03 / 06',
    name: 'つぼみ',
    en: 'Tsubomi',
    desc: '小ぶり多収のミニタイプ。お弁当・付け合わせ・蒸し料理に。子どもにも食べやすい。',
    tags: ['小ぶり', '子ども向き'],
    seed: 3, hue: 138, l: 0.50,
    spec: { 産地: '長野・佐久', 旬: '通年', 重さ: '約 280g', 価格: '¥320' }
  },
  {
    id: 'kuki',
    num: '04 / 06',
    name: '茎太',
    en: 'Kukibuto',
    desc: 'スティックブロッコリー。茎まで甘く、生のままディップで。歯ごたえも楽しい。',
    tags: ['スティック', '茎まで美味'],
    seed: 5, hue: 142, l: 0.48,
    spec: { 産地: '長野・佐久', 旬: '6月〜10月', 重さ: '約 200g', 価格: '¥380' }
  },
  {
    id: 'murasaki',
    num: '05 / 06',
    name: '紫雲',
    en: 'Shiun',
    desc: '紫がかった希少品種。アントシアニンが豊富で、サラダの彩りにも。茹でると緑に。',
    tags: ['希少', '紫', '色映え'],
    seed: 9, hue: 320, l: 0.42, c: 0.08,
    spec: { 産地: '長野・小諸', 旬: '10月〜12月', 重さ: '約 400g', 価格: '¥720' }
  },
  {
    id: 'kibou',
    num: '06 / 06',
    name: '黄房',
    en: 'Kibusa',
    desc: 'カリフラワーに近い淡色品種。やわらかな食感とほのかな甘さ。蒸し料理に最適。',
    tags: ['淡色', '蒸し料理'],
    seed: 4, hue: 95, l: 0.78, c: 0.07,
    spec: { 産地: '長野・佐久', 旬: '11月〜2月', 重さ: '約 450g', 価格: '¥520' }
  },
];

const PROCESS = [
  { month: 'JUL · 7月', title: '苗床づくり', body: '土を耕し、堆肥をすき込んで種をまく。3,000本の苗を一つ一つ手作業で。' },
  { month: 'AUG · 8月', title: '定植・草取り', body: '畑へ移植し、根が張るまで毎日水やり。雑草は抜きすぎず、土を冷やすために残す。' },
  { month: 'OCT · 10月', title: '花蕾の見立て', body: '一株ずつ覗きこみ、収穫日を見定める。寒さに当たって甘みが乗るのを待つ時期。' },
  { month: 'NOV · 11月', title: '朝採り出荷', body: '日の出前に収穫し、その日のうちに発送。新鮮なまま食卓へ届ける。' },
];

// ===== ticker =====
const Ticker = () => {
  const items = ['朝採り直送', '減農薬栽培', '寒締めで甘く', '長野・佐久平から', '農家直販', '🥦', '今朝の畑から', '一株ずつ手作業'];
  return (
    <div className="ticker">
      <div className="ticker__track">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i}>{t} <i>—</i></span>
        ))}
      </div>
    </div>
  );
};

// ===== variety modal =====
const VarietyModal = ({ v, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__art">
          <button className="modal__close" onClick={onClose}>×</button>
          <Broccoli size={220} hue={v.hue} l={v.l} c={v.c ?? 0.12} seed={v.seed} />
        </div>
        <div className="modal__body">
          <small>{v.num}</small>
          <h3>{v.name}</h3>
          <em>{v.en}</em>
          <p>{v.desc}</p>
          <div className="modal__spec">
            {Object.entries(v.spec).map(([k, val]) => (
              <div key={k}><b>{k}</b><span>{val}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== broccoli wall (lots and lots) =====
const Wall = () => {
  const cells = useMemo(() => {
    const arr = [];
    const total = 96;
    for (let i = 0; i < total; i++) {
      const r = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const seed = Math.abs(r);
      let kind;
      if (seed < 0.55) kind = 'emoji';
      else if (seed < 0.85) kind = 'svg';
      else kind = 'photo';
      arr.push({ kind, hue: 130 + (i * 7) % 50, seed: i });
    }
    return arr;
  }, []);
  const counts = useMemo(() => ({
    emoji: cells.filter(c => c.kind === 'emoji').length,
    svg: cells.filter(c => c.kind === 'svg').length,
    photo: cells.filter(c => c.kind === 'photo').length,
  }), [cells]);
  return (
    <section className="wall" id="wall">
      <div className="wall__head">
        <h3>こんなに、<em>ブロッコリー</em>。</h3>
        <p>絵文字も、イラストも、写真も。畑にはいつも何千株というブロッコリーが並んでいます。</p>
      </div>
      <div className="wall__grid">
        {cells.map((c, i) => {
          if (c.kind === 'emoji') return <div key={i} className="wall__cell">🥦</div>;
          if (c.kind === 'svg') return (
            <div key={i} className="wall__cell wall__cell--svg">
              <BroccoliMini size={32} hue={c.hue} />
            </div>
          );
          return (
            <div key={i} className="wall__cell wall__cell--photo">
              <PhotoSlot label="畑" tone={c.hue} ratio="1" style={{ height: '100%' }} />
            </div>
          );
        })}
      </div>
      <p className="wall__count">
        <b>{cells.length}</b> 株 &nbsp;·&nbsp; 🥦 × {counts.emoji} &nbsp;·&nbsp; SVG × {counts.svg} &nbsp;·&nbsp; PHOTO × {counts.photo}
      </p>
    </section>
  );
};

// ===== order box =====
const OrderBox = () => {
  const items = [
    { id: 'midori', name: '緑風 1株', sub: 'Midorikaze · 約480g', price: 480 },
    { id: 'yuki', name: '雪ごもり 1株', sub: 'Yuki-gomori · 約520g', price: 620 },
    { id: 'mix', name: '農家おまかせ 5株', sub: '品種ミックス', price: 2200 },
    { id: 'kuki', name: '茎太 3束', sub: 'スティックタイプ', price: 980 },
  ];
  const [qty, setQty] = useState({ midori: 2, yuki: 1, mix: 0, kuki: 0 });
  const [success, setSuccess] = useState(false);
  const total = items.reduce((s, it) => s + qty[it.id] * it.price, 0);
  const totalQty = Object.values(qty).reduce((a, b) => a + b, 0);
  const set = (id, d) => setQty(q => ({ ...q, [id]: Math.max(0, q[id] + d) }));
  const submit = () => {
    if (totalQty === 0) return;
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2200);
  };
  return (
    <div className="box-card">
      <div className="box-card__title">
        <span>今週のお届け箱</span>
        <em>This week's box</em>
      </div>
      <div className="box-card__sub">送料 ¥0 · 5,000円以上で氷詰め保冷</div>
      {items.map(it => (
        <div key={it.id} className="box-row">
          <div className="box-row__left">
            <BroccoliMini size={28} hue={it.id === 'yuki' ? 152 : 145} />
            <div className="box-row__name">
              <b>{it.name}</b>
              <span>{it.sub}</span>
            </div>
          </div>
          <div className="qty">
            <span className="mono" style={{ marginRight: 12, color: 'var(--ink-mute)' }}>¥{it.price}</span>
            <button onClick={() => set(it.id, -1)} disabled={qty[it.id] === 0}>−</button>
            <span>{qty[it.id]}</span>
            <button onClick={() => set(it.id, +1)}>+</button>
          </div>
        </div>
      ))}
      <div className="box-total">
        <span>合計 · TOTAL</span>
        <b>¥{total.toLocaleString()}<small>（税込）</small></b>
      </div>
      <button
        className="btn-primary"
        data-success={success ? 'true' : null}
        onClick={submit}
      >
        {success ? '✓ ご注文ありがとうございます' : `カートに入れる（${totalQty}点）`}
      </button>
    </div>
  );
};

// ===== main =====
const App = () => {
  const tweaksDefaults = /*EDITMODE-BEGIN*/{
    "rain": true,
    "accent": "#c87a3f",
    "broccoliCount": 60
  }/*EDITMODE-END*/;
  const [t, setTweak] = useTweaks(tweaksDefaults);
  const [openVariety, setOpenVariety] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--terra', t.accent);
  }, [t.accent]);

  return (
    <>
      {t.rain && <BroccoliRain count={t.broccoliCount} />}

      <header className="topbar">
        <div className="shell topbar__inner">
          <div className="brand">
            <span className="brand__mark"><BroccoliMini size={22} hue={142} /></span>
            <span>緑風農園</span>
          </div>
          <nav className="nav">
            <a href="#varieties">品種</a>
            <a href="#story">農家のはなし</a>
            <a href="#process">育てかた</a>
            <a href="#order">注文</a>
          </nav>
          <a href="#order" className="topbar__cta">
            <span className="topbar__cta__long">今朝の畑から注文</span>
            <span className="topbar__cta__short">注文する</span>
            <span className="topbar__cta__icon">🥦</span>
            <span className="topbar__cta__arrow"> →</span>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="shell hero__row">
          <div>
            <div className="hero__eyebrow">2026 — WINTER HARVEST</div>
            <h1 className="hero__title">
              一株、<br/>
              <em>まるごと甘い</em>。<br/>
              冬の<em>ブロッコリー</em>。
            </h1>
            <p className="hero__sub">
              長野・佐久平の標高 800m。霜にあてて甘みを引き出した、緑風農園のブロッコリーをお届けします。朝採りをその日のうちに、ご家庭の食卓へ。
            </p>
            <div className="hero__meta">
              <div><b>3,200</b><span>株 / 今シーズン</span></div>
              <div><b>0.6ha</b><span>畑の広さ</span></div>
              <div><b>11<small style={{fontSize: 18}}>月</small></b><span>収穫スタート</span></div>
              <div><b>1<small style={{fontSize: 18}}>人</small></b><span>農家</span></div>
            </div>
          </div>
          <div className="hero__art">
            <div className="hero__circle"></div>
            <div className="hero__big-broc">
              <Broccoli size={360} hue={145} l={0.45} seed={2} />
            </div>
            <div className="hero__floats">
              <span className="hero__float">🥦</span>
              <span className="hero__float">🥦</span>
              <span className="hero__float">🥦</span>
              <span className="hero__float">🥦</span>
              <span className="hero__float">🥦</span>
              <span className="hero__float">🥦</span>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* VARIETIES */}
      <section className="section" id="varieties">
        <div className="shell">
          <div className="section__head">
            <div>
              <div className="section__label">VARIETIES — 品種</div>
              <h2 className="section__title">6 品種、ぜんぶ違うブロッコリー。</h2>
            </div>
            <p className="section__lede">
              定番の「緑風」から、雪の下で熟成させる「雪ごもり」、希少な紫品種「紫雲」まで。それぞれの旬と顔つきがあります。気になる株をクリックすると詳細が開きます。
            </p>
          </div>
          <div className="varieties">
            {VARIETIES.map((v, i) => (
              <div key={v.id} className="variety" onClick={() => setOpenVariety(v)}>
                <div className="variety__art">
                  <span className="variety__num mono">{v.num}</span>
                  <Broccoli size={140} hue={v.hue} l={v.l} c={v.c ?? 0.12} seed={v.seed} />
                </div>
                <div className="variety__name">
                  {v.name} <small>{v.en}</small>
                </div>
                <p className="variety__desc">{v.desc}</p>
                <div className="variety__tags">
                  {v.tags.map((tag, j) => (
                    <span key={j} className={`variety__tag ${tag.includes('限定') || tag.includes('希少') ? 'variety__tag--hot' : ''}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section section--paper" id="story">
        <div className="shell">
          <div className="section__head">
            <div>
              <div className="section__label">FARMER — 農家のはなし</div>
              <h2 className="section__title">朝5時、畑が目を覚ます前に。</h2>
            </div>
            <p className="section__lede">
              緑風農園を一人で営む森田さんに、ブロッコリーの育て方と暮らしについて聞きました。
            </p>
          </div>
          <div className="story">
            <div className="story__photo">
              <PhotoSlot label="森田さん 畑にて" tone={140} ratio="4 / 5" style={{ height: '100%' }} />
              <div className="story__caption">
                <b>森田 健一</b>
                <span>緑風農園 · since 2014</span>
              </div>
            </div>
            <div className="story__body">
              <p>
                <strong>「ブロッコリーは、寒さに当たれば当たるほど甘くなる」</strong>と、就農した最初の年に教わりました。実際、霜が降りた朝に収穫した一株を生で齧ると、ほのかに梨のような香りがする。それが冬の緑風農園の自慢です。
              </p>
              <p>
                農薬は最小限に、堆肥は地元の牛舎から分けてもらったものを使います。化学肥料を抑える代わりに、土の温度と湿度を毎日記録する。一株ごとに育ち方が違うので、出荷の見立ては全部、目と手で。
              </p>
              <p>
                「丸ごと食べてほしい」というのが、いちばんの願いです。茎まで甘いのがうちのブロッコリーなので、捨てずに薄切りで炒めたり、スープに入れたり。レシピも箱に入れてお送りしています。
              </p>
              <div className="story__signature">
                <Broccoli size={56} hue={145} seed={11} />
                <div>
                  <b>森田 健一</b>
                  <div><span>MORITA KENICHI</span></div>
                </div>
              </div>
              <div className="story__stats">
                <div className="story__stat"><b>11<small style={{fontSize: 16, color: 'var(--ink-mute)', marginLeft: 4}}>年目</small></b><span>就農年数</span></div>
                <div className="story__stat"><b>3,200</b><span>今期 株数</span></div>
                <div className="story__stat"><b>92<small style={{fontSize: 16, color: 'var(--ink-mute)'}}>%</small></b><span>リピート率</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section--dark" id="process">
        <div className="shell">
          <div className="section__head">
            <div>
              <div className="section__label">PROCESS — 育てかた</div>
              <h2 className="section__title">7月の種まきから、11月の朝採りまで。</h2>
            </div>
            <p className="section__lede" style={{ color: 'oklch(0.78 0.04 130)' }}>
              一株のブロッコリーが食卓に届くまで、およそ4ヶ月。畑で過ごす日々のひとこまを並べてみました。
            </p>
          </div>
          <div className="process">
            {PROCESS.map((s, i) => (
              <div key={i} className="step">
                <div className="step__circle">
                  <span className="step__num">{i + 1}</span>
                  <Broccoli size={64} hue={145} l={0.55} seed={i + 20} />
                </div>
                <div className="step__month mono">{s.month}</div>
                <h4 className="step__title">{s.title}</h4>
                <p className="step__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER */}
      <section className="section" id="order">
        <div className="shell">
          <div className="section__head">
            <div>
              <div className="section__label">ORDER — ご注文</div>
              <h2 className="section__title">畑から、まっすぐご家庭へ。</h2>
            </div>
            <p className="section__lede">
              注文をいただいた翌朝、畑で収穫してそのまま発送します。配達は翌々日の午前。冷蔵便でお届けします。
            </p>
          </div>
          <div className="order">
            <div>
              <div className="order__photos">
                <PhotoSlot label="箱詰めの様子" tone={140} ratio="4 / 5" />
                <PhotoSlot label="氷詰め保冷" tone={150} ratio="4 / 5" />
                <PhotoSlot label="同梱レシピ" tone={50} ratio="4 / 5" />
                <PhotoSlot label="今朝の畑" tone={130} ratio="4 / 5" />
              </div>
              <div className="order__notes">
                <div className="order__note">
                  <b>SHIPPING · 配送</b>
                  <span>クロネコヤマト 冷蔵便。注文翌々日のお届け。</span>
                </div>
                <div className="order__note">
                  <b>STORAGE · 保存</b>
                  <span>冷蔵で5日。冷凍は小房に分けて1ヶ月保存可能。</span>
                </div>
              </div>
            </div>
            <OrderBox />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="shell">
          <div className="foot__row">
            <div className="foot__brand">
              <b>緑風農園</b>
              <p>長野県佐久市の小さなブロッコリー専業農家。一人で畑に立ち、一株ずつ手で出荷しています。</p>
            </div>
            <div>
              <h4>品種 · VARIETIES</h4>
              <ul>
                {VARIETIES.slice(0, 5).map(v => <li key={v.id}><a href="#varieties">{v.name}</a></li>)}
              </ul>
            </div>
            <div>
              <h4>サイト · SITE</h4>
              <ul>
                <li><a href="#story">農家のはなし</a></li>
                <li><a href="#process">育てかた</a></li>
                <li><a href="#order">ご注文</a></li>
              </ul>
            </div>
            <div>
              <h4>連絡先 · CONTACT</h4>
              <ul>
                <li>〒385-0000 長野県佐久市</li>
                <li>info@ryokufu.farm</li>
                <li>0267-XX-XXXX</li>
                <li>Instagram @ryokufu</li>
              </ul>
            </div>
          </div>
          <div className="foot__low">
            <span>© 2026 RYOKUFU FARM</span>
            <span>🥦 一株、まるごと甘い。</span>
          </div>
        </div>
      </footer>

      {openVariety && <VarietyModal v={openVariety} onClose={() => setOpenVariety(null)} />}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Atmosphere">
          <TweakToggle label="🥦 ブロッコリーの雨" value={t.rain} onChange={(v) => setTweak('rain', v)} />
          <TweakSlider label="降る量" min={20} max={160} step={10} value={t.broccoliCount} onChange={(v) => setTweak('broccoliCount', v)} />
        </TweakSection>
        <TweakSection label="Color">
          <TweakColor
            label="アクセント"
            value={t.accent}
            onChange={(v) => setTweak('accent', v)}
            options={["#c87a3f", "#b8423a", "#d8a23a", "#7a5a9a", "#3a82a8"]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
