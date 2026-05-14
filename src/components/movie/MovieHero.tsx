import Image from "next/image";
import type { Movie } from "@/types";
import HeartButton from "@/components/shared/HeartButton";

export default function MovieHero({ movie }: { movie: Movie }) {
  const meta = [
    movie.release_year,
    movie.duration_minutes ? `${movie.duration_minutes} 分鐘` : null,
    movie.genre?.join("・"),
  ]
    .filter(Boolean)
    .join("・");

  return (
    <div className="relative w-full h-[280px] overflow-hidden">
      {/* Poster */}
      {movie.poster_url ? (
        <Image
          src={movie.poster_url}
          alt={movie.title_zh}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-800" />
      )}

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,18,0.95)] via-[rgba(10,10,18,0.3)] to-transparent" />

      {/* Heart button — top-right of poster */}
      <HeartButton
        movieId={movie.id}
        size={20}
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/40"
      />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        {movie.rating && (
          <span className="inline-block mb-2 text-[10px] px-2 py-0.5 border border-white/60 rounded text-white/80">
            {movie.rating}
          </span>
        )}
        <h1 className="text-[24px] font-bold text-white leading-tight">
          {movie.title_zh}
        </h1>
        {movie.title_en && (
          <p className="text-[13px] text-white/70 mt-0.5">{movie.title_en}</p>
        )}
        {meta && <p className="text-[11px] text-white/60 mt-1">{meta}</p>}
      </div>
    </div>
  );
}
