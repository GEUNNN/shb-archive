"use client";

import React, { FC } from "react";
import { usePathname } from "next/navigation";
import { MascotPair, CatFace, HamsterFace } from "@/components/diary/Mascots";

const TITLES: Record<string, { sub: string; title: string; mascot: "cat" | "hamster" }> = {
  "/photos": { sub: "PHOTO", title: "갤러리", mascot: "cat" },
  "/videos": { sub: "VIDEO", title: "영상", mascot: "hamster" },
};

const Header: FC = () => {
  const pathname = usePathname();
  const meta = TITLES[pathname];

  return (
    <header className="fixed top-0 left-1/2 z-20 flex h-[55px] w-[375px] -translate-x-1/2 items-center justify-between bg-bgsky/80 px-[18px] backdrop-blur-md">
      {meta ? (
        <>
          <div>
            <div className="font-mono text-[10px] font-bold tracking-[2.5px] text-sky">
              {meta.sub}
            </div>
            <div className="whitespace-nowrap font-display text-[22px] font-extrabold leading-none text-ink">
              {meta.title}
            </div>
          </div>
          {meta.mascot === "cat" ? <CatFace size={32} /> : <HamsterFace size={32} />}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2.5">
            <MascotPair size={30} />
            <div className="leading-none">
              <div className="font-display text-[18px] font-extrabold text-ink">성한빈</div>
              <div className="mt-0.5 font-mono text-[9.5px] font-bold tracking-[2.5px] text-sky">
                ARCHIVE ☁️
              </div>
            </div>
          </div>
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-surface shadow-[0_3px_10px_rgba(80,140,200,0.14)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#4fb0ef">
              <path d="M12 2 C12.8 8 16 11.2 22 12 C16 12.8 12.8 16 12 22 C11.2 16 8 12.8 2 12 C8 11.2 11.2 8 12 2 Z" />
            </svg>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
