import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovie, getShowtimes, getNextShowtimeDate } from "@/lib/supabase/queries";
import AppHeader from "@/components/layout/AppHeader";
import MovieHero from "@/components/movie/MovieHero";
import ScoreBar from "@/components/movie/ScoreBar";
import Synopsis from "@/components/movie/Synopsis";
import ShowtimeSection from "@/components/movie/ShowtimeSection";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) return {};
  return {
    title: `${movie.title_zh} 場次 | GoMovie`,
    description: `查詢 ${movie.title_zh} 台北市最新場次時刻表`,
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) notFound();

  const today = new Date().toISOString().split("T")[0];
  let showtimes = await getShowtimes(id, today).catch(() => []);
  let initialDate = today;
  let isAutoAdvanced = false;

  if (showtimes.length === 0) {
    const nextDate = await getNextShowtimeDate(id).catch(() => null);
    if (nextDate && nextDate !== today) {
      initialDate = nextDate;
      isAutoAdvanced = true;
      showtimes = await getShowtimes(id, nextDate).catch(() => []);
    }
  }

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title_zh,
    alternateName: movie.title_en,
    description: movie.synopsis,
    image: movie.poster_url,
    dateCreated: movie.release_tw?.slice(0, 4),
    duration: movie.duration_minutes
      ? `PT${movie.duration_minutes}M`
      : undefined,
    genre: movie.genres,
    aggregateRating: movie.rating_imdb
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.rating_imdb,
          ratingCount: 1000,
          bestRating: 10,
        }
      : undefined,
  };

  return (
    <main className="max-w-lg mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Header with back button */}
      <AppHeader showBack />

      <MovieHero movie={movie} />
      <ScoreBar movie={movie} />
      {movie.synopsis && <Synopsis text={movie.synopsis} />}

      <section>
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-[15px] font-bold text-text-primary">場次</h2>
        </div>
        <ShowtimeSection
          movieId={id}
          initialShowtimes={showtimes}
          initialDate={initialDate}
          isAutoAdvanced={isAutoAdvanced}
        />
      </section>
    </main>
  );
}
