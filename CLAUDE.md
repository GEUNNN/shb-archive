# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev      # start dev server with Turbopack
yarn build    # production build
yarn lint     # ESLint via next lint
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** mobile-first celebrity archive (375px fixed-width layout).

**Layout shell** (`src/app/layout.tsx`): fixed Header (55px top) + fixed Footer (64px bottom) with a scrollable `<main>` absolutely positioned between them. The entire app is centered and capped at `w-[375px]`.

**Routes**

- `/` → `src/app/page.tsx` → renders `HomeMain` which shows a calendar with photo/video date dots
- `/photos` → `src/app/photos/page.tsx` — photo grid with Swiper carousel per item; filter badges at sticky top
- `/videos` → `src/app/videos/page.tsx` — video thumbnail grid; filter badges at sticky top
- `/calendar` → `src/app/calendar/page.tsx` — calendar view (renders calendar with photo/video date dots or dedicated calendar UI)

**Data pattern (current state):** all data is hardcoded mock arrays inside the page files. Filter badges exist in the UI but filtering logic is not yet wired up — badge `onClick` only `console.log`s.

**Planned backend:** Supabase (PostgreSQL). Required env vars when integrating:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Planned data flow: Server Components fetch from Supabase → pass full dataset to Client Component → in-memory filter via `useState` (no re-queries on filter change).

**UI components:** shadcn/ui (`new-york` style, `zinc` base color) under `src/components/ui/`. Add new shadcn components with `npx shadcn@latest add <component>`.

**Accent color:** `#F09884` (salmon/pink) — used on filter badges and Swiper pagination.

**Images:** `next/image` with remote patterns configured in `next.config.ts` for `i.ytimg.com`, `pbs.twimg.com`, `i.namu.wiki`, `talkimg.imbc.com`. Add new domains there before using external image URLs.

**Font:** Pretendard variable font loaded as a local font via `next/font/local`.

**Footer navigation** (`src/app/components/Footer.tsx`): uses SVG icons from `public/assets/` — each nav item has two variants: `{icon}.svg` and `{icon}-selected.svg`.

## SHB ARCHIVE — Design Rules

> Fan-original archive app. Concept = fresh sky-blue (cheongryang) + coral accent + Ham-Nyang mascots (hamster/cat) + diary/scrapbook tone (handwriting · masking tape).

### Top principle

- **Design fidelity > existing implementation.** If a screen differs from the design, change the existing markup/styles/components to match the design.
- **But edit/delete only within the scope you're allowed to.** Confirm first for any area where rights are unclear.
- **Keep the technical foundation**: Next.js 15 (App Router) · 375px fixed shell (Header 55 / Footer 64 / scrollable main) · shadcn (new-york, zinc) · Swiper · Pretendard (next/font/local) · next/image · Supabase.

### Color tokens (override on top of shadcn zinc)

```
bg #eaf6ff · surface #ffffff · primary #4fb0ef · primaryDeep #2c87cf
soft #cfeaff · ink #173a52 · sub #6b8aa3 · accent #ffe08a
coral #F09884 (signature) · coralSoft #ffe2da
```

- coral `#F09884` = hearts · badges · masking tape · stamps · video dot. Use zinc neutrals only for borders/placeholders.

### Typography

- **Body = Pretendard** (almost all text). **Do NOT switch body to handwriting.**
- **Accents = Ownglyph 박다현 (`OngleipParkDahyeon`)** — only titles · screen titles · diary years · polaroid captions · large dates · card titles.
- **Mono** = uppercase EN labels (ON THIS DAY/PHOTO/VIDEO) · date meta. (`ui-monospace`, letter-spacing 2px, 10–10.5px, coral/primary)
- Decorative handwriting (Parisienne) = one line in the home footer only. Body `word-break:keep-all`, header title `white-space:nowrap`.

### Shape

- radius: card 22px (= shadcn `--radius`), chips/filters ~20px, polaroid 2–4px.
- shadow: card `0 12px 30px rgba(80,140,200,.16)`. Side padding 18px. Hit target ≥44px.

### Structure (4 routes)

- `/` = diary home · `/calendar` (★new) · `/photos` · `/videos`. Tab switch = routing (`next/link` + `usePathname`).
- Shared 375px shell in `(app)/layout`. Active TabBar icon = `{icon}-selected.svg`.
- **MVP**: filters (in-memory) · calendar → that date's content · Supabase · diary home · /calendar ✅ / search · detail view `/photos/[id]` · favorites ❌ (Post-MVP). Photo/video click = overlay (lightbox/player).

### Screen essentials

- **Home**: ① ON THIS DAY "N years ago today" (taped polaroids) → ② recent photos → ③ recent videos (Swiper horizontal) → footer (MascotDuo + "Don't regret what you do").
- **Photos**: filter = source platform (All/Instagram/Twitter/Plus Chat). Multi-photo post = stacked polaroids, click → AlbumViewer (Swiper).
- **Videos**: filter = category (All/Music show/Fancam/Live/Behind/Self-content). Taped polaroid card, click → inline YouTube playback (`i.ytimg.com` thumbnail, prefer `lite-youtube-embed`/`@next/third-parties`; internal UI not customizable). Card = title (박다현) + date (mono) + author (Pretendard).
- **Calendar**: dynamic from `new Date()` (no hardcoding). Dot blue = photo / coral = video. Today = coral ring, selected-day color `#f9cdbf`. **In diary mode the grid (numbers · weekday · legend) is 박다현 handwriting.** Default selection = today; empty-state line + mascot.

### Mascots (use actively: header · empty states)

- `public/mascots/`: `mascot-hamster.png` (cream) · `mascot-cat.png` (gray) · `mascot-pair.png` (header, no blush) · `mascot-bodies.png` (home footer). `next/image`/`<img>` with height set, width auto.

### Data (Supabase)

- `photos` (filter = `platform`) · `videos` (filter = `category`, `yt` = YouTube ID) · `tags` (filter-option master). No table for person profile (hardcode in components).
- The `Film` slots in prototype `source/data.jsx` = empty frames for real images → replace with `next/image`.
