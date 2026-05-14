"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/types";
import { getWatchlist } from "@/lib/watchlist";
import AppHeader from "@/components/layout/AppHeader";
import WatchlistGrid from "@/components/watchlist/WatchlistGrid";
import EmptyWatchlist from "@/components/watchlist/EmptyWatchlist";

export default function CollectionPageClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    const ids = getWatchlist();
    if (ids.length === 0) {
      setMovies([]);
      setLoading(false);
      return;
    }
    const res = await fetch(`/api/movies?ids=${ids.join(",")}`).catch(
      () => null
    );
    const data = res ? await res.json().catch(() => []) : [];
    const ordered = ids
      .map((id) => data.find((m: Movie) => m.id === id))
      .filter(Boolean) as Movie[];
    setMovies(ordered);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
    const handler = () => fetchMovies();
    window.addEventListener("watchlist-change", handler);
    return () => window.removeEventListener("watchlist-change", handler);
  }, []);

  return (
    <main className="max-w-lg mx-auto">
      <div className="pt-safe">
        <AppHeader />
      </div>
      <div className="px-4 pb-3">
        <h1 className="text-[15px] font-bold text-text-primary">收藏清單</h1>
      </div>

      {loading ? (
        <p className="text-center text-text-muted text-[13px] py-12">
          載入中…
        </p>
      ) : movies.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <WatchlistGrid movies={movies} />
      )}
    </main>
  );
}
