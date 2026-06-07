"use client";
import React, { FC } from "react";
import { PhotoItem } from "./components/PhotoItem";
import { Badge } from "@/components/ui/badge";

const filter = [
  { type: "인스타", value: "인스타" },
  { type: "멤트", value: "멤트" },
  { type: "플챗", value: "플챗" },
];

const photoData = [
  {
    photos: [
      "https://pbs.twimg.com/media/GrUUB46aQAECcmy?format=jpg&name=large",
      "https://pbs.twimg.com/media/GrUUB5nbkAA760Y?format=jpg&name=large",
    ],
    description: "2023.10.01",
    date: "2025-05-20",
  },
  {
    photos: [
      "https://i.namu.wiki/i/jZjjVsTYuHrEwTwDLeqIOcURmqDvRMvmz25AYzkrWeVhnqNMeNRnX4D_uby8O2gCDvtr1Ze09dwJ4Nueus61IwjSLQktIIe1Fn9lBmNqYCPIc7UNqlcDPSFhdfxYyYG7jmOpCfizNSkwatTKQodETg.webp",
      "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2024/07/21/a29d0922-0961-4ebb-828b-7aeaeec6e977.jpg",
    ],
  },
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
      {photoData.map((item, idx) => (
        <PhotoItem
          key={idx}
          photos={item.photos}
          description={item.description}
          date={item.date}
        />
      ))}
    </div>
  );
};

export default Photo;
