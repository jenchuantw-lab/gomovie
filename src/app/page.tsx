import { getMoviesWithShowtimes, getShowtimesByDate } from "@/lib/supabase/queries";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];

  const [movies, todayShowtimes] = await Promise.all([
    getMoviesWithShowtimes().catch(() => []),
    getShowtimesByDate(today).catch(() => []),
  ]);

  return <HomeClient movies={movies} todayShowtimes={todayShowtimes} />;
}
