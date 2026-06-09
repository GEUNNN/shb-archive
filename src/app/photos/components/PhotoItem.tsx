"use client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import React, { FC } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface PhotoItemProps {
  description?: string;
  photos?: string[];
  tags?: string[];
  date?: string;
}

export const PhotoItem: FC<PhotoItemProps> = ({
  photos,
  description,
  tags,
  date,
}) => {
  return (
    <Card className="w-full border-transparent shadow-none">
      {photos && photos.length === 1 && (
        <div className="relative w-full aspect-square">
          <Image
            src={photos[0]}
            alt={tags ? tags[0] : "shb photo"}
            fill
            className="object-contain"
          />
        </div>
      )}
      {photos && photos.length > 1 && (
        <div className="relative w-full aspect-square">
          <Swiper
            pagination={{ dynamicBullets: true }}
            style={{ "--swiper-pagination-color": "#F09884" }}
            modules={[Pagination]}
            className="w-full h-full"
          >
            {photos.map((photo, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <Image
                    src={photo}
                    alt={tags ? tags[idx] : "shb photo"}
                    fill
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination-bullets mb-10" />
          </Swiper>
        </div>
      )}
      <div className="flex flex-col gap-2 flex-wrap mt-2">
        <CardTitle className="self-center">{description}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </div>
    </Card>
  );
};
