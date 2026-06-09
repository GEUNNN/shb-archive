"use client";

import { useState } from "react";
import Image from "next/image";
import Film from "@/components/diary/Film";
import Tape from "@/components/diary/Tape";
import { Video } from "@/lib/data";

interface VideoCardProps {
  video: Video;
  k: number; // feed index — drives tape tilt/placement
}

const TAPE_DEG = [-8, 7, -6, 8, -7, 6];
const TAPE_POS = ["34%", "42%", "30%", "44%", "36%"];

// Full-width taped-polaroid video card. Click swaps the 16:10 slot in place
// for a YouTube iframe (no overlay, no resize) — thumbnail-first.
export default function VideoCard({ video, k }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="px-[18px]">
      <div
        className="relative rounded-[4px] bg-white p-2.5 pb-3"
        style={{ boxShadow: "0 9px 22px rgba(80,140,200,0.2)" }}
      >
        <Tape
          w={62}
          deg={TAPE_DEG[k % TAPE_DEG.length]}
          style={{ top: -10, left: TAPE_POS[k % TAPE_POS.length] }}
        />

        {/* 16:10 media slot — thumbnail until clicked, then real iframe */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] bg-black">
          {playing && video.yt ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button
              onClick={() => video.yt && setPlaying(true)}
              className="block h-full w-full text-left"
              aria-label={`${video.title} 재생`}
            >
              {video.yt ? (
                <Image
                  src={`https://i.ytimg.com/vi/${video.yt}/hqdefault.jpg`}
                  alt={video.title}
                  fill
                  sizes="339px"
                  className="object-cover"
                />
              ) : (
                <Film f={video.f} glyph="cloud" radius={3} />
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/90"
                  style={{ boxShadow: "0 3px 10px rgba(20,50,75,0.25)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2c87cf">
                    <path d="M8 5.5l11 6.5-11 6.5z" />
                  </svg>
                </span>
              </span>
              <span className="absolute bottom-[7px] right-[7px] rounded-[9px] bg-[#0f2841]/70 px-[7px] py-0.5 text-[10.5px] font-bold text-white">
                {video.dur}
              </span>
            </button>
          )}
        </div>

        {/* caption — row1: title + date · row2: author */}
        <div className="mt-2.5 px-0.5">
          <div className="flex items-baseline gap-2">
            <div className="min-w-0 flex-1 truncate font-display text-[15.5px] font-extrabold leading-tight text-ink">
              {video.title}
            </div>
            <span className="shrink-0 font-mono text-[9px] tracking-[0.5px] text-sub">
              {video.date}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11.5px] text-sub">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
            </svg>
            {video.author}
          </div>
        </div>
      </div>
    </div>
  );
}
