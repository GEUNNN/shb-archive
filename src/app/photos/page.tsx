"use client";
import React, { FC } from "react";
import { PhotoItem } from "./components/PhotoItem";
import { Badge } from "@/components/ui/badge";

const filter = [
  { type: "인스타", value: "인스타" },
  { type: "멤트", value: "멤트" },
  { type: "플챗", value: "플챗" },
];

const Photo: FC = () => {
  const arr = [1, 2, 3, 4, 5];

  return (
    <div className="p-2 grid grid-cols-1 gap-4">
      <div className="px-1 flex justify-end gap-3 sticky top-0 bg-white z-10 py-2">
        {filter.map((item) => (
          <Badge
            key={item.type}
            className="bg-[#F09884] text-white"
            onClick={() => console.log(item.value)}
          >
            {item.type}
          </Badge>
        ))}
      </div>
      {arr.map((item, idx) => (
        <PhotoItem key={idx} />
      ))}
    </div>
  );
};

export default Photo;
