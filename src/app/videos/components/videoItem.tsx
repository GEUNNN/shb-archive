"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import React, { FC } from "react";
import Image from "next/image";

interface VideoItemProps {
  title: string;
  thumbnail: string;
  date: string;
}

const VideoItem: FC<VideoItemProps> = ({ title, thumbnail, date }) => {
  console.log("videoItem");
  return (
    <Card
      className="w-full border-transparent shadow-none"
      onClick={() => console.log("clicked")}
    >
      <div className="relative w-full aspect-video">
        <Image src={thumbnail} alt={title} fill className="object-cover" />
      </div>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <CardDescription>{date}</CardDescription>
    </Card>
  );
};

export default VideoItem;
