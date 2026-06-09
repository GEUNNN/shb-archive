// data.ts — fan-archive mock content for SHB ARCHIVE.
// Placeholder for the planned Supabase `photos` / `videos` tables.
// Images are gradient "film" placeholders until real URLs are wired in.

export const HANBIN = {
  name: "성한빈",
  nameEn: "SUNG HANBIN",
  tag: "햄냥이 주인 찾아요",
};

// gradient "film" placeholder hue pairs — read fresh / cheongryang
export const FILMS: [string, string][] = [
  ["#bfe3ff", "#7cc4f5"],
  ["#cdeedd", "#7fd6b0"],
  ["#d8d6ff", "#a7a8f0"],
  ["#ffe1c4", "#ffc48a"],
  ["#c2eef4", "#7fd4e0"],
  ["#ffd6e6", "#f7a9c6"],
  ["#dff0ff", "#9fd0f5"],
  ["#e6f6c8", "#bfe07f"],
];

export type Glyph = "cloud" | "camera";

export interface Photo {
  id: string;
  cap: string;
  date: string;
  tag: string; // platform (Instagram / Twitter / Plus Chat)
  ratio: number;
  f: number; // FILMS index
  likes: number;
}

export const GALLERY: Photo[] = [
  {
    id: "g1",
    cap: "여름 화보 비하인드",
    date: "2025.07.02",
    tag: "인스타그램",
    ratio: 1.28,
    f: 0,
    likes: 1284,
  },
  {
    id: "g2",
    cap: "공항 가는 길",
    date: "2025.06.21",
    tag: "트위터",
    ratio: 0.82,
    f: 6,
    likes: 932,
  },
  {
    id: "g3",
    cap: "음악방송 출근길",
    date: "2025.06.14",
    tag: "플러스챗",
    ratio: 1.0,
    f: 1,
    likes: 1471,
  },
  {
    id: "g4",
    cap: "바다 브이로그",
    date: "2025.06.09",
    tag: "인스타그램",
    ratio: 1.5,
    f: 4,
    likes: 2038,
  },
  {
    id: "g5",
    cap: "팬사인회 셀카",
    date: "2025.05.30",
    tag: "트위터",
    ratio: 0.84,
    f: 5,
    likes: 1755,
  },
  {
    id: "g6",
    cap: "연습실 거울샷",
    date: "2025.05.18",
    tag: "플러스챗",
    ratio: 1.18,
    f: 2,
    likes: 864,
  },
];

// Instagram-style multi-photo posts (the /photos "album" view). `photos` are
// FILMS indices until real image URLs land; `tag` = SNS source platform.
export interface Album {
  id: string;
  cap: string;
  date: string;
  tag: string; // platform (인스타그램 / 트위터 / 플러스챗)
  likes: number;
  ratio: number;
  photos: number[]; // FILMS indices
}

export const ALBUMS: Album[] = [
  { id: "al1", cap: "여름 화보 비하인드", date: "2025.07.02", tag: "인스타그램", likes: 1284, ratio: 1.25, photos: [0, 3, 6, 1, 4] },
  { id: "al2", cap: "바다 브이로그 스틸컷", date: "2025.06.21", tag: "트위터", likes: 2038, ratio: 1.0, photos: [4, 7, 2] },
  { id: "al3", cap: "팬사인회 데이 ♡", date: "2025.05.30", tag: "인스타그램", likes: 1755, ratio: 1.25, photos: [5, 3, 6, 0] },
  { id: "al4", cap: "음악방송 출근길 모음", date: "2025.06.14", tag: "플러스챗", likes: 1471, ratio: 1.33, photos: [1, 2, 6] },
  { id: "al5", cap: "생일 카페 이벤트", date: "2025.05.13", tag: "인스타그램", likes: 3120, ratio: 1.0, photos: [3, 0, 7, 4, 2, 6] },
];

export interface Video {
  id: string;
  title: string;
  dur: string;
  date: string;
  views: string;
  author: string;
  tag: string; // category
  f: number;
  yt?: string; // YouTube ID
}

export const VIDEOS: Video[] = [
  {
    id: "v1",
    title: "[MV] TOP5",
    dur: "12:04",
    date: "2025.07.03",
    views: "142만",
    author: "OFFICIAL",
    tag: "비하인드",
    f: 0,
    yt: "7QGRDC7ngpE",
  },
  {
    id: "v2",
    title: "[입덕직캠] TOP5",
    dur: "18:47",
    date: "2025.06.10",
    views: "256만",
    author: "OFFICIAL",
    tag: "자컨",
    f: 4,
    yt: "00eDQU6_Azc",
  },
  {
    id: "v3",
    title: "직캠 | 컴백 무대 4K",
    dur: "03:21",
    date: "2025.06.21",
    views: "389만",
    author: "@청량모먼트",
    tag: "직캠",
    f: 6,
  },
  {
    id: "v4",
    title: "음악방송 1위 앵콜 무대",
    dur: "03:55",
    date: "2025.05.24",
    views: "198만",
    author: "OFFICIAL",
    tag: "음악방송",
    f: 1,
  },
  {
    id: "v5",
    title: "단독 라이브 〈여름밤〉",
    dur: "24:18",
    date: "2025.06.28",
    views: "88만",
    author: "OFFICIAL",
    tag: "라이브",
    f: 2,
  },
  {
    id: "v6",
    title: "음악방송 1위 무대 직캠",
    dur: "03:48",
    date: "2025.07.05",
    views: "165만",
    author: "@청량모먼트",
    tag: "음악방송",
    f: 5,
  },
];

// "N년 전 오늘" reminiscence content (dummy). Dates are derived from today's
// MM-DD at render time, mirroring the planned `photos`∪`videos` MM-DD match.
export interface MemorySeed {
  title: string;
  tag: string;
  weather: string;
  f: number;
  glyph: Glyph;
  deg: number;
}

export const MEMORY_SEEDS: MemorySeed[] = [
  {
    title: "단독 팬미팅 〈Who stole His cake?>",
    tag: "팬미팅",
    weather: "☀️",
    f: 0,
    glyph: "cloud",
    deg: -3,
  },
  {
    title: "여름 화보 'BLUE HOUR' 공개",
    tag: "화보",
    weather: "🌤️",
    f: 3,
    glyph: "camera",
    deg: 3,
  },
  {
    title: "첫 여름 음악방송 컴백 무대",
    tag: "무대",
    weather: "☁️",
    f: 5,
    glyph: "camera",
    deg: -3,
  },
];
