// calendar.ts — month-keyed content helpers for the /calendar route.
//
// ┌─ SUPABASE SWAP POINT ───────────────────────────────────────────────────┐
// │ `getMonthContent(year, month)` is the single seam to swap for real data. │
// │ Today (dummy): synchronous filter over the in-memory GALLERY/VIDEOS      │
// │   arrays, matched by MONTH ONLY (year-agnostic) — the fan-archive sample  │
// │   dates span mixed years, so this surfaces content regardless of year.    │
// │ Later (Supabase): make it `async`, keep the signature, and query a real   │
// │   year-month date range, e.g.                                             │
// │     .gte("date", `${year}-${mm}-01`).lt("date", nextMonthFirstDay)        │
// │   The calendar page should fetch the visible month and cache fetched      │
// │   months client-side (Record<"YYYY-MM", DayItem[]>) so month-nav stays    │
// │   instant — do NOT fetch the whole archive and filter on the frontend.    │
// └──────────────────────────────────────────────────────────────────────────┘

import { GALLERY, VIDEOS, Video } from "./data";

// "2025.07.02" → { y: 2025, m: 7, d: 2 }
export function parseDateKR(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = s.split(".").map(Number);
  return { y, m, d };
}

// One day's upload — discriminated by `kind` so the photo branch carries the
// lightbox payload and the video branch carries the original Video for the player.
export type DayItem =
  | {
      kind: "photo";
      day: number;
      date: string;
      title: string;
      tag: string;
      f: number;
      likes: number;
    }
  | {
      kind: "video";
      day: number;
      date: string;
      title: string;
      tag: string;
      f: number;
      dur: string;
      views: string;
      ref: Video;
    };

// Uploads for the given year-month, newest day first.
// NOTE: `year` is accepted for a production-shaped signature but ignored by the
// dummy implementation (month-only match). See the SUPABASE SWAP POINT above.
export function getMonthContent(year: number, month: number): DayItem[] {
  const list: DayItem[] = [];

  GALLERY.forEach((g) => {
    const p = parseDateKR(g.date);
    if (p.m === month) {
      list.push({
        kind: "photo",
        day: p.d,
        date: g.date,
        title: g.cap,
        tag: g.tag,
        f: g.f,
        likes: g.likes,
      });
    }
  });

  VIDEOS.forEach((v) => {
    const p = parseDateKR(v.date);
    if (p.m === month) {
      list.push({
        kind: "video",
        day: p.d,
        date: v.date,
        title: v.title,
        tag: v.tag,
        f: v.f,
        dur: v.dur,
        views: v.views,
        ref: v,
      });
    }
  });

  return list.sort((a, b) => b.day - a.day);
}

// { day: { photo?: true, video?: true } } — drives the calendar cell dots
// (blue = photo, coral = video, both = two dots). Derived from getMonthContent
// so the grid stays dumb and there's one source of truth per month.
export function marksForMonth(
  year: number,
  month: number
): Record<number, { photo?: true; video?: true }> {
  const marks: Record<number, { photo?: true; video?: true }> = {};
  getMonthContent(year, month).forEach((it) => {
    marks[it.day] = marks[it.day] || {};
    marks[it.day][it.kind] = true;
  });
  return marks;
}
