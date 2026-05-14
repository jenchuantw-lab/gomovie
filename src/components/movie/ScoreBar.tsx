import type { Movie } from "@/types";

interface ScoreItem {
  icon: string;
  label: string;
  value: string;
  color: string;
}

export default function ScoreBar({ movie }: { movie: Movie }) {
  const scores: ScoreItem[] = [
    movie.rating_imdb != null && {
      icon: "⭐",
      label: "IMDb",
      value: String(movie.rating_imdb),
      color: "text-yellow-500",
    },
    movie.rt_score != null && {
      icon: "🍅",
      label: "爛番茄",
      value: `${movie.rt_score}%`,
      color: "text-red-500",
    },
    movie.tw_score != null && {
      icon: "♥",
      label: "台灣觀眾",
      value: String(movie.tw_score),
      color: "text-pink-500",
    },
  ].filter(Boolean) as ScoreItem[];

  if (scores.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-border-muted">
      <div className="flex items-center gap-4 flex-wrap">
        {scores.map((item, i) => (
          <span key={i} className="flex items-center gap-1 text-[13px]">
            <span className={item.color}>{item.icon}</span>
            <span className="text-text-secondary">{item.label}:</span>
            <span className="text-text-primary font-medium">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
