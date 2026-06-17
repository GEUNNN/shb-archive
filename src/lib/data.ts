// data.ts — shared types + presentation constants for SHB ARCHIVE.
// Archive content (photos/videos) now comes from Supabase via queries.ts;
// this file keeps the TS types, the gradient "film" placeholders (FILMS),
// and the ON THIS DAY seeds (MEMORY_SEEDS).

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

// Multi-photo post (the /photos "album" view). `photos` = FILMS indices until
// real image URLs land; `tag` = SNS source platform. Rows come from Supabase.
export interface Album {
  id: string;
  cap: string;
  date: string;
  tag: string; // platform (인스타그램 / 트위터 / 플러스챗)
  likes: number;
  ratio: number;
  photos: number[]; // FILMS indices (gradient fallback)
  images: string[]; // real image URLs (R2); empty → fall back to `photos`
}

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
  isShorts: boolean; // YouTube Shorts (short-form)
}

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
