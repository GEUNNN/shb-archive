import React, { FC } from "react";
import { PhotoItem } from "./components/PhotoItem";

const Photo: FC = () => {
  const arr = [1, 2, 3, 4, 5];

  return (
    <div>
      {arr.map((item, idx) => (
        <PhotoItem key={idx} />
      ))}
    </div>
  );
};

export default Photo;
