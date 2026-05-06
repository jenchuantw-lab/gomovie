import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types";
import HeartButton from "@/components/shared/HeartButton";

function StatusBadge({ status }: { status: Movie["status"] }) {
  if (status === "showing") {
    return (
      <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-[#eef6ee] text-green-700 font-medium">
        上映中
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-[#f5f0e8] text-amber-700 font-medium">
        即將上映
      </span>
    );
  }
  return null;
}

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-text-muted text-[13px]">
        目前沒有上映中的電影
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          href={`/movies/${movie.id}`}
          className="flex-shrink-0"
        >
          <div className="relative min-w-[104px] w-[104px]">
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-surface-muted">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title_zh}
                  fill
                  className="object-cover"
                  sizes="104px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-[11px]">
                  無海報
                </div>
              )}
              <HeartButton
                movieId={movie.id}
                size={18}
                className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/30"
              />
              <StatusBadge status={movie.status} />
            </div>
            <p className="mt-1.5 text-[12px] font-medium text-text-primary leading-tight line-clamp-2">
              {movie.title_zh}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
