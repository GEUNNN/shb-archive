"use client";

import { FC, useState } from "react";
import { Album } from "@/lib/data";
import AlbumCard from "./components/AlbumCard";
import AlbumViewer from "./components/AlbumViewer";

const TAGS = ["전체", "인스타그램", "트위터", "플러스챗"];

const PhotosClient: FC<{ albums: Album[] }> = ({ albums }) => {
  const [filter, setFilter] = useState("전체");
  const [album, setAlbum] = useState<Album | null>(null);

  const visible = albums.filter((a) => filter === "전체" || a.tag === filter);

  return (
    <div className="pb-7">
      {/* scrapbook intro */}
      <div className="flex items-center gap-1.5 px-[18px] pb-1">
        <span className="whitespace-nowrap font-display text-[15px] font-extrabold text-ink">
          한빈이의 앨범
        </span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#F09884" style={{ transform: "rotate(-8deg)" }}>
          <path d="M12 21s-7-4.6-9.3-9C1 8.6 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.3 6.5C19 16.4 12 21 12 21z" />
        </svg>
        <span className="ml-auto font-mono text-[10px] text-sub">{visible.length} POSTS</span>
      </div>

      {/* sticky filter row */}
      <div className="sticky top-0 z-20 flex gap-[7px] overflow-x-auto bg-bgsky px-[18px] pb-3.5 pt-2 [scrollbar-width:none]">
        {TAGS.map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`whitespace-nowrap rounded-chip px-[13px] py-[7px] text-[12px] font-bold transition-colors ${
                active ? "bg-sky text-white" : "bg-surface text-sub"
              }`}
              style={{
                boxShadow: active
                  ? "0 4px 12px rgba(80,150,210,0.3)"
                  : "0 2px 6px rgba(80,140,200,0.1)",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* 2-column grid — row-major so date order reads newest → top-left → right */}
      <div className="grid grid-cols-2 gap-x-[14px] px-3 pt-1.5">
        {visible.map((a, k) => (
          <AlbumCard key={a.id} album={a} k={k} onOpen={setAlbum} />
        ))}
      </div>

      <AlbumViewer album={album} onClose={() => setAlbum(null)} />
    </div>
  );
};

export default PhotosClient;
