import Film from "@/components/diary/Film";
import Tape from "@/components/diary/Tape";
import { Album } from "@/lib/data";

interface AlbumCardProps {
  album: Album;
  k: number; // masonry index — drives rotation / tape placement
  onOpen: (album: Album) => void;
}

const TAPE_DEG = [-9, 7, 6, -8, 8, -6];
const TAPE_POS = ["34%", "40%", "30%", "44%", "36%", "38%"];

// Stacked-polaroid card: two rotated white backings (the "stack" of a
// multi-photo post) + front polaroid with coral tape + count badge.
export default function AlbumCard({ album, k, onOpen }: AlbumCardProps) {
  const count = album.images.length || album.photos.length;
  return (
    <button
      onClick={() => onOpen(album)}
      className="relative mb-[26px] block w-full break-inside-avoid text-left"
    >
      {/* backing layers — give the post its scrapbook "stack" tilt */}
      <span
        className="absolute inset-0 rounded-[4px] bg-white"
        style={{ transform: "rotate(2.6deg)", boxShadow: "0 6px 15px rgba(80,140,200,0.16)" }}
      />
      <span className="absolute inset-0 rounded-[4px] bg-white" style={{ transform: "rotate(-1.6deg)" }} />
      <div
        className="relative rounded-[4px] bg-white p-2 pb-3"
        style={{ boxShadow: "0 8px 20px rgba(80,140,200,0.2)" }}
      >
        <Tape
          w={58}
          deg={TAPE_DEG[k % TAPE_DEG.length]}
          style={{ top: -9, left: TAPE_POS[k % TAPE_POS.length] }}
        />
        <div
          className="relative w-full overflow-hidden rounded-[2px]"
          style={{ aspectRatio: `1 / ${album.ratio}` }}
        >
          <Film src={album.images[0]} f={album.photos[0]} glyph="camera" radius={2} alt={album.cap} />
          {/* photo-count badge — hidden for single-photo posts */}
          {count > 1 && (
            <span className="absolute right-2 top-2 z-[3] inline-flex items-center gap-1 rounded-chip bg-black/50 px-1.5 py-[3px] font-mono text-[10px] font-bold text-white">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
                <rect x="8" y="3" width="13" height="13" rx="2.5" opacity="0.55" />
                <rect x="3" y="8" width="13" height="13" rx="2.5" />
              </svg>
              {count}
            </span>
          )}
        </div>
        <div className="mt-3 px-0.5">
        <div className="truncate whitespace-nowrap font-display text-[12.5px] font-extrabold leading-tight text-ink">
          {album.cap}
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-mono text-[8px] tracking-[0.5px] text-sub">{album.date}</span>
          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-[#c2503a]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#F09884">
              <path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" />
            </svg>
            {album.likes.toLocaleString()}
          </span>
        </div>
        </div>
      </div>
    </button>
  );
}
