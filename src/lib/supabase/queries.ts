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
    .order("created_at", { ascending: false });

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
  date: string,
  city: string = "台北市"
): Promise<(ShowtimeWithCinema & { movies: Movie })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("showtimes")
    .select("*, cinemas!inner(*), movies(*)")
    .eq("show_date", date)
    .eq("cinemas.city", city)
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
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("status", "showing")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
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
