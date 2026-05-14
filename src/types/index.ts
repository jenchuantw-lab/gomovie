export interface Cinema {
  id: string;
  brand: string;
  name: string;
  city: string;
  address: string | null;
  district: string | null;
  website_url: string | null;
}

export interface Movie {
  id: string;
  title_zh: string;
  title_en: string | null;
  poster_url: string | null;
  rating_imdb: number | null;
  genres: string[] | null;
  release_tw: string | null;
  synopsis: string | null;
  duration_minutes: number | null;
  rating: string | null;
  tmdb_id: number | null;
  rt_score: number | null;
  tw_score: number | null;
  trailer_url: string | null;
  status: "showing" | "coming_soon" | "ended";
}

export interface Showtime {
  id: string;
  movie_id: string;
  cinema_id: string;
  show_date: string;
  show_time: string;
  hall_name: string | null;
  hall_type: string | null;
  lang: string | null;
  subtitle: string | null;
  scraped_at: string;
}

export interface ShowtimeWithCinema extends Showtime {
  cinemas: Cinema;
}

export interface ShowtimeWithMovie extends Showtime {
  movies: Movie;
}

export interface MovieWithShowtimes extends Movie {
  showtimes: ShowtimeWithCinema[];
}
