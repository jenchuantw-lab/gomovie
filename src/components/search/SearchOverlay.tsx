"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Movie } from "@/types";
import { useSearch } from "@/context/SearchContext";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  type RecentSearch,
} from "@/lib/recentSearches";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function StatusBadge({ status }: { status: Movie["status"] }) {
  if (status === "showing")
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eef6ee] text-green-700 font-medium">
        上映中
      </span>
    );
  if (status === "coming_soon")
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f5f0e8] text-amber-700 font-medium">
        即將上映
      </span>
    );
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-muted text-text-muted font-medium">
      已下映
    </span>
  );
}

export default function SearchOverlay() {
  const { isOpen, close } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [hotMovies, setHotMovies] = useState<Movie[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && hotMovies.length === 0) {
      fetch("/api/movies?hot=true")
        .then((r) => r.json())
        .then(setHotMovies)
        .catch(() => {});
    }
  }, [isOpen, hotMovies.length]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleMovieClick = useCallback(
    (movie: Movie) => {
      addRecentSearch({ movieId: movie.id, title: movie.title_zh });
      close();
      router.push(`/movies/${movie.id}`);
    },
    [close, router]
  );

  const handleRemoveRecent = useCallback((movieId: string) => {
    removeRecentSearch(movieId);
    setRecentSearches(getRecentSearches());
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150]">
      {/* Dimmed backdrop — clicking outside closes search */}
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      {/* Search panel slides down from top */}
      <div className="relative bg-surface-base max-h-[85vh] flex flex-col overflow-hidden rounded-b-2xl shadow-2xl animate-slide-down">
        {/* Input row */}
        <div className="flex items-center gap-2 px-4 pt-12 pb-3">
          <button onClick={close} aria-label="關閉搜尋">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555555"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1 flex items-center gap-2 bg-surface-muted rounded-full px-4 h-10">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#bbbbbb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋電影、戲院"
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-placeholder outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="清除">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#aaaaaa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Empty state */}
          {!query && (
            <>
              {recentSearches.length > 0 && (
                <div className="px-4 mb-5">
                  <h3 className="text-[12px] text-text-muted mb-2 font-medium">
                    最近搜尋
                  </h3>
                  <ul>
                    {recentSearches.map((item) => (
                      <li
                        key={item.movieId}
                        className="flex items-center justify-between py-2.5 border-b border-border-muted last:border-0"
                      >
                        <button
                          onClick={() =>
                            handleMovieClick({
                              id: item.movieId,
                              title_zh: item.title,
                            } as Movie)
                          }
                          className="text-[14px] text-text-primary text-left"
                        >
                          {item.title}
                        </button>
                        <button
                          onClick={() => handleRemoveRecent(item.movieId)}
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
              )}

              {hotMovies.length > 0 && (
                <div className="px-4 pb-4">
                  <h3 className="text-[12px] text-text-muted mb-2 font-medium">
                    熱門搜尋
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hotMovies.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleMovieClick(m)}
                        className="px-3 py-1.5 bg-surface-muted rounded-full text-[12px] text-text-secondary"
                      >
                        {m.title_zh}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {query && loading && (
            <p className="text-center text-text-muted text-[13px] py-8">搜尋中…</p>
          )}

          {query && !loading && results.length === 0 && (
            <p className="text-center text-text-muted text-[14px] py-12">
              找不到相符的電影
            </p>
          )}

          {query && !loading && results.length > 0 && (
            <ul className="pb-4">
              {results.map((movie) => {
                const meta = [
                  movie.release_year,
                  movie.duration_minutes ? `${movie.duration_minutes} 分` : null,
                  movie.genre?.slice(0, 2).join("・"),
                ]
                  .filter(Boolean)
                  .join("・");

                return (
                  <li key={movie.id}>
                    <button
                      onClick={() => handleMovieClick(movie)}
                      className="w-full flex items-center gap-3 px-4 py-3 border-b border-border-muted text-left"
                    >
                      <div className="relative w-[44px] h-[62px] flex-shrink-0 rounded overflow-hidden bg-surface-muted">
                        {movie.poster_url && (
                          <Image
                            src={movie.poster_url}
                            alt={movie.title_zh}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        )}
                      </div>
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
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
