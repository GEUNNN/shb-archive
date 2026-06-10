-- SHB ARCHIVE — seed data (from src/lib/data.ts)
-- Run AFTER schema.sql. Idempotent via upsert on primary key / unique.

-- ─── tags ─────────────────────────────────────────────────────
insert into public.tags (kind, label, sort_order) values
  ('platform', '인스타그램', 1),
  ('platform', '트위터',     2),
  ('platform', '플러스챗',   3),
  ('category', '음악방송',   1),
  ('category', '직캠',       2),
  ('category', '라이브',     3),
  ('category', '비하인드',   4),
  ('category', '자컨',       5)
on conflict (kind, label) do nothing;

-- ─── photos (from ALBUMS) ─────────────────────────────────────
insert into public.photos (id, caption, date, platform, likes, ratio, films) values
  ('al1', '여름 화보 비하인드',   '2025-07-02', '인스타그램', 1284, 1.25, '{0,3,6,1,4}'),
  ('al2', '바다 브이로그 스틸컷', '2025-06-21', '트위터',     2038, 1.00, '{4,7,2}'),
  ('al3', '팬사인회 데이 ♡',      '2025-05-30', '인스타그램', 1755, 1.25, '{5,3,6,0}'),
  ('al4', '음악방송 출근길 모음', '2025-06-14', '플러스챗',   1471, 1.33, '{1,2,6}'),
  ('al5', '생일 카페 이벤트',     '2025-05-13', '인스타그램', 3120, 1.00, '{3,0,7,4,2,6}')
on conflict (id) do update set
  caption = excluded.caption, date = excluded.date, platform = excluded.platform,
  likes = excluded.likes, ratio = excluded.ratio, films = excluded.films;

-- ─── videos (from VIDEOS) ─────────────────────────────────────
insert into public.videos (id, title, date, author, category, yt, duration, views, f) values
  ('v1', '[MV] TOP5',            '2025-07-03', 'OFFICIAL',   '비하인드', '7QGRDC7ngpE', '12:04', '142만', 0),
  ('v2', '[입덕직캠] TOP5',       '2025-06-10', 'OFFICIAL',   '자컨',     '00eDQU6_Azc', '18:47', '256만', 4),
  ('v3', '직캠 | 컴백 무대 4K',   '2025-06-21', '@청량모먼트', '직캠',     null,          '03:21', '389만', 6),
  ('v4', '음악방송 1위 앵콜 무대', '2025-05-24', 'OFFICIAL',   '음악방송', null,          '03:55', '198만', 1),
  ('v5', '단독 라이브 〈여름밤〉',  '2025-06-28', 'OFFICIAL',   '라이브',   null,          '24:18', '88만',  2),
  ('v6', '음악방송 1위 무대 직캠', '2025-07-05', '@청량모먼트', '음악방송', null,          '03:48', '165만', 5)
on conflict (id) do update set
  title = excluded.title, date = excluded.date, author = excluded.author,
  category = excluded.category, yt = excluded.yt, duration = excluded.duration,
  views = excluded.views, f = excluded.f;
