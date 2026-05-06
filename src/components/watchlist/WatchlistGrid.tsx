"use client";

import Image from "next/image";
import Link from "next/link";
import type { Movie, ShowtimeWithCinema } from "@/types";
import { toggleWatchlist } from "@/lib/watchlist";
import { useState } from "react";

function StatusBadge({ status }: { status: Movie["status"] }) {
  if (status === "showing") {
    return (
      <span className="absolute bottom-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-[#eef6ee] text-green-700 font-medium">
        上映中
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span className="absolute bottom-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-[#f5f0e8] text-amber-700 font-medium">
        即將上映
      </span>
    );
  }
  return (
    <span className="absolute bottom-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-surface-muted text-text-muted font-medium">
      已下映
    </span>
  );
}

interface MovieWithNextShowtime extends Movie {
  nextShowtime?: string;
}

export default function WatchlistGrid({
  movies,
}: {
  movies: MovieWithNextShowtime[];
}) {
  const [list, setList] = useState(movies);

  const handleRemove = (movieId: string) => {
    toggleWatchlist(movieId);
    setList((prev) => prev.filter((m) => m.id !== movieId));
    window.dispatchEvent(new CustomEvent("watchlist-change"));
  };

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {list.map((movie) => (
        <div key={movie.id} className="relative">
          <Link href={`/movies/${movie.id}`}>
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface-muted">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title_zh}
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 50vw, 256px"
                />
              ) : (
                <div className="w-full h-full bg-surface-muted" />
              )}

              {/* Heart button — filled, removes on click */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(movie.id);
                }}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/30"
                aria-label="從想看清單移除"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#d94f2a" stroke="#d94f2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              <StatusBadge status={movie.status} />
            </div>

            <p className="mt-1.5 text-[12px] font-medium text-text-primary leading-tight line-clamp-2">
              {movie.title_zh}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              {movie.status === "showing" && movie.nextShowtime
                ? `最近場次 ${movie.nextShowtime}`
                : movie.status === "coming_soon"
                ? "尚未排片"
                : ""}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
