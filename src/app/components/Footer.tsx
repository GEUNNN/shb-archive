import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="absolute bottom-0 left-0 w-full">
      <ul className="flex justify-between">
        <li>Home</li>
        <li>Photo</li>
        <li>Video</li>
      </ul>
    </footer>
  );
};

export default Footer;
