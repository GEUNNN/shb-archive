import { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { FILMS, Glyph } from "@/lib/data";

interface FilmProps {
  f?: number;
  src?: string; // real image URL (R2). When set, renders next/image instead of the gradient.
  alt?: string;
  radius?: number | string;
  glyph?: Glyph;
  children?: ReactNode;
  style?: CSSProperties;
}

// Photo/video frame. With a real `src` it renders next/image (object-cover);
// without one it falls back to the gradient placeholder ("필름").
export default function Film({ f = 0, src, alt = "", radius, glyph = "cloud", children, style }: FilmProps) {
  if (src) {
    return (
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ borderRadius: radius ?? "inherit", ...style }}
      >
        <Image src={src} alt={alt} fill sizes="375px" className="object-cover" />
        {children}
      </div>
    );
  }

  const [c0, c1] = FILMS[f] ?? FILMS[0];
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: `linear-gradient(150deg, ${c0} 0%, ${c1} 100%)`,
        borderRadius: radius ?? "inherit",
        ...style,
      }}
    >
      {/* dotted texture */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1.1px, transparent 1.2px)",
          backgroundSize: "13px 13px",
        }}
      />
      {/* sheen */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.42), rgba(255,255,255,0) 42%)" }}
      />
      {/* center glyph */}
      <div className="absolute inset-0 flex items-center justify-center text-white/85">
        {glyph === "cloud" ? (
          <svg width="44" height="30" viewBox="0 0 44 30" fill="rgba(255,255,255,0.78)">
            <path d="M12 27 a9 9 0 0 1 0-18 a11 11 0 0 1 21 2 a8 8 0 0 1 -2 16 Z" />
          </svg>
        ) : (
          <svg width="40" height="34" viewBox="0 0 40 34" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.4">
            <rect x="3" y="8" width="34" height="23" rx="5" />
            <circle cx="20" cy="19.5" r="6.5" />
            <path d="M14 8l2.5-4h7L26 8" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}
