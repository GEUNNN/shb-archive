import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import localFont from "next/font/local";
import { Parisienne } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const pretendard = localFont({
  src: "../app/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

// 박다현 손글씨 — titles / dates / captions only (body stays Pretendard)
const dahyeon = localFont({
  src: "../app/fonts/OwnglyphParkDaHyeon.woff2",
  display: "swap",
  weight: "400",
  variable: "--font-dahyeon",
});

// decorative handwriting — home footer sign-off only
const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-parisienne",
});

export const metadata: Metadata = {
  title: "햄냥이 아카이브",
  description: "햄냥이와 함께 차곡차곡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} ${dahyeon.variable} ${parisienne.variable} antialiased min-h-screen flex justify-center items-center bg-[#e6ebf1]`}
      >
        <div className="relative w-[375px] min-h-screen bg-bgsky shadow-lg overflow-hidden">
          <Header />
          <main className="absolute top-[55px] bottom-[64px] w-full overflow-y-auto overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </div>
        {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
