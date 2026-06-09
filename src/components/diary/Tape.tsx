import { CSSProperties } from "react";

interface TapeProps {
  w?: number;
  deg?: number;
  style?: CSSProperties;
}

// Coral masking-tape strip — pins down taped polaroids.
const Tape = ({ w = 64, deg = -8, style }: TapeProps) => {
  return (
    <span
      className="absolute rounded-[2px]"
      style={{
        width: w,
        height: 22,
        transform: `rotate(${deg}deg)`,
        background: "color-mix(in srgb, #F09884 62%, transparent)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0 5px, rgba(255,255,255,0.18) 5px 6px)",
        ...style,
      }}
    />
  );
};

export default Tape;
