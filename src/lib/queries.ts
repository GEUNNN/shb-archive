// queries.ts — Supabase data-access for the archive.
// Fetches rows and maps DB columns back into the app's existing
// Album / Video shapes (so components stay unchanged).
//   platform/category → tag · "2025-07-02" → "2025.07.02" · films → photos

import { supabase } from "./supabase";
import { Album, Video } from "./data";

// Postgres `date` ("2025-07-02") → display format ("2025.07.02")
const toKRDate = (iso: string) => iso.replaceAll("-", ".");

// All photo posts, newest first. (Home preview slices the first few.)
export async function getAlbums(): Promise<Album[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("id, caption, date, platform, likes, ratio, films")
    .order("date", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    cap: r.caption,
    date: toKRDate(r.date),
    tag: r.platform,
    likes: r.likes,
    ratio: Number(r.ratio),
    photos: r.films ?? [],
  }));
}

// All videos, newest first.
export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("id, title, date, author, category, yt, duration, views, f")
    .order("date", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    dur: r.duration,
    date: toKRDate(r.date),
    views: r.views,
    author: r.author,
    tag: r.category,
    f: r.f,
    yt: r.yt ?? undefined,
  }));
}
