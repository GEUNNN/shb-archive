import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../app/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
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
    <html lang="en">
      <body
        className={`${pretendard.className} antialiased min-h-screen flex justify-center items-center`}
      >
        <div className="relative w-[375px] min-h-screen bg-white shadow-lg overflow-hidden">
          <Header />
          <main className="absolute top-[55px] bottom-[64px] w-full overflow-y-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
