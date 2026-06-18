import Film from "@/components/diary/Film";
import Chip from "@/components/diary/Chip";
import Tape from "@/components/diary/Tape";
import { Album, Video, Glyph } from "@/lib/data";

const TILT = [-3, 3, -2, 2, -3, 3];

// "YYYY.MM.DD" → { y, m, d }
const parse = (s: string) => {
  const [y, m, d] = s.split(".").map(Number);
  return { y, m, d };
};

interface DiaryOnThisDayProps {
  albums: Album[];
  videos: Video[];
  onOpenPhoto: (f: number, src?: string) => void;
  onPlay: (v: Video) => void;
}

// "N년 전 오늘" — real photos/videos from PAST years sharing today's MM-DD.
// Date is always derived from `new Date()` (no hard-coded day). Empty until the
// archive spans more than one year.
export default function DiaryOnThisDay({ albums, videos, onOpenPhoto, onPlay }: DiaryOnThisDayProps) {
  const now = new Date();
  const Y = now.getFullYear();
  const M = now.getMonth() + 1;
  const D = now.getDate();
  const bigDate = `${M}월 ${D}일`;

  type Memory = {
    key: string;
    year: number;
    ago: number;
    date: string;
    title: string;
    tag: string;
    src?: string;
    f: number;
    glyph: Glyph;
    isVideo: boolean;
    open: () => void;
  };

  // past-year photos sharing today's MM-DD
  const photoMems: Memory[] = albums
    .map((a) => ({ a, p: parse(a.date) }))
    .filter(({ p }) => p.m === M && p.d === D && p.y < Y)
    .map(({ a, p }) => ({
      key: `p-${a.id}`,
      year: p.y,
      ago: Y - p.y,
      date: a.date,
      title: a.cap,
      tag: a.tag,
      src: a.images[0],
      f: a.photos[0] ?? 0,
      glyph: "camera",
      isVideo: false,
      open: () => onOpenPhoto(a.photos[0] ?? 0, a.images[0]),
    }));

  // past-year videos sharing today's MM-DD
  const videoMems: Memory[] = videos
    .map((v) => ({ v, p: parse(v.date) }))
    .filter(({ p }) => p.m === M && p.d === D && p.y < Y)
    .map(({ v, p }) => ({
      key: `v-${v.id}`,
      year: p.y,
      ago: Y - p.y,
      date: v.date,
      title: v.title,
      tag: v.tag,
      src: v.yt ? `https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg` : undefined,
      f: v.f,
      glyph: "cloud",
      isVideo: true,
      open: () => onPlay(v),
    }));

  // most recent past year first
  const memories = [...photoMems, ...videoMems].sort((a, b) => b.year - a.year);

  return (
    <div className="px-[18px] pt-1.5">
      <div
        className="relative overflow-hidden rounded-card bg-surface px-[18px] pb-[22px] pt-5"
        style={{
          boxShadow: "0 12px 30px rgba(80,140,200,0.16)",
          backgroundImage:
            "repeating-linear-gradient(transparent 0 33px, color-mix(in srgb, #F09884 12%, transparent) 33px 34px)",
        }}
      >
        {/* header — ON THIS DAY */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[10.5px] font-bold tracking-[2px] text-coral">
              ON THIS DAY
            </div>
            <div className="mt-[3px] flex items-baseline gap-2">
              <span className="font-display text-[30px] font-extrabold leading-none text-ink">
                {bigDate}
              </span>
              <span className="text-[12px] text-sub">다시 보는 오늘</span>
            </div>
          </div>
          {/* coral memo stamp */}
          {memories.length > 0 && (
            <div
              className="shrink-0 rounded-[10px] border-2 border-coral px-[9px] py-[5px] text-center font-mono leading-tight text-coral"
              style={{
                transform: "rotate(-9deg)",
                background: "color-mix(in srgb, #F09884 8%, transparent)",
              }}
            >
              <div className="text-[7.5px] tracking-[1px]">MEMORIES</div>
              <div className="text-[13px] font-bold">{memories.length}</div>
            </div>
          )}
        </div>

        {memories.length === 0 ? (
          // empty until the archive has content from a previous year
          <div className="mt-4 flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-[12.5px] leading-relaxed text-sub">
              아직 다시 볼 지난 오늘의 기록이 없어요 ☁️
            </p>
          </div>
        ) : (
          // memory feed — one taped polaroid per "N년 전 오늘"
          <div className="mt-3.5">
            {memories.map((m, idx) => {
              const deg = TILT[idx % TILT.length];
              return (
                <div
                  key={m.key}
                  className="flex items-start gap-[13px]"
                  style={{
                    paddingTop: idx ? 15 : 4,
                    marginTop: idx ? 15 : 0,
                    borderTop: idx
                      ? "1px dashed color-mix(in srgb, #F09884 30%, transparent)"
                      : "none",
                  }}
                >
                  <button
                    onClick={m.open}
                    className="relative shrink-0 basis-[110px] rounded-[4px] bg-white p-[7px] pb-[9px]"
                    style={{
                      boxShadow: "0 7px 17px rgba(80,140,200,0.2)",
                      transform: `rotate(${deg}deg)`,
                    }}
                  >
                    <Tape w={54} deg={deg < 0 ? -7 : 7} style={{ top: -8, left: 30 }} />
                    <div className="relative aspect-square w-full overflow-hidden rounded-[2px]">
                      <Film src={m.src} f={m.f} glyph={m.glyph} radius={2} alt={m.title} />
                      {m.isVideo && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/90">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#2c87cf">
                              <path d="M8 5.5l11 6.5-11 6.5z" />
                            </svg>
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-center font-display text-[13px] font-extrabold text-skyDeep">
                      {m.year}
                    </div>
                  </button>

                  {/* note */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-[7px]">
                      <Chip tone="coral">{m.ago}년 전 오늘</Chip>
                      <span className="font-mono text-[10.5px] text-sub">{m.date}</span>
                    </div>
                    <div className="mt-[7px] font-display text-[15px] font-extrabold leading-[1.4] text-ink">
                      {m.title}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Chip tone="soft">#{m.tag}</Chip>
                      <Chip tone="ghost">{m.isVideo ? "▶ 영상" : "📷 사진"}</Chip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* coral heart sticker */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="#F09884"
          className="absolute bottom-3 right-4 opacity-90"
          style={{ transform: "rotate(12deg)" }}
        >
          <path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" />
        </svg>
      </div>
    </div>
  );
}
