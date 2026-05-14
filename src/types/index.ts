export interface Cinema {
  id: string;
  name: string;
  district: string | null;
  city: string;
  website_url: string | null;
  created_at: string;
}

export interface Movie {
  id: string;
  title_zh: string;
  title_en: string | null;
  release_year: number | null;
  duration_minutes: number | null;
  rating: string | null;
  genre: string[] | null;
  synopsis: string | null;
  poster_url: string | null;
  tmdb_id: number | null;
  imdb_score: number | null;
  rt_score: number | null;
  tw_score: number | null;
  trailer_url: string | null;
  status: "showing" | "coming_soon" | "ended";
  created_at: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  cinema_id: string;
  show_date: string;
  show_time: string;
  hall_name: string | null;
  hall_feature: string | null;
  total_seats: number | null;
  created_at: string;
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
