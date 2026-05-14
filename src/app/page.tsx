import { getMovies, getShowtimesByDate } from "@/lib/supabase/queries";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];

  const [allMovies, todayShowtimes] = await Promise.all([
    getMovies("showing").catch(() => []),
    getShowtimesByDate(today).catch(() => []),
  ]);

  // Carousel 只顯示有海報的電影
  const movies = allMovies.filter((m) => m.poster_url);

  return <HomeClient movies={movies} todayShowtimes={todayShowtimes} />;
}
