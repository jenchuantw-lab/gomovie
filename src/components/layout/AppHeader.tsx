"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  showBack?: boolean;
}

export default function AppHeader({ showBack = false }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center px-4 h-12 bg-surface-base">
      {showBack ? (
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center -ml-2"
            aria-label="返回"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1814"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-1">
            <span className="text-[16px] font-bold text-text-primary">GoMovie</span>
            <span className="text-[11px] text-text-muted">走入戲院</span>
          </Link>
        </div>
      ) : (
        <Link href="/" className="flex items-center gap-1">
          <span className="text-[22px] font-bold text-text-primary tracking-tight">GoMovie</span>
          <span className="ml-1 text-[13px] text-text-muted">走入戲院</span>
        </Link>
      )}
    </header>
  );
}
