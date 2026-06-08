// app.jsx — SHB ARCHIVE: assembles theme, tweaks, device frame, screens.

// coral #F09884 = the signature warm point color, woven through every palette
// (hearts, D-day, masking tape, "임박" badges). coralSoft = its pale paper tint.
const THEMES = {
  sky:      { name: '하늘',   bg: '#eaf6ff', surface: '#ffffff', primary: '#4fb0ef', primaryDeep: '#2c87cf', soft: '#cfeaff', ink: '#173a52', sub: '#6b8aa3', accent: '#ffe08a', coral: '#f09884', coralSoft: '#ffe2da', swatch: ['#4fb0ef', '#f09884', '#eaf6ff'] },
  soda:     { name: '소다',   bg: '#eafcff', surface: '#ffffff', primary: '#37c2d6', primaryDeep: '#1f9bad', soft: '#cdeff5', ink: '#0f3d44', sub: '#5b8a91', accent: '#ffd3a6', coral: '#f09884', coralSoft: '#ffe2da', swatch: ['#37c2d6', '#f09884', '#eafcff'] },
  mint:     { name: '민트',   bg: '#e9faf0', surface: '#ffffff', primary: '#3fc795', primaryDeep: '#23a576', soft: '#cdeede', ink: '#143f33', sub: '#5d8479', accent: '#ffe173', coral: '#f09884', coralSoft: '#ffe2da', swatch: ['#3fc795', '#f09884', '#e9faf0'] },
  lavender: { name: '라벤더', bg: '#f1efff', surface: '#ffffff', primary: '#8b8df0', primaryDeep: '#6a6ae0', soft: '#dcdcff', ink: '#2c2a4f', sub: '#7d7ba2', accent: '#ffc2dd', coral: '#f09884', coralSoft: '#ffe2da', swatch: ['#8b8df0', '#f09884', '#f1efff'] },
  // peach ☀️ — coral as the BACKGROUND mood: warm paper bg + coral primary, sky kept as the cool counterpoint
  peach:    { name: '피치',   bg: '#fff1ec', surface: '#fffaf8', primary: '#f0846f', primaryDeep: '#d96450', soft: '#ffe0d6', ink: '#5a3128', sub: '#b08074', accent: '#9fd2f2', coral: '#f09884', coralSoft: '#ffe2da', swatch: ['#f0846f', '#ffd0c2', '#fff1ec'] },
};
const SWATCH_TO_KEY = Object.fromEntries(Object.entries(THEMES).map(([k, v]) => [v.swatch[0], k]));

const MOODS = {
  mallang: { name: '말랑 파스텔', fdisplay: "'Jua', sans-serif", fbody: "'Gowun Dodum', sans-serif", radius: 26 },
  minimal: { name: '깨끗 미니멀', fdisplay: "'Gothic A1', sans-serif", fbody: "'Gothic A1', sans-serif", radius: 16 },
  summer:  { name: '여름 손글씨', fdisplay: "'OngleipParkDahyeon', cursive", fbody: "'Gowun Dodum', sans-serif", radius: 22 },
};
const MOOD_TO_KEY = Object.fromEntries(Object.entries(MOODS).map(([k, v]) => [v.name, k]));

const LAYOUTS = { '히어로': 'hero', '카드': 'card', '매거진': 'magazine', '다이어리': 'diary' };
const LAYOUT_TO_LABEL = Object.fromEntries(Object.entries(LAYOUTS).map(([l, k]) => [k, l]));

const GALLERY_STYLES = { '기본': 'classic', '다이어리': 'diary' };
const GSTYLE_TO_LABEL = Object.fromEntries(Object.entries(GALLERY_STYLES).map(([l, k]) => [k, l]));

// 사진 크기 — A 자유(varied) / B 정돈(3종 고정)
const PHOTO_SIZES = { 'A 자유': 'free', 'B 정돈': 'tidy' };
const PSIZE_TO_LABEL = Object.fromEntries(Object.entries(PHOTO_SIZES).map(([l, k]) => [k, l]));

// 영상 재생 — 인라인(그 자리에서 재생) / 플레이어(전체화면)
const VIDEO_PLAYS = { '인라인': 'inline', '플레이어': 'player' };
const VPLAY_TO_LABEL = Object.fromEntries(Object.entries(VIDEO_PLAYS).map(([l, k]) => [k, l]));

// 영상 스타일 — 기본(카드) / 다이어리(스크랩북)
const VIDEO_LOOKS = { '기본': 'classic', '다이어리': 'diary' };
const VLOOK_TO_LABEL = Object.fromEntries(Object.entries(VIDEO_LOOKS).map(([l, k]) => [k, l]));

// 영상 테이프 — 기본(민무늬 코랄 테이프) / 표정(웃는 얼굴 테이프). 다이어리 스타일일 때만 적용
const VIDEO_TAPES = { '기본': false, '표정': true };
const VTAPE_TO_LABEL = { false: '기본', true: '표정' };

// 마스코트 종류 — 일러스트(실제 그림) / 도형(기존 SVG)
const MASCOT_STYLES = { '일러스트': 'illust', '도형': 'shape' };
const MSTYLE_TO_LABEL = Object.fromEntries(Object.entries(MASCOT_STYLES).map(([l, k]) => [k, l]));

// 캘린더 스타일 — 기본 / 다이어리(테이프·손글씨·코럴 동그라미)
const CAL_LOOKS = { '기본': 'classic', '다이어리': 'diary' };
const CLOOK_TO_LABEL = Object.fromEntries(Object.entries(CAL_LOOKS).map(([l, k]) => [k, l]));

// 캘린더 선택일 색 — 추천 색상 (단색 스와치). theme 변수 대신 고정 hex로 비교
const CAL_SEL_COLORS = ['#f9cdbf', '#c3e3f7', '#fbd6e2', '#cce9cd', '#e2d2f6', '#ffe2b3'];

// 갤러리 묶음 — 낱개(사진 하나씩) / 앨범(인스타식 여러 장 포스트)
const GALLERY_GROUPS = { '낱개': 'single', '앨범': 'album' };
const GGROUP_TO_LABEL = Object.fromEntries(Object.entries(GALLERY_GROUPS).map(([l, k]) => [k, l]));

// ★ 확정 조합 — '확정' 모드일 때 적용되는 단 하나의 최종본.
// 탐색하다 마음에 드는 조합을 찾으면 이 값만 바꾸면 됨.
const FINAL = { palette: 'sky', mood: 'summer', homeLayout: 'diary', galleryStyle: 'diary', galleryGroup: 'album', photoSize: 'tidy', videoPlay: 'inline', videoFilter: true, videoLook: 'diary', videoTape: false, calLook: 'diary', calSelColor: '#f9cdbf', mascots: true, mascotStyle: 'illust' };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "확정",
  "palette": "sky",
  "mood": "summer",
  "homeLayout": "diary",
  "galleryStyle": "diary",
  "galleryGroup": "album",
  "photoSize": "tidy",
  "videoPlay": "inline",
  "videoFilter": true,
  "videoLook": "diary",
  "videoTape": false,
  "calLook": "diary",
  "calSelColor": "#f9cdbf",
  "mascots": true,
  "mascotStyle": "illust"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('home');
  const [photo, setPhoto] = React.useState(null);
  const [video, setVideo] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const scrollRef = React.useRef(null);

  // 확정 모드면 FINAL 값을, 탐색 모드면 개별 트윗 값을 적용
  const isFinal = t.mode === '확정';
  const palKey    = isFinal ? FINAL.palette    : t.palette;
  const moodKey   = isFinal ? FINAL.mood       : t.mood;
  const layoutKey = isFinal ? FINAL.homeLayout : t.homeLayout;
  const galleryKey = isFinal ? FINAL.galleryStyle : t.galleryStyle;
  const galleryGroupKey = isFinal ? FINAL.galleryGroup : t.galleryGroup;
  const photoSizeKey = isFinal ? FINAL.photoSize : t.photoSize;
  const videoPlayKey = isFinal ? FINAL.videoPlay : t.videoPlay;
  const videoFilter = isFinal ? FINAL.videoFilter : t.videoFilter;
  const videoLookKey = isFinal ? FINAL.videoLook : t.videoLook;
  const videoTape = isFinal ? FINAL.videoTape : t.videoTape;
  const calLookKey = isFinal ? FINAL.calLook : t.calLook;
  const calSelColor = isFinal ? FINAL.calSelColor : t.calSelColor;
  const showMascots = isFinal ? FINAL.mascots  : t.mascots;
  const mascotStyleKey = isFinal ? FINAL.mascotStyle : t.mascotStyle;

  const theme = THEMES[palKey] || THEMES.sky;
  const mood = MOODS[moodKey] || MOODS.mallang;
  React.useEffect(() => {
    const fit = () => {
      const s = Math.min((window.innerHeight - 36) / 874, (window.innerWidth - 24) / 402, 1.1);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tab]);

  const vars = {
    '--bg': theme.bg, '--surface': theme.surface, '--primary': theme.primary,
    '--primaryDeep': theme.primaryDeep, '--soft': theme.soft, '--ink': theme.ink,
    '--sub': theme.sub, '--accent': theme.accent,
    '--coral': theme.coral, '--coralSoft': theme.coralSoft,
    '--radius': mood.radius + 'px', '--fdisplay': mood.fdisplay, '--fbody': mood.fbody,
  };

  return (
    <MascotStyleContext.Provider value={mascotStyleKey}>
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, #f3f7fb, #e6ebf1)' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice>
          <div style={{ ...vars, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', fontFamily: 'var(--fbody)' }}>
            <AppHeader tab={tab} />
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
              {tab === 'home' && <HomeScreen layout={layoutKey} onOpenPhoto={setPhoto} onPlay={setVideo} onTab={setTab} />}
              {tab === 'gallery' && <GalleryScreen onOpenPhoto={setPhoto} variant={galleryKey} sizing={photoSizeKey} grouping={galleryGroupKey} />}
              {tab === 'video' && <VideoScreen onPlay={setVideo} playMode={videoPlayKey} showFilter={videoFilter} look={videoLookKey} tapeFace={videoTape} />}
              {tab === 'calendar' && <CalendarScreen onOpenPhoto={setPhoto} onPlay={setVideo} look={calLookKey} selColor={calSelColor} />}
            </div>
            <TabBar tab={tab} onChange={setTab} />
            <PhotoLightbox index={photo} onClose={() => setPhoto(null)} onNav={(d) => setPhoto((p) => (p + d + GALLERY.length) % GALLERY.length)} />
            <VideoPlayer video={video} onClose={() => setVideo(null)} />
            {!showMascots && <style>{`[data-mascot]{display:none!important}`}</style>}
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="보기 모드" />
        <TweakRadio label="모드" value={t.mode}
          options={['확정', '탐색']}
          onChange={(v) => setTweak('mode', v)} />

        {isFinal ? (
          <div style={{
            margin: '4px 0 2px', padding: '12px 13px', borderRadius: 14,
            background: 'color-mix(in srgb, #f09884 12%, #fff)',
            border: '1.5px solid color-mix(in srgb, #f09884 38%, transparent)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#c2503a', fontFamily: 'ui-monospace, monospace' }}>★ 확정 조합</div>
            <div style={{ fontSize: 12.5, color: '#5a4a44', marginTop: 6, lineHeight: 1.6 }}>
              {THEMES[FINAL.palette].name} · {LAYOUT_TO_LABEL[FINAL.homeLayout]} · {MOODS[FINAL.mood].name} · 갤러리 {GSTYLE_TO_LABEL[FINAL.galleryStyle]}/{GGROUP_TO_LABEL[FINAL.galleryGroup]} · 사진 {PSIZE_TO_LABEL[FINAL.photoSize]} · 영상 {VPLAY_TO_LABEL[FINAL.videoPlay]}/{VTAPE_TO_LABEL[FINAL.videoTape]}테이프{FINAL.mascots ? ` · 마스코트 ${MSTYLE_TO_LABEL[FINAL.mascotStyle]}` : ''}
            </div>
            <div style={{ fontSize: 11, color: '#9a8780', marginTop: 6 }}>'탐색'으로 바꾸면 모든 옵션을 자유롭게 비교할 수 있어요.</div>
          </div>
        ) : (
          <>
            <TweakSection label="청량 색감" />
            <TweakColor label="팔레트" value={theme.swatch}
              options={Object.values(THEMES).map((th) => th.swatch)}
              onChange={(v) => setTweak('palette', SWATCH_TO_KEY[v[0]] || 'sky')} />

            <TweakSection label="레이아웃 & 무드" />
            <TweakSelect label="홈 화면" value={LAYOUT_TO_LABEL[t.homeLayout]}
              options={['히어로', '카드', '매거진', '다이어리']}
              onChange={(v) => setTweak('homeLayout', LAYOUTS[v])} />
            <TweakRadio label="갤러리 스타일" value={GSTYLE_TO_LABEL[t.galleryStyle]}
              options={['기본', '다이어리']}
              onChange={(v) => setTweak('galleryStyle', GALLERY_STYLES[v])} />
            <TweakRadio label="사진 묶음" value={GGROUP_TO_LABEL[t.galleryGroup]}
              options={['낱개', '앨범']}
              onChange={(v) => setTweak('galleryGroup', GALLERY_GROUPS[v])} />
            <TweakRadio label="사진 크기" value={PSIZE_TO_LABEL[t.photoSize]}
              options={['A 자유', 'B 정돈']}
              onChange={(v) => setTweak('photoSize', PHOTO_SIZES[v])} />

            <TweakSection label="영상" />
            <TweakRadio label="재생 방식" value={VPLAY_TO_LABEL[t.videoPlay]}
              options={['인라인', '플레이어']}
              onChange={(v) => setTweak('videoPlay', VIDEO_PLAYS[v])} />
            <TweakRadio label="영상 스타일" value={VLOOK_TO_LABEL[t.videoLook]}
              options={['기본', '다이어리']}
              onChange={(v) => setTweak('videoLook', VIDEO_LOOKS[v])} />
            <TweakRadio label="영상 테이프" value={VTAPE_TO_LABEL[t.videoTape]}
              options={['기본', '표정']}
              onChange={(v) => setTweak('videoTape', VIDEO_TAPES[v])} />
            <TweakToggle label="태그 필터 표시" value={t.videoFilter}
              onChange={(v) => setTweak('videoFilter', v)} />

            <TweakSection label="캘린더" />
            <TweakRadio label="달력 스타일" value={CLOOK_TO_LABEL[t.calLook]}
              options={['기본', '다이어리']}
              onChange={(v) => setTweak('calLook', CAL_LOOKS[v])} />
            <TweakColor label="선택한 날짜 색" value={t.calSelColor}
              options={CAL_SEL_COLORS}
              onChange={(v) => setTweak('calSelColor', v)} />
            <TweakSelect label="폰트 무드" value={MOODS[t.mood].name}
              options={Object.values(MOODS).map((m) => m.name)}
              onChange={(v) => setTweak('mood', MOOD_TO_KEY[v])} />

            <TweakSection label="마스코트" />
            <TweakRadio label="마스코트 종류" value={MSTYLE_TO_LABEL[t.mascotStyle]}
              options={['일러스트', '도형']}
              onChange={(v) => setTweak('mascotStyle', MASCOT_STYLES[v])} />
            <TweakToggle label="햄스터·고양이 표시" value={t.mascots}
              onChange={(v) => setTweak('mascots', v)} />
          </>
        )}
      </TweaksPanel>
    </div>
    </MascotStyleContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
