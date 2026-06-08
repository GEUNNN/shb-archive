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
