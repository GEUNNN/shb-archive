"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabItem {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

// active = sky #4fb0ef (fill/stroke + soft #cfeaff fill), inactive = sub #6b8aa3
const TABS: TabItem[] = [
  {
    label: "홈",
    href: "/",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "#4fb0ef" : "none"} stroke={a ? "#4fb0ef" : "#6b8aa3"} strokeWidth="2" strokeLinejoin="round">
        <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    label: "갤러리",
    href: "/photos",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#4fb0ef" : "#6b8aa3"} strokeWidth="2">
        <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill={a ? "#cfeaff" : "none"} />
        <circle cx="9" cy="9" r="2" fill={a ? "#4fb0ef" : "none"} stroke={a ? "#4fb0ef" : "#6b8aa3"} />
        <path d="M4 17l5-4 4 3 4-4 3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "영상",
    href: "/videos",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#4fb0ef" : "#6b8aa3"} strokeWidth="2">
        <rect x="3" y="5.5" width="18" height="13" rx="3.5" fill={a ? "#cfeaff" : "none"} />
        <path d="M10.5 9.5l4 2.5-4 2.5z" fill={a ? "#4fb0ef" : "#6b8aa3"} stroke="none" />
      </svg>
    ),
  },
  {
    label: "캘린더",
    href: "/calendar",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#4fb0ef" : "#6b8aa3"} strokeWidth="2">
        <rect x="3.5" y="5" width="17" height="15" rx="3.5" fill={a ? "#cfeaff" : "none"} />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
        <circle cx="12" cy="14.5" r="1.6" fill={a ? "#4fb0ef" : "#6b8aa3"} stroke="none" />
      </svg>
    ),
  },
];

const Footer: FC = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 z-10 flex h-[64px] w-[375px] -translate-x-1/2 items-stretch justify-around border-t border-sky/15 bg-white/[0.86] px-3 pb-1.5 pt-2 backdrop-blur-xl">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-1 flex-col items-center justify-center gap-[3px]"
          >
            <span
              className="transition-transform duration-200"
              style={{ transform: active ? "translateY(-1px)" : "none" }}
            >
              {t.icon(active)}
            </span>
            <span
              className="text-[10.5px]"
              style={{
                fontWeight: active ? 800 : 600,
                color: active ? "#4fb0ef" : "#6b8aa3",
              }}
            >
              {t.label}
            </span>
          </Link>
        );
      })}
    </footer>
  );
};

export default Footer;
