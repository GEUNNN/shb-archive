# MVP Plan — 햄냥이 아카이브 (Celebrity Archive)

## Stack

- **Framework**: Next.js 15 + Tailwind CSS + shadcn/ui (new-york, zinc)
- **Backend**: Supabase (PostgreSQL + auto REST API) — final backend, no migration needed
- **Data fetching**: Server Components fetch from Supabase → pass full dataset to Client Component → in-memory filter via `useState`
- **Design**: Diary/scrapbook tone — sky-blue + coral `#F09884` + Ham-Nyang mascots (🐹/🐱)

## Routes (4)

```
/             Home — diary (ON THIS DAY + recent gallery + recent videos)
/calendar     ★NEW — content archive calendar with photo/video dots
/photos       Photos — stacked polaroid grid, filter by source platform
/videos       Videos — video diary feed, filter by category
```

## Supabase Tables

- `photos` — `id, caption, date, platform(tag: Instagram/Twitter/Plus Chat), ratio, likes, image_urls[]`
- `videos` — `id, title, date, author, category(tag: music show/fancam/live/behind/self-content), yt(YouTube ID), duration, views`
- `tags` — filter-option master (photo platform tags + video category tags)

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## MVP Scope

| Feature                                                            | Status      |
| ------------------------------------------------------------------ | ----------- |
| Diary home (ON THIS DAY + recent gallery + recent videos)          | ✅ In MVP   |
| `/calendar` route — content archive calendar                       | ✅ In MVP   |
| Calendar date select → that day's content list                     | ✅ In MVP   |
| Working filter logic — Photos (by platform) + Videos (by category) | ✅ In MVP   |
| Photo/video click → overlay (lightbox / inline player)             | ✅ In MVP   |
| Supabase integration (replace mock data)                           | ✅ In MVP   |
| Search                                                             | ❌ Post-MVP |
| Individual detail view (`/photos/[id]`)                            | ❌ Post-MVP |
| Favorites / bookmarks                                              | ❌ Post-MVP |
| Schedule / Events page                                             | ❌ Post-MVP |
| Profile / About page                                               | ❌ Post-MVP |
| Discography page                                                   | ❌ Post-MVP |

---

## Current State

| Feature                                        | Status            |
| ---------------------------------------------- | ----------------- |
| Mobile layout (375px)                          | ✅ Done           |
| Header + Footer (3-tab) navigation             | ✅ Done           |
| Photos page — carousel + filter badge UI       | ✅ Done           |
| Videos page — thumbnail grid + filter badge UI | ✅ Done           |
| Diary home screen                              | ❌ Not started    |
| `/calendar` route                              | ❌ Not started    |
| Filter logic (actual filtering behavior)       | ❌ Not connected  |
| Design tokens (sky-blue palette, 박다현 font)  | ❌ Not applied    |
| Real data / Supabase integration               | ❌ Mock data only |

---

## Build Order

### Phase 1 — Design foundation

1. Apply design tokens (color palette, `--radius: 22px`, 박다현 font)
2. Redesign Header (mascot-pair + "SHB ARCHIVE" title)
3. Expand Footer to 4 tabs (add `/calendar`)
4. Implement diary home screen (DiaryOnThisDay + GalleryPreview + VideoPreview)
5. Add `/calendar` stub route

### Phase 2 — Data & interactivity

6. Set up Supabase project + define schema (`photos`, `videos`, `tags`)
7. Seed real data into Supabase
8. Replace mock data with Supabase server-side queries
9. Wire filter logic on Photos + Videos pages
10. Wire calendar date selection → content list
11. Implement photo lightbox + inline video player overlays

---

## Filter Architecture (decided)

- Filter state: `useState` in Client Component
- Filter behavior: in-memory array filter on the full dataset (no re-queries)
- **Photos**: filter by `platform` — 전체 / 인스타그램 / 트위터 / 플러스챗
- **Videos**: filter by `category` — 전체 / 음악방송 / 직캠 / 라이브 / 비하인드 / 자컨
- Works well for archive scale (< 500 items per page)

## Calendar Architecture (decided)

- Dedicated `/calendar` route (standalone page, not a home widget)
- Dynamic from `new Date()` — no hardcoded dates
- Dots: blue = photo, coral = video; both = two dots side by side
- Today = coral ring; selected day = pastel coral bg `#f9cdbf`
- Default selection = today; empty state shows mascot illustration
- Month nav (‹ ›) with `{y, m}` state — safe across year boundaries

## Video Playback (decided)

- YouTube thumbnail via `next/image` using `i.ytimg.com` (already an allowed remote host)
- Click → replace thumbnail slot with `<iframe autoplay=1>` (no card size change)
- Prefer `@next/third-parties` `<YouTubeEmbed>` or `lite-youtube-embed`
- Duration/view-count: dummy values for now; server-prefetch via YouTube Data API as follow-up
