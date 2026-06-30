# SHB Archive

> 아티스트의 활동을 사진·영상·캘린더로 모아 보는 아카이브 웹앱.
> A fan-made archive web app that collects an artist's activity into photos, videos, and a calendar.


**Live**: [shb-archive.vercel.app](https://shb-archive.vercel.app)

모바일 우선(375px)으로 설계한 다이어리·스크랩북 톤의 개인 프로젝트입니다. YouTube와 SNS에 흩어진 콘텐츠를 직접 만든 수집 스크립트로 모아 Supabase에 적재하고, 날짜 기반으로 다시 보여줍니다. 기획·디자인·프론트엔드·데이터 파이프라인·배포까지 전 과정을 혼자 진행했습니다.

A solo project with a diary/scrapbook tone, designed mobile-first (375px). Content scattered across YouTube and social platforms is collected through custom ingest scripts, stored in Supabase, and surfaced back by date. I handled the entire process end-to-end — planning, design, frontend, data pipeline, and deployment.

> ⚠️ **Status: 진행 중 (Work in Progress)** — 4개 핵심 화면의 MVP가 라이브에서 동작합니다. 실데이터 적재와 기능 고도화(검색, 상세 뷰 등)를 계속 진행 중입니다.
> The MVP of all four core screens is live. Real-data ingestion and further features (search, detail view, etc.) are ongoing.

---

## ✨ Features

- **다이어리 홈 (Diary Home)** — "ON THIS DAY"로 N년 전 오늘의 콘텐츠를 보여주고, 최근 사진·영상 미리보기를 모았습니다.
- **캘린더 (Calendar)** — `new Date()` 기반으로 동적 생성되는 콘텐츠 아카이브 달력. 날짜별 점(파랑=사진, 코랄=영상)으로 그날의 기록을 표시하고, 날짜를 누르면 해당일 콘텐츠가 펼쳐집니다.
- **사진 (Photos)** — 폴라로이드 스타일 그리드. 출처 플랫폼(인스타그램·트위터·플러스챗)별 필터, 여러 장 포스트는 앨범 뷰어(Swiper)로 넘겨봅니다.
- **영상 (Videos)** — YouTube 영상 피드. 카테고리(음악방송·직캠·라이브·비하인드·자컨 등)별 필터, 썸네일 클릭 시 인라인 재생.

---

## 🛠 Tech Stack

| 영역 | 사용 기술 |
| --- | --- |
| **Framework** | Next.js 15 (App Router, Turbopack), React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui (new-york / zinc), Pretendard · 온글잎 박다현 폰트 |
| **UI** | Swiper (앨범 캐러셀), react-day-picker (캘린더), lucide-react |
| **Backend / DB** | Supabase (PostgreSQL + Row Level Security) |
| **Image hosting** | Cloudflare R2 (S3 호환 API), sharp (리사이즈·webp 변환) |
| **External API** | YouTube Data API v3 (영상 메타데이터 수집) |
| **Deploy** | Vercel |

---

## 🏗 Architecture

### 데이터 흐름 (Data flow)

```
[수집 스크립트] → Supabase (PostgreSQL) → Server Component (anon key, 읽기 전용)
                                              ↓ 전체 데이터셋 전달
                                          Client Component → useState 인메모리 필터
```

- **읽기는 Server Component에서** anon key로 수행하고(RLS로 읽기 전용), 전체 데이터셋을 Client Component로 내려보냅니다.
- **현재 필터링은 인메모리**로 처리합니다. 전체 데이터셋을 받아둔 뒤 필터를 바꿀 때마다 재쿼리하지 않고 배열을 거릅니다 — 현재 아카이브 규모에 적합한 선택입니다. (데이터가 늘면 무한 스크롤 + 서버 사이드 필터로 전환 예정 — *Roadmap* 참고)
- **이미지 바이트는 DB에 저장하지 않습니다.** R2에 업로드한 뒤 공개 URL만 Postgres에 보관해, DB는 가볍게 유지합니다.

### 레이아웃 셸 (Layout shell)

375px 고정 폭 모바일 셸 — 상단 고정 Header(55px) + 하단 고정 Footer(64px) 사이에 스크롤 가능한 `<main>`을 배치. 전체를 중앙 정렬해 데스크톱에서도 모바일 뷰로 봅니다.

### 데이터 수집 스크립트 (Ingest scripts)

콘텐츠 적재를 자동화하기 위해 두 개의 CLI 스크립트를 작성했습니다.

**`yarn add-videos`** — YouTube Data API v3로 영상 메타데이터를 수집해 `videos` 테이블에 upsert.
- 4가지 입력 모드: 채널 전체 업로드 / 채널 내 키워드 검색 / 플레이리스트 / 개별 URL
- ISO 8601 duration 파싱(`PT7M31S` → `7:31`), 조회수 한국식 포맷(`260000` → `26만`)
- 기간 필터(`--since`/`--until`), 제목 포함·제외 필터, dry-run 미리보기
- **Shorts 자동 판별**: 180초 이하 후보만 `/shorts/{id}`에 HEAD 요청을 보내 판정 — YouTube API 쿼터를 쓰지 않는 방식
- 동시성 풀로 다수 영상을 병렬 처리, `ON CONFLICT` 기반 멱등 upsert

**`yarn add-photos`** — 로컬 이미지 폴더를 R2에 올리고 `photos` 테이블에 포스트 단위로 적재.
- sharp로 리사이즈·webp 변환(품질·최대 폭 옵션) 후 R2(S3 API)에 업로드, 공개 URL을 DB에 저장
- 폴더 1개 = 포스트 1개(여러 장 → 한 앨범), `--flat`으로 이미지당 1포스트도 가능
- 폴더명(`260616`)에서 날짜 자동 추론, 플랫폼별 R2 경로 구성, 멱등 upsert

---

## 📁 Project Structure

```
src/
├─ app/
│  ├─ page.tsx              # 홈 (다이어리)
│  ├─ calendar/             # 캘린더 라우트
│  ├─ photos/               # 사진 라우트 (+ 앨범 뷰어)
│  ├─ videos/               # 영상 라우트 (+ 인라인 재생)
│  └─ components/           # Header / Footer 등 공통
├─ components/
│  ├─ diary/                # 다이어리 톤 UI (테이프, 필름, 마스코트 등)
│  └─ ui/                   # shadcn/ui
└─ lib/
   ├─ supabase.ts           # Supabase 클라이언트 (anon, 읽기 전용)
   ├─ queries.ts            # DB 컬럼 → 앱 타입 매핑
   ├─ calendar.ts           # 캘린더 날짜 로직
   └─ data.ts               # 공통 타입 · 상수

scripts/
├─ add-videos.ts            # YouTube → Supabase 수집
└─ add-photos.ts            # 로컬 이미지 → R2 + Supabase 수집

supabase/
└─ schema.sql               # 테이블 · 인덱스 · RLS 정책
```

---

## 🚀 Getting Started

```bash
yarn install
yarn dev        # http://localhost:3000 (Turbopack)
```

### 환경 변수 (`.env.local`)

```bash
# 앱 (읽기 전용 · 공개 가능)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 수집 스크립트 전용 (백엔드 · 절대 노출 금지)
SUPABASE_SECRET_KEY=
YOUTUBE_API_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_BASE=
```

> 앱은 anon key만 사용하며 RLS로 읽기 전용입니다. secret/R2 키는 수집 스크립트에서만 쓰이고 클라이언트에 절대 노출되지 않습니다.

### 데이터 수집 예시

```bash
# 채널의 모든 업로드를 '직캠' 카테고리로 수집
yarn add-videos @somechannel --category 직캠

# 한 폴더의 이미지들을 하나의 인스타그램 포스트로 적재
yarn add-photos photo/260616 --platform 인스타그램
```

---

## 🗺 Roadmap

- [x] 4개 핵심 화면 MVP (홈 · 캘린더 · 사진 · 영상)
- [x] Supabase 연동 + 인메모리 필터
- [x] YouTube / R2 데이터 수집 파이프라인
- [ ] 검색 (Search)
- [ ] 개별 상세 뷰 (`/photos/[id]`)
- [ ] 즐겨찾기 / 북마크
- [ ] Shorts 전용 탭 (`is_shorts` 컬럼 기반, 데이터 레이어 준비 완료)
- [ ] 무한 스크롤 + 서버 사이드 필터/페이지네이션 (현재는 전체 로드 + 인메모리 필터)
- [ ] 백엔드 API 레이어(NestJS) 도입 — 앱이 DB를 직접 쿼리하는 대신 API 경유
- [ ] AI를 활용한 자연어 검색 (외부 AI API 연동)

---

## 📝 About this project

좋아하는 아티스트의 기록을 한곳에 모으고 싶다는 개인적인 동기에서 시작한 프로젝트입니다. 단순한 화면 구현을 넘어, 흩어진 콘텐츠를 어떻게 수집·정규화·저장하고 다시 보여줄지를 직접 설계하며 프론트엔드 바깥(데이터 파이프라인·스토리지·배포)까지 다뤄본 경험을 담았습니다.

A project that started from a personal desire to gather an artist's records in one place. Beyond building screens, it reflects hands-on experience designing how scattered content gets collected, normalized, stored, and resurfaced — reaching beyond the frontend into data pipelines, storage, and deployment.
