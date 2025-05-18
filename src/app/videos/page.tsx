"use client";
import React, { FC } from "react";
import { Badge } from "@/components/ui/badge";

import VideoItem from "./components/videoItem";

const videos = [
  {
    title: "focused cam",
    thumbnail:
      "https://i.ytimg.com/vi/3JLV992Zxbo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDOtfHnlSW2CfoZ11FRcEWnb0b-xw",
    date: "",
    type: "직캠",
  },
  {
    title: "focused cam",
    thumbnail:
      "https://i.ytimg.com/vi/3JLV992Zxbo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDOtfHnlSW2CfoZ11FRcEWnb0b-xw",
    date: "",
    type: "직캠",
  },
  {
    title: "focused cam",
    thumbnail:
      "https://i.ytimg.com/vi/3JLV992Zxbo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDOtfHnlSW2CfoZ11FRcEWnb0b-xw",
    date: "2025-05-01",
    type: "직캠",
  },
  {
    title: "focused cam",
    thumbnail:
      "https://i.ytimg.com/vi/Za75TeSyV3s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB-8OacGnCVuwXomlxaYrTGj7hmxQ",
    date: "2025-05-01",
    type: "직캠",
  },
];

const filter = [
  { type: "뮤비", value: "뮤비" },
  { type: "음방", value: "음방" },
  { type: "직캠", value: "직캠" },
];

const Video: FC = () => {
  console.log("video");

  return (
    <div className="p-2 grid grid-cols-1 gap-4">
      <div className="px-1 flex justify-end gap-3">
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
      {videos.map((item, index) => (
        <VideoItem
          key={index}
          title={item.title}
          thumbnail={item.thumbnail}
          date={item.date}
        />
      ))}
    </div>
  );
};

export default Video;
