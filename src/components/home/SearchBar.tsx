"use client";

import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/search")}
      className="w-full flex items-center gap-2 px-4 h-10 bg-surface-muted rounded-full text-left"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbbbbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="text-[14px] text-text-placeholder">搜尋電影、戲院</span>
    </button>
  );
}
