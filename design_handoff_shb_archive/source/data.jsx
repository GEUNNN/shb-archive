// data.jsx — fictional fan-archive content for SHB archive prototype.
// Photos are placeholders; captions/dates are illustrative.

const HANBIN = {
  name: '성한빈',
  nameEn: 'SEONG HANBIN',
  tag: '청량 그 자체 ☁️',
  birth: '2005.05.13',
  height: '178cm',
  position: '리더 · 메인댄서',
  emoji: '🐹🐱',
};

// gradient "film" placeholders — hue pairs that read fresh/cheongryang
const FILMS = [
  ['#bfe3ff', '#7cc4f5'], ['#cdeedd', '#7fd6b0'], ['#d8d6ff', '#a7a8f0'],
  ['#ffe1c4', '#ffc48a'], ['#c2eef4', '#7fd4e0'], ['#ffd6e6', '#f7a9c6'],
  ['#dff0ff', '#9fd0f5'], ['#e6f6c8', '#bfe07f'],
];

const GALLERY = [
  { id: 'g1', cap: '여름 화보 비하인드', date: '2025.07.02', tag: '인스타그램', ratio: 1.28, f: 0, likes: 1284 },
  { id: 'g2', cap: '공항 가는 길', date: '2025.06.21', tag: '트위터', ratio: 0.82, f: 6, likes: 932 },
  { id: 'g3', cap: '음악방송 출근길', date: '2025.06.14', tag: '플러스챗', ratio: 1.0, f: 1, likes: 1471 },
  { id: 'g4', cap: '바다 브이로그', date: '2025.06.09', tag: '인스타그램', ratio: 1.5, f: 4, likes: 2038 },
  { id: 'g5', cap: '팬사인회 셀카', date: '2025.05.30', tag: '트위터', ratio: 0.84, f: 5, likes: 1755 },
  { id: 'g6', cap: '연습실 거울샷', date: '2025.05.18', tag: '플러스챗', ratio: 1.18, f: 2, likes: 864 },
  { id: 'g7', cap: '생일 컵홀더 이벤트', date: '2025.05.13', tag: '인스타그램', ratio: 1.0, f: 3, likes: 3120 },
  { id: 'g8', cap: '하늘이 예뻤던 날', date: '2025.05.02', tag: '트위터', ratio: 0.78, f: 7, likes: 671 },
  { id: 'g9', cap: '비하인드 컷', date: '2025.04.27', tag: '플러스챗', ratio: 1.34, f: 0, likes: 1102 },
];

const VIDEOS = [
  { id: 'v1', title: '[메이킹] 여름 화보 촬영 비하인드', dur: '12:04', date: '2025.07.03', views: '142만', author: '한빈 OFFICIAL', tag: '비하인드', f: 0, yt: '7QGRDC7ngpE' },
  { id: 'v2', title: '한빈이의 바다 브이로그 🌊', dur: '18:47', date: '2025.06.10', views: '256만', author: '한빈 OFFICIAL', tag: '자컨', f: 4, yt: '00eDQU6_Azc' },
  { id: 'v3', title: '직캠 | 컴백 무대 4K', dur: '03:21', date: '2025.06.21', views: '389만', author: '@청량모먼트', tag: '직캠', f: 6 },
  { id: 'v4', title: '음악방송 1위 앵콜 무대', dur: '03:55', date: '2025.05.24', views: '198만', author: '한빈 OFFICIAL', tag: '음악방송', f: 1 },
  { id: 'v5', title: '한빈 생일 라이브 다시보기', dur: '47:12', date: '2025.05.13', views: '88만', author: '@한빈_archive', tag: '라이브', f: 3 },
  { id: 'v6', title: '필름카메라로 담은 하루', dur: '08:30', date: '2025.04.29', views: '120만', author: '@필름한빈', tag: '자컨', f: 7 },
];

const SCHEDULE = [
  { id: 's1', d: 13, day: '토', mon: '06', title: '생일 카페 〈한빈정원〉', place: '성수 · 12:00', type: '팬이벤트', soon: true, f: 3 },
  { id: 's2', d: 18, day: '목', mon: '06', title: '음악중심 사전녹화', place: '상암 MBC · 14:00', type: '방송', f: 1 },
  { id: 's3', d: 21, day: '일', mon: '06', title: '팬사인회 (영통)', place: '온라인 · 19:00', type: '팬사인', f: 5 },
  { id: 's4', d: 28, day: '일', mon: '06', title: '여름 단독 팬미팅 ☁️', place: '올림픽홀 · 17:00', type: '팬미팅', f: 0 },
  { id: 's5', d: 5, day: '토', mon: '07', title: '뮤직뱅크 글로벌 페스티벌', place: '도쿄 · 18:00', type: '공연', f: 6 },
];

const HIGHLIGHTS = [
  { id: 'h1', label: '여름 화보', sub: 'PHOTOBOOK', f: 0, go: { type: 'photo', idx: 0 } },
  { id: 'h2', label: '바다 브이로그', sub: 'VLOG', f: 4, go: { type: 'video', vid: 'v2' } },
  { id: 'h3', label: '컴백 무대 직캠', sub: 'STAGE', f: 6, go: { type: 'video', vid: 'v3' } },
];

// instagram-style multi-photo posts (each post = several photos). photos = FILMS indices.
const ALBUMS = [
  { id: 'al1', cap: '여름 화보 비하인드', date: '2025.07.02', tag: '인스타그램', likes: 1284, ratio: 1.25, photos: [0, 3, 6, 1, 4] },
  { id: 'al2', cap: '바다 브이로그 스틸컷', date: '2025.06.21', tag: '트위터', likes: 2038, ratio: 1.0, photos: [4, 7, 2] },
  { id: 'al3', cap: '팬사인회 데이 ♡', date: '2025.05.30', tag: '인스타그램', likes: 1755, ratio: 1.25, photos: [5, 3, 6, 0] },
  { id: 'al4', cap: '음악방송 출근길 모음', date: '2025.06.14', tag: '플러스챗', likes: 1471, ratio: 1.33, photos: [1, 2, 6] },
  { id: 'al5', cap: '생일 카페 이벤트', date: '2025.05.13', tag: '인스타그램', likes: 3120, ratio: 1.0, photos: [3, 0, 7, 4, 2, 6] },
];

Object.assign(window, { HANBIN, FILMS, GALLERY, VIDEOS, SCHEDULE, HIGHLIGHTS, ALBUMS });
