import { ReactNode } from "react";
import { HamsterFace, CatFace } from "./Mascots";

interface SectionHeadProps {
  title: string;
  sub?: string;
  mascot?: "hamster" | "cat";
  right?: ReactNode;
}

const SectionHead = ({ title, sub, mascot, right }: SectionHeadProps) => {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div className="flex items-center gap-2">
        {mascot === "hamster" && <HamsterFace size={26} />}
        {mascot === "cat" && <CatFace size={26} />}
        <div>
          {sub && (
            <div className="font-mono text-[10px] font-bold tracking-[2px] text-sky">
              {sub}
            </div>
          )}
          <div className="whitespace-nowrap font-display text-[20px] font-extrabold leading-tight text-ink">
            {title}
          </div>
        </div>
      </div>
      {right}
    </div>
  );
};

export default SectionHead;
