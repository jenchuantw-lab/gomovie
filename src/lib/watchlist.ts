const STORAGE_KEY = "gomovie_collection";

export const getWatchlist = (): string[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
};

export const toggleWatchlist = (movieId: string): boolean => {
  const list = getWatchlist();
  const isAdded = list.includes(movieId);
  const next = isAdded
    ? list.filter((id) => id !== movieId)
    : [...list, movieId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !isAdded;
};

export const isInWatchlist = (movieId: string): boolean => {
  return getWatchlist().includes(movieId);
};
