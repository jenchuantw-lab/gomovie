"use client";

import { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import type { Movie, ShowtimeWithCinema } from "@/types";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/home/SearchBar";
import MovieCarousel from "@/components/home/MovieCarousel";
import ShowtimeQuickLook from "@/components/home/ShowtimeQuickLook";

interface HomeClientProps {
  movies: Movie[];
  todayShowtimes: (ShowtimeWithCinema & { movies: Movie })[];
}

export default function HomeClient({ movies, todayShowtimes }: HomeClientProps) {
  const { open } = useSearch();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const allGenres = Array.from(
    new Set(movies.flatMap((m) => m.genres ?? []))
  ).sort();

  const filteredMovies = selectedGenre
    ? movies.filter((m) => m.genres?.includes(selectedGenre))
    : movies;

  return (
    <main className="max-w-lg mx-auto">
      <AppHeader />

      <div className="px-4 mb-5">
        <SearchBar onOpen={open} />
      </div>

      {/* 本週推薦 */}
      <section className="mb-6">
        <div className="px-4 mb-2">
          <h2 className="text-[15px] font-bold text-text-primary">本週推薦</h2>
        </div>

        {/* Genre filter chips */}
        {allGenres.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-none">
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() =>
                  setSelectedGenre(selectedGenre === genre ? null : genre)
                }
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                  selectedGenre === genre
                    ? "bg-text-primary text-white"
                    : "bg-surface-muted text-text-secondary"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        <MovieCarousel movies={filteredMovies} />
      </section>

      {/* 場次快查 */}
      <section className="mb-6">
        <div className="px-4 mb-3">
          <h2 className="text-[15px] font-bold text-text-primary">場次快查</h2>
        </div>
        <ShowtimeQuickLook initialShowtimes={todayShowtimes} />
      </section>
    </main>
  );
}
