// screens.jsx — Home / Gallery / Video / Calendar for SHB archive.
// Exports: HomeScreen, GalleryScreen, VideoScreen, CalendarScreen

const PAD = { padding: '4px 18px 0' };

// ── reusable home blocks ─────────────────────────────────────────
function ProfileChips() {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <Chip tone="soft">🎂 {HANBIN.birth}</Chip>
      <Chip tone="soft">📏 {HANBIN.height}</Chip>
      <Chip tone="accent">⭐ {HANBIN.position}</Chip>
    </div>
  );
}

function HighlightsRow({ onOpenPhoto, onPlay }) {
  const goTo = (h) => {
    if (!h.go) return;
    if (h.go.type === 'photo') onOpenPhoto(h.go.idx);
    else if (h.go.type === 'video') {
      const v = (window.VIDEOS || []).find((x) => x.id === h.go.vid);
      if (v) onPlay(v);
    }
  };
  return (
    <div style={{ ...PAD, marginTop: 22 }}>
      <SectionHead title="하이라이트" sub="HIGHLIGHTS" mascot="hamster" />
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px 0 6px', margin: '0 -18px', paddingLeft: 18, paddingRight: 18, scrollbarWidth: 'none' }}>
        {HIGHLIGHTS.map((h) => {
          const isVideo = h.go && h.go.type === 'video';
          return (
            <button key={h.id} onClick={() => goTo(h)} style={{ ...bare, flex: '0 0 132px' }}>
              <div style={{ width: '100%', aspectRatio: '3 / 4', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 6px 16px rgba(80,140,200,0.16)', position: 'relative' }}>
                <Film f={h.f} glyph="cloud" />
                {isVideo && (
                  <span style={{ position: 'absolute', top: 9, right: 9, width: 26, height: 26, borderRadius: 14, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>
                  </span>
                )}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 11px 11px', textAlign: 'left', background: 'linear-gradient(transparent, rgba(20,50,75,0.55))' }}>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8.5, letterSpacing: 1.5, color: 'rgba(255,255,255,0.85)' }}>{h.sub}</div>
                  <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{h.label}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VideoPreview({ onPlay, onMore }) {
  const items = VIDEOS.slice(0, 4);
  return (
    <div style={{ ...PAD, marginTop: 26 }}>
      <SectionHead title="최근 영상" sub="VIDEO" mascot="hamster" right={
        <button onClick={onMore} style={moreBtn}>더보기 ›</button>
      } />
      <div style={{ display: 'flex', gap: 11, overflowX: 'auto', padding: '2px 0 6px', margin: '0 -18px', paddingLeft: 18, paddingRight: 18, scrollbarWidth: 'none' }}>
        {items.map((v) => (
          <button key={v.id} onClick={() => onPlay(v)} style={{ ...bare, flex: '0 0 184px', textAlign: 'left' }}>
            <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: '0 5px 14px rgba(80,140,200,0.14)' }}>
              <Film f={v.f} glyph="cloud" radius={16} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 38, height: 38, borderRadius: 20, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(20,50,75,0.25)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>
                </span>
              </div>
              <span style={{ position: 'absolute', right: 7, bottom: 7, fontFamily: 'var(--fbody)', fontSize: 10.5, fontWeight: 700, color: '#fff', background: 'rgba(15,40,65,0.72)', padding: '2px 7px', borderRadius: 9 }}>{v.dur}</span>
            </div>
            <div style={{ fontFamily: 'var(--fbody)', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginTop: 7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
            <div style={{ fontFamily: 'var(--fbody)', fontSize: 11, color: 'var(--sub)', marginTop: 2 }}>조회 {v.views} · {v.date}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryPreview({ onOpenPhoto, onMore }) {
  const items = GALLERY.slice(0, 4);
  return (
    <div style={{ ...PAD, marginTop: 26 }}>
      <SectionHead title="최근 갤러리" sub="PHOTO" mascot="cat" right={
        <button onClick={onMore} style={moreBtn}>더보기 ›</button>
      } />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((g, i) => (
          <button key={g.id} onClick={() => onOpenPhoto(i)} style={{ border: 'none', padding: 0, background: 'none', cursor: 'pointer', borderRadius: 18, overflow: 'hidden', aspectRatio: '1 / 1', boxShadow: '0 5px 14px rgba(80,140,200,0.14)', position: 'relative' }}>
            <Film f={g.f} glyph="camera" radius={18} />
            <span style={{ position: 'absolute', bottom: 8, left: 8 }}><Chip tone="ghost" style={{ fontSize: 10, padding: '4px 8px' }}>{g.tag}</Chip></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SchedulePreview({ onMore }) {
  const items = SCHEDULE.slice(0, 2);
  return (
    <div style={{ ...PAD, marginTop: 26 }}>
      <SectionHead title="다가오는 일정" sub="SCHEDULE" mascot="hamster" right={
        <button onClick={onMore} style={moreBtn}>전체 ›</button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((s) => <ScheduleCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}

const moreBtn = { border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--fbody)', fontSize: 12.5, fontWeight: 700, color: 'var(--primary)' };

// ── HOME ─────────────────────────────────────────────────────────
function HomeScreen({ layout = 'hero', onOpenPhoto, onPlay, onTab }) {
  return (
    <div style={{ paddingBottom: 28 }}>
      {layout === 'hero' && <HeroTop onOpenPhoto={onOpenPhoto} />}
      {layout === 'card' && <CardTop />}
      {layout === 'magazine' && <MagazineTop onOpenPhoto={onOpenPhoto} />}
      {layout === 'diary' && <DiaryTop onOpenPhoto={onOpenPhoto} />}
      <GalleryPreview onOpenPhoto={onOpenPhoto} onMore={() => onTab('gallery')} />
      <VideoPreview onPlay={onPlay} onMore={() => onTab('video')} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
        <MascotDuo size={104} style={{ opacity: 0.96 }} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 2, marginBottom: 6, fontFamily: "'Parisienne', cursive", fontSize: 16, color: 'var(--sub)', letterSpacing: 0.3 }}>
        Don't regret what you do
      </div>
    </div>
  );
}

function HeroTop({ onOpenPhoto }) {
  return (
    <div style={{ ...PAD, marginTop: 4 }}>
      <button onClick={() => onOpenPhoto(0)} style={{ border: 'none', padding: 0, background: 'none', width: '100%', cursor: 'pointer', display: 'block', borderRadius: 28, overflow: 'hidden', position: 'relative', aspectRatio: '4 / 5', boxShadow: '0 14px 34px rgba(80,140,200,0.26)' }}>
        <Film f={0} glyph="cloud" radius={28} />
        <span style={{ position: 'absolute', top: 14, left: 14 }}><Chip tone="solid">☁️ 컴백 D-12</Chip></span>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '54px 18px 18px', textAlign: 'left', background: 'linear-gradient(transparent, rgba(15,45,70,0.6))' }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.9)' }}>SEONG HANBIN</div>
          <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1, marginTop: 4 }}>성한빈</div>
          <div style={{ fontFamily: 'var(--fbody)', fontSize: 13, color: 'rgba(255,255,255,0.92)', marginTop: 7 }}>{HANBIN.tag}</div>
        </div>
        <div style={{ position: 'absolute', right: 12, bottom: 12 }}><MascotPair size={48} /></div>
      </button>
      <div style={{ marginTop: 14 }}><ProfileChips /></div>
    </div>
  );
}

function CardTop() {
  return (
    <div style={{ ...PAD, marginTop: 6 }}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '20px 18px', boxShadow: '0 12px 28px rgba(80,140,200,0.16)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -18, right: -10, opacity: 0.9 }}><CatFace size={84} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 96, height: 96, borderRadius: 30, overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 18px rgba(80,140,200,0.24)' }}>
            <Film f={0} glyph="cloud" radius={30} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 2.5, color: 'var(--primary)', fontWeight: 700 }}>SEONG HANBIN</div>
            <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 30, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>성한빈</div>
            <div style={{ fontFamily: 'var(--fbody)', fontSize: 12.5, color: 'var(--sub)', marginTop: 5 }}>{HANBIN.tag}</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}><ProfileChips /></div>
      </div>
    </div>
  );
}

function MagazineTop({ onOpenPhoto }) {
  return (
    <div style={{ ...PAD, marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: 2, color: 'var(--primary)', fontWeight: 700 }}>ISSUE No.07 — 청량</div>
        <MascotPair size={30} />
      </div>
      <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 46, fontWeight: 800, color: 'var(--ink)', lineHeight: 0.92, letterSpacing: -1 }}>
        성한빈<span style={{ color: 'var(--primary)' }}>.</span>
      </div>
      <div style={{ fontFamily: 'var(--fbody)', fontSize: 13, color: 'var(--sub)', margin: '10px 0 14px' }}>여름, 그리고 가장 맑은 표정 — 2025 ARCHIVE</div>
      <div style={{ position: 'relative', height: 250 }}>
        <button onClick={() => onOpenPhoto(0)} style={{ ...bare, position: 'absolute', left: 0, top: 0, width: '64%', aspectRatio: '3 / 4', borderRadius: 22, overflow: 'hidden', boxShadow: '0 12px 28px rgba(80,140,200,0.24)', zIndex: 2 }}>
          <Film f={0} glyph="cloud" radius={22} />
        </button>
        <button onClick={() => onOpenPhoto(3)} style={{ ...bare, position: 'absolute', right: 0, bottom: 0, width: '46%', aspectRatio: '3 / 4', borderRadius: 18, overflow: 'hidden', boxShadow: '0 10px 22px rgba(80,140,200,0.2)', border: '4px solid var(--bg)', zIndex: 3 }}>
          <Film f={4} glyph="camera" radius={14} />
        </button>
      </div>
      <div style={{ marginTop: 14 }}><ProfileChips /></div>
    </div>
  );
}
const bare = { border: 'none', padding: 0, background: 'none', cursor: 'pointer' };

// ── DIARY (다이어리 컨셉) ─────────────────────────────────────────
// coral masking-tape strip. face=true → cute smiley taped strip (눈/미소)
function Tape({ style = {}, w = 64, deg = -8, face = false }) {
  if (face) {
    return (
      <span style={{
        position: 'absolute', width: w, height: 22, transform: `rotate(${deg}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'color-mix(in srgb, var(--coral) 62%, transparent)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)', borderRadius: 2,
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 5px, rgba(255,255,255,0.18) 5px 6px)',
        ...style,
      }}>
        <svg width="30" height="13" viewBox="0 0 30 13" style={{ overflow: 'visible' }}>
          {/* cheeks */}
          <ellipse cx="7" cy="7.5" rx="2.2" ry="1.5" fill="color-mix(in srgb, var(--coral) 80%, #c2503a)" opacity="0.5" />
          <ellipse cx="23" cy="7.5" rx="2.2" ry="1.5" fill="color-mix(in srgb, var(--coral) 80%, #c2503a)" opacity="0.5" />
          {/* eyes */}
          <circle cx="10" cy="4.5" r="1.6" fill="var(--ink)" />
          <circle cx="20" cy="4.5" r="1.6" fill="var(--ink)" />
          {/* smile */}
          <path d="M11 7.5 Q15 11 19 7.5" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span style={{
      position: 'absolute', width: w, height: 22, transform: `rotate(${deg}deg)`,
      background: 'color-mix(in srgb, var(--coral) 62%, transparent)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)', borderRadius: 2,
      backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 5px, rgba(255,255,255,0.18) 5px 6px)',
      ...style,
    }} />
  );
}

function DiaryTop({ onOpenPhoto }) {
  // "N년 전 오늘" — 6월 4일, 그날의 기록을 다시 보는 회상 피드 (팬 오리지널 아카이브 · 더미 데이터)
  const today = { weekday: '목요일', year: 2026 };
  const memories = [
    {
      year: 2025, ago: 1, date: '2025.06.04',
      title: '단독 팬미팅 〈한여름, 한빈〉',
      note: '팬들이랑 같이 부른 청량 떼창… 아직도 귀에 맴돌아 ☁️',
      tag: '팬미팅', weather: '☀️', f: 0, glyph: 'cloud', deg: -3,
    },
    {
      year: 2024, ago: 2, date: '2024.06.04',
      title: "여름 화보 'BLUE HOUR' 공개",
      note: '바다 배경 화보가 처음 나온 날. 인생 화보 갱신 🌊',
      tag: '화보', weather: '🌤️', f: 3, glyph: 'camera', deg: 3,
    },
    {
      year: 2023, ago: 3, date: '2023.06.04',
      title: '첫 여름 음악방송 컴백 무대',
      note: '긴장한 표정이 더 귀여웠던 그날의 직캠 🎬', tag: '무대', weather: '☁️', f: 5, glyph: 'camera', deg: -3,
    },
  ];
  return (
    <div style={{ ...PAD, marginTop: 6 }}>
      <div style={{
        position: 'relative', background: 'var(--surface)', borderRadius: 'var(--radius)',
        padding: '20px 18px 22px', boxShadow: '0 12px 30px rgba(80,140,200,0.16)',
        // faint diary ruling
        backgroundImage: 'repeating-linear-gradient(transparent 0 33px, color-mix(in srgb, var(--coral) 12%, transparent) 33px 34px)',
        overflow: 'hidden',
      }}>
        {/* header — ON THIS DAY */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: 2, color: 'var(--coral)', fontWeight: 700 }}>ON THIS DAY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 3 }}>
              <span style={{ fontFamily: 'var(--fdisplay)', fontSize: 30, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>6월 4일</span>
              <span style={{ fontFamily: 'var(--fbody)', fontSize: 12, color: 'var(--sub)' }}>다시 보는 오늘 · {today.year} {today.weekday}</span>
            </div>
          </div>
          {/* coral memo stamp */}
          <div style={{
            transform: 'rotate(-9deg)', border: '2px solid var(--coral)', color: 'var(--coral)',
            borderRadius: 10, padding: '5px 9px', textAlign: 'center', fontFamily: 'ui-monospace, monospace',
            lineHeight: 1.1, background: 'color-mix(in srgb, var(--coral) 8%, transparent)', flexShrink: 0,
          }}>
            <div style={{ fontSize: 7.5, letterSpacing: 1 }}>MEMORIES</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{memories.length}</div>
          </div>
        </div>

        {/* memory feed — one taped polaroid per "N년 전 오늘" */}
        <div style={{ marginTop: 14 }}>
          {memories.map((m, idx) => (
            <div key={m.year} style={{
              display: 'flex', gap: 13, alignItems: 'flex-start',
              paddingTop: idx ? 15 : 4, marginTop: idx ? 15 : 0,
              borderTop: idx ? '1px dashed color-mix(in srgb, var(--coral) 30%, transparent)' : 'none',
            }}>
              <button onClick={() => onOpenPhoto(m.f)} style={{
                ...bare, position: 'relative', flex: '0 0 110px', background: '#fff', padding: 7,
                paddingBottom: 9, borderRadius: 4, boxShadow: '0 7px 17px rgba(80,140,200,0.2)',
                transform: `rotate(${m.deg}deg)`,
              }}>
                <Tape style={{ top: -8, left: 30 }} w={54} deg={m.deg < 0 ? -7 : 7} />
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 2 }}>
                  <Film f={m.f} glyph={m.glyph} radius={2} />
                </div>
                <div style={{ marginTop: 8, textAlign: 'center', fontFamily: 'var(--fdisplay)', fontSize: 13, fontWeight: 800, color: 'var(--primaryDeep)' }}>{m.year}</div>
              </button>

              {/* note */}
              <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <Chip tone="coral">{m.ago}년 전 오늘</Chip>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, color: 'var(--sub)' }}>{m.date}</span>
                </div>
                <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 15, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.4, marginTop: 7 }}>{m.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  <Chip tone="soft">#{m.tag}</Chip>
                  <Chip tone="ghost">{m.weather}</Chip>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* coral heart sticker, bottom-right corner */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--coral)" style={{ position: 'absolute', right: 16, bottom: 12, opacity: 0.9, transform: 'rotate(12deg)' }}>
          <path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" />
        </svg>
      </div>
    </div>
  );
}

// ── GALLERY ──────────────────────────────────────────────────────
function GalleryScreen({ onOpenPhoto, variant = 'diary', sizing = 'free', grouping = 'single' }) {
  const [filter, setFilter] = React.useState('전체');
  const [album, setAlbum] = React.useState(null);
  const tags = ['전체', '인스타그램', '트위터', '플러스챗'];
  const visible = GALLERY.map((g, i) => ({ g, i })).filter(({ g }) => filter === '전체' || g.tag === filter);

  // 사진 크기 모드 —
  //  A 자유(free): 비율을 과감하게 벌려 진짜 마소너리 느낌 (와이드~롱샷 혼재)
  //  B 정돈(tidy): 3종(1:1 · 4:5 · 3:4)으로만 스냅해 깔끔하게
  const FREE = [1.35, 0.68, 1.0, 1.62, 0.78, 0.95, 1.18, 0.6, 1.5];
  const tidySnap = (r) => [1.0, 1.25, 1.33].reduce((a, b) => (Math.abs(b - r) < Math.abs(a - r) ? b : a));
  const ratioOf = (g, i) => (sizing === 'tidy' ? tidySnap(g.ratio) : (FREE[i] ?? g.ratio));

  const FilterRow = (
    <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: variant === 'diary' ? '8px 18px 14px' : '2px 18px 14px', scrollbarWidth: 'none', position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg)' }}>
      {tags.map((t) => (
        <button key={t} onClick={() => setFilter(t)} style={{
          ...bare, padding: '7px 13px', borderRadius: 20, whiteSpace: 'nowrap',
          fontFamily: 'var(--fbody)', fontSize: 12, fontWeight: 700,
          background: filter === t ? 'var(--primary)' : 'var(--surface)',
          color: filter === t ? '#fff' : 'var(--sub)',
          boxShadow: filter === t ? '0 4px 12px rgba(80,150,210,0.3)' : '0 2px 6px rgba(80,140,200,0.1)',
        }}>{t}</button>
      ))}
    </div>
  );

  // ── 앨범 (인스타식 멀티사진 포스트) ──
  if (grouping === 'album') {
    const visibleAlbums = ALBUMS.filter((a) => filter === '전체' || a.tag === filter);
    const CountBadge = (n) => (
      <span style={{ position: 'absolute', top: 8, right: 8, display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '3px 7px', borderRadius: 20, fontFamily: 'ui-monospace, monospace', fontSize: 10, fontWeight: 700, zIndex: 3 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><rect x="8" y="3" width="13" height="13" rx="2.5" opacity="0.55" /><rect x="3" y="8" width="13" height="13" rx="2.5" /></svg>
        {n}
      </span>
    );
    return (
      <div style={{ paddingBottom: 28 }}>
        {variant === 'diary' && (
          <div style={{ padding: '0 18px 4px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: 'var(--fdisplay)', fontSize: 15, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>한빈이의 앨범</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--coral)" style={{ transform: 'rotate(-8deg)' }}><path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" /></svg>
            <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'var(--sub)' }}>{visibleAlbums.length} POSTS</span>
          </div>
        )}
        {FilterRow}
        <div style={{ padding: variant === 'diary' ? '6px 12px 0' : '0 14px', columnCount: 2, columnGap: variant === 'diary' ? 14 : 10 }}>
          {visibleAlbums.map((a, k) => (variant === 'diary' ? (
            <button key={a.id} onClick={() => setAlbum(a)} style={{ ...bare, position: 'relative', width: '100%', marginBottom: 26, breakInside: 'avoid', display: 'block' }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'rotate(2.6deg)', background: '#fff', borderRadius: 4, boxShadow: '0 6px 15px rgba(80,140,200,0.16)' }} />
              <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-1.6deg)', background: '#fff', borderRadius: 4 }} />
              <div style={{ position: 'relative', background: '#fff', padding: 8, paddingBottom: 12, borderRadius: 4, boxShadow: '0 8px 20px rgba(80,140,200,0.2)' }}>
                <Tape style={{ top: -9, left: '38%' }} w={58} deg={k % 2 ? 6 : -7} />
                <div style={{ width: '100%', aspectRatio: `1 / ${a.ratio}`, overflow: 'hidden', borderRadius: 2, position: 'relative' }}>
                  <Film f={a.photos[0]} glyph="camera" radius={2} />
                  {CountBadge(a.photos.length)}
                </div>
                <div style={{ marginTop: 13, padding: '0 2px' }}>
                  <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.cap}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8, letterSpacing: 0.5, color: 'var(--sub)' }}>{a.date}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 9.5, fontWeight: 700, color: '#c2503a' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--coral)"><path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" /></svg>
                      {a.likes.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <button key={a.id} onClick={() => setAlbum(a)} style={{ ...bare, position: 'relative', width: '100%', marginBottom: 16, breakInside: 'avoid', display: 'block' }}>
              <div style={{ position: 'absolute', left: 6, right: -4, top: 7, bottom: -7, borderRadius: 18, background: 'var(--soft)', boxShadow: '0 4px 12px rgba(80,140,200,0.12)' }} />
              <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', boxShadow: '0 6px 16px rgba(80,140,200,0.18)' }}>
                <div style={{ width: '100%', aspectRatio: `1 / ${a.ratio}` }}><Film f={a.photos[0]} glyph="camera" radius={18} /></div>
                {CountBadge(a.photos.length)}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 10px 9px', textAlign: 'left', background: 'linear-gradient(transparent, rgba(20,50,75,0.55))' }}>
                  <div style={{ fontFamily: 'var(--fbody)', fontSize: 11.5, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{a.cap}</div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8.5, letterSpacing: 1, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{a.date} · {a.photos.length}장</div>
                </div>
              </div>
            </button>
          )))}
        </div>
        <AlbumViewer album={album} onClose={() => setAlbum(null)} />
      </div>
    );
  }

  // ── 기본 (그라데이션 오버레이 마소너리) ──
  if (variant === 'classic') {
    return (
      <div style={{ paddingBottom: 28 }}>
        {FilterRow}
        <div style={{ padding: '0 14px', columnCount: 2, columnGap: 10 }}>
          {visible.map(({ g, i }) => (
            <button key={g.id} onClick={() => onOpenPhoto(i)} style={{
              ...bare, width: '100%', marginBottom: 10, borderRadius: 18, overflow: 'hidden',
              display: 'block', breakInside: 'avoid', boxShadow: '0 5px 14px rgba(80,140,200,0.14)', position: 'relative',
            }}>
              <div style={{ width: '100%', aspectRatio: `1 / ${ratioOf(g, i)}` }}>
                <Film f={g.f} glyph="camera" radius={18} />
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 10px 9px', textAlign: 'left', background: 'linear-gradient(transparent, rgba(20,50,75,0.5))' }}>
                <div style={{ fontFamily: 'var(--fbody)', fontSize: 11.5, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{g.cap}</div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8.5, letterSpacing: 1, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{g.date}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── 다이어리 (스크랩북 / 폴라로이드) ──
  const rots = [-2.2, 1.6, -1.1, 2, -1.6, 1.2];
  const tapeDeg = [-9, 7, 6, -8, 8, -6];
  const tapePos = ['34%', '40%', '30%', '44%', '36%', '38%'];
  return (
    <div style={{ paddingBottom: 28 }}>
      {/* handwritten scrapbook intro */}
      <div style={{ padding: '0 18px 4px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontFamily: 'var(--fdisplay)', fontSize: 15, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>한빈이의 사진첩</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--coral)" style={{ transform: 'rotate(-8deg)' }}><path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" /></svg>
        <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'var(--sub)' }}>{visible.length} CUTS</span>
      </div>

      {FilterRow}

      {/* taped polaroids */}
      <div style={{ padding: '4px 12px 0', columnCount: 2, columnGap: 14 }}>
        {visible.map(({ g, i }, k) => (
          <button key={g.id} onClick={() => onOpenPhoto(i)} style={{
            ...bare, position: 'relative', width: '100%', marginBottom: 20, breakInside: 'avoid',
            display: 'block', background: '#fff', padding: 8, paddingBottom: 12, borderRadius: 4,
            boxShadow: '0 8px 20px rgba(80,140,200,0.2)', transform: `rotate(${rots[k % rots.length]}deg)`,
          }}>
            <Tape style={{ top: -9, left: tapePos[k % tapePos.length] }} w={58} deg={tapeDeg[k % tapeDeg.length]} />
            <div style={{ width: '100%', aspectRatio: `1 / ${ratioOf(g, i)}`, overflow: 'hidden', borderRadius: 2 }}>
              <Film f={g.f} glyph="camera" radius={2} />
            </div>
            <div style={{ marginTop: 13, padding: '0 2px' }}>
              <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.cap}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8, letterSpacing: 0.5, color: 'var(--sub)' }}>{g.date}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 9.5, fontWeight: 700, color: '#c2503a' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--coral)"><path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" /></svg>
                  {g.likes.toLocaleString()}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── VIDEO ────────────────────────────────────────────────────────
// inline mock player — expands in place, scrubber auto-advances while "playing"
function InlinePlayer({ v, playing, onToggle, radius = 16 }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (!playing || v.yt) return;
    const id = setInterval(() => setT((x) => (x >= 1 ? 0 : +(x + 0.012).toFixed(3))), 180);
    return () => clearInterval(id);
  }, [playing, v.yt]);
  React.useEffect(() => { if (!playing) setT(0); }, [playing]);
  // real YouTube embed — autoplays in place inside the same card slot
  if (playing && v.yt) {
    return (
      <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: radius, overflow: 'hidden', position: 'relative', boxShadow: '0 8px 22px rgba(80,140,200,0.2)', background: '#000' }}>
        <iframe src={`https://www.youtube.com/embed/${v.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} title={v.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
      </div>
    );
  }
  return (
    <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: radius, overflow: 'hidden', position: 'relative', boxShadow: '0 8px 22px rgba(80,140,200,0.2)' }}>
      {v.yt
        ? <img src={`https://img.youtube.com/vi/${v.yt}/hqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <Film f={v.f} glyph="cloud" radius={0} />}
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{
        ...bare, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: playing ? 'transparent' : 'rgba(15,45,70,0.12)', cursor: 'pointer',
      }}>
        {!playing && (
          <span style={{ width: 56, height: 56, borderRadius: 32, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>
          </span>
        )}
      </button>
      {playing ? (
        <div onClick={(e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); setT(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))); }}
          style={{ position: 'absolute', left: 10, right: 10, bottom: 10, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <span onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{ width: 24, height: 24, borderRadius: 14, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            </span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9.5, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{fmtT(v.dur, t)} / {v.dur}</span>
          </div>
          <div style={{ height: 5, borderRadius: 5, background: 'rgba(255,255,255,0.4)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${t * 100}%`, background: '#fff', borderRadius: 5 }} />
            <div style={{ position: 'absolute', left: `calc(${t * 100}% - 6px)`, top: -3.5, width: 12, height: 12, borderRadius: 7, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.35)' }} />
          </div>
        </div>
      ) : (
        <span style={{ position: 'absolute', bottom: 8, right: 8, fontFamily: 'ui-monospace, monospace', fontSize: 9.5, color: '#fff', background: 'rgba(0,0,0,0.45)', padding: '2px 6px', borderRadius: 5 }}>{v.dur}</span>
      )}
    </div>
  );
}
function fmtT(dur, frac) {
  const [m, s] = dur.split(':').map(Number);
  const total = m * 60 + s, cur = Math.round(total * frac);
  return `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`;
}

// static thumbnail for 플레이어 모드 (whole card opens fullscreen overlay)
function StaticThumb({ v, radius = 0, onClick }) {
  return (
    <button onClick={onClick} style={{ ...bare, position: 'relative', display: 'block', width: '100%', aspectRatio: '16 / 10', overflow: 'hidden', borderRadius: radius }}>
      {v.yt
        ? <img src={`https://img.youtube.com/vi/${v.yt}/hqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <Film f={v.f} glyph="cloud" radius={0} />}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,45,70,0.1)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 32, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>
        </div>
      </div>
      <span style={{ position: 'absolute', bottom: 8, right: 8, fontFamily: 'ui-monospace, monospace', fontSize: 9.5, color: '#fff', background: 'rgba(0,0,0,0.45)', padding: '2px 6px', borderRadius: 5 }}>{v.dur}</span>
    </button>
  );
}

// one uniform full-width video card — size never changes on play (classic / diary)
function VideoFeedCard({ v, look, mode, playing, onClick, featured, idx, tapeFace }) {
  const diary = look === 'diary';
  const media = mode === 'inline'
    ? <InlinePlayer v={v} playing={playing} onToggle={onClick} radius={diary ? 2 : 0} />
    : <StaticThumb v={v} radius={diary ? 2 : 0} onClick={onClick} />;

  if (diary) {
    return (
      <div style={{
        position: 'relative', background: '#fff', padding: 9, paddingBottom: 12, borderRadius: 4,
        boxShadow: '0 9px 22px rgba(80,140,200,0.2)',
      }}>
        <Tape style={{ top: -9, left: '50%', marginLeft: tapeFace ? -42 : -36 }} w={tapeFace ? 84 : 72} deg={featured ? -5 : 4} face={tapeFace} />
        <div style={{ borderRadius: 2, overflow: 'hidden' }}>{media}</div>
        <div style={{ marginTop: 12, padding: '0 2px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--fdisplay)', fontSize: 15.5, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3 }}>{v.title}</div>
            <span style={{ flexShrink: 0, fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 0.5, color: 'var(--sub)', paddingTop: 4 }}>{v.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, fontFamily: 'var(--fbody)', fontSize: 11.5, color: 'var(--sub)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2"><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" strokeLinecap="round" /></svg>
            {v.author}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface)', boxShadow: featured ? '0 12px 26px rgba(80,140,200,0.2)' : '0 6px 16px rgba(80,140,200,0.14)' }}>
      {media}
      <div style={{ padding: '12px 14px 14px', textAlign: 'left' }}>
        <span style={{ display: 'inline-block', marginBottom: 8 }}><Chip tone={featured ? 'coral' : 'soft'} style={{ fontSize: 10, padding: '3px 9px' }}>{featured ? '▶ 최신 영상' : v.tag}</Chip></span>
        <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 16, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25 }}>{v.title}</div>
        <div style={{ fontFamily: 'var(--fbody)', fontSize: 11.5, color: 'var(--sub)', marginTop: 4 }}>조회수 {v.views} · {v.date}</div>
      </div>
    </div>
  );
}

function VideoScreen({ onPlay, playMode = 'inline', showFilter = true, look = 'classic', tapeFace = false }) {
  const [filter, setFilter] = React.useState('전체');
  const [playingId, setPlayingId] = React.useState(null);
  const tags = ['전체', '음악방송', '직캠', '라이브', '비하인드', '자컨'];
  const inline = playMode === 'inline';
  const visible = VIDEOS.filter((v) => filter === '전체' || v.tag === filter);
  const setFil = (t) => { setFilter(t); setPlayingId(null); };
  const onCard = (v) => (inline ? setPlayingId((id) => (id === v.id ? null : v.id)) : onPlay(v));

  return (
    <div style={{ paddingBottom: 28 }}>
      {look === 'diary' && (
        <div style={{ padding: '0 18px 2px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: 'var(--fdisplay)', fontSize: 15, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>한빈이의 영상일기</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--coral)" style={{ transform: 'rotate(-8deg)' }}><path d="M8 5v14l11-7z" /></svg>
          <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'var(--sub)' }}>{visible.length} CLIPS</span>
        </div>
      )}

      {showFilter && (
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: look === 'diary' ? '8px 18px 14px' : '2px 18px 14px', scrollbarWidth: 'none', position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg)' }}>
          {tags.map((t) => (
            <button key={t} onClick={() => setFil(t)} style={{
              ...bare, padding: '7px 13px', borderRadius: 20, whiteSpace: 'nowrap',
              fontFamily: 'var(--fbody)', fontSize: 12, fontWeight: 700,
              background: filter === t ? 'var(--primary)' : 'var(--surface)',
              color: filter === t ? '#fff' : 'var(--sub)',
              boxShadow: filter === t ? '0 4px 12px rgba(80,150,210,0.3)' : '0 2px 6px rgba(80,140,200,0.1)',
            }}>{t}</button>
          ))}
        </div>
      )}

      <div style={{ ...PAD, paddingTop: look === 'diary' ? 8 : 4 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: look === 'diary' ? 24 : 16 }}>
          {visible.map((v, idx) => (
            <VideoFeedCard key={v.id} v={v} look={look} mode={playMode}
              playing={inline && playingId === v.id} featured={idx === 0}
              idx={idx} tapeFace={look === 'diary' && tapeFace} onClick={() => onCard(v)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CALENDAR ─────────────────────────────────────────────────────
function ddayLabel(mon, d) {
  const diff = mon === '06' ? d - 10 : (30 - 10) + d; // base 2025.06.10
  if (diff === 0) return 'D-DAY';
  if (diff < 0) return '종료';
  return `D-${diff}`;
}

function ScheduleCard({ s }) {
  const dl = ddayLabel(s.mon, s.d);
  const isDday = dl === 'D-DAY';
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', background: 'var(--surface)', borderRadius: 20, padding: '13px 15px', boxShadow: '0 5px 14px rgba(80,140,200,0.12)' }}>
      <div style={{ flexShrink: 0, width: 50, textAlign: 'center', borderRight: '1.5px dashed color-mix(in srgb, var(--primary) 30%, transparent)', paddingRight: 12 }}>
        <div style={{ fontFamily: 'var(--fbody)', fontSize: 10.5, color: 'var(--sub)', fontWeight: 700 }}>{s.mon}월</div>
        <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 26, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{s.d}</div>
        <div style={{ fontFamily: 'var(--fbody)', fontSize: 10.5, color: 'var(--primary)', fontWeight: 700 }}>{s.day}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 4 }}>
          <Chip tone="soft" style={{ fontSize: 10, padding: '3px 8px' }}>{s.type}</Chip>
          {s.soon && <Chip tone="coral" style={{ fontSize: 10, padding: '3px 8px' }}>🔥 임박</Chip>}
        </div>
        <div style={{ fontFamily: 'var(--fbody)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{s.title}</div>
        <div style={{ fontFamily: 'var(--fbody)', fontSize: 11.5, color: 'var(--sub)', marginTop: 2 }}>📍 {s.place}</div>
      </div>
      <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 13, fontWeight: 800, color: isDday ? '#fff' : 'var(--primaryDeep)', background: isDday ? 'var(--coral)' : 'var(--soft)', padding: '6px 9px', borderRadius: 12 }}>{dl}</div>
      </div>
    </div>
  );
}

// ── content calendar — marks days that have photos / videos uploaded ──
function parseDateKR(s) { const [y, m, d] = s.split('.').map(Number); return { y, m, d }; }
// today-driven: the calendar always renders the CURRENT month/year (no hard-coded date).
const _TODAY = new Date();
const CUR_Y = _TODAY.getFullYear();
const CUR_M = _TODAY.getMonth() + 1;   // 1-indexed
const CUR_D = _TODAY.getDate();
// uploads for a given month — matched by month only (year-agnostic) so the fan
// archive's sample content surfaces regardless of which year the app is opened in.
function contentForMonth(month) {
  const list = [];
  (window.GALLERY || []).forEach((g, i) => { const p = parseDateKR(g.date); if (p.m === month) list.push({ kind: 'photo', day: p.d, date: g.date, title: g.cap, tag: g.tag, f: g.f, likes: g.likes, idx: i }); });
  (window.VIDEOS || []).forEach((v) => { const p = parseDateKR(v.date); if (p.m === month) list.push({ kind: 'video', day: p.d, date: v.date, title: v.title, tag: v.tag, f: v.f, dur: v.dur, views: v.views, ref: v }); });
  return list.sort((a, b) => b.day - a.day);
}
const DOWS = ['일', '월', '화', '수', '목', '금', '토'];

function MiniCalendar({ year, month, marks, selected, onSelect, onPrev, onNext, look = 'classic', selColor }) {
  const diary = look === 'diary';
  const selBg = selColor || (diary ? 'var(--coral)' : 'var(--primary)');
  const firstDow = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const isCurMonth = year === CUR_Y && month === CUR_M;
  const navBtn = { ...bare, width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)' };
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  return (
    <div style={{ position: 'relative', background: diary ? '#fff' : 'var(--surface)', borderRadius: diary ? 6 : 'var(--radius)', padding: diary ? '20px 14px 16px' : '16px 14px', boxShadow: '0 8px 22px rgba(80,140,200,0.14)' }}>
      {diary && <Tape style={{ top: -10, left: '50%', marginLeft: -42 }} w={84} deg={-4} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={onPrev} aria-label="이전 달" style={navBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 19, fontWeight: 800, color: 'var(--ink)', minWidth: 96, textAlign: 'center' }}>{year}. <span style={{ color: 'var(--primary)' }}>{month}월</span></div>
          <button onClick={onNext} aria-label="다음 달" style={navBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <HamsterFace size={24} /><CatFace size={24} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
        {DOWS.map((d, i) => (
          <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--fbody)', fontSize: 10.5, fontWeight: 700, color: i === 0 ? '#e88' : i === 6 ? 'var(--primary)' : 'var(--sub)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />;
          const m = marks[d];
          const has = !!m;
          const sel = selected === d;
          const isToday = isCurMonth && d === CUR_D;
          return (
            <button key={i} onClick={() => onSelect(d)} style={{
              ...bare, aspectRatio: '1 / 1', borderRadius: diary ? '50%' : 12, position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: sel ? selBg : 'transparent',
              boxShadow: isToday && !sel ? 'inset 0 0 0 2px var(--coral)' : 'none',
              cursor: 'pointer',
            }}>
              <span style={{ fontFamily: diary ? 'var(--fdisplay)' : 'var(--fbody)', fontSize: 12.5, fontWeight: has ? 800 : 500, color: sel ? 'var(--ink)' : has ? 'var(--ink)' : 'var(--sub)' }}>{d}</span>
              {has && (
                <span style={{ position: 'absolute', bottom: 5, display: 'flex', gap: 2 }}>
                  {m.photo && <span style={{ width: 5, height: 5, borderRadius: 5, background: 'var(--primary)' }} />}
                  {m.video && <span style={{ width: 5, height: 5, borderRadius: 5, background: 'var(--coral)' }} />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContentCard({ it, onOpenPhoto, onPlay, look = 'classic' }) {
  const isVideo = it.kind === 'video';
  const diary = look === 'diary';
  const open = () => (isVideo ? onPlay(it.ref) : onOpenPhoto(it.idx));
  if (diary) {
    return (
      <button onClick={open} style={{
        ...bare, position: 'relative', display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
        background: '#fff', borderRadius: 5, padding: '11px 13px 11px 11px', boxShadow: '0 7px 18px rgba(80,140,200,0.18)',
      }}>
        <Tape style={{ top: -7, left: '50%', marginLeft: -22, zIndex: 2 }} w={44} deg={-5} />
        <div style={{ flex: '0 0 78px', height: 60, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
          <Film f={it.f} glyph={isVideo ? 'cloud' : 'camera'} radius={0} />
          {isVideo && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: 26, height: 26, borderRadius: 15, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>
              </span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Chip tone={isVideo ? 'coral' : 'soft'} style={{ fontSize: 9.5, padding: '3px 8px' }}>{isVideo ? '▶ 영상' : '📷 사진'}</Chip>
          <div style={{ fontFamily: 'var(--fdisplay)', fontSize: 14, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3, margin: '6px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--fbody)', fontSize: 11, color: 'var(--sub)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--coral)"><path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" /></svg>
            {isVideo ? `조회수 ${it.views}` : it.likes.toLocaleString()}
          </div>
        </div>
      </button>
    );
  }
  return (
    <button onClick={open} style={{
      ...bare, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
      background: 'var(--surface)', borderRadius: 18, padding: 10, boxShadow: '0 5px 14px rgba(80,140,200,0.12)',
    }}>
      <div style={{ flex: '0 0 86px', height: 64, borderRadius: 13, overflow: 'hidden', position: 'relative' }}>
        <Film f={it.f} glyph={isVideo ? 'cloud' : 'camera'} radius={0} />
        {isVideo && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 28, height: 28, borderRadius: 16, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--primaryDeep)"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>
            </span>
          </div>
        )}
        {isVideo && <span style={{ position: 'absolute', bottom: 5, right: 5, fontFamily: 'ui-monospace, monospace', fontSize: 8, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '1px 4px', borderRadius: 4 }}>{it.dur}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Chip tone={isVideo ? 'coral' : 'soft'} style={{ fontSize: 9.5, padding: '3px 8px' }}>{isVideo ? '▶ 영상' : '📷 사진'}</Chip>
        <div style={{ fontFamily: 'var(--fbody)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, margin: '6px 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
        <div style={{ fontFamily: 'var(--fbody)', fontSize: 11, color: 'var(--sub)' }}>{isVideo ? `조회수 ${it.views}` : `♡ ${it.likes.toLocaleString()}`} · {it.tag}</div>
      </div>
    </button>
  );
}

function CalendarScreen({ onOpenPhoto, onPlay, look = 'classic', selColor }) {
  const diary = look === 'diary';
  const [view, setView] = React.useState({ y: CUR_Y, m: CUR_M });
  const [selected, setSelected] = React.useState(CUR_D);
  const monthContent = React.useMemo(() => contentForMonth(view.m), [view.m]);
  const marks = {};
  monthContent.forEach((it) => { marks[it.day] = marks[it.day] || {}; marks[it.day][it.kind] = true; });
  const dayItems = monthContent.filter((it) => it.day === selected);
  const dow = DOWS[new Date(view.y, view.m - 1, selected).getDay()];
  const isCurMonth = view.y === CUR_Y && view.m === CUR_M;
  const changeMonth = (dir) => {
    const d = new Date(view.y, view.m - 1 + dir, 1);
    const ny = d.getFullYear(), nm = d.getMonth() + 1;
    setView({ y: ny, m: nm });
    // landing on the real current month selects today; otherwise the 1st
    setSelected(ny === CUR_Y && nm === CUR_M ? CUR_D : 1);
  };

  return (
    <div style={{ paddingBottom: 28 }}>
      {diary && (
        <div style={{ padding: '0 18px 8px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: 'var(--fdisplay)', fontSize: 15, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>한빈이의 기록 달력</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--coral)" style={{ transform: 'rotate(-8deg)' }}><path d="M7 2v3M17 2v3M3.5 8h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6.5A1.5 1.5 0 0 1 5 5z" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" /></svg>
          <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'var(--sub)' }}>{monthContent.length} UPLOADS</span>
        </div>
      )}
      <div style={{ ...PAD, paddingTop: diary ? 4 : 4 }}>
        <MiniCalendar year={view.y} month={view.m} marks={marks} selected={selected} onSelect={setSelected} onPrev={() => changeMonth(-1)} onNext={() => changeMonth(1)} look={look} selColor={selColor} />
        {/* legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, padding: '0 4px', fontFamily: 'var(--fbody)', fontSize: 11.5, color: 'var(--sub)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 5, background: 'var(--primary)' }} /> 사진</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 5, background: 'var(--coral)' }} /> 영상</span>
        </div>
      </div>

      <div style={{ ...PAD, marginTop: 22 }}>
        <SectionHead title={`${view.m}월 ${selected}일의 기록`} mascot="cat" right={<span style={{ fontFamily: 'var(--fbody)', fontSize: 12.5, color: 'var(--sub)', whiteSpace: 'nowrap' }}>{dow}요일 · {dayItems.length}개</span>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {dayItems.map((it) => (
            <ContentCard key={it.kind + (it.idx ?? it.ref.id)} it={it} onOpenPhoto={onOpenPhoto} onPlay={onPlay} look={look} />
          ))}
          {dayItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0 8px', fontFamily: 'var(--fbody)', fontSize: 13, color: 'var(--sub)' }}>
              {isCurMonth && selected === CUR_D ? '오늘은 아직 올라온 기록이 없어요 ☁️' : '이 날의 기록이 없어요'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, GalleryScreen, VideoScreen, CalendarScreen, ScheduleCard });
