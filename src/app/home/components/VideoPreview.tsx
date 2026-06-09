"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import Film from "@/components/diary/Film";
import SectionHead from "@/components/diary/SectionHead";
import { VIDEOS, Video } from "@/lib/data";

interface VideoPreviewProps {
  onPlay: (v: Video) => void;
}

export default function VideoPreview({ onPlay }: VideoPreviewProps) {
  const items = VIDEOS.slice(0, 4);
  return (
    <div className="mt-[26px] pl-[18px]">
      <div className="pr-[18px]">
        <SectionHead
          title="최근 영상"
          sub="VIDEO"
          mascot="hamster"
          right={
            <Link href="/videos" className="font-bold text-[12.5px] text-sky">
              더보기 ›
            </Link>
          }
        />
      </div>
      <Swiper
        modules={[FreeMode]}
        freeMode
        slidesPerView="auto"
        spaceBetween={11}
        className="!overflow-visible pb-1.5 pr-[18px]"
      >
        {items.map((v) => (
          <SwiperSlide key={v.id} className="!w-[184px]">
            <button
              onClick={() => onPlay(v)}
              className="block w-full text-left"
              aria-label={`${v.title} 영상 재생`}
            >
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px]"
                style={{ boxShadow: "0 5px 14px rgba(80,140,200,0.14)" }}
              >
                {v.yt ? (
                  <Image
                    src={`https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg`}
                    alt={v.title}
                    fill
                    sizes="184px"
                    className="object-cover"
                  />
                ) : (
                  <Film f={v.f} glyph="cloud" radius={16} />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/90"
                    style={{ boxShadow: "0 3px 10px rgba(20,50,75,0.25)" }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="#2c87cf"
                    >
                      <path d="M8 5.5l11 6.5-11 6.5z" />
                    </svg>
                  </span>
                </div>
                <span className="absolute bottom-[7px] right-[7px] rounded-[9px] bg-[#0f2841]/70 px-[7px] py-0.5 text-[10.5px] font-bold text-white">
                  {v.dur}
                </span>
              </div>
              <div className="mt-[7px] truncate text-[12.5px] font-bold leading-snug text-ink">
                {v.title}
              </div>
              <div className="mt-0.5 text-[11px] text-sub">
                조회 {v.views} · {v.date}
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
