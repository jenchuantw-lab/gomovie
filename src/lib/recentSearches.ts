const STORAGE_KEY = "gomovie_recent_searches";

export interface RecentSearch {
  movieId: string;
  title: string;
}

export const getRecentSearches = (): RecentSearch[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
};

export const addRecentSearch = (search: RecentSearch) => {
  const list = getRecentSearches();
  const filtered = list.filter((s) => s.movieId !== search.movieId);
  const next = [search, ...filtered].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const removeRecentSearch = (movieId: string) => {
  const list = getRecentSearches().filter((s) => s.movieId !== movieId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
