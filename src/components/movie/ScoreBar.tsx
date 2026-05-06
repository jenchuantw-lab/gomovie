import type { Movie } from "@/types";

export default function ScoreBar({ movie }: { movie: Movie }) {
  const scores = [
    movie.imdb_score != null && `IMDb ${movie.imdb_score}`,
    movie.rt_score != null && `${movie.rt_score}% 爛番茄`,
    movie.tw_score != null && `${movie.tw_score} 台灣觀眾`,
  ].filter(Boolean);

  if (scores.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-border-muted">
      <div className="flex items-center gap-3 flex-wrap">
        {scores.map((score, i) => (
          <span key={i} className="text-[12px] text-text-secondary">
            {score}
            {i < scores.length - 1 && (
              <span className="ml-3 text-border-default">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
