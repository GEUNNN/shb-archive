"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import Film from "@/components/diary/Film";
import Chip from "@/components/diary/Chip";
import { Album } from "@/lib/data";

import "swiper/css";
import "swiper/css/pagination";

interface AlbumViewerProps {
  album: Album | null;
  onClose: () => void;
}

// Full-screen album overlay — Swiper carousel through one post's shots.
export default function AlbumViewer({ album, onClose }: AlbumViewerProps) {
  const [index, setIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (!album) return;
    setIndex(0);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [album, onClose]);

  if (!album) return null;
  // real images when present, else the gradient placeholders
  const shots: { src?: string; f?: number }[] = album.images.length
    ? album.images.map((url) => ({ src: url }))
    : album.photos.map((f) => ({ f }));
  const total = shots.length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#14283c]/60 px-5 pb-10 pt-16 backdrop-blur-sm animate-in fade-in duration-200"
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
        className="w-full max-w-[340px] overflow-hidden rounded-[24px] bg-white shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="relative w-full">
          <Swiper
            modules={[Pagination]}
            pagination={{ dynamicBullets: true }}
            style={{ "--swiper-pagination-color": "#4fb0ef" } as React.CSSProperties}
            onSwiper={setSwiper}
            loop={total > 1}
            autoHeight
            onSlideChange={(s) => setIndex(s.realIndex)}
            className="w-full"
          >
            {shots.map((s, k) => (
              <SwiperSlide key={k}>
                {s.src ? (
                  // hug the image: natural aspect, capped to viewport, no crop
                  <Image
                    src={s.src}
                    alt={album.cap}
                    width={0}
                    height={0}
                    sizes="(max-width: 375px) 100vw, 340px"
                    className="mx-auto h-auto max-h-[80vh] w-auto max-w-full"
                    onLoad={() => swiper?.updateAutoHeight()}
                  />
                ) : (
                  <div className="relative aspect-[3/4] w-full">
                    <Film f={s.f} glyph="camera" radius={0} />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          {/* edge navigation arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  swiper?.slidePrev();
                }}
                aria-label="이전 사진"
                className="absolute left-2.5 top-1/2 z-10 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[20px] leading-none text-[#456] shadow-[0_3px_10px_rgba(0,0,0,0.2)]"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  swiper?.slideNext();
                }}
                aria-label="다음 사진"
                className="absolute right-2.5 top-1/2 z-10 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[20px] leading-none text-[#456] shadow-[0_3px_10px_rgba(0,0,0,0.2)]"
              >
                ›
              </button>
            </>
          )}
          {/* platform chip + counter sit above the swiper */}
          <span className="pointer-events-none absolute left-3 top-3 z-10">
            <Chip tone="ghost">{album.tag}</Chip>
          </span>
          {total > 1 && (
            <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-chip bg-black/50 px-2.5 py-[3px] font-mono text-[11px] font-bold text-white">
              {index + 1} / {total}
            </span>
          )}
        </div>

        <div className="px-4 pb-4 pt-2.5">
          <div className="font-display text-[18px] font-extrabold text-ink">{album.cap}</div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[12.5px] text-sub">
              {album.date} · 사진 {total}장
            </span>
            <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-skyDeep">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#F09884">
                <path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" />
              </svg>
              {album.likes.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
