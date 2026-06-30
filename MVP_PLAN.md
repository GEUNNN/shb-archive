# MVP Plan — 햄냥이 아카이브 (Celebrity Archive)

## Stack

- **Framework**: Next.js 15 + Tailwind CSS + shadcn/ui (new-york, zinc)
- **Backend**: Supabase (PostgreSQL) — currently queried directly from Server Components; a NestJS API layer is planned (see *Planned Architecture Evolution*)
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

---

## Current State

> ✅ **MVP shipped & deployed** — [shb-archive.vercel.app](https://shb-archive.vercel.app).
> All four core routes are live with real data. Remaining items are Post-MVP enhancements.

| Feature                                          | Status            |
| ------------------------------------------------ | ----------------- |
| Mobile layout (375px shell)                      | ✅ Done           |
| Header + Footer (4-tab) navigation               | ✅ Done           |
| Diary home (ON THIS DAY + recent gallery/videos) | ✅ Done           |
| `/calendar` route — dynamic content calendar     | ✅ Done           |
| Photos page — polaroid grid + album viewer       | ✅ Done           |
| Videos page — feed + inline YouTube playback     | ✅ Done           |
| Filter logic (in-memory, Photos + Videos)        | ✅ Done           |
| Design tokens (sky-blue palette, 박다현 font)    | ✅ Done           |
| Supabase integration (real data, RLS read-only)  | ✅ Done           |
| YouTube ingest pipeline (`add-videos`)           | ✅ Done           |
| Photo → R2 ingest pipeline (`add-photos`)        | ✅ Done           |
| Search                                           | ⬜ Post-MVP       |
| Detail view (`/photos/[id]`)                     | ⬜ Post-MVP       |
| Favorites / bookmarks                            | ⬜ Post-MVP       |
| Shorts tab (`is_shorts` data layer ready)        | ⬜ Post-MVP       |

---

## Build Order (completed)

### Phase 1 — Design foundation ✅

1. Applied design tokens (color palette, `--radius: 22px`, 박다현 font)
2. Redesigned Header (mascot-pair + "SHB ARCHIVE" title)
3. Expanded Footer to 4 tabs (added `/calendar`)
4. Implemented diary home screen (DiaryOnThisDay + GalleryPreview + VideoPreview)
5. Added `/calendar` route

### Phase 2 — Data & interactivity ✅

6. Set up Supabase project + schema (`photos`, `videos`, `tags`) with RLS
7. Built ingest pipelines: `add-videos` (YouTube Data API) + `add-photos` (sharp → R2)
8. Replaced mock data with Supabase server-side queries
9. Wired filter logic on Photos + Videos pages (in-memory)
10. Wired calendar date selection → content list
11. Implemented photo lightbox + inline YouTube player overlays

### Phase 3 — Post-MVP (planned)

- Search · detail view (`/photos/[id]`) · favorites · Shorts tab
- AI를 활용한 자연어 검색 기능 (AI-powered natural-language search)
- 백엔드 API 레이어(NestJS) 도입 — see *Planned Architecture Evolution* below

---

## Planned Architecture Evolution

현재는 프론트엔드(Server Component)가 Supabase를 anon key로 **직접 쿼리**하는 구조입니다. 읽기 전용 공개 아카이브에는 충분하지만, 쓰기 작업과 비즈니스 로직이 늘어날 것을 대비해 **NestJS API 레이어를 추가**할 계획입니다.

The app currently queries Supabase **directly** from Server Components (anon key, RLS read-only). That's sufficient for a read-only public archive, but as write operations and business logic grow, a **NestJS API layer** will be introduced.

### Current

```
Next.js (Server Component) ──anon key──▶ Supabase (Postgres)
```

### Target

```
Next.js ──HTTP──▶ NestJS API ──service key──▶ Supabase (Postgres)
```

- **DB는 그대로 Supabase(Postgres) 유지** — 교체가 아니라, DB 앞에 API 레이어를 추가하는 것. NestJS에서 Prisma/TypeORM으로 연결.
- 프론트는 더 이상 DB를 직접 쿼리하지 않고 NestJS API만 호출. service key는 백엔드에만 두어 노출 위험 제거.

### Why

- **(a) 쓰기 작업 대비** — 검색·즐겨찾기·조회수 집계 등 클라이언트가 DB를 직접 건드리면 안 되는 기능을 안전하게 처리.
- **(b) 비즈니스 로직 캡슐화** — 지금 `queries.ts`에 흩어진 매핑·정렬 로직을 서버 레이어로 모아 일관성 확보.
- **(c) 데이터 로딩 방식 전환** — 현재는 개발 편의로 전체 데이터를 한 번에 받아 인메모리 필터링하지만, 데이터가 늘면 **무한 스크롤 + 서버 사이드 필터/페이지네이션**으로 전환 필요. 이 로직을 둘 위치가 API 레이어.
- **(d) AI 자연어 검색 기능** — 외부 AI API를 연동해 아카이브에 자연어로 질문하고 답을 받는 기능을 추가할 계획. (구체 설계는 추후)

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
- Duration/view-count: fetched live from the YouTube Data API at ingest (`add-videos`), formatted KR-style (`26만`). No dummy values.
