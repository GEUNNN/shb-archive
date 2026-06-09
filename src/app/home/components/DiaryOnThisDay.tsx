import Film from "@/components/diary/Film";
import Chip from "@/components/diary/Chip";
import Tape from "@/components/diary/Tape";
import { MEMORY_SEEDS } from "@/lib/data";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");

interface DiaryOnThisDayProps {
  onOpenPhoto: (f: number) => void;
}

// "N년 전 오늘" — a reminiscence feed of past items sharing today's MM-DD.
// Date is always derived from `new Date()` (no hard-coded day).
export default function DiaryOnThisDay({ onOpenPhoto }: DiaryOnThisDayProps) {
  const now = new Date();
  const Y = now.getFullYear();
  const M = now.getMonth() + 1;
  const D = now.getDate();
  const bigDate = `${M}월 ${D}일`;
  const weekday = `${WEEKDAYS[now.getDay()]}요일`;

  const memories = MEMORY_SEEDS.map((s, i) => ({
    ...s,
    ago: i + 1,
    year: Y - (i + 1),
    date: `${Y - (i + 1)}.${pad(M)}.${pad(D)}`,
  }));

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
        </div>

        {/* memory feed — one taped polaroid per "N년 전 오늘" */}
        <div className="mt-3.5">
          {memories.map((m, idx) => (
            <div
              key={m.year}
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
                onClick={() => onOpenPhoto(m.f)}
                className="relative shrink-0 basis-[110px] rounded-[4px] bg-white p-[7px] pb-[9px]"
                style={{
                  boxShadow: "0 7px 17px rgba(80,140,200,0.2)",
                  transform: `rotate(${m.deg}deg)`,
                }}
              >
                <Tape
                  w={54}
                  deg={m.deg < 0 ? -7 : 7}
                  style={{ top: -8, left: 30 }}
                />
                <div className="aspect-square w-full overflow-hidden rounded-[2px]">
                  <Film f={m.f} glyph={m.glyph} radius={2} />
                </div>
                <div className="mt-2 text-center font-display text-[13px] font-extrabold text-skyDeep">
                  {m.year}
                </div>
              </button>

              {/* note */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-[7px]">
                  <Chip tone="coral">{m.ago}년 전 오늘</Chip>
                  <span className="font-mono text-[10.5px] text-sub">
                    {m.date}
                  </span>
                </div>
                <div className="mt-[7px] font-display text-[15px] font-extrabold leading-[1.4] text-ink">
                  {m.title}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Chip tone="soft">#{m.tag}</Chip>
                  <Chip tone="ghost">{m.weather}</Chip>
                </div>
              </div>
            </div>
          ))}
        </div>

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
