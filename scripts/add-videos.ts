// add-videos.ts — ingest YouTube videos into Supabase `videos`.
//   mode 1 (channel):  all uploads from a channel.
//   mode 2 (search):   videos matching a keyword within a channel (--search "word").
//   mode 3 (playlist): every video in a playlist (--playlist <url>).
//   mode 4 (url):      one or more individual videos by URL (--url <url>[,<url>…]).
//
// Usage:
//   yarn add-videos <@handle | channel-url | channelId> --category <카테고리>
//                   [--search "word"] [--title-match "a,b"] [--title-exclude "a,b"]
//                   [--limit N] [--since YYYY-MM-DD] [--until YYYY-MM-DD] [--dry-run]
//   yarn add-videos --playlist <url> --category <카테고리> [--dry-run]   # channel arg not needed
//   yarn add-videos --url <url>[,<url>…] --category <카테고리> [--dry-run] # one or more videos; --url repeatable
//
// --skip-existing: insert new videos only; ids already in the table are left
// untouched (ON CONFLICT DO NOTHING). Without it, a duplicate id is overwritten
// with fresh YouTube data + the given --category (resets manual category/f).
//
// Examples:
//   yarn add-videos @somechannel --category 직캠                                 # mode 1: all uploads
//   yarn add-videos @somechannel --category 직캠 --search "직캠" --dry-run        # mode 2: keyword in channel
//   yarn add-videos @somechannel --category 라이브 --since 2025-01-01 --until 2025-06-30
//   yarn add-videos @somechannel --category 비하인드 --search "behind" --title-match "behind,비하인드"
//   yarn add-videos @somechannel --category 미분류 --title-exclude "behind,비하인드"   # everything else
//   yarn add-videos --playlist "https://www.youtube.com/playlist?list=PL…" --category 브이로그 --dry-run
//   yarn add-videos --url "https://youtu.be/abc,https://youtu.be/def" --category 브이로그 --dry-run
//   yarn add-videos --backfill-shorts [--dry-run]                                  # stamp is_shorts on existing rows
//
// Shorts (is_shorts): every ingest stamps it — ≤180s videos get probed at
// youtube.com/shorts/{id} (200 = Short, redirect = not; no API quota). Use
// --backfill-shorts to (re)compute it for rows already in the table.
//
// --title-match keeps only rows whose title contains one of the (comma-separated)
// terms, case-insensitive. Bare --title-match reuses the --search term. Use it to
// trim relevance-based --search noise down to literal title hits.
// --title-exclude is the inverse: drops rows whose title contains any of the
// (comma-separated) terms. Useful for "everything except X" passes; combine with
// channel mode (no --search) to ingest the remainder without clobbering rows you
// already categorized.
//
// Env (.env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, YOUTUBE_API_KEY.
// The secret key bypasses RLS — backend only, never expose it.

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const CATEGORIES = ["뮤비", "음악방송", "직캠", "라이브", "비하인드", "자컨", "커버", "챌린지", "브이로그", "트위터", "플러스챗", "기타"] as const;
const UNCATEGORIZED = "미분류";
const YT = "https://www.googleapis.com/youtube/v3";

// ─── args ────────────────────────────────────────────────────────────────────
function parseArgs(argv: string[]) {
  const positional: string[] = [];
  let category = "";
  let limit = Infinity;
  let dryRun = false;
  let since = "";
  let until = "";
  let search = "";
  let titleMatch: string | null = null; // null = off; "" = bare flag (use --search term)
  let titleExclude = "";
  let backfillShorts = false;
  let playlist = "";
  let skipExisting = false;
  const urls: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--category") category = argv[++i] ?? "";
    else if (a === "--limit") limit = Number(argv[++i]);
    else if (a === "--since") since = argv[++i] ?? "";
    else if (a === "--until") until = argv[++i] ?? "";
    else if (a === "--search") search = argv[++i] ?? "";
    else if (a === "--playlist") playlist = argv[++i] ?? "";
    else if (a === "--url") urls.push(...(argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean));
    else if (a === "--skip-existing") skipExisting = true;
    else if (a === "--title-match") {
      const next = argv[i + 1];
      titleMatch = next && !next.startsWith("--") ? argv[++i] : ""; // optional value
    } else if (a === "--title-exclude") titleExclude = argv[++i] ?? "";
    else if (a === "--backfill-shorts") backfillShorts = true;
    else if (a === "--dry-run") dryRun = true;
    else positional.push(a);
  }
  return { channel: positional[0], category, limit, dryRun, since, until, search, titleMatch, titleExclude, backfillShorts, playlist, skipExisting, urls };
}

// playlist URL → playlist id. Accepts a full URL (…?list=PL… / …&list=PL…) or a
// bare id. Returns "" if no id can be found.
function playlistId(raw: string): string {
  const s = raw.trim();
  const m = s.match(/[?&]list=([^&]+)/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]+$/.test(s) ? s : "";
}

// video URL → 11-char video id. Accepts watch?v=…, youtu.be/…, /shorts/…,
// /embed/…, or a bare id. Returns "" if no id can be found.
function videoId(raw: string): string {
  const s = raw.trim();
  for (const re of [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /\/shorts\/([A-Za-z0-9_-]{11})/,
    /\/embed\/([A-Za-z0-9_-]{11})/,
  ]) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : "";
}

// ─── YouTube fetch helper ──────────────────────────────────────────────────────
async function yt<T = any>(
  endpoint: string,
  params: Record<string, string>,
  apiKey: string
): Promise<T> {
  const qs = new URLSearchParams({ ...params, key: apiKey });
  const res = await fetch(`${YT}/${endpoint}?${qs}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube ${endpoint} ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ─── channel input → {param} for channels.list ─────────────────────────────────
function channelParam(raw: string): { id?: string; forHandle?: string; forUsername?: string; query?: string } {
  const s = raw.trim();

  // URL forms
  const url = s.match(/youtube\.com\/(.+)/i)?.[1] ?? "";
  const chMatch = url.match(/channel\/(UC[\w-]{22})/) ?? s.match(/^(UC[\w-]{22})$/);
  if (chMatch) return { id: chMatch[1] };

  const handleUrl = url.match(/@([^/?#]+)/) ?? s.match(/^@([^/?#]+)$/);
  if (handleUrl) return { forHandle: `@${handleUrl[1]}` };

  const userUrl = url.match(/user\/([^/?#]+)/);
  if (userUrl) return { forUsername: userUrl[1] };

  const customUrl = url.match(/c\/([^/?#]+)/);
  if (customUrl) return { query: customUrl[1] };

  // bare token: try as a handle, fall back to search if it fails
  return { forHandle: `@${s.replace(/^@/, "")}`, query: s };
}

type ChannelInfo = { channelId: string; uploads: string; title: string };

async function resolveChannel(raw: string, apiKey: string): Promise<ChannelInfo> {
  const p = channelParam(raw);

  // 1) direct lookup (id / handle / username)
  for (const key of ["id", "forHandle", "forUsername"] as const) {
    if (!p[key]) continue;
    const data = await yt<any>("channels", { part: "contentDetails,snippet", [key]: p[key]! }, apiKey);
    const item = data.items?.[0];
    if (item) {
      return {
        channelId: item.id,
        uploads: item.contentDetails.relatedPlaylists.uploads,
        title: item.snippet.title,
      };
    }
  }

  // 2) fallback: search for the channel by name (100 quota units)
  if (p.query) {
    const search = await yt<any>(
      "search",
      { part: "snippet", type: "channel", q: p.query, maxResults: "1" },
      apiKey
    );
    const channelId = search.items?.[0]?.snippet?.channelId ?? search.items?.[0]?.id?.channelId;
    if (channelId) {
      const data = await yt<any>("channels", { part: "contentDetails,snippet", id: channelId }, apiKey);
      const item = data.items?.[0];
      if (item) {
        return {
          channelId: item.id,
          uploads: item.contentDetails.relatedPlaylists.uploads,
          title: item.snippet.title,
        };
      }
    }
  }

  throw new Error(`Could not resolve a channel from "${raw}".`);
}

// ─── collect every video id in the uploads playlist ────────────────────────────
async function allUploadIds(
  uploads: string,
  limit: number,
  since: string,
  until: string,
  apiKey: string
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const data = await yt<any>(
      "playlistItems",
      { part: "contentDetails", playlistId: uploads, maxResults: "50", ...(pageToken ? { pageToken } : {}) },
      apiKey
    );
    for (const it of data.items ?? []) {
      const date = (it.contentDetails.videoPublishedAt ?? "").slice(0, 10);
      if (!date) continue; // skip private/unavailable
      // uploads are newest-first → once older than `since`, the rest are too
      if (since && date < since) return ids;
      if (until && date > until) continue; // newer than the range: skip, keep paging
      ids.push(it.contentDetails.videoId);
      if (ids.length >= limit) return ids;
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return ids;
}

// ─── mode 2: search within a channel (search.list, 100 quota units/page) ───────
async function searchChannelIds(
  channelId: string,
  query: string,
  limit: number,
  since: string,
  until: string,
  apiKey: string
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  const dateParams: Record<string, string> = {};
  if (since) dateParams.publishedAfter = `${since}T00:00:00Z`;
  if (until) dateParams.publishedBefore = `${until}T23:59:59Z`; // inclusive end-of-day
  do {
    const data = await yt<any>(
      "search",
      {
        part: "snippet",
        channelId,
        q: query,
        type: "video",
        order: "date",
        maxResults: "50",
        ...dateParams,
        ...(pageToken ? { pageToken } : {}),
      },
      apiKey
    );
    for (const it of data.items ?? []) {
      const id = it.id?.videoId;
      if (!id) continue;
      ids.push(id);
      if (ids.length >= limit) return ids;
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return ids;
}

// ─── format helpers ────────────────────────────────────────────────────────────
function fmtDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = Number(m?.[1] ?? 0);
  const min = Number(m?.[2] ?? 0);
  const sec = Number(m?.[3] ?? 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(min)}:${pad(sec)}` : `${min}:${pad(sec)}`;
}

// strip the group name from titles ("[ZE_pisode] ZEROBASEONE (제로베이스원) HAN BIN …"
// → "[ZE_pisode] HAN BIN …"), then collapse leftover whitespace.
function cleanTitle(title: string): string {
  return title.replace(/ZEROBASEONE \(제로베이스원\)/g, "").replace(/\s+/g, " ").trim();
}

function fmtViews(count: string): string {
  const n = Number(count);
  if (!Number.isFinite(n)) return "0";
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1).replace(/\.0$/, "")}억`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1).replace(/\.0$/, "")}만`;
  return n.toLocaleString("ko-KR");
}

// ─── Shorts detection ──────────────────────────────────────────────────────────
const SHORTS_MAX_SECONDS = 180; // a Short is capped at 3:00

// ISO 8601 ("PT1H2M3S") → total seconds
function isoSeconds(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return Number(m?.[1] ?? 0) * 3600 + Number(m?.[2] ?? 0) * 60 + Number(m?.[3] ?? 0);
}

// display string ("1:44:43" / "2:32") → total seconds (for backfill of stored rows)
function displaySeconds(d: string): number {
  return d.split(":").map(Number).reduce((acc, n) => acc * 60 + n, 0);
}

// definitive check: /shorts/{id} serves 200 for a Short, 3xx-redirects otherwise.
// No API quota — plain HEAD request.
async function probeShorts(id: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, { method: "HEAD", redirect: "manual" });
    return res.status === 200;
  } catch {
    return false;
  }
}

// run an async fn over items with a bounded concurrency pool
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

type VideoRow = {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  yt: string;
  duration: string;
  views: string;
  f: number;
  is_shorts: boolean;
};

// ─── enrich ids → rows via videos.list (batches of 50) ─────────────────────────
async function fetchRows(ids: string[], category: string, apiKey: string): Promise<VideoRow[]> {
  const rows: (VideoRow & { _seconds: number })[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const data = await yt<any>(
      "videos",
      { part: "snippet,contentDetails,statistics", id: chunk.join(",") },
      apiKey
    );
    for (const v of data.items ?? []) {
      rows.push({
        id: v.id,
        title: cleanTitle(v.snippet.title),
        date: v.snippet.publishedAt.slice(0, 10),
        author: v.snippet.channelTitle,
        category,
        yt: v.id,
        duration: fmtDuration(v.contentDetails.duration),
        views: fmtViews(v.statistics?.viewCount ?? "0"),
        f: 0,
        is_shorts: false,
        _seconds: isoSeconds(v.contentDetails.duration),
      });
    }
  }
  // only ≤180s videos can be Shorts → probe just those
  const candidates = rows.filter((r) => r._seconds <= SHORTS_MAX_SECONDS);
  if (candidates.length) {
    await mapPool(candidates, 10, async (r) => { r.is_shorts = await probeShorts(r.yt); });
    const n = candidates.filter((r) => r.is_shorts).length;
    console.log(`📱 Shorts probe: ${n} of ${candidates.length} short candidates are Shorts.`);
  }
  return rows.map(({ _seconds, ...row }) => row);
}

// ─── backfill is_shorts for existing rows (no YouTube ingest) ──────────────────
async function backfillShortsMode(url: string, secret: string, dryRun: boolean) {
  const supabase = createClient(url, secret, { auth: { persistSession: false } });

  // page the whole table (Supabase caps each request at 1000 rows)
  const all: { id: string; yt: string | null; duration: string }[] = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await supabase
      .from("videos")
      .select("id, yt, duration")
      .range(from, from + size - 1);
    if (error) throw new Error(`Supabase select failed: ${error.message}`);
    all.push(...(data ?? []));
    if (!data || data.length < size) break;
  }
  console.log(`📚 ${all.length} videos in table.`);

  // a Short must be ≤180s and have a YouTube id to probe
  const candidates = all.filter((r) => r.yt && displaySeconds(r.duration) <= SHORTS_MAX_SECONDS);
  console.log(`⏱️  ${candidates.length} are ≤${SHORTS_MAX_SECONDS}s with a YouTube id → probing /shorts.`);

  const probed = await mapPool(candidates, 10, async (r) => ({ id: r.id, short: await probeShorts(r.yt!) }));
  const shortIds = probed.filter((p) => p.short).map((p) => p.id);
  console.log(`📱 ${shortIds.length} detected as Shorts.`);

  if (dryRun) {
    console.log("\n💡 --dry-run: nothing written. Re-run without --dry-run to update.");
    return;
  }

  for (let i = 0; i < shortIds.length; i += 200) {
    const batch = shortIds.slice(i, i + 200);
    const { error } = await supabase.from("videos").update({ is_shorts: true }).in("id", batch);
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
  }
  console.log(`✅ Set is_shorts = true on ${shortIds.length} videos (the rest stay false).`);
}

// ─── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const { channel, category, limit, dryRun, since, until, search, titleMatch, titleExclude, backfillShorts, playlist, skipExisting, urls } = parseArgs(process.argv.slice(2));

  // backfill mode: recompute is_shorts for rows already in the table (no YouTube ingest).
  if (backfillShorts) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secret) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
    return backfillShortsMode(url, secret, dryRun);
  }

  // --url / --playlist source ids directly, so a channel arg isn't required
  // in those modes.
  const videoIds = urls.map((u) => {
    const id = videoId(u);
    if (!id) throw new Error(`Could not find a video id in "${u}". Pass a watch/youtu.be/shorts URL or a bare id.`);
    return id;
  });
  const pl = playlist ? playlistId(playlist) : "";
  if (playlist && !pl) {
    throw new Error(`Could not find a playlist id in "${playlist}". Pass a URL with ?list=… or a bare id.`);
  }
  if (!channel && !pl && videoIds.length === 0) {
    throw new Error('Missing source. Usage: yarn add-videos <@handle|url|channelId> --category <카테고리>  (or --playlist <url>, or --url <video-url>)');
  }
  // category is written to the DB (NOT NULL). Omit it to store rows as "미분류"
  // (uncategorized) and fix them later in the Supabase table editor.
  const finalCategory = category || UNCATEGORIZED;
  if (![...CATEGORIES, UNCATEGORIZED].includes(finalCategory as any)) {
    throw new Error(`--category must be one of: ${CATEGORIES.join(", ")} (or omit for "${UNCATEGORIZED}")  (got: "${category}")`);
  }
  const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  if (since && !isDate(since)) throw new Error(`--since must be YYYY-MM-DD (got: "${since}")`);
  if (until && !isDate(until)) throw new Error(`--until must be YYYY-MM-DD (got: "${until}")`);

  // --title-match: keep only rows whose title contains one of these terms
  // (case-insensitive). Bare --title-match reuses the --search term; pass a
  // comma list to add variants, e.g. --title-match "behind,비하인드".
  const matchTerms =
    titleMatch === null
      ? []
      : (titleMatch || search).split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (titleMatch !== null && matchTerms.length === 0) {
    throw new Error('--title-match needs a term: pass --search "word" or --title-match "a,b".');
  }
  // --title-exclude: drop rows whose title contains any of these terms (comma list).
  const excludeTerms = titleExclude
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
  if (!SUPABASE_URL || !SUPABASE_SECRET) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  if (!YOUTUBE_KEY) throw new Error("Missing YOUTUBE_API_KEY in .env.local");

  const range = since || until ? ` in ${since || "…"} ~ ${until || "…"}` : "";
  let rawIds: string[];
  if (videoIds.length) {
    // url mode: the ids are given directly; fetchRows enriches them.
    console.log(`🔗 ${videoIds.length} video URL(s).`);
    rawIds = videoIds;
  } else if (pl) {
    // playlist mode: read the playlist directly (allUploadIds is a generic
    // playlist reader — uploads is just one kind of playlist).
    console.log(`🎞️  Playlist: ${pl}`);
    rawIds = await allUploadIds(pl, limit, since, until, YOUTUBE_KEY);
  } else {
    const ch = await resolveChannel(channel, YOUTUBE_KEY);
    console.log(`📺 Channel: ${ch.title}  (${ch.channelId})`);
    rawIds = search
      ? await searchChannelIds(ch.channelId, search, limit, since, until, YOUTUBE_KEY)
      : await allUploadIds(ch.uploads, limit, since, until, YOUTUBE_KEY);
  }
  // search.list can return the same id across pages — dedupe so the upsert
  // batch never references one row twice ("cannot affect row a second time").
  const ids = [...new Set(rawIds)];
  const what = videoIds.length ? "videos" : pl ? "playlist videos" : search ? `videos matching "${search}"` : "uploads";
  console.log(`🔎 Found ${ids.length} ${what}${range}${Number.isFinite(limit) ? ` (limited to ${limit})` : ""}.`);

  let rows = await fetchRows(ids, finalCategory, YOUTUBE_KEY);
  if (matchTerms.length) {
    const before = rows.length;
    rows = rows.filter((r) => matchTerms.some((t) => r.title.toLowerCase().includes(t)));
    console.log(`🔤 Title filter [${matchTerms.join(", ")}]: kept ${rows.length}/${before}.`);
  }
  if (excludeTerms.length) {
    const before = rows.length;
    rows = rows.filter((r) => !excludeTerms.some((t) => r.title.toLowerCase().includes(t)));
    console.log(`🚫 Title exclude [${excludeTerms.join(", ")}]: kept ${rows.length}/${before}.`);
  }
  console.log(`🎬 Prepared ${rows.length} rows · category "${finalCategory}".`);

  if (dryRun) {
    rows.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.date} · ${r.duration} · ${r.views}회${r.is_shorts ? " · 📱 Shorts" : ""}`);
      console.log(`   ${r.title}`);
      console.log(`   https://youtu.be/${r.yt}`);
    });
    console.log("\n💡 --dry-run: nothing written. Re-run without --dry-run to upsert.");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET, { auth: { persistSession: false } });

  let written = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    // --skip-existing → ON CONFLICT DO NOTHING: new rows inserted, existing ids
    // left exactly as they are in the table (category, f, etc. preserved).
    const { error } = await supabase
      .from("videos")
      .upsert(batch, { onConflict: "id", ignoreDuplicates: skipExisting });
    if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
    written += batch.length;
  }
  console.log(
    skipExisting
      ? `✅ Inserted new videos; existing ids left untouched (${written} in batch).`
      : `✅ Upserted ${written} videos into Supabase.`
  );
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`);
  process.exit(1);
});
