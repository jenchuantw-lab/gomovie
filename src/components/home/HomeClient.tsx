"use client";

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

  return (
    <main className="max-w-lg mx-auto">
      <div className="pt-safe">
        <AppHeader />
      </div>

      <div className="px-4 mb-5">
        <SearchBar onOpen={open} />
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[15px] font-bold text-text-primary">本週推薦</h2>
        </div>
        <MovieCarousel movies={movies} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[15px] font-bold text-text-primary">場次快查</h2>
          <span className="text-[11px] text-text-muted">台北市</span>
        </div>
        <ShowtimeQuickLook initialShowtimes={todayShowtimes} />
      </section>
    </main>
  );
}
