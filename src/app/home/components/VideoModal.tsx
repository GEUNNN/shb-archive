"use client";

import { useEffect } from "react";
import Film from "@/components/diary/Film";
import { Video } from "@/lib/data";

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, onClose]);

  if (!video) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c1c2a]/80 px-[18px] backdrop-blur-sm animate-in fade-in duration-200"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="닫기"
        className="absolute right-[18px] top-[60px] flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[19px] text-[#456] shadow-lg"
      >
        ✕
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[350px] overflow-hidden rounded-[22px] shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* TODO(shorts): when video.isShorts, render a vertical 9:16 player
            (narrow ~270px wrapper) instead of this 16:10 box. Part of the
            planned Shorts work: (1) /shorts tab, (2) shorts layout. Until then
            Shorts play letterboxed in this landscape box. */}
        <div className="relative aspect-[16/10] w-full bg-black">
          {video.yt ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <Film f={video.f} glyph="cloud" radius={0} />
          )}
        </div>
        <div className="bg-white px-4 py-3.5">
          <div className="font-display text-[16px] font-extrabold leading-snug text-ink">
            {video.title}
          </div>
          <div className="mt-[5px] text-[12px] text-sub">
            조회수 {video.views} · {video.date}
          </div>
        </div>
      </div>
    </div>
  );
}
