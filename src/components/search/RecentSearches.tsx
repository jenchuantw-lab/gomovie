"use client";

const STORAGE_KEY = "gomovie_recent_searches";

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
}

export function addRecentSearch(query: string) {
  const list = getRecentSearches();
  const next = [query, ...list.filter((q) => q !== query)].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function removeRecentSearch(query: string) {
  const list = getRecentSearches().filter((q) => q !== query);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function RecentSearches({
  items,
  onSelect,
  onRemove,
}: {
  items: string[];
  onSelect: (q: string) => void;
  onRemove: (q: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="px-4 mb-5">
      <h3 className="text-[12px] text-text-muted mb-2 font-medium">最近搜尋</h3>
      <ul className="space-y-0">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center justify-between py-2.5 border-b border-border-muted last:border-0"
          >
            <button
              onClick={() => onSelect(item)}
              className="text-[14px] text-text-primary text-left"
            >
              {item}
            </button>
            <button
              onClick={() => onRemove(item)}
              aria-label={`刪除 ${item}`}
              className="p-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
