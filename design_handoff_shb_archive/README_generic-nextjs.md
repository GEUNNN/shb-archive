# Handoff: SHB ARCHIVE — Fan Archive Mobile App

> Target implementation stack: **Next.js 15 (App Router) + Tailwind CSS** · single mobile (phone) view · Korean-language UI

---

## 1. Overview
A **fan-original archive** mobile app for K-pop artist **SHB**. The concept is "a place to gather and look back at past things" = a pure archive, and its identity is a **fresh/airy (sky-blue) palette + coral accent + hamster/cat mascots**.

The app is organized around 4 bottom tabs: **Home · Gallery · Video · Calendar**.

> ⚠️ This is a **fan-original concept** that does NOT replicate any agency's official logo/UI. Photos/videos are all placeholders filled with airy gradients (to be swapped for real data later), and text/dates/view counts etc. are dummy values.

---

## 2. About the Design Files (Important)
The files in the `source/` folder are **design references built in HTML** — prototypes that show the intended **look & behavior**, NOT production code to use as-is.

- They transpile JSX on the fly with in-browser Babel, and draw React components with inline `<style>` / inline `style` objects (not Tailwind).
- **Your task:** **recreate** this design in a **Next.js 15 + Tailwind CSS** environment, following that codebase's patterns (component structure, font loading, image handling). Move CSS variables / inline styles into Tailwind tokens/classes (mapping provided in §5 below).
- Don't copy-paste the style objects directly; reference only the measurements, colors, and typography and rebuild them in Tailwind.

---

## 3. Fidelity
This is **high-fidelity (hifi)**. Colors/typography/spacing/radius/shadows/interactions are the final intended values. Reproduce them close to pixel-accurate, but load fonts/images/icons using the codebase's standard approach (`next/font`, `next/image`).

---

## 4. Technical Mapping (recommended Next.js 15 + Tailwind structure)
```
app/
  layout.tsx           // font loading (next/font/google), <html lang="ko">, global CSS variables
  (mobile)/
    layout.tsx         // mobile shell: fixed-width frame + AppHeader + scroll area + TabBar (shared layout for all 4 tabs)
    page.tsx           // Home     (route: / )
    gallery/page.tsx   // Gallery  (route: /gallery )
    video/page.tsx     // Video    (route: /video )
    calendar/page.tsx  // Calendar (route: /calendar )
components/
  AppHeader.tsx  TabBar.tsx
  home/DiaryOnThisDay.tsx  GalleryPreview.tsx  VideoPreview.tsx
  gallery/GalleryScreen.tsx  AlbumViewer.tsx
  video/VideoFeedCard.tsx  InlinePlayer.tsx  VideoPlayer.tsx
  calendar/CalendarScreen.tsx  MiniCalendar.tsx
  common/Film.tsx  Chip.tsx  SectionHead.tsx  Tape.tsx  PhotoLightbox.tsx
  mascots/Mascot.tsx        // <img> stickers (cat/hamster/pair/bodies)
lib/data.ts          // dummy data: GALLERY, VIDEOS, ALBUMS, JUNE_CONTENT, etc.
public/mascots/*.png // 4 mascot files
```
- **Tab switching: implement via routing.** Each tab = a separate route (`/`, `/gallery`, `/video`, `/calendar`). Put the shared mobile shell in `(mobile)/layout.tsx` and render `{children}` (the current screen) inside it. **TabBar** navigates with `next/link` and reads the current path with `usePathname()` to highlight the active tab. On route change the body scroll naturally starts at the top (correct it in the shell if needed). Branch the header title / right-side mascot off `usePathname()`.
- **Mobile frame:** the original renders inside an iPhone mockup (width 402 / content height 874) and `transform: scale()`s to fit the viewport. The real app needs no device bezel, so implement it as a **fixed max-width (~390–430px) centered column**. Header is sticky at top, body scrolls, tab bar is fixed at bottom.
- **The Tweaks panel is NOT an implementation target.** It was just a tool for comparing options in the prototype; only implement the final combination (FINAL, §6 below).

---

## 5. Design Tokens

### 5.1 Colors (confirmed palette = `sky`)
Values that were injected as CSS variables. Move them to Tailwind `theme.extend.colors`.

| Token | HEX | Usage |
|---|---|---|
| `bg` | `#eaf6ff` | App background (light sky) |
| `surface` | `#ffffff` | Cards / surfaces |
| `primary` | `#4fb0ef` | Main accent (sky) — selected tab, active filter, links |
| `primaryDeep` | `#2c87cf` | Deep accent — diary year text, subheadings |
| `soft` | `#cfeaff` | Light chip background |
| `ink` | `#173a52` | Body/heading text |
| `sub` | `#6b8aa3` | Secondary text (dates · meta) |
| `accent` | `#ffe08a` | Yellow accent (stars · small accents) |
| `coral` | `#f09884` | **Signature accent** — hearts, D-day, masking tape, stamps |
| `coralSoft` | `#ffe2da` | Light paper tone for coral chips/tape |
| (coral text) | `#c2503a` / `#a85647` | Dark text on coral chips (currently unused on video chips — §7.3) |

> The other palettes (soda/mint/lavender/peach) were exploratory and **do not need to be implemented**. However, `coral`/`coralSoft` were a shared accent across all palettes.

### 5.2 Typography (confirmed mood = `summer` handwriting)
Google Fonts, Korean support. Load with `next/font/google`.

| Role | Font | Notes |
|---|---|---|
| Display (`--fdisplay`) | **Ownglyph ParkDahyeon** (`OngleipParkDahyeon`) | Handwriting face. If not in next/font, load via `@font-face` (local/CDN) |
| Body (`--fbody`) | **Gowun Dodum** | |
| Mono (meta/labels) | `ui-monospace, monospace` | dates · EN labels · uppercase tracking |
| Decorative script | **Parisienne** | small amounts, e.g. home footer "Don't regret what you do" |

- English uppercase labels (e.g. `ON THIS DAY`, `PHOTO`, `VIDEO`) use the mono font with `letter-spacing: 2px; font-weight:700; font-size:10–10.5px; color:var(--primary or coral)`.
- Apply `word-break: keep-all` to body text and `white-space: nowrap` to headings (header only).

### 5.3 Radius / Shadow / Spacing
- **radius (`--radius`)**: confirmed mood summer = **22px** (shared by cards/surfaces). Chips/filters use `20px` (nearly pill), polaroid photos `2–4px`.
- **Shadows**: card `0 12px 30px rgba(80,140,200,0.16)`; small card `0 6–9px 17–22px rgba(80,140,200,0.2)`; active chip `0 4px 12px rgba(80,150,210,0.3)`.
- **Horizontal padding (PAD)**: screen left/right **18px**.
- Spacing is close to multiples of 8 (mix of 6/7/9/12/14/16/22/26px).

---

## 6. Confirmed Combination (FINAL — implement only this)
```
palette: sky / mood: summer / home layout: diary /
gallery: diary + album + tidy /
video: inline playback + diary style + tape default (plain) + filters shown /
calendar: diary / selected-day color: #f9cdbf / mascots: illustration ON
```
Screenshots of the screens are in `screenshots/` (01 Home · 02 Gallery · 03 Video · 04 Calendar).

---

## 7. Screens / Views

### Shared Shell
- **AppHeader (sticky top)**: left = `MascotPair` (hamster + cat stickers, ~32px) + screen title (large handwriting) + a small EN label / menu name above it. Right = per-screen mascot or action icon. Title is `nowrap`.
  - Home: title "성한빈 / ARCHIVE", ✨ button on the right.
  - Gallery/Video/Calendar: each has a "PHOTO·VIDEO·ARCHIVE"-style EN label + Korean title + right-side mascot.
- **TabBar (fixed bottom)**: Home / Gallery / Video / Calendar. The active tab gets the `primary` color + emphasized icon. Scroll resets on tab change.
- **Film — photo/video placeholder (must understand)**
  - **placeholder = a temporary fill element that pre-occupies the space where real content will go.** This prototype is fan-original dummy content, so it has **zero real photoshoot/fancam image files.** Therefore every spot where a photo/video should go is filled with an **airy gradient rectangle + small icon** (a fake thumbnail) instead of a real image. That component is `Film`.
  - **What it renders**: a 150° linear-gradient from a `FILMS[f]` color pair + dot texture + diagonal sheen + a centered glyph (`cloud` ☁️ = photo feel / `camera` 📷 = video feel). It's a **code-drawn color field**, not a real picture.
  - **Why it's "common"**: photos and videos both ultimately need a "rectangular image area," so instead of building one per spot, **a single `Film` is reused everywhere** → all placeholders share the same tone/texture. Photo vs. video is distinguished only by the `glyph` prop.
  - **Where it's used**: gallery cards · home diary polaroids · calendar "record of the day" cards · lightbox enlarged photos · video card thumbnails. (Exception: videos v1·v2 now use **real YouTube thumbnails** instead of `Film` — §7.3)
  - **props**: `f` (= index into the 8 `FILMS` color pairs, different per card), `glyph` (`cloud`/`camera`), `radius` (corner), `label` (optional mono text).
  - **Next.js replacement guidance**: once real data exists, **replace these `Film` spots directly with real media.** Photos → `next/image` (real photoshoots), videos → YouTube thumbnail/embed (§7.3 approach). In other words `Film` is not the "final output" but **an empty frame for real images to drop into.**

### 7.1 Home — `screenshots/01-home-diary.png`
Vertical scroll. Composition: **Diary (ON THIS DAY) → Recent Gallery → Recent Video → Footer**.

**A. DiaryOnThisDay (the centerpiece)** — an "N years ago today" reminiscence feed.
- Card: `surface` background + radius 22 + card shadow + **faint diary ruled lines** (background `repeating-linear-gradient(transparent 0 33px, coral12% 33px 34px)`).
- Header: left — EN label `ON THIS DAY` (coral, mono), large title **"6월 4일"** (handwriting 30px ink), next to it `다시 보는 오늘 · 2026 목요일` (sub 12px). Right — a coral-bordered **stamp** (rotate -9°): `MEMORIES` on top, count number below.
- Memory list: rows from the `memories` array (today 1/2/3 years ago = 2025/2024/2023.06.04). Rows separated by `1px dashed coral30%`.
  - Each row: left = a **taped polaroid** (white paper padding, rotate ±3°, coral `Tape` on top, 1:1 Film, caption at the bottom = **year** in handwriting, `primaryDeep` color). Right = text — `Chip(coral)` "N years ago today" + date (mono sub) / title (handwriting 15px ink) / chip row (`#tag` soft + weather emoji ghost chip).
  - Click a polaroid → opens PhotoLightbox.
  - Content (dummy): ①2025 solo fanmeeting "한여름, 한빈" #팬미팅 ☀️ ②2024 summer photoshoot 'BLUE HOUR' released #화보 🌤️ ③2023 first summer music-show comeback stage #무대 ☁️.
- Coral heart sticker at bottom-right (rotate 12°).

**B. GalleryPreview** — `SectionHead` (title "최근 갤러리", EN "PHOTO", mascot=cat, right "더보기 ›" → Gallery tab) + photo preview.

**C. VideoPreview** — `SectionHead` (title "최근 영상", mascot=hamster, "더보기 ›" → Video tab) + horizontal-scroll thumbnails (play button · duration badge). Click → plays video.

**D. Footer** — centered `MascotDuo` (body-duo sticker ~104px) + handwriting (Parisienne) **"Don't regret what you do"** (sub 16px).

### 7.2 Gallery — `screenshots/02-gallery-diary-album.png`
- Top **tag filter row** (전체/인스타그램/트위터/플러스챗 — based on the SNS platform the content came from): `position: sticky; top:0`, horizontal scroll, active chip `primary` + white text. The data's `tag` value IS the platform name.
- **Confirmed: diary + album** — Instagram-style multi-photo posts (`ALBUMS`) shown as **stacked polaroids** (coral tape). Cards get a count badge + stacked-paper effect. Click a card → **AlbumViewer** (a carousel that pages through the multiple photos in one post via ‹ › / dots).
- Photo size **tidy**: ratios snapped to 3 types (1:1 · 5:4 · 4:3) and aligned. (free = bold masonry, unused.)
- 2-column column masonry.

### 7.3 Video — `screenshots/03-video-diary.png`
- Top **tag filter** (전체/음악방송/직캠/라이브/비하인드/자컨), sticky. Based on the data's `tag` value.
- **Confirmed: diary style + inline playback** — a feed of uniform full-width **taped polaroid cards** ("한빈이의 영상일기"). Clicking a card plays **inline in place with no size change** (scrubber auto-advances / pauses). Coral `Tape` on top (tape default = plain; the 'expression' variant is unused).
- **Card bottom text (recently revised, reproduce exactly):**
  - Row 1: **title (left, handwriting 15.5px ink) + date (right, mono 9px sub)** aligned on the same line (`flex; align-items:flex-start; gap:10`; title `flex:1 min-w-0`, date `flex-shrink:0; padding-top:4`). If the title is long it wraps and the date stays pinned to the right of the first line.
  - Row 2: **author** — person icon (round head + shoulders stroke, `sub` color) + `author` text (body 11.5px sub). ※ **View count / category chips were removed** (the title conveys category).
- Duration badge: bottom-right of the thumbnail, dark translucent pill, mono. ※ **The current duration is the dummy `VIDEOS[i].dur` value.** You can replace it with the real length by parsing `contentDetails.duration` (ISO 8601, e.g. `PT3M21S`) from the YouTube Data API (`videos.list?part=contentDetails`) into `mm:ss` (and view count from `statistics.viewCount`). A plain embed can't read the length and **requires an API-key call** ⇒ prefetch on the server at build time recommended.
- **▶ YouTube embed (real playback, implementation core):** the 16:10 media slot of each video card **actually plays a YouTube video**.
  - Data: `VIDEOS[i].yt` = YouTube video ID (e.g. v1=`7QGRDC7ngpE`, v2=`00eDQU6_Azc`). If `yt` exists it's a real video; otherwise it falls back to a gradient placeholder.
  - Thumbnail (not playing): `https://img.youtube.com/vi/<id>/hqdefault.jpg` with `object-fit:cover`. Overlay the play button · duration badge on top. The polaroid tape frame still wraps it.
  - Click (inline): replace the same slot with `<iframe src="https://www.youtube.com/embed/<id>?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen>` → **autoplays in place**. (The fake scrubber is unused when `yt` is present.)
  - The fullscreen player mode uses the same iframe.
  - **Next.js recommendation:** to avoid loading the heavy iframe before click, use `@next/third-parties`'s `<YouTubeEmbed videoid=… />` or `lite-youtube-embed` (thumbnail first, iframe on click). Handle embed-blocked / region-restricted videos with a fallback. The internal player UI can't be customized (design only the frame/surroundings).

### 7.4 Calendar — `screenshots/04-calendar-diary.png`
- A **content-archive calendar** (not a scheduler): dates that had a photo/video uploaded get a dot. **Blue dot = photo, coral dot = video**; days with both get 2 dots.
- **Confirmed: diary style** — coral tape on top, handwriting month, 2 mascots on the right. Weekday header (Sun–Sat). Date cell: a dot below days that have content.
- **⚠️ No hardcoding — always render based on today's date / the current month, with month navigation.** Use `new Date()` to get the current year/month/day: header `YYYY. M월`, compute the 1st's weekday / last day of the grid with `new Date(y, m-1, 1).getDay()` / `new Date(y, m, 0).getDate()`, and mark **today's cell with a coral ring** (`inset 0 0 0 2px coral`).
  - **Month navigation**: ‹ › buttons on either side of the header move to the previous/next month. Track the visible month with a `view={y,m}` state; ‹/› use `new Date(y, m-1±1, 1)` to cross year boundaries safely. Returning to the month containing today sets selected = today; moving to another month sets selected = the 1st. The today ring shows **only when the visible month is actually the current month.**
  - Upload matching: the dummy content spans different years, so it's matched **by month only** (year-agnostic) — in a real service, filter by actual year-month.
- On date selection, emphasize with a circular background (**selected-day color `#f9cdbf` pastel coral**, number in deep ink). Every date is clickable. Below, a **content card list for that day** (`SectionHead` "M월 N일의 기록" + right "N요일 · n개"): each card = thumbnail + `사진`/`영상` chip + title + likes/views. Photo click → Lightbox, video click → Player.
- **Default selected day = today** (`new Date().getDate()`). If today has no content, show an empty-state line ("오늘은 아직 올라온 기록이 없어요 ☁️").

### 7.5 Overlays
- **PhotoLightbox**: enlarged photo card (pop-in animation), ◀▶ prev/next, like count, close. Index wraps.
- **VideoPlayer**: fullscreen overlay + large play area + close.
- **AlbumViewer**: ‹ ›/dots carousel through the multiple photos in one post.

---

## 8. Interactions & Behavior
- Tab switching (**routing**: `next/link` + `usePathname()`) — route navigation, scroll to top on change.
- Gallery/Video filter chip click → filter to that tag only. Filter row is sticky.
- Gallery card click → AlbumViewer (album) or Lightbox (single).
- Video card click → toggle inline playback (scrubber advances), or Player overlay (optional).
- Diary polaroid / calendar content card click → Lightbox/Player.
- Lightbox: ◀▶ wraps, Esc/backdrop/✕ closes. Pop-in transition.
- Animation: card/lightbox **pop-in** (scale+opacity, ~150–250ms ease-out). No decorative infinite loops. Respect `prefers-reduced-motion`.
- Responsive: single mobile width. On desktop, show as a fixed-width centered column.
- Hit targets ≥ 44px.

---

## 9. State Management
- Current tab: **URL path** (`/`, `/gallery`, `/video`, `/calendar`) = `usePathname()`. (No separate `tab` state needed.)
- `photo`: lightbox photo index | null.
- `video`: currently playing video object | null.
- `playingId` (video inline): id of the card currently playing inline.
- `filter` (gallery/video): selected tag.
- `album` (gallery): the opened album post.
- `selected` (calendar): selected date (day). **Default = today** (`new Date().getDate()`). The calendar renders the current month/year dynamically (not hardcoded).
- Data fetching: currently all local dummy. A real service would fetch photos/videos/dates from an API/CMS and replace the `Film` spots with real images.

---

## 10. Data Model (migrate to lib/data.ts)
Reference the original `source/data.jsx`. Key arrays:
- ~~`HANBIN`~~ — **removed.** A person profile (name/birthday/height/position) doesn't need to live in the data model. Names/titles shown on screen are **hardcoded directly in the components** (the home profile chip was also already removed).
- `FILMS` — 8 gradient color pairs (decides placeholder colors).
- `GALLERY` — 9 photos (id, cap, date, tag, ratio, f, likes).
- `ALBUMS` — 5 Instagram-style multi-photo posts (cap, date, tag, likes, ratio, `photos`=array of FILMS indices).
- `VIDEOS` — 6 videos (id, title, dur, date, views, **author**, tag, f, **`yt`**=YouTube ID (real playback when present)). ※ Video cards hide views and show author.
- (reference/unused) `SCHEDULE`, `HIGHLIGHTS` — legacy schedule/highlights. Not on any current screen.
- Calendar content = the 2025.06 items from GALLERY+VIDEOS (original `JUNE_CONTENT`).
- The home diary `memories` is inline inside `screens.jsx` (DiaryTop) → recommended to extract into `lib/data.ts`.

---

## 11. Assets
4 files in `source/assets/` (= migrate to public/mascots) — **background-removed mascot sticker PNGs** (rendered as `<img>`, set height and let width follow ratio):
- `mascot-hamster.png` — hamster alone (cream `#f6e7c6`, pink cheeks)
- `mascot-cat.png` — cat alone (**light gray `#D3D3D3`**, pink cheeks)
- `mascot-pair.png` — the two side by side (faces, **no cheek blush** — for the header)
- `mascot-bodies.png` — body duo + yellow star/cloud (home footer sign-off)

> Mascot colors were finalized after several reworks as **cat = gray / hamster = cream**. The shape (SVG) version was exploratory and doesn't need implementing.
> The Film gradient spots (`FILMS`) will be replaced with real photoshoots/fancams/stills → `next/image`.
> Icons (play ▶, heart ♡, camera, person, cloud, etc.) were inline SVG — can be swapped for the codebase's icon set.

---

## 12. Files (in this bundle)
- `source/SHB ARCHIVE.html` — entry point (font loading + script import order)
- `source/app.jsx` — theme/mood/layout definitions, FINAL combination, shell assembly (**source of the tokens**)
- `source/screens.jsx` — Home/Gallery/Video/Calendar + DiaryTop/Tape/VideoFeedCard/MiniCalendar, etc.
- `source/ui.jsx` — Film/Chip/SectionHead/AppHeader/TabBar/PhotoLightbox/VideoPlayer/AlbumViewer
- `source/mascots.jsx` — mascot rendering (illustration `<img>` + shape SVG)
- `source/data.jsx` — dummy data
- `source/ios-frame.jsx`, `source/tweaks-panel.jsx` — prototype-only (frame/tweaks) **no implementation needed**
- `source/assets/*.png` — 4 mascots
- `screenshots/01~04` — confirmed (FINAL) screen captures

---

## 13. Implementation Checklist (summary)
1. Load Gowun Dodum / Ownglyph ParkDahyeon / Parisienne with `next/font`, `<html lang="ko">`.
2. Register the §5.1 color tokens + radius(22) + shadow utilities in the Tailwind config.
3. Build the mobile shell (fixed-width column + sticky header + scrolling body + fixed tab bar).
4. Common components first (Film/Chip/SectionHead/Tape/Mascot).
5. Implement the 4 screens as FINAL (diary-based) → compare against the screenshots.
6. Lightbox/Player/AlbumViewer overlays + interactions.
7. Move dummy data into `lib/data.ts`, then connect real-data API + swap Film → images.
