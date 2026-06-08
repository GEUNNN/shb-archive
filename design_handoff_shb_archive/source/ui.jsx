// ui.jsx — shared primitives for the SHB archive prototype.
// Exports: Film, Chip, SectionHead, AppHeader, TabBar, PhotoLightbox, VideoPlayer

// ── photo / video placeholder ("필름") ───────────────────────────
function Film({ f = 0, radius, children, style = {}, glyph = 'cloud', label }) {
  const pair = (window.FILMS && window.FILMS[f]) || ['#cdeaff', '#7cc4f5'];
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(150deg, ${pair[0]} 0%, ${pair[1]} 100%)`,
      borderRadius: radius != null ? radius : 'inherit', overflow: 'hidden',
      ...style,
    }}>
      {/* soft dotted texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.35,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1.1px, transparent 1.2px)',
        backgroundSize: '13px 13px',
      }} />
      {/* sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(120deg, rgba(255,255,255,0.42), rgba(255,255,255,0) 42%)',
      }} />
      {/* center glyph */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6, color: 'rgba(255,255,255,0.85)',
      }}>
        {glyph === 'cloud' && (
          <svg width="44" height="30" viewBox="0 0 44 30" fill="rgba(255,255,255,0.78)">
            <path d="M12 27 a9 9 0 0 1 0-18 a11 11 0 0 1 21 2 a8 8 0 0 1 -2 16 Z" />
          </svg>
        )}
        {glyph === 'camera' && (
          <svg width="40" height="34" viewBox="0 0 40 34" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.4">
            <rect x="3" y="8" width="34" height="23" rx="5" /><circle cx="20" cy="19.5" r="6.5" />
            <path d="M14 8l2.5-4h7L26 8" strokeLinejoin="round" />
          </svg>
        )}
        {label && (
          <span style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 10.5, letterSpacing: 1.5, color: 'rgba(255,255,255,0.92)',
            background: 'rgba(0,0,0,0.10)', padding: '2px 7px', borderRadius: 20,
          }}>{label}</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── chip / pill ──────────────────────────────────────────────────
function Chip({ children, tone = 'soft', style = {} }) {
  const tones = {
    soft:   { bg: 'var(--soft)', color: 'var(--primaryDeep)' },
    solid:  { bg: 'var(--primary)', color: '#fff' },
    ghost:  { bg: 'rgba(255,255,255,0.6)', color: 'var(--ink)' },
    accent: { bg: 'var(--accent)', color: '#5a4410' },
    coral:  { bg: 'var(--coralSoft)', color: '#c2503a' },
  };
  const t = tones[tone] || tones.soft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'var(--fbody)', fontSize: 11.5, fontWeight: 700,
      lineHeight: 1, padding: '5px 10px', borderRadius: 20,
      background: t.bg, color: t.color, whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  );
}

// ── section heading ──────────────────────────────────────────────
function SectionHead({ title, sub, right, mascot }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '0 0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {mascot === 'hamster' && <HamsterFace size={26} />}
        {mascot === 'cat' && <CatFace size={26} />}
        <div>
          {sub && <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 2, color: 'var(--primary)', fontWeight: 700 }}>{sub}</div>}
          <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 20, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{title}</div>
        </div>
      </div>
      {right}
    </div>
  );
}

// ── top app header ───────────────────────────────────────────────
function AppHeader({ tab }) {
  const titles = { home: null, gallery: '갤러리', video: '영상', calendar: '캘린더' };
  const subs = { gallery: 'PHOTO', video: 'VIDEO', calendar: 'ARCHIVE' };
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      padding: '54px 18px 12px',
      background: 'color-mix(in srgb, var(--bg) 82%, transparent)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {tab === 'home' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <MascotPair size={34} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>성한빈</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9.5, letterSpacing: 2.5, color: 'var(--primary)', fontWeight: 700, marginTop: 2 }}>ARCHIVE ☁️</div>
            </div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 20, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(80,140,200,0.14)' }}>
            <Sparkle size={17} color="var(--primary)" />
          </div>
        </>
      ) : (
        <>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 2.5, color: 'var(--primary)', fontWeight: 700 }}>{subs[tab]}</div>
            <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 26, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.05, whiteSpace: 'nowrap' }}>{titles[tab]}</div>
          </div>
          {tab === 'gallery' ? <CatFace size={36} /> : tab === 'video' ? <HamsterFace size={36} /> : <MascotPair size={32} />}
        </>
      )}
    </div>
  );
}

// ── bottom tab bar ───────────────────────────────────────────────
function TabBar({ tab, onChange }) {
  const tabs = [
    { k: 'home', label: '홈', icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? 'var(--primary)' : 'none'} stroke={a ? 'var(--primary)' : 'var(--sub)'} strokeWidth="2" strokeLinejoin="round"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" /></svg>
    ) },
    { k: 'gallery', label: '갤러리', icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? 'var(--primary)' : 'var(--sub)'} strokeWidth="2"><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill={a ? 'var(--soft)' : 'none'} /><circle cx="9" cy="9" r="2" fill={a ? 'var(--primary)' : 'none'} stroke={a ? 'var(--primary)' : 'var(--sub)'} /><path d="M4 17l5-4 4 3 4-4 3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ) },
    { k: 'video', label: '영상', icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? 'var(--primary)' : 'var(--sub)'} strokeWidth="2"><rect x="3" y="5.5" width="18" height="13" rx="3.5" fill={a ? 'var(--soft)' : 'none'} /><path d="M10.5 9.5l4 2.5-4 2.5z" fill={a ? 'var(--primary)' : 'var(--sub)'} stroke="none" /></svg>
    ) },
    { k: 'calendar', label: '캘린더', icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? 'var(--primary)' : 'var(--sub)'} strokeWidth="2"><rect x="3.5" y="5" width="17" height="15" rx="3.5" fill={a ? 'var(--soft)' : 'none'} /><path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" /><circle cx="12" cy="14.5" r="1.6" fill={a ? 'var(--primary)' : 'var(--sub)'} stroke="none" /></svg>
    ) },
  ];
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 30,
      padding: '8px 12px 26px',
      background: 'color-mix(in srgb, var(--surface) 86%, transparent)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid color-mix(in srgb, var(--primary) 14%, transparent)',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map((t) => {
        const a = tab === t.k;
        return (
          <button key={t.k} onClick={() => onChange(t.k)} style={{
            border: 'none', background: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '4px 10px', flex: 1,
          }}>
            <div style={{ transform: a ? 'translateY(-1px)' : 'none', transition: 'transform .2s' }}>{t.icon(a)}</div>
            <span style={{ fontFamily: 'var(--fbody)', fontSize: 10.5, fontWeight: a ? 800 : 600, color: a ? 'var(--primary)' : 'var(--sub)' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── photo lightbox overlay ───────────────────────────────────────
function PhotoLightbox({ index, onClose, onNav }) {
  if (index == null) return null;
  const G = window.GALLERY;
  const item = G[index];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(20,40,60,0.62)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '70px 20px 40px', animation: 'fadeIn .2s ease',
    }}>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
        position: 'absolute', top: 60, right: 18, width: 40, height: 40, borderRadius: 22,
        border: 'none', background: 'rgba(255,255,255,0.92)', cursor: 'pointer', fontSize: 19, color: '#456',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
      }}>✕</button>

      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 340, background: '#fff', borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(20,50,80,0.4)', animation: 'popIn .26s cubic-bezier(.2,1.1,.5,1)',
      }}>
        <div style={{ width: '100%', aspectRatio: `1 / ${item.ratio}`, maxHeight: 440, position: 'relative' }}>
          <Film f={item.f} glyph="camera" radius={0} />
          <span style={{ position: 'absolute', top: 12, left: 12 }}><Chip tone="ghost">{item.tag}</Chip></span>
        </div>
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{item.cap}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--fbody)', fontSize: 12.5, color: 'var(--sub)' }}>{item.date}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--primaryDeep)', fontWeight: 700 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--coral)"><path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" /></svg>
              {item.likes.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 14, marginTop: 18 }}>
        <button onClick={() => onNav(-1)} style={navBtn}>‹</button>
        <button onClick={() => onNav(1)} style={navBtn}>›</button>
      </div>
    </div>
  );
}
const navBtn = {
  width: 46, height: 46, borderRadius: 24, border: 'none', cursor: 'pointer',
  background: 'rgba(255,255,255,0.92)', color: '#456', fontSize: 24, lineHeight: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.16)',
};

// ── album viewer — instagram-style multi-photo post (swipe through one post) ──
function AlbumViewer({ album, onClose }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => { setI(0); }, [album && album.id]);
  if (!album) return null;
  const photos = album.photos;
  const total = photos.length;
  const go = (e, d) => { e.stopPropagation(); setI((x) => (x + d + total) % total); };
  const edgeBtn = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: 20,
    border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.88)', color: '#456', fontSize: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.2)', zIndex: 3,
  };
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(20,40,60,0.62)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '64px 20px 40px', animation: 'fadeIn .2s ease',
    }}>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
        position: 'absolute', top: 60, right: 18, width: 40, height: 40, borderRadius: 22,
        border: 'none', background: 'rgba(255,255,255,0.92)', cursor: 'pointer', fontSize: 19, color: '#456',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
      }}>✕</button>

      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 340, background: '#fff', borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(20,50,80,0.4)', animation: 'popIn .26s cubic-bezier(.2,1.1,.5,1)',
      }}>
        <div style={{ width: '100%', aspectRatio: `1 / ${album.ratio}`, maxHeight: 430, position: 'relative' }}>
          <Film f={photos[i]} glyph="camera" radius={0} />
          <span style={{ position: 'absolute', top: 12, left: 12 }}><Chip tone="ghost">{album.tag}</Chip></span>
          <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '3px 9px', borderRadius: 20 }}>{i + 1} / {total}</span>
          {total > 1 && <button onClick={(e) => go(e, -1)} style={{ ...edgeBtn, left: 10 }}>‹</button>}
          {total > 1 && <button onClick={(e) => go(e, 1)} style={{ ...edgeBtn, right: 10 }}>›</button>}
        </div>
        {/* dot indicators */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', padding: '11px 0 3px' }}>
          {photos.map((_, k) => (
            <span key={k} style={{ width: k === i ? 7 : 5, height: k === i ? 7 : 5, borderRadius: 5, background: k === i ? 'var(--primary)' : 'var(--soft)', transition: 'all .2s' }} />
          ))}
        </div>
        <div style={{ padding: '6px 16px 16px' }}>
          <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{album.cap}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--fbody)', fontSize: 12.5, color: 'var(--sub)' }}>{album.date} · 사진 {total}장</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--primaryDeep)', fontWeight: 700 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--coral)"><path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" /></svg>
              {album.likes.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── video player overlay (mock) ──────────────────────────────────
function VideoPlayer({ video, onClose }) {
  if (!video) return null;
  const [t, setT] = React.useState(0.28);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(12,28,42,0.78)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '70px 18px 40px', animation: 'fadeIn .2s ease',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 60, right: 18, width: 40, height: 40, borderRadius: 22,
        border: 'none', background: 'rgba(255,255,255,0.92)', cursor: 'pointer', fontSize: 19, color: '#456',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>
      <div style={{ width: '100%', maxWidth: 350, borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.45)' }}>
        <div style={{ width: '100%', aspectRatio: '16 / 10', position: 'relative', background: '#000' }}>
          {video.yt ? (
            <iframe src={`https://www.youtube.com/embed/${video.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          ) : (
            <>
              <Film f={video.f} glyph="cloud" radius={0} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 40, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>
                </div>
              </div>
            </>
          )}
        </div>
        <div style={{ background: '#fff', padding: '14px 16px 16px' }}>
          <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 16, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25 }}>{video.title}</div>
          <div style={{ fontFamily: 'var(--fbody)', fontSize: 12, color: 'var(--sub)', marginTop: 5 }}>조회수 {video.views} · {video.date}</div>
          {!video.yt && (<>
          {/* scrubber */}
          <div onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setT(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))); }}
            style={{ marginTop: 14, height: 6, borderRadius: 6, background: 'var(--soft)', position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${t * 100}%`, background: 'var(--primary)', borderRadius: 6 }} />
            <div style={{ position: 'absolute', left: `calc(${t * 100}% - 7px)`, top: -4, width: 14, height: 14, borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'ui-monospace, monospace', fontSize: 10.5, color: 'var(--sub)' }}>
            <span>{fmtTime(video.dur, t)}</span><span>{video.dur}</span>
          </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
function fmtTime(dur, frac) {
  const [m, s] = dur.split(':').map(Number);
  const total = m * 60 + s;
  const cur = Math.round(total * frac);
  return `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`;
}

Object.assign(window, { Film, Chip, SectionHead, AppHeader, TabBar, PhotoLightbox, VideoPlayer, AlbumViewer });
