"use client";

import { HamsterFace, CatFace } from "@/components/diary/Mascots";
import Tape from "@/components/diary/Tape";

const DOWS = ["일", "월", "화", "수", "목", "금", "토"];

interface MiniCalendarProps {
  year: number;
  month: number; // 1-indexed
  marks: Record<number, { photo?: true; video?: true }>;
  selected: number;
  onSelect: (day: number) => void;
  onPrev: () => void;
  onNext: () => void;
  // today's y/m/d — passed in so the grid stays pure (no new Date() inside)
  today: { y: number; m: number; d: number };
}

const SELECTED_BG = "#f9cdbf"; // pastel-coral selected-day fill (spec §5.4)

// Diary-mode month grid. Numbers · weekday header use 박다현 handwriting per
// README §5.4. Today = coral ring; selected = pastel fill.
export default function MiniCalendar({
  year,
  month,
  marks,
  selected,
  onSelect,
  onPrev,
  onNext,
  today,
}: MiniCalendarProps) {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const isCurMonth = year === today.y && month === today.m;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  return (
    <div
      className="relative rounded-[6px] bg-white px-[14px] pb-4 pt-5"
      style={{ boxShadow: "0 8px 22px rgba(80,140,200,0.14)" }}
    >
      <Tape w={84} deg={-4} style={{ top: -10, left: "50%", marginLeft: -42 }} />

      {/* header: ‹ YYYY. M월 › + mascot faces */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            aria-label="이전 달"
            className="flex h-7 w-7 items-center justify-center rounded-full text-sky"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="min-w-[96px] text-center font-display text-[19px] font-extrabold text-ink">
            {year}. <span className="text-sky">{month}월</span>
          </div>
          <button
            onClick={onNext}
            aria-label="다음 달"
            className="flex h-7 w-7 items-center justify-center rounded-full text-sky"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex gap-1.5">
          <HamsterFace size={24} />
          <CatFace size={24} />
        </div>
      </div>

      {/* weekday header — handwriting, Sun red / Sat sky */}
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {DOWS.map((d, i) => (
          <div
            key={d}
            className="text-center font-display text-[12px] font-bold"
            style={{ color: i === 0 ? "#e88" : i === 6 ? "#4fb0ef" : "#6b8aa3" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />;
          const m = marks[d];
          const has = !!m;
          const sel = selected === d;
          const isToday = isCurMonth && d === today.d;
          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className="relative flex aspect-square flex-col items-center justify-center rounded-full"
              style={{
                background: sel ? SELECTED_BG : "transparent",
                boxShadow: isToday && !sel ? "inset 0 0 0 2px #F09884" : "none",
              }}
            >
              <span
                className="font-display text-[16px]"
                style={{
                  fontWeight: has || sel ? 800 : 500,
                  color: sel || has ? "#173a52" : "#6b8aa3",
                }}
              >
                {d}
              </span>
              {has && (
                <span className="absolute bottom-[5px] flex gap-0.5">
                  {m.photo && <span className="h-[5px] w-[5px] rounded-full bg-sky" />}
                  {m.video && <span className="h-[5px] w-[5px] rounded-full bg-coral" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
