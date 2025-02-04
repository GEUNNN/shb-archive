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

  console.log("isActive? >>>>>>", icon, isActive);

  return (
    <li>
      <Link href={href} className="flex flex-col items-center">
        <Image src={iconPath} alt={icon} width={24} height={24} />
        <span className="text-xs">{menu}</span>
      </Link>
    </li>
  );
};

const Footer: FC = () => {
  const pathname = usePathname();
  console.log("current pathname >>>>>>", pathname);
  const menuItems = [
    { name: "HOME", href: "/", icon: "home" },
    { name: "PHOTOS", href: "/photos", icon: "photos" },
    { name: "VIDEOS", href: "/videos", icon: "videos" },
  ];

  return (
    <footer className="absolute bottom-0 left-0 w-full px-5 py-2 bg-white shadow-md">
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
