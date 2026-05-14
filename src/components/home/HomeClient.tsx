"use client";

import { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import type { Movie, ShowtimeWithCinema } from "@/types";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/home/SearchBar";
import MovieCarousel from "@/components/home/MovieCarousel";
import ShowtimeQuickLook from "@/components/home/ShowtimeQuickLook";

// Normalize genre labels to Traditional Chinese
const GENRE_ZH: Record<string, string> = {
  // English
  Action: "動作", Adventure: "冒險", Animation: "動畫", Comedy: "喜劇",
  Crime: "犯罪", Documentary: "紀錄片", Drama: "劇情", Family: "家庭",
  Fantasy: "奇幻", History: "歷史", Horror: "恐怖", Music: "音樂",
  Mystery: "懸疑", Romance: "愛情", "Science Fiction": "科幻",
  Thriller: "驚悚", War: "戰爭", Western: "西部",
  // Simplified Chinese
  动作: "動作", 冒险: "冒險", 动画: "動畫", 喜剧: "喜劇",
  犯罪: "犯罪", 纪录片: "紀錄片", 剧情: "劇情", 家庭: "家庭",
  奇幻: "奇幻", 历史: "歷史", 音乐: "音樂", 悬疑: "懸疑",
  爱情: "愛情", 科幻: "科幻", 惊悚: "驚悚", 战争: "戰爭",
};
const toZh = (g: string) => GENRE_ZH[g] ?? g;

interface HomeClientProps {
  movies: Movie[];
  todayShowtimes: (ShowtimeWithCinema & { movies: Movie })[];
}

export default function HomeClient({ movies, todayShowtimes }: HomeClientProps) {
  const { open } = useSearch();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Extract unique genres, normalise to Traditional Chinese
  const allGenres = Array.from(
    new Set(movies.flatMap((m) => (m.genres ?? []).map(toZh)))
  ).sort();

  const filteredMovies = selectedGenre
    ? movies.filter((m) => m.genres?.map(toZh).includes(selectedGenre))
    : movies;

  return (
    <main className="max-w-lg mx-auto">
      <AppHeader />

      <div className="px-4 mb-5">
        <SearchBar onOpen={open} />
      </div>

      {/* 本週推薦 */}
      <section className="mb-6">
        <div className="px-4 mb-2">
          <h2 className="text-[15px] font-bold text-text-primary">本週推薦</h2>
        </div>

        {allGenres.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-none">
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() =>
                  setSelectedGenre(selectedGenre === genre ? null : genre)
                }
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                  selectedGenre === genre
                    ? "bg-text-primary text-white"
                    : "bg-surface-muted text-text-secondary"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        <MovieCarousel movies={filteredMovies} />
      </section>

      {/* 場次快查 — title is rendered inside ShowtimeQuickLook */}
      <section className="mb-6">
        <ShowtimeQuickLook initialShowtimes={todayShowtimes} />
      </section>
    </main>
  );
}
