"use client";

import { FC, useState } from "react";
import DiaryOnThisDay from "./components/DiaryOnThisDay";
import GalleryPreview from "./components/GalleryPreview";
import VideoPreview from "./components/VideoPreview";
import HomeFooter from "./components/HomeFooter";
import PhotoLightbox, { LightboxPhoto } from "./components/PhotoLightbox";
import VideoModal from "./components/VideoModal";
import { Video } from "@/lib/data";

const HomeMain: FC = () => {
  const [photo, setPhoto] = useState<LightboxPhoto | null>(null);
  const [video, setVideo] = useState<Video | null>(null);

  return (
    <div className="pb-2">
      <DiaryOnThisDay onOpenPhoto={(f) => setPhoto({ f })} />
      <GalleryPreview onOpenPhoto={(f) => setPhoto({ f })} />
      <VideoPreview onPlay={setVideo} />
      <HomeFooter />

      <PhotoLightbox photo={photo} onClose={() => setPhoto(null)} />
      <VideoModal video={video} onClose={() => setVideo(null)} />
    </div>
  );
};

export default HomeMain;
