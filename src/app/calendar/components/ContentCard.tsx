"use client";

import Film from "@/components/diary/Film";
import Chip from "@/components/diary/Chip";
import Tape from "@/components/diary/Tape";
import { DayItem } from "@/lib/calendar";

interface ContentCardProps {
  item: DayItem;
  onOpenPhoto: (f: number, src?: string) => void; // → PhotoLightbox
  onPlay: (item: Extract<DayItem, { kind: "video" }>) => void; // → VideoModal
}

// Diary day-content row: coral-taped white card, Film thumb (play overlay for
// video), photo/video chip, handwritten title, likes/views meta.
export default function ContentCard({ item, onOpenPhoto, onPlay }: ContentCardProps) {
  const isVideo = item.kind === "video";

  const open = () => {
    if (item.kind === "video") onPlay(item);
    else onOpenPhoto(item.f, item.src);
  };

  return (
    <button
      onClick={open}
      className="relative flex items-center gap-3 rounded-[5px] bg-white py-[11px] pl-[11px] pr-[13px] text-left"
      style={{ boxShadow: "0 7px 18px rgba(80,140,200,0.18)" }}
    >
      <Tape w={44} deg={-5} style={{ top: -7, left: "50%", marginLeft: -22, zIndex: 2 }} />

      {/* thumbnail */}
      <div className="relative h-[60px] w-[78px] shrink-0 overflow-hidden rounded-[3px]">
        <Film src={item.kind === "photo" ? item.src : undefined} f={item.f} glyph={isVideo ? "cloud" : "camera"} radius={0} alt={item.title} />
        {isVideo && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/90">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#2c87cf">
                <path d="M8 5.5l11 6.5-11 6.5z" />
              </svg>
            </span>
          </span>
        )}
      </div>

      {/* meta */}
      <div className="min-w-0 flex-1">
        <Chip tone={isVideo ? "coral" : "soft"} className="text-[9.5px]" style={{ padding: "3px 8px" }}>
          {isVideo ? "▶ 영상" : "📷 사진"}
        </Chip>
        <div className="my-1 truncate font-display text-[14px] font-extrabold leading-tight text-ink">
          {item.title}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-sub">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#F09884">
            <path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" />
          </svg>
          {item.kind === "video" ? `조회수 ${item.views}` : item.likes.toLocaleString()}
        </div>
      </div>
    </button>
  );
}
