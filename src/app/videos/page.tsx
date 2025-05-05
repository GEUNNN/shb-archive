import React, { FC } from "react";
import VideoItem from "./components/videoItem";

const Video: FC = () => {
  const videos = [
    {
      title: "focused cam",
      thumbnail:
        "https://i.ytimg.com/vi/3JLV992Zxbo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDOtfHnlSW2CfoZ11FRcEWnb0b-xw",
      date: "",
    },
    {
      title: "focused cam",
      thumbnail:
        "https://i.ytimg.com/vi/3JLV992Zxbo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDOtfHnlSW2CfoZ11FRcEWnb0b-xw",
      date: "",
    },
    {
      title: "focused cam",
      thumbnail:
        "https://i.ytimg.com/vi/3JLV992Zxbo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDOtfHnlSW2CfoZ11FRcEWnb0b-xw",
      date: "2025-05-01",
    },
    {
      title: "focused cam",
      thumbnail:
        "https://i.ytimg.com/vi/Za75TeSyV3s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB-8OacGnCVuwXomlxaYrTGj7hmxQ",
      date: "2025-05-01",
    },
  ];

  return (
    <div className="px-1 grid grid-cols-1 gap-4">
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
