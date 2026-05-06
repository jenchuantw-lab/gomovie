import type { Movie } from "@/types";

export default function HotTags({
  movies,
  onSelect,
}: {
  movies: Movie[];
  onSelect: (title: string) => void;
}) {
  if (movies.length === 0) return null;

  return (
    <div className="px-4">
      <h3 className="text-[12px] text-text-muted mb-2 font-medium">熱門搜尋</h3>
      <div className="flex flex-wrap gap-2">
        {movies.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.title_zh)}
            className="px-3 py-1.5 bg-surface-muted rounded-full text-[12px] text-text-secondary"
          >
            {m.title_zh}
          </button>
        ))}
      </div>
    </div>
  );
}
