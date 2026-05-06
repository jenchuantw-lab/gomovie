import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types";
import HeartButton from "@/components/shared/HeartButton";

function StatusBadge({ status }: { status: Movie["status"] }) {
  if (status === "showing") {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eef6ee] text-green-700 font-medium">
        上映中
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f5f0e8] text-amber-700 font-medium">
        即將上映
      </span>
    );
  }
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-muted text-text-muted font-medium">
      已下映
    </span>
  );
}

export default function SearchResultList({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-text-muted text-[14px]">找不到相符的電影</p>
      </div>
    );
  }

  return (
    <ul>
      {movies.map((movie) => {
        const meta = [
          movie.release_year,
          movie.duration_minutes ? `${movie.duration_minutes} 分` : null,
          movie.genre?.slice(0, 2).join("・"),
        ]
          .filter(Boolean)
          .join("・");

        return (
          <li key={movie.id}>
            <Link
              href={`/movies/${movie.id}`}
              className="flex items-center gap-3 px-4 py-3 border-b border-border-muted hover:bg-surface-hover transition-colors"
            >
              {/* Poster */}
              <div className="relative w-[44px] h-[62px] flex-shrink-0 rounded overflow-hidden bg-surface-muted">
                {movie.poster_url ? (
                  <Image
                    src={movie.poster_url}
                    alt={movie.title_zh}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-muted" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">
                  {movie.title_zh}
                </p>
                {meta && (
                  <p className="text-[11px] text-text-muted mt-0.5 truncate">
                    {meta}
                  </p>
                )}
                <div className="mt-1.5">
                  <StatusBadge status={movie.status} />
                </div>
              </div>

              {/* Heart */}
              <HeartButton
                movieId={movie.id}
                size={20}
                className="flex-shrink-0 p-1"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
