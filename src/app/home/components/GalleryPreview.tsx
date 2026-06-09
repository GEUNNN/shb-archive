import Link from "next/link";
import Film from "@/components/diary/Film";
import Chip from "@/components/diary/Chip";
import SectionHead from "@/components/diary/SectionHead";
import { GALLERY } from "@/lib/data";

interface GalleryPreviewProps {
  onOpenPhoto: (f: number) => void;
}

export default function GalleryPreview({ onOpenPhoto }: GalleryPreviewProps) {
  const items = GALLERY.slice(0, 4);
  return (
    <div className="mt-[26px] px-[18px]">
      <SectionHead
        title="최근 갤러리"
        sub="PHOTO"
        mascot="cat"
        right={
          <Link href="/photos" className="font-bold text-[12.5px] text-sky">
            더보기 ›
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((g) => (
          <button
            key={g.id}
            onClick={() => onOpenPhoto(g.f)}
            className="relative aspect-square overflow-hidden rounded-[18px]"
            style={{ boxShadow: "0 5px 14px rgba(80,140,200,0.14)" }}
          >
            <Film f={g.f} glyph="camera" radius={18} />
            <span className="absolute bottom-2 left-2">
              <Chip tone="ghost" className="px-2 py-1 text-[10px]">
                {g.tag}
              </Chip>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
