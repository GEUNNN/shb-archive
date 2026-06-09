"use client";

import { useEffect } from "react";
import Film from "@/components/diary/Film";
import { Glyph } from "@/lib/data";

export interface LightboxPhoto {
  f: number;
  glyph?: Glyph;
}

interface PhotoLightboxProps {
  photo: LightboxPhoto | null;
  onClose: () => void;
}

export default function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, onClose]);

  if (!photo) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#14283c]/60 px-5 backdrop-blur-sm animate-in fade-in duration-200"
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
        <div className="relative aspect-square max-h-[440px] w-full">
          <Film f={photo.f} glyph={photo.glyph ?? "camera"} radius={0} />
        </div>
        <div className="px-4 py-3.5 font-mono text-[10.5px] tracking-[2px] text-sub">PHOTO</div>
      </div>
    </div>
  );
}
