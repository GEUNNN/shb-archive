import React, { FC } from "react";

const Header: FC = () => {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-[375px] h-[55px] bg-white z-10 flex items-center justify-center">
      <h1 className="font-bold">햄냥이 아카이브</h1>
    </header>
  );
};

export default Header;
