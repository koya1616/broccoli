// SVG broccoli illustrations — clusters of organic blobs over a stem.
// Stylized, not photoreal; serves the "lots of broccoli" brief.

const Broccoli = ({ size = 120, hue = 145, l = 0.45, c = 0.12, stemL = 0.62, seed = 1, style }) => {
  // Pseudo-random but stable per seed
  const rng = (n) => {
    const x = Math.sin((seed + 1) * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const florets = [];
  // Outer ring
  const ringCount = 7 + Math.floor(rng(0) * 3);
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2 + rng(i + 1) * 0.4;
    const r = 30 + rng(i + 20) * 6;
    florets.push({
      cx: 50 + Math.cos(angle) * (24 + rng(i + 30) * 2),
      cy: 38 + Math.sin(angle) * (16 + rng(i + 40) * 2) - 4,
      r,
    });
  }
  // Inner blobs
  for (let i = 0; i < 5; i++) {
    florets.push({
      cx: 38 + rng(i + 50) * 24,
      cy: 26 + rng(i + 60) * 18,
      r: 22 + rng(i + 70) * 6,
    });
  }
  const headColor = `oklch(${l} ${c} ${hue})`;
  const headColor2 = `oklch(${l - 0.08} ${c} ${hue})`;
  const headColor3 = `oklch(${l + 0.08} ${c - 0.02} ${hue + 4})`;
  const stemColor = `oklch(${stemL} 0.07 ${hue - 30})`;
  const stemColor2 = `oklch(${stemL - 0.1} 0.07 ${hue - 30})`;

  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} style={style}>
      {/* stem */}
      <path
        d={`M 38 56 Q 36 78 42 96 L 58 96 Q 64 78 62 56 Z`}
        fill={stemColor}
      />
      <path
        d={`M 42 60 Q 40 78 44 94 M 50 60 L 50 94 M 58 60 Q 60 78 56 94`}
        stroke={stemColor2}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* head shadow */}
      {florets.map((f, i) => (
        <circle key={`s${i}`} cx={f.cx + 1.5} cy={f.cy + 1.5} r={f.r * 0.55} fill={headColor2} opacity="0.55" />
      ))}
      {/* head main */}
      {florets.map((f, i) => (
        <circle key={`m${i}`} cx={f.cx} cy={f.cy} r={f.r * 0.5} fill={headColor} />
      ))}
      {/* highlights */}
      {florets.slice(0, 6).map((f, i) => (
        <circle key={`h${i}`} cx={f.cx - f.r * 0.18} cy={f.cy - f.r * 0.18} r={f.r * 0.18} fill={headColor3} opacity="0.85" />
      ))}
      {/* floret texture - tiny dots */}
      {florets.slice(0, 8).map((f, i) => (
        <g key={`t${i}`} opacity="0.5">
          <circle cx={f.cx - 4} cy={f.cy - 2} r="1" fill={headColor2} />
          <circle cx={f.cx + 3} cy={f.cy + 2} r="0.8" fill={headColor2} />
          <circle cx={f.cx} cy={f.cy + 5} r="0.9" fill={headColor2} />
        </g>
      ))}
    </svg>
  );
};

// Tiny inline broccoli — a single cluster, used in lists/badges
const BroccoliMini = ({ size = 28, hue = 145 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <rect x="13" y="17" width="6" height="11" rx="2" fill={`oklch(0.62 0.07 ${hue - 30})`} />
    <circle cx="10" cy="14" r="6" fill={`oklch(0.42 0.12 ${hue})`} />
    <circle cx="22" cy="14" r="6" fill={`oklch(0.42 0.12 ${hue})`} />
    <circle cx="16" cy="9"  r="6" fill={`oklch(0.46 0.12 ${hue})`} />
    <circle cx="16" cy="16" r="6" fill={`oklch(0.46 0.12 ${hue})`} />
    <circle cx="13" cy="11" r="1.4" fill={`oklch(0.55 0.12 ${hue})`} />
    <circle cx="20" cy="13" r="1.2" fill={`oklch(0.55 0.12 ${hue})`} />
  </svg>
);

// A scattered field of emoji broccoli, drifting upward
const BroccoliRain = ({ count = 60, paused = false }) => {
  const items = Array.from({ length: count }, (_, i) => {
    const left = (i * 53.7) % 100;
    const delay = (i * 0.31) % 12;
    const dur = 14 + ((i * 7) % 10);
    const size = 18 + ((i * 13) % 36);
    const drift = ((i * 17) % 40) - 20;
    return { left, delay, dur, size, drift, key: i };
  });
  return (
    <div className="broc-rain" aria-hidden="true" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
      {items.map((it) => (
        <span
          key={it.key}
          className="broc-rain__bit"
          style={{
            left: `${it.left}%`,
            fontSize: `${it.size}px`,
            animationDelay: `-${it.delay}s`,
            animationDuration: `${it.dur}s`,
            animationPlayState: paused ? 'paused' : 'running',
            ['--drift']: `${it.drift}px`,
          }}
        >🥦</span>
      ))}
    </div>
  );
};

// Striped placeholder — for "where a real photo goes"
const PhotoSlot = ({ label, ratio = '4 / 3', tone = 145, style }) => (
  <div className="photo-slot" style={{ aspectRatio: ratio, ...style }}>
    <div className="photo-slot__stripes" style={{ ['--tone']: tone }}></div>
    <span className="photo-slot__label">{label}</span>
  </div>
);

window.Broccoli = Broccoli;
window.BroccoliMini = BroccoliMini;
window.BroccoliRain = BroccoliRain;
window.PhotoSlot = PhotoSlot;
