"use client";

import React, { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface FooterItemProps {
  menu: string;
  href: string;
  icon: string;
  isActive: boolean;
}

const FooterItem = ({ menu, href, icon, isActive }: FooterItemProps) => {
  const iconPath = isActive
    ? `/assets/${icon}-selected.svg`
    : `/assets/${icon}.svg`;

  return (
    <li>
      <Link href={href} className="flex flex-col items-center">
        <Image src={iconPath} alt={`${menu} icon`} width={24} height={24} />
        <span className="text-xs">{menu}</span>
      </Link>
    </li>
  );
};

const Footer: FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "HOME", href: "/", icon: "home" },
    { name: "PHOTOS", href: "/photos", icon: "photos" },
    { name: "VIDEOS", href: "/videos", icon: "videos" },
  ];

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] h-[64px] bg-white px-5 py-2 shadow-md z-10">
      <ul className="flex justify-between">
        {menuItems.map((item, idx) => (
          <FooterItem
            key={idx}
            href={item.href}
            menu={item.name}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
