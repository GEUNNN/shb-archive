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

  // clickable platform logo → original post (트위터/인스타그램 with a url only)
  const sourceLink =
    album.url && (album.tag === "트위터" || album.tag === "인스타그램") ? (
      <a
        href={album.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${album.tag} 원본 보기`}
        className="inline-flex h-6 w-6 items-center justify-center text-sub transition hover:text-coral hover:opacity-80"
      >
        {album.tag === "트위터" ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-[14px] w-[14px]">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]">
            <defs>
              <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#feda75" />
                <stop offset="0.25" stopColor="#fa7e1e" />
                <stop offset="0.5" stopColor="#d62976" />
                <stop offset="0.75" stopColor="#962fbf" />
                <stop offset="1" stopColor="#4f5bd5" />
              </linearGradient>
            </defs>
            <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#ig-grad)" />
            <rect x="6.25" y="6.25" width="11.5" height="11.5" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" strokeWidth="1.7" />
            <circle cx="17.2" cy="6.8" r="1.05" fill="#fff" />
          </svg>
        )}
      </a>
    ) : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#14283c]/60 px-5 pb-10 pt-16 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="닫기"
        className="absolute right-[18px] top-[60px] z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[19px] text-[#456] shadow-lg"
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="relative w-full shrink-0">
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
                    className="h-auto w-full"
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

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-2.5">
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto whitespace-pre-line font-display text-[18px] font-extrabold leading-snug text-ink">{album.cap}</div>
          <div className="mt-1.5 flex shrink-0 items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-sub">
              {album.date} · 사진 {total}장
              {sourceLink}
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
