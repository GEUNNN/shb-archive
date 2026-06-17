-- SHB ARCHIVE — schema
-- Run in Supabase SQL Editor. Mirrors src/lib/data.ts shapes.
-- Re-runnable: drops + recreates from scratch.

drop table if exists public.photos, public.videos, public.tags cascade;

-- ─── tags: filter-option master ───────────────────────────────
-- kind = 'platform' (photos) | 'category' (videos)
create table public.tags (
  id         bigint generated always as identity primary key,
  kind       text not null check (kind in ('platform', 'category')),
  label      text not null,
  sort_order int  not null default 0,
  unique (kind, label)
);

-- ─── photos: album-shaped (one row = one post, 1..N images) ────
create table public.photos (
  id        text primary key,
  caption   text not null,
  date      date not null,
  platform  text not null,            -- 인스타그램 / 트위터 / 플러스챗
  likes     int  not null default 0,
  ratio     numeric not null default 1,
  films     int[]  not null default '{}',  -- gradient placeholder indices, one per photo in the post
  images    text[] not null default '{}',  -- real URLs (future), empty for now
  created_at timestamptz not null default now()
);

-- ─── videos ───────────────────────────────────────────────────
create table public.videos (
  id        text primary key,
  title     text not null,
  date      date not null,
  author    text not null,
  category  text not null,            -- 음악방송 / 직캠 / 라이브 / 비하인드 / 자컨
  yt        text,                     -- YouTube ID (nullable)
  duration  text not null,
  views     text not null,
  f         int  not null default 0,
  is_shorts boolean not null default false,  -- YouTube Shorts (≤180s + /shorts redirect)
  created_at timestamptz not null default now()
);

-- helpful for calendar month-range queries
create index photos_date_idx on public.photos (date);
create index videos_date_idx on public.videos (date);

-- ─── RLS: public archive = anon may read, nothing else ────────
alter table public.tags   enable row level security;
alter table public.photos enable row level security;
alter table public.videos enable row level security;

create policy "tags readable"   on public.tags   for select using (true);
create policy "photos readable" on public.photos for select using (true);
create policy "videos readable" on public.videos for select using (true);
