// calendar.ts — month-scoped content for the /calendar route, from Supabase.
// getMonthContent(year, month) queries an exact year-month date range over
// photos + videos and merges them into a discriminated DayItem[]. The page
// caches each fetched month client-side so month-nav stays instant.

import { supabase } from "./supabase";
import { Video } from "./data";

const pad = (n: number) => String(n).padStart(2, "0");
const toKRDate = (iso: string) => iso.replaceAll("-", ".");

// "2025.07.02" → { y: 2025, m: 7, d: 2 }
export function parseDateKR(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = s.split(".").map(Number);
  return { y, m, d };
}

export type DayItem =
  | { kind: "photo"; day: number; date: string; title: string; tag: string; f: number; src?: string; likes: number }
  | { kind: "video"; day: number; date: string; title: string; tag: string; f: number; dur: string; views: string; ref: Video };

// Uploads in [year-month-01, next-month-01), newest day first.
export async function getMonthContent(year: number, month: number): Promise<DayItem[]> {
  const start = `${year}-${pad(month)}-01`;
  const next = new Date(year, month, 1); // month is 1-indexed → this is the 1st of next month
  const end = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-01`;

  const [photosRes, videosRes] = await Promise.all([
    supabase.from("photos").select("id, caption, date, platform, likes, films, images").gte("date", start).lt("date", end),
    supabase.from("videos").select("id, title, date, author, category, yt, duration, views, f, is_shorts").gte("date", start).lt("date", end),
  ]);
  if (photosRes.error) throw photosRes.error;
  if (videosRes.error) throw videosRes.error;

  const list: DayItem[] = [];

  (photosRes.data ?? []).forEach((r) => {
    list.push({
      kind: "photo",
      day: Number(r.date.slice(8, 10)),
      date: toKRDate(r.date),
      title: r.caption,
      tag: r.platform,
      f: (r.films ?? [])[0] ?? 0,
      src: (r.images ?? [])[0],
      likes: r.likes,
    });
  });

  (videosRes.data ?? []).forEach((r) => {
    const ref: Video = {
      id: r.id,
      title: r.title,
      dur: r.duration,
      date: toKRDate(r.date),
      views: r.views,
      author: r.author,
      tag: r.category,
      f: r.f,
      yt: r.yt ?? undefined,
      isShorts: r.is_shorts ?? false,
    };
    list.push({
      kind: "video",
      day: Number(r.date.slice(8, 10)),
      date: toKRDate(r.date),
      title: r.title,
      tag: r.category,
      f: r.f,
      dur: r.duration,
      views: r.views,
      ref,
    });
  });

  return list.sort((a, b) => b.day - a.day);
}

// Pure: derive cell dots from already-fetched items (no extra query).
// Replaces the old marksForMonth — the page passes its cached month in.
export function marksFromItems(items: DayItem[]): Record<number, { photo?: true; video?: true }> {
  const marks: Record<number, { photo?: true; video?: true }> = {};
  items.forEach((it) => {
    marks[it.day] = marks[it.day] || {};
    marks[it.day][it.kind] = true;
  });
  return marks;
}
