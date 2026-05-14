"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

const NAV_ITEMS: {
  label: string;
  href: string;
  icon: string;
  disabled?: boolean;
  isSearch?: boolean;
}[] = [
  { label: "首頁", href: "/", icon: "home" },
  { label: "搜尋", href: "/search", icon: "search", isSearch: true },
  { label: "收藏", href: "/collection", icon: "heart" },
  { label: "我的", href: "/profile", icon: "user", disabled: true },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#1a1814" : "#cccccc";

  switch (icon) {
    case "home":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "search":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "heart":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "user":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function BottomNav() {
  const pathname = usePathname();
  const { open } = useSearch();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card border-t border-border-default">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex flex-col items-center justify-center gap-0.5 opacity-40"
              >
                <NavIcon icon={item.icon} active={false} />
                <span className="text-[10px] text-text-muted">{item.label}</span>
              </div>
            );
          }

          if (item.isSearch) {
            return (
              <button
                key={item.href}
                onClick={open}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <NavIcon icon={item.icon} active={false} />
                <span className="text-[10px] text-[#cccccc]">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <NavIcon icon={item.icon} active={isActive} />
              <span
                className={`text-[10px] ${
                  isActive ? "text-text-primary font-medium" : "text-[#cccccc]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
