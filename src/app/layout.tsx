import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import SearchOverlay from "@/components/search/SearchOverlay";
import { ToastProvider } from "@/context/ToastContext";
import { SearchProvider } from "@/context/SearchContext";

export const metadata: Metadata = {
  title: "GoMovie 走入戲院 | 台灣電影場次整合",
  description:
    "查詢台北市最新電影場次、票房排行、院線資訊，一站掌握今日上映時刻表。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full bg-surface-base text-text-primary antialiased pb-14">
        <ToastProvider>
          <SearchProvider>
            {children}
            <SearchOverlay />
            <BottomNav />
          </SearchProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
