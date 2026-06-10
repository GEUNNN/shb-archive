"use client";

import { FC, useState } from "react";
import { Video } from "@/lib/data";
import VideoCard from "./components/VideoCard";
import { MascotPair } from "@/components/diary/Mascots";

const TAGS = ["전체", "음악방송", "직캠", "라이브", "비하인드", "자컨"];

const VideosClient: FC<{ videos: Video[] }> = ({ videos }) => {
  const [filter, setFilter] = useState("전체");

  const visible = videos.filter((v) => filter === "전체" || v.tag === filter);

  return (
    <div className="pb-7">
      {/* scrapbook intro */}
      <div className="flex items-center gap-1.5 px-[18px] pb-1">
        <span className="whitespace-nowrap font-display text-[15px] font-extrabold text-ink">
          한빈이의 영상일기
        </span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#F09884" style={{ transform: "rotate(-8deg)" }}>
          <path d="M8 5.5l11 6.5-11 6.5z" />
        </svg>
        <span className="ml-auto font-mono text-[10px] text-sub">{visible.length} VIDEOS</span>
      </div>

      {/* sticky filter row */}
      <div className="sticky top-0 z-20 flex gap-[7px] overflow-x-auto bg-bgsky px-[18px] pb-3.5 pt-2 [scrollbar-width:none]">
        {TAGS.map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`whitespace-nowrap rounded-chip px-[13px] py-[7px] text-[12px] font-bold transition-colors ${
                active ? "bg-sky text-white" : "bg-surface text-sub"
              }`}
              style={{
                boxShadow: active
                  ? "0 4px 12px rgba(80,150,210,0.3)"
                  : "0 2px 6px rgba(80,140,200,0.1)",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* taped polaroid feed */}
      <div className="flex flex-col gap-[26px] pt-2">
        {visible.map((v, k) => (
          <VideoCard key={v.id} video={v} k={k} />
        ))}
      </div>

      {/* empty state */}
      {visible.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-[18px] pt-12 text-center">
          <MascotPair size={84} />
          <p className="text-[13px] leading-relaxed text-sub">
            아직 이 카테고리에 올라온 영상이 없어요 ☁️
          </p>
        </div>
      )}
    </div>
  );
};

export default VideosClient;
