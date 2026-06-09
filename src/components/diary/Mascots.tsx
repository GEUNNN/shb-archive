import Image from "next/image";
import { CSSProperties } from "react";

// Ham-Nyang mascots (hamster 🐹 / cat 🐱). `size` = rendered HEIGHT in px;
// width follows the PNG's intrinsic ratio.
const ART = {
  hamster: { src: "/mascots/mascot-hamster.png", ratio: 204 / 169 },
  cat: { src: "/mascots/mascot-cat.png", ratio: 195 / 172 },
  pair: { src: "/mascots/mascot-pair.png", ratio: 239 / 130 },
  bodies: { src: "/mascots/mascot-bodies.png", ratio: 551 / 273 },
} as const;

interface MascotProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

function Mascot({ kind, size, className, style }: MascotProps & { kind: keyof typeof ART }) {
  const { src, ratio } = ART[kind];
  return (
    <Image
      src={src}
      alt=""
      width={Math.round(size! * ratio)}
      height={size!}
      draggable={false}
      className={`block select-none pointer-events-none ${className ?? ""}`}
      style={style}
      priority
    />
  );
}

export function HamsterFace({ size = 26, ...rest }: MascotProps) {
  return <Mascot kind="hamster" size={size} {...rest} />;
}
export function CatFace({ size = 26, ...rest }: MascotProps) {
  return <Mascot kind="cat" size={size} {...rest} />;
}
// pair art reads small per-face; bump height a touch to match a lone face
export function MascotPair({ size = 34, ...rest }: MascotProps) {
  return <Mascot kind="pair" size={Math.round(size * 1.35)} {...rest} />;
}
export function MascotDuo({ size = 104, ...rest }: MascotProps) {
  return <Mascot kind="bodies" size={size} {...rest} />;
}
