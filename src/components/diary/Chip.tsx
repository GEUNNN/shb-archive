import { CSSProperties, ReactNode } from "react";

type Tone = "soft" | "solid" | "ghost" | "accent" | "coral";

const TONES: Record<Tone, string> = {
  soft: "bg-soft text-skyDeep",
  solid: "bg-sky text-white",
  ghost: "bg-white/60 text-ink",
  accent: "bg-star text-[#5a4410]",
  coral: "bg-coralSoft text-[#c2503a]",
};

interface ChipProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}

export default function Chip({ children, tone = "soft", className = "", style }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-chip px-2.5 py-[5px] text-[11.5px] font-bold leading-none whitespace-nowrap ${TONES[tone]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
