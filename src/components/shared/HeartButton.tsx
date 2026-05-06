"use client";

import { useState, useEffect } from "react";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";

export default function HeartButton({
  movieId,
  size = 20,
  className = "",
}: {
  movieId: string;
  size?: number;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(movieId));
  }, [movieId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleWatchlist(movieId);
    setSaved(newState);
    window.dispatchEvent(new CustomEvent("watchlist-change"));
  };

  return (
    <button onClick={handleToggle} className={`${className}`} aria-label={saved ? "從想看清單移除" : "加入想看清單"}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={saved ? "#d94f2a" : "none"}
        stroke={saved ? "#d94f2a" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
