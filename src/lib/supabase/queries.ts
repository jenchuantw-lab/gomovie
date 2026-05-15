import type { Movie, ShowtimeWithCinema } from "@/types";
import { createClient } from "./server";

export async function getMovies(
  status: "showing" | "coming_soon" = "showing"
): Promise<Movie[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("status", status)
    .order("release_tw", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMovie(id: string): Promise<Movie | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getShowtimes(
  movieId: string,
  date: string
): Promise<ShowtimeWithCinema[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("showtimes")
    .select("*, cinemas(*)")
    .eq("movie_id", movieId)
    .eq("show_date", date)
    .order("show_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getShowtimesByDate(
  date: string
): Promise<(ShowtimeWithCinema & { movies: Movie })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("showtimes")
    .select("*, cinemas(*), movies(*)")
    .eq("show_date", date)
    .order("show_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .or(`title_zh.ilike.%${query}%,title_en.ilike.%${query}%`)
    .limit(20);

  if (error) throw error;
  return data ?? [];
}

export async function getHotMovies(limit: number = 10): Promise<Movie[]> {
  const supabase = await createClient();
  // 取有近期場次的電影（今天起 7 天內）
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("showtimes")
    .select("movie_id, movies(*)")
    .gte("show_date", today)
    .lte("show_date", nextWeek)
    .limit(limit * 5); // 取多一些再去重

  if (error) throw error;

  const seen = new Set<string>();
  const movies: Movie[] = [];
  for (const row of data ?? []) {
    if (!seen.has(row.movie_id) && row.movies) {
      seen.add(row.movie_id);
      movies.push(row.movies as unknown as Movie);
      if (movies.length >= limit) break;
    }
  }
  return movies;
}

export async function getMoviesByIds(ids: string[]): Promise<Movie[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .in("id", ids);

  if (error) throw error;
  return data ?? [];
}

export async function getMoviesWithShowtimes(limit = 50): Promise<Movie[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

  const { data: stData } = await supabase
    .from("showtimes")
    .select("movie_id")
    .gte("show_date", today)
    .lte("show_date", twoWeeks);

  if (!stData?.length) return [];

  const freq = new Map<string, number>();
  for (const { movie_id } of stData) {
    freq.set(movie_id, (freq.get(movie_id) ?? 0) + 1);
  }

  const topIds = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  const { data: movies } = await supabase
    .from("movies")
    .select("*")
    .in("id", topIds);

  return (movies ?? [])
    .filter((m) => m.poster_url)
    .sort((a, b) => (freq.get(b.id) ?? 0) - (freq.get(a.id) ?? 0));
}

export async function getNextShowtimeDate(movieId: string): Promise<string | null> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("showtimes")
    .select("show_date")
    .eq("movie_id", movieId)
    .gte("show_date", today)
    .order("show_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data?.show_date ?? null;
}
