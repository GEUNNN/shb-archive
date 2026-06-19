# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # start dev server with Turbopack
yarn build      # production build
yarn lint       # ESLint via next lint

yarn add-photos <folder…> --platform <인스타그램|트위터|플러스챗> [--url "<post link>"]  # ingest photos → R2 + Supabase
yarn add-videos …                                                                      # ingest YouTube videos → Supabase
```

No test suite is configured.

## Deployment

- **Hosted on Vercel.** Production branch = `main`; every push to `main` auto-builds and deploys (CI/CD, no config files needed). Non-`main` branches get preview deploys.
- **Release flow:** work on `develop` → merge `develop` → `main` locally → push `main` → Vercel auto-deploys. Keep `develop` and `main` in sync.
- **`next` is pinned to an exact version (`15.3.9`), not a range.** Vercel blocks builds on Next.js versions with critical security advisories (15.1.6 was blocked). When bumping, move to a patched release and re-run `yarn build` locally first; never downgrade.
- Runtime env vars must be set in the Vercel dashboard (Settings → Environment Variables, Production scope) — see the env list under Architecture. Script-only secrets must **not** be added to Vercel.
- Custom domain, when wanted: Vercel → Settings → Domains.

## Architecture

**Next.js 15 App Router** mobile-first celebrity archive (375px fixed-width layout).

**Layout shell** (`src/app/layout.tsx`): fixed Header (55px top) + fixed Footer (64px bottom) with a scrollable `<main>` absolutely positioned between them. The entire app is centered and capped at `w-[375px]`.

**Routes**

- `/` → `src/app/page.tsx` → renders `HomeMain` which shows a calendar with photo/video date dots
- `/photos` → `src/app/photos/page.tsx` — photo grid with Swiper carousel per item; filter badges at sticky top
- `/videos` → `src/app/videos/page.tsx` — video thumbnail grid; filter badges at sticky top
- `/calendar` → `src/app/calendar/page.tsx` — calendar view (renders calendar with photo/video date dots or dedicated calendar UI)

**Data flow (live):** Supabase (PostgreSQL) is the backend. Server Components fetch via `src/lib/queries.ts` (`getAlbums` / `getVideos`), which map DB columns onto the `Album` / `Video` types in `src/lib/data.ts`, then pass the full dataset to Client Components that filter in-memory via `useState` (no re-queries on filter change). The `/photos` and `/videos` pages use ISR (`export const revalidate = 60`). The Supabase client (`src/lib/supabase.ts`) uses the public anon key (read-only via RLS — public `SELECT` must stay enabled on `photos`/`videos`).

**Photo hosting:** real images live on **Cloudflare R2**, not Supabase Storage; `photos.images` holds R2 URLs. `photos.source_url` holds the original post link (트위터/인스타그램), surfaced as a clickable X/Instagram logo in `AlbumViewer`.

**Env vars — runtime (set in BOTH `.env.local` and Vercel, Production scope):**

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GA_ID              # optional; GA renders only in production when set
```

**Env vars — local / ingest-script only (NEVER in Vercel, never `NEXT_PUBLIC_`, never commit):** `SUPABASE_SECRET_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE`, `YOUTUBE_API_KEY` — used by `yarn add-photos` / `yarn add-videos`, run from your machine. DB edits / recategorization are done at the Supabase SQL level, not via the front-end.

**UI components:** shadcn/ui (`new-york` style, `zinc` base color) under `src/components/ui/`. Add new shadcn components with `npx shadcn@latest add <component>`.

**Accent color:** `#F09884` (salmon/pink) — used on filter badges and Swiper pagination.

**Images:** `next/image` with remote patterns configured in `next.config.ts` for `i.ytimg.com`, `pbs.twimg.com`, `i.namu.wiki`, `talkimg.imbc.com`, and `**.r2.dev` (Cloudflare R2 photo host). Add new domains there before using external image URLs.

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

- `photos` (filter = `platform`; `images` = R2 URLs; `source_url` = original post link) · `videos` (filter = `category`, `yt` = YouTube ID, `is_shorts` flag) · `tags` (filter-option master). No table for person profile (hardcode in components).
- `Film` (`src/components/diary/Film.tsx`) renders gradient placeholders (`FILMS` in `src/lib/data.ts`) used as a fallback when a row has no real `images`; real images render via `next/image`.
