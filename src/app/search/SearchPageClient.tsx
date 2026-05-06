"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Movie } from "@/types";
import SearchInput from "@/components/search/SearchInput";
import RecentSearches, {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
} from "@/components/search/RecentSearches";
import HotTags from "@/components/search/HotTags";
import SearchResultList from "@/components/search/SearchResultList";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchPageClient({
  hotMovies,
}: {
  hotMovies: Movie[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data);
        if (debouncedQuery.trim()) {
          addRecentSearch(debouncedQuery.trim());
          setRecentSearches(getRecentSearches());
        }
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleSelect = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const handleRemove = useCallback((q: string) => {
    removeRecentSearch(q);
    setRecentSearches(getRecentSearches());
  }, []);

  return (
    <main className="max-w-lg mx-auto">
      {/* Header with safe area */}
      <div className="pt-12">
        <SearchInput
          value={query}
          onChange={setQuery}
          onBack={() => router.back()}
        />
      </div>

      {/* Empty state */}
      {!query && (
        <>
          <RecentSearches
            items={recentSearches}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
          <HotTags movies={hotMovies} onSelect={handleSelect} />
        </>
      )}

      {/* Loading */}
      {query && loading && (
        <p className="text-center text-text-muted text-[13px] py-8">搜尋中…</p>
      )}

      {/* Results */}
      {query && !loading && <SearchResultList movies={results} />}
    </main>
  );
}
