// mascots.jsx — cute hamster + cat fan mascots.
// Two styles, switchable from Tweaks via MascotStyleContext:
//   'illust' → real illustrated stickers (assets/mascot-*.png, background removed)
//   'shape'  → original simple-shape SVG characters
// Exports: HamsterFace, CatFace, MascotPair, MascotDuo, Sparkle, Drop, MascotStyleContext
// `size` = rendered HEIGHT in px; data-mascot attr kept for the on/off toggle.

const MascotStyleContext = React.createContext('illust');

const MASCOT_SRC = {
  hamster: 'assets/mascot-hamster.png',
  cat:     'assets/mascot-cat.png',
  pair:    'assets/mascot-pair.png',
  bodies:  'assets/mascot-bodies.png',
};

function MascotImg({ kind, size, style = {} }) {
  return (
    <img
      data-mascot={kind}
      src={MASCOT_SRC[kind]}
      alt=""
      draggable="false"
      style={{ height: size, width: 'auto', display: 'block', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none', ...style }}
    />
  );
}

// ── shape (SVG) versions ─────────────────────────────────────────
function HamsterSVG({ size = 64, blush = '#ffb7c5', fur = '#f6e7c6', earFur = '#efd6a6' }) {
  return (
    <svg data-mascot="hamster" width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <circle cx="26" cy="24" r="13" fill={earFur} />
      <circle cx="74" cy="24" r="13" fill={earFur} />
      <circle cx="26" cy="24" r="6.5" fill={blush} opacity="0.7" />
      <circle cx="74" cy="24" r="6.5" fill={blush} opacity="0.7" />
      <ellipse cx="50" cy="55" rx="40" ry="35" fill={fur} />
      <ellipse cx="50" cy="63" rx="20" ry="16" fill="#fffaf0" opacity="0.85" />
      <ellipse cx="24" cy="62" rx="10" ry="8" fill={blush} opacity="0.85" />
      <ellipse cx="76" cy="62" rx="10" ry="8" fill={blush} opacity="0.85" />
      <circle cx="37" cy="52" r="4.6" fill="#3a2e22" />
      <circle cx="63" cy="52" r="4.6" fill="#3a2e22" />
      <circle cx="38.6" cy="50.4" r="1.5" fill="#fff" />
      <circle cx="64.6" cy="50.4" r="1.5" fill="#fff" />
      <ellipse cx="50" cy="62" rx="3.2" ry="2.4" fill="#d98aa0" />
      <path d="M50 64.5 Q50 69 45.5 70" stroke="#c98a72" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M50 64.5 Q50 69 54.5 70" stroke="#c98a72" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="47.5" y="69.5" width="5" height="4" rx="1.2" fill="#fff" />
    </svg>
  );
}

function CatSVG({ size = 64, blush = '#ffc2cf', fur = '#dcefff' }) {
  return (
    <svg data-mascot="cat" width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M20 40 L22 14 L44 30 Z" fill={fur} />
      <path d="M80 40 L78 14 L56 30 Z" fill={fur} />
      <path d="M25 35 L26 21 L38 31 Z" fill={blush} opacity="0.7" />
      <path d="M75 35 L74 21 L62 31 Z" fill={blush} opacity="0.7" />
      <ellipse cx="50" cy="56" rx="37" ry="34" fill={fur} />
      <ellipse cx="26" cy="62" rx="8.5" ry="6.5" fill={blush} opacity="0.85" />
      <ellipse cx="74" cy="62" rx="8.5" ry="6.5" fill={blush} opacity="0.85" />
      <circle cx="38" cy="54" r="4.4" fill="#2c3e50" />
      <circle cx="62" cy="54" r="4.4" fill="#2c3e50" />
      <circle cx="39.6" cy="52.4" r="1.4" fill="#fff" />
      <circle cx="63.6" cy="52.4" r="1.4" fill="#fff" />
      <path d="M47 62 L53 62 L50 65 Z" fill="#e89aac" />
      <path d="M50 65 Q50 68 46.5 68.5" stroke="#6b8aa0" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M50 65 Q50 68 53.5 68.5" stroke="#6b8aa0" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <g stroke="#9fc6e0" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 56 L31 58" /><path d="M15 63 L31 63" />
        <path d="M84 56 L69 58" /><path d="M85 63 L69 63" />
      </g>
    </svg>
  );
}

function PairSVG({ size = 56, gap = -10 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ transform: 'rotate(-7deg)', marginRight: gap }}><HamsterSVG size={size} /></div>
      <div style={{ transform: 'rotate(7deg)' }}><CatSVG size={size * 0.96} /></div>
    </div>
  );
}

// ── public components — pick style from context ──────────────────
function HamsterFace({ size = 64, style = {} }) {
  const s = React.useContext(MascotStyleContext);
  return s === 'shape' ? <HamsterSVG size={size} /> : <MascotImg kind="hamster" size={size} style={style} />;
}

function CatFace({ size = 64, style = {} }) {
  const s = React.useContext(MascotStyleContext);
  return s === 'shape' ? <CatSVG size={size} /> : <MascotImg kind="cat" size={size} style={style} />;
}

// two faces nestled together
function MascotPair({ size = 56, style = {} }) {
  const s = React.useContext(MascotStyleContext);
  if (s === 'shape') return <PairSVG size={size} />;
  // pair art is ~1.8:1, faces read smaller than a lone face — bump height to match
  return <MascotImg kind="pair" size={Math.round(size * 1.35)} style={style} />;
}

// full-body duo (hamster + cat sitting) — bigger decorative sign-off
function MascotDuo({ size = 120, style = {} }) {
  const s = React.useContext(MascotStyleContext);
  // shape style has no body art — fall back to the side-by-side SVG faces
  if (s === 'shape') return <div style={style}><PairSVG size={Math.round(size * 0.62)} gap={-14} /></div>;
  return <MascotImg kind="bodies" size={size} style={style} />;
}

function Sparkle({ size = 18, color = 'currentColor', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 2 C12.8 8 16 11.2 22 12 C16 12.8 12.8 16 12 22 C11.2 16 8 12.8 2 12 C8 11.2 11.2 8 12 2 Z" fill={color} />
    </svg>
  );
}

function Drop({ size = 16, color = 'currentColor', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 3 C12 3 5 11 5 16 a7 7 0 0 0 14 0 C19 11 12 3 12 3 Z" fill={color} />
    </svg>
  );
}

Object.assign(window, { HamsterFace, CatFace, Sparkle, Drop, MascotPair, MascotDuo, MascotStyleContext });
