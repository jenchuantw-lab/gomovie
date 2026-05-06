import SearchBar from "@/components/home/SearchBar";
import MovieCarousel from "@/components/home/MovieCarousel";
import ShowtimeQuickLook from "@/components/home/ShowtimeQuickLook";
import { getMovies, getShowtimesByDate } from "@/lib/supabase/queries";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];

  const [movies, todayShowtimes] = await Promise.all([
    getMovies("showing").catch(() => []),
    getShowtimesByDate(today).catch(() => []),
  ]);

  return (
    <main className="max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-12 pb-3">
        <div>
          <span className="text-[22px] font-bold text-text-primary tracking-tight">GoMovie</span>
          <span className="ml-1.5 text-[13px] text-text-muted">走入戲院</span>
        </div>
        <button aria-label="通知" className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </header>

      {/* Search bar */}
      <div className="px-4 mb-5">
        <SearchBar />
      </div>

      {/* This week recommendations */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[15px] font-bold text-text-primary">本週推薦</h2>
        </div>
        <MovieCarousel movies={movies} />
      </section>

      {/* Showtime quick look */}
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
