# Handoff: SHB (SEONG HANBIN) ARCHIVE — for the `햄냥이 아카이브` repo

> **This is not a generic guide. It is a work order for layering this design onto the repo you already have (`햄냥이 아카이브` / "Ham-Nyang-i Archive").**
> Don't pick a new stack — keep the repo's **technical foundation** (§2 below) as-is, and **faithfully** layer this visual/structure on top.
> Need the generic Next.js version? See `README_generic-nextjs.md` in this folder. (This document is the latest / source of truth.)
> Korean version: `README.ko.md` (kept in sync with this English document).

> ### ★ TOP PRINCIPLE — Design fidelity first
> **The goal is to implement this design pixel-close, as-is.** Where an existing screen differs from the design, **feel free to edit or rip out existing code — but ONLY where you have permission to modify/delete it.** Do not compromise the design to preserve existing markup/styles/components — the priority is always **design > existing implementation**. For any area where you do NOT have modify/delete rights, confirm and get approval first before proceeding.
> - **Keep (infrastructure foundation)**: the technical decisions in §2 — Next.js · 375px shell · shadcn base · Swiper · Pretendard · next/image · Supabase. These are a "what do we build with" question, so leave them alone.
> - **Freely edit/rewrite (screen presentation)**: layout, markup, CSS, component structure of existing pages. **Within the scope you're allowed to modify/delete**, rewriting/replacing/deleting to match the design is OK. shadcn components too — override or customize color/radius/font/structure to fit the design.
> - In other words, the "Design notes" column in the §2 table means *"express it this way on top of this foundation,"* not *"don't touch existing screens."*

---

## 0. One-line summary
A **fan-original archive** mobile web app for K-pop artist **SHB (SEONG HANBIN)**. "A place to gather and look back at past things" = a pure archive. Identity = **fresh/airy sky-blue (cheongryang) + coral accent `#F09884` + Ham-Nyang mascots (hamster 🐹 / cat 🐱) + diary/scrapbook tone (handwriting · masking tape)**.

> ⚠️ Not a copy of any official agency logo/UI — **fan-original concept**. Photos/videos are dummy placeholders (to be swapped for real data). A person's profile (birthday/height etc.) is NOT kept as a data model — it's hardcoded in components.

### Feasibility — **this design is 100% reproducible on the repo stack as-is** ✅
No new tech needed; everything is built with plain CSS + fonts + PNG + Swiper + next/image. Diary/tape/handwriting/mascot/coral are all standard techniques. Three **real-world constraints** to know up front (not blockers, just adjustment points):
1. **375px width** — the prototype mockup is 402px, so it's not a pixel copy but a **re-flow at the same proportions** (keep 18px side padding, content width ≈ 339px). Only nudge masonry/card spacing.
2. **Header 55px is tight** — keep header mascots ~28–32px. Just manage size so they fit alongside the title (박다현).
3. **YouTube's internal player UI is not customizable** — you can't change what's inside the iframe (playback controls). **Only design the frame (taped polaroid), thumbnail, and surroundings.** (Same YouTube policy constraint on any stack.)

Beyond that, just load the 박다현 font (`next/font/local`) and swap Film → real images, and it matches the screenshots.

---

## 1. What was decided in this handoff (kickoff answers → work direction)
This table turns your (the user's) answers directly into work instructions. **This is the heart of the document.**

| # | Topic | Decision | Implementation meaning |
|---|---|---|---|
| ① | **Visual intensity** | **Full apply** | **Replace existing screens entirely with handwriting · masking tape · mascots · coral.** Not "a light accent" — make the diary/scrapbook tone the baseline of every screen. |
| ② | **Font strategy** | **박다현 handwriting on titles/accents only; body stays Pretendard** | Keep the repo's Pretendard (next/font/local) as the body font. Add **Ownglyph 박다현** on top, only on accents like titles/years/captions. (The generic README's "swap body to summer mood too" is **NOT applied**.) |
| ③ | **Mascot usage** | **Use actively** | Place mascots in the Header (the 55px area) and in **empty states**. Not overly decorative, but present throughout. |
| ④ | **Structure** | **Expand to 4 routes** | Home = diary, **add new `/calendar`**, keep existing `/photos` · `/videos`. → **MVP_PLAN needs revision** (§3). |
| ⑤ | **Diary home composition** | **Both: top "On this day, N years ago" + bottom recent uploads** | Home = ① ON THIS DAY reminiscence feed (top) + ② recent photos/videos (bottom). Include both. |
| ⑥ | **Deliverable** | **Repo-specific handoff (this document)** | + On request, a design-rules snippet to paste into `CLAUDE.md` can be provided. |

---

## 2. The repo's technical foundation — **keep** (layer design on top)
This is the **infrastructure** the design sits on. Keep the "what we build with" below, but **freely edit how the screen looks (markup/style/component structure) to match the design** (see §0 top principle). The "Design notes" column is presentation guidance on top of this foundation.

| Area | Repo status | Design notes |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Tabs = routes (§3). |
| Layout width | **375px fixed** · **Header 55px / Footer 64px / scrollable main in the middle** | Match the design to this 3-band shell. Keep header/footer heights fixed. |
| UI kit | **shadcn/ui (style: new-york, base color: zinc)** | Use shadcn components (Button/Sheet/Dialog etc.) as a base, but **override color/radius/font with the tokens below**. Lay coral/sky accents over the zinc neutrals. |
| Carousel | **Swiper** | **Anything you swipe left/right = Swiper**: ① **Photos tab AlbumViewer** (multiple shots within one post, ‹›/dots) ② **Home "recent videos" horizontal scroll** (free-mode) ③ (optional) Home "recent gallery" horizontal preview · PhotoLightbox left/right swipe. |
| Fonts | **Pretendard** (`next/font/local`) | **Body = keep Pretendard.** Additionally load **박다현** for titles/accents (§4.2). |
| Images | **`next/image`**, allowed remote hosts = `i.ytimg.com`, `pbs.twimg.com`, `i.namu.wiki`, `talkimg.imbc.com` | Replace placeholder (Film) slots with real images from these hosts. **A new host requires adding it to `next.config` remotePatterns.** |
| Footer/tab icons | **SVG icon convention**: `{icon}.svg` / `{icon}-selected.svg` (separate file for selected state) | Toggle TabBar active/inactive via the two files. Export new design icons with this naming too. |
| Data | **Supabase** — tables `photos` / `videos` / `tags` (currently mock) | See §8 for the data model mapping. Screens read from these 3 tables. |
| Accent | **`#F09884`** (same in repo and design) | Signature coral. Use as-is. |

---

## 3. Route structure & MVP change (per ④)
**Expand to 4 routes → existing MVP_PLAN needs revision.**

```
app/
  layout.tsx                 // <html lang="ko"> + Pretendard/박다현 fonts, global tokens (CSS vars/Tailwind)
  (app)/layout.tsx           // 375px shell: Header(55) + scrollable main + Footer/TabBar(64) — shared by 4 routes
  (app)/page.tsx             // Home = diary (route: / )
  (app)/calendar/page.tsx    // ★NEW: Calendar (route: /calendar )
  (app)/photos/page.tsx      // Photos (route: /photos )  ← not /gallery; follow repo naming
  (app)/videos/page.tsx      // Videos (route: /videos )
```

- **Tab switching = routing.** TabBar navigates with `next/link`, determines active tab via `usePathname()`. Active icon = `{icon}-selected.svg`.
- **TabBar 4 cells: Home / Photos / Videos / Calendar.** Lay out within the 64px Footer.
- **MVP scope (revised):**
  - ✅ **In MVP**: filter logic (in-memory), **calendar tab → jump to that date's content**, Supabase integration, **diary home**, **new `/calendar` route**.
  - ❌ **Post-MVP**: search, **detail view `/photos/[id]`**, favorites.
    - Since the detail view is out of MVP, **photo/video click = overlay (lightbox/player)**. If sharing/deep links become needed, promote to a "modal route with a URL" (intercepting routes).
  - → **Update `MVP_PLAN.md` accordingly**: (a) routes 3→4 (add `/calendar`), (b) home from a plain list → diary (ON THIS DAY + recent).

---

## 4. Design tokens (layer onto the repo)

### 4.1 Color — override on top of shadcn (zinc)
Final palette = `sky` + coral accent. Put into Tailwind `theme.extend.colors` or CSS variables.

| Token | HEX | Use |
|---|---|---|
| `bg` | `#eaf6ff` | App background (light sky). 375px shell bg. |
| `surface` | `#ffffff` | Cards / surfaces |
| `primary` | `#4fb0ef` | Sky accent — active tab/filter, links, photo dot |
| `primaryDeep` | `#2c87cf` | Deep accent — diary year / subheads |
| `soft` | `#cfeaff` | Light chip background |
| `ink` | `#173a52` | Body/title text |
| `sub` | `#6b8aa3` | Secondary text (dates · meta) |
| `accent` | `#ffe08a` | Yellow (stars · small accents) |
| **`coral`** | **`#F09884`** | **Signature** — hearts, D-day/badges, masking tape, stamps, video dot (same as repo accent) |
| `coralSoft` | `#ffe2da` | Light paper tone for coral chips/tape |

> Keep shadcn zinc neutrals only for secondary use (borders · placeholders), and **override surfaces/accents with the tokens above**. Map these onto shadcn CSS vars (`--background/--primary/--ring`, etc.) and components will follow naturally.

### 4.2 Typography — Pretendard (body) + 박다현 (accents) (per ②)
- **Body = Pretendard** (keep the repo's `next/font/local`). Almost all text.
- **Accents = Ownglyph 박다현 (`OngleipParkDahyeon`)** — only on **titles / screen titles / diary years / polaroid captions / large dates**. Add the 박다현 font file via `next/font/local` (or `@font-face` CDN if unavailable).
- **Mono**: `ui-monospace, monospace` — uppercase EN labels (`ON THIS DAY`, `PHOTO`, `VIDEO`), date meta. `letter-spacing:2px; font-weight:700; font-size:10–10.5px`, color coral or primary.
- **Decorative handwriting (sparingly)**: Parisienne — only the home footer "Don't regret what you do". Optional (fall back to 박다현 if missing).
- Body `word-break: keep-all`, header title `white-space: nowrap`.

> ⚠️ The crux of ②: **do NOT switch body text to handwriting.** Pretendard carries legibility; 박다현 is only the accent that delivers the "summer diary" feel.

**Font distribution — real on-screen examples (already applied in the prototype)**

| 박다현 (`--fdisplay`, handwriting) | Pretendard (`--fbody`, body) | Mono |
|---|---|---|
| Screen titles (성한빈) · large date (6월 4일) · diary years (2025/2024/2023) · memory titles · "한빈이의 앨범/사진첩" · gallery/video card titles | "다시 보는 오늘" subtitle · "N년 전 오늘" · "#tag" chips · video author · gallery caption overlay · filter chips · tab labels · empty-state text | EN labels (ON THIS DAY/PHOTO) · dates (2025.06.04) |

### 4.3 Radius / shadow / spacing
- **radius**: cards/surfaces **22px**, chips/filters ~20px (near pill), polaroid photos 2–4px. (Set shadcn `--radius` to 22px.)
- **shadows**: card `0 12px 30px rgba(80,140,200,0.16)` · small card `0 6–9px 17–22px rgba(80,140,200,0.2)` · active chip `0 4px 12px rgba(80,150,210,0.3)`.
- **horizontal padding**: 18px on each side (content width ≈ 339px at 375px).
- spacing: near multiples of 8 (mix of 6/9/12/14/16/22/26px).

---

## 5. Screens (FINAL = diary-based, full apply)
Screenshots: `screenshots/01-home-diary.png` … `04-calendar-diary.png`. (Prototype is a 402px mockup, but **build to the 375px shell** in the repo at the same proportions.)

### Common shell (375 / Header 55 / Footer 64)
- **Header (55px, sticky)**: left = `MascotPair` (hamster+cat sticker ~30px) + screen title (박다현). Small EN label above. Right = per-screen mascot/action. Title `nowrap`. (Header 55px is tight, so mascots ~28–32px.)
- **TabBar (64px, fixed bottom)**: Home/Photos/Videos/Calendar. Active = `{icon}-selected.svg` + primary. On route change, scroll main to top.
- **`Film` = photo/video placeholder (must understand)**: since there are no real images yet, it lays a **fresh gradient rectangle + glyph (☁️ photo / 📷 video)** wherever media goes. Reused for both photos and videos to unify tone. **When real data arrives, replace this slot with `next/image` (remote host).** Videos v1·v2 already use real YouTube thumbnails (§7).

### 5.1 Home `/` — diary (⑤: top "N years ago today" + bottom recent, both)
Vertical scroll. **① ON THIS DAY reminiscence → ② recent photos → ③ recent videos → footer.**

- **① DiaryOnThisDay (the centerpiece)**: "N years ago today" reminiscence feed.
  - Card = surface + radius22 + shadow + faint diary ruling (`repeating-linear-gradient(transparent 0 33px, coral12% 33px 34px)`).
  - Header: EN `ON THIS DAY` (coral mono) + large date (박다현 30px, **dynamic, based on today**) + `다시 보는 오늘` ("revisiting today", sub, Pretendard — no year/weekday). Right: coral **stamp** (rotate-9°): `MEMORIES`/count.
  - List: rows for 1/2/3 years ago today. Between rows `1px dashed coral30%`. Each row = left **taped polaroid** (rotate±3°, coral Tape, 1:1 Film, caption = year (박다현, primaryDeep)) + right (coral chip "N년 전 오늘" + date mono + title + #tag/weather chips). Click polaroid → lightbox.
- **② Recent photos**: `SectionHead` (title "최근 갤러리"/Recent gallery, EN PHOTO, mascot=cat, "더보기 ›"/More → `/photos`) + preview.
- **③ Recent videos**: `SectionHead` (title "최근 영상"/Recent videos, mascot=hamster, "더보기 ›" → `/videos`) + **Swiper horizontal scroll** thumbnails (play button · duration badge). Click → play.
- **Footer**: centered `MascotDuo` (bodies sticker ~100px) + handwriting "Don't regret what you do".

### 5.2 Photos `/photos`
- **Filter row (sticky top)**: **전체 / 인스타그램 / 트위터 / 플러스챗** (All / Instagram / Twitter / Plus Chat) — **by SNS source platform**. The data's `tag` value = platform name. Active chip primary + white text, horizontal scroll.
- **Display**: Instagram-style multi-photo posts (`ALBUMS`) as **stacked polaroids** (coral tape, count badge). Click card → **AlbumViewer = Swiper carousel** (‹ ›/dots through multiple shots in one post).
- 2-column masonry, ratio "tidy" (snap to 1:1 · 5:4 · 4:3).

### 5.3 Videos `/videos`
- **Filter row (sticky top)**: **전체 / 음악방송 / 직캠 / 라이브 / 비하인드 / 자컨** (All / Music show / Fancam / Live / Behind / Self-content) — content category. By data `tag`.
- **Display**: uniform full-width **taped polaroid card** feed ("한빈이의 영상일기" / Hanbin's video diary). Click card → **inline play in place, with no size change**.
- Card bottom: row 1 title (박다현 15.5px, left) + date (mono 9px, right, `flex-shrink:0`). Row 2 author (person icon + `author`, Pretendard 11.5px sub). **No view-count/category chip.**
- **▶ YouTube embed (real playback)**: the 16:10 slot really plays YouTube.
  - Data `videos.yt` = YouTube ID (v1=`7QGRDC7ngpE`, v2=`00eDQU6_Azc`). If present, real video; otherwise gradient fallback.
  - Thumbnail = `https://i.ytimg.com/vi/<id>/hqdefault.jpg` (**`i.ytimg.com` is an allowed repo remote host** → works directly with `next/image`). `object-fit:cover` + play button/duration badge overlay.
  - Click → replace the same slot with `<iframe src="https://www.youtube.com/embed/<id>?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen>`.
  - **Recommended**: don't load the iframe before click → use `@next/third-parties` `<YouTubeEmbed videoid=… />` or `lite-youtube-embed` (thumbnail first, iframe on click). The internal player UI is not customizable (design only the frame/surroundings).
  - **Duration/views**: `dur`/`views` are currently dummy. For real values, **server-prefetch at build time** via the **YouTube Data API** (`videos.list?part=contentDetails,statistics`): `contentDetails.duration` (ISO8601 `PT3M21S` → `mm:ss`) / `statistics.viewCount` (a plain embed can't read these; needs an API key).

### 5.4 Calendar `/calendar` (★NEW)
- **Content archive calendar** (not a schedule): a dot on dates where photos/videos were posted. **Blue = photo, coral = video**; both = two dots.
- diary style: coral tape at top, handwritten month, two mascots at right, weekday header (Sun–Sat). **The whole calendar grid is unified in 박다현 handwriting** — date numbers · weekday header (Sun–Sat) · bottom legend (photo/video) all use `--fdisplay` (diary mode only). In classic mode it's Pretendard. (Other body/empty-state/"N요일·n개" stay Pretendard.)
- **⚠️ No hardcoding — always based on `new Date()` (current month/today).** Header `YYYY. M월`, first-day weekday `new Date(y,m-1,1).getDay()`, last day `new Date(y,m,0).getDate()`. **Today's cell = coral ring** (`inset 0 0 0 2px coral`).
- **Month nav**: ‹ › on either side of the header for prev/next month (`view={y,m}` state, safe across year boundaries). Returning to the real current month selects today; another month selects the 1st. The today-ring shows only when the visible month is the actual current month.
- Selecting a date → circular background highlight (**selected-day color `#f9cdbf`** pastel coral, number in deep ink). Below, that day's **content card list** (`SectionHead` "M월 N일의 기록"/Record of M/N + "N요일 · n개"/weekday · count): thumbnail + photo/video chip + title. Photo → lightbox, video → player.
- **Default selection = today.** If no content, show an **empty-state line + mascot** ("오늘은 아직 올라온 기록이 없어요 ☁️" / "Nothing posted today yet ☁️"; a spot for ③ active mascot use).

### 5.5 Overlays (detail view is Post-MVP, so use these)
- **PhotoLightbox**: enlarged card (pop-in) + ◀▶ cycle + likes + close (Esc/backdrop/✕). → can build on shadcn `Dialog`.
- **VideoPlayer**: fullscreen overlay + YouTube iframe + close.
- **AlbumViewer**: multiple shots in one post → **Swiper** ‹ ›/dots.

---

## 6. Mascots (③ active use)
4 files in `source/assets/` = background-removed PNGs. **Move to `public/` (e.g. `public/mascots/`), render with `next/image` or `<img>` (set height; width auto by ratio).**

| File | Content | Main placement |
|---|---|---|
| `mascot-hamster.png` | Hamster alone (cream `#f6e7c6`, pink cheeks) | Section heads / Videos |
| `mascot-cat.png` | Cat alone (light gray `#D3D3D3`, pink cheeks) | Section heads / Photos |
| `mascot-pair.png` | Two faces side by side (**no cheek blush**) | **Header (Header 55)** |
| `mascot-bodies.png` | Bodies duo + stars/clouds | **Home footer sign-off** |

- **Active-use spots**: header (pair), each section head (cat/hamster), **empty states** (calendar etc.), home footer (bodies). But keep sizes restrained since the 55px header is narrow.
- Mascot colors are finalized as **cat = gray / hamster = cream**. (The shape-SVG version was prototype-exploration only → no need to implement.)

---

## 7. Interaction & state
- Tabs = routing (`next/link` + `usePathname()`); scroll main to top on switch.
- Filter chip → in-memory filter by `tag` (`useState`). Filter row sticky. (MVP)
- Photo card → AlbumViewer (Swiper) / video card → inline play / diary·calendar card → lightbox·player.
- Calendar date select → that day's content list (no route change; same-page update).
- Animation: pop-in (scale+opacity ~150–250ms ease-out). No infinite decorative loops. Respect `prefers-reduced-motion`.
- Width: **375px fixed shell**. Hit targets ≥ 44px (4 cells in the 64px Footer = ~93px each, OK).

**State summary**
- Current tab = URL path (`usePathname`).
- lightbox photo idx | null / playing video | null / inline `playingId` / filter tag / open album / calendar `selected` (default today) + `view{y,m}`.

---

## 8. Data — Supabase `photos`/`videos`/`tags` mapping
Currently mock. Guide for moving the prototype dummy (`source/data.jsx`) into tables:

- **`photos`** ← prototype `GALLERY`/`ALBUMS`.
  - Fields: `id, caption(cap), date, platform(tag: Instagram/Twitter/Plus Chat), ratio, likes, image_url` (real URL — `pbs.twimg.com`/`i.namu.wiki`/`talkimg.imbc.com` etc.); for multi-photo, `photos[]` (array of URLs) or a separate `photo_assets` join.
  - **Filter = `platform`** (SNS source). The gallery filter chips map to this value.
- **`videos`** ← prototype `VIDEOS`.
  - Fields: `id, title, date, author, category(tag: music show/fancam/live/behind/self-content), yt(YouTube ID), duration, views`.
  - **Filter = `category`.** Thumbnail generated from `yt` via `i.ytimg.com`. Prefetch `duration/views` from YouTube Data API (§5.3).
- **`tags`** — classification/platform master (source of filter options). Manage photo platform tags and video category tags here so filter chips need not be hardcoded.
- **Calendar content** = `photos` ∪ `videos` grouped by date (current month). The dummy has mixed years, so it **matches by month only (year-agnostic)** — production should filter by actual year-month.
- **Home `memories` (N years ago today)** = past items sharing today's MM-DD. The prototype has these inline in `screens.jsx` → implement as a Supabase query (match `date`'s MM-DD, year desc).
- **Person profile** (name/birthday/height) → **no table needed**; hardcode displayed text in components.

---

## 9. Files in this bundle
- `README.md` — **this document** (repo-specific handoff, English; primary).
- `README.ko.md` — Korean version.
- `README_generic-nextjs.md` — reference generic Next.js version (older).
- `source/SHB ARCHIVE.html` — prototype entry (font/script import order).
- `source/app.jsx` — theme/mood/layout · FINAL combo · shell assembly (**source of tokens**).
- `source/screens.jsx` — Home/Gallery/Video/Calendar + DiaryTop/Tape/VideoFeedCard/MiniCalendar.
- `source/ui.jsx` — Film/Chip/SectionHead/AppHeader/TabBar/PhotoLightbox/VideoPlayer/AlbumViewer.
- `source/mascots.jsx` — mascot render (illustration `<img>` + shape SVG).
- `source/data.jsx` — dummy data (→ migrate to Supabase).
- `source/ios-frame.jsx`, `source/tweaks-panel.jsx` — prototype-only, **no need to implement**.
- `source/assets/*.png` — 4 mascots (→ `public/`).
- `screenshots/01~04` — FINAL screen captures (diary-based).

> Note: the prototype is a **reference** transpiled on-the-fly by browser Babel and drawn with inline styles. Don't copy-paste style objects — **reference only the measurements, colors, and type** and rebuild with the repo's patterns (shadcn + Tailwind + Pretendard + Swiper + next/image).

---

## 10. Implementation checklist
1. **Update MVP_PLAN.md**: 4 routes (add `/calendar`) + home → diary (ON THIS DAY + recent). Mark detail view/search/favorites = Post-MVP.
2. Fonts: Pretendard (body, existing) + **박다현 (accents)** via `next/font/local`. `<html lang="ko">`.
3. Tokens: map §4.1 colors + radius22 onto shadcn (zinc) CSS vars; coral `#F09884` signature.
4. 375px shell ((app)/layout): Header55 (sticky) + scrollable main + Footer64 (TabBar, `{icon}-selected.svg` toggle).
5. Shared: Film (→ next/image slot) / Chip / SectionHead / Tape / Mascot (public PNG).
6. Build the 4 route screens diary-based → compare against `screenshots/`.
7. Filters (in-memory): photos = platform (Instagram/Twitter/Plus Chat), videos = category (music show/fancam/live/behind/self-content).
8. Video YouTube embed (lite/third-parties) + thumbnail `i.ytimg.com`. Duration/view-count prefetch as a follow-up.
9. Overlays: lightbox (Dialog) / player / AlbumViewer (Swiper).
10. Data: dummy → connect Supabase `photos`/`videos`/`tags`. Calendar/memories via date queries.
