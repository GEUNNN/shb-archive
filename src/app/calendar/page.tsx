"use client";

import { FC, useEffect, useMemo, useState } from "react";
import MiniCalendar from "./components/MiniCalendar";
import ContentCard from "./components/ContentCard";
import SectionHead from "@/components/diary/SectionHead";
import PhotoLightbox, { LightboxPhoto } from "../home/components/PhotoLightbox";
import VideoModal from "../home/components/VideoModal";
import { getMonthContent, marksFromItems, DayItem } from "@/lib/calendar";
import { Video } from "@/lib/data";

const DOWS = ["일", "월", "화", "수", "목", "금", "토"];
const monthKey = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}`;

const Calendar: FC = () => {
  // single source of "now" — passed down so child grids stay pure
  const [today] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
  });

  const [view, setView] = useState({ y: today.y, m: today.m });
  const [selected, setSelected] = useState(today.d);
  const [photo, setPhoto] = useState<LightboxPhoto | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [cache, setCache] = useState<Record<string, DayItem[]>>({});

  const key = monthKey(view.y, view.m);
  const monthContent = cache[key]; // undefined until fetched
  const loading = monthContent === undefined;

  // fetch the visible month once; subsequent visits serve from cache
  useEffect(() => {
    if (cache[key] !== undefined) return;
    let cancelled = false;
    getMonthContent(view.y, view.m).then((items) => {
      if (!cancelled) setCache((c) => ({ ...c, [key]: items }));
    });
    return () => {
      cancelled = true;
    };
  }, [key, view.y, view.m, cache]);

  const items = useMemo(() => monthContent ?? [], [monthContent]);
  const marks = useMemo(() => marksFromItems(items), [items]);

  const dayItems = items.filter((it) => it.day === selected);
  const dow = DOWS[new Date(view.y, view.m - 1, selected).getDay()];
  const isCurMonth = view.y === today.y && view.m === today.m;

  // month nav — safe across year boundaries; landing on the real current month
  // re-selects today, any other month selects the 1st (spec §5.4)
  const changeMonth = (dir: number) => {
    const d = new Date(view.y, view.m - 1 + dir, 1);
    const ny = d.getFullYear();
    const nm = d.getMonth() + 1;
    setView({ y: ny, m: nm });
    setSelected(ny === today.y && nm === today.m ? today.d : 1);
  };

  return (
    <div className="pb-7">
      {/* scrapbook intro */}
      <div className="flex items-center gap-1.5 px-[18px] pb-2 pt-1">
        <span className="whitespace-nowrap font-display text-[15px] font-extrabold text-ink">
          한빈이의 기록 달력
        </span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F09884" strokeWidth="2" strokeLinecap="round" style={{ transform: "rotate(-8deg)" }}>
          <path d="M7 2v3M17 2v3M3.5 8h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6.5A1.5 1.5 0 0 1 5 5z" />
        </svg>
        <span className="ml-auto font-mono text-[10px] text-sub">{items.length} UPLOADS</span>
      </div>

      <div className="px-[18px] pt-1">
        <MiniCalendar
          year={view.y}
          month={view.m}
          marks={marks}
          selected={selected}
          onSelect={setSelected}
          onPrev={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
          today={today}
        />

        {/* legend */}
        <div className="mt-3 flex items-center gap-4 px-1 text-[11.5px] text-sub">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-[7px] w-[7px] rounded-full bg-sky" /> 사진
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-[7px] w-[7px] rounded-full bg-coral" /> 영상
          </span>
        </div>
      </div>

      {/* selected day's content */}
      <div className="mt-[22px] px-[18px]">
        <SectionHead
          title={`${view.m}월 ${selected}일의 기록`}
          mascot="cat"
          right={
            <span className="whitespace-nowrap text-[12.5px] text-sub">
              {dow}요일 · {dayItems.length}개
            </span>
          }
        />

        <div className="flex flex-col gap-[11px]">
          {dayItems.map((it) => (
            <ContentCard
              key={it.kind + (it.kind === "video" ? it.ref.id : it.title + it.day)}
              item={it}
              onOpenPhoto={(f, src) => setPhoto({ f, src })}
              onPlay={(v) => setVideo(v.ref)}
            />
          ))}

          {loading && (
            <div className="pt-6 text-center">
              <p className="text-[13px] text-sub">기록을 불러오는 중…</p>
            </div>
          )}

          {!loading && dayItems.length === 0 && (
            <div className="pt-6 text-center">
              <p className="text-[13px] text-sub">
                {isCurMonth && selected === today.d
                  ? "오늘은 아직 올라온 기록이 없어요 ☁️"
                  : "이 날의 기록이 없어요"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* overlays — reused from the home page */}
      <PhotoLightbox photo={photo} onClose={() => setPhoto(null)} />
      <VideoModal video={video} onClose={() => setVideo(null)} />
    </div>
  );
};

export default Calendar;
