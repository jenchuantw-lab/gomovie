"use client";

import { useState } from "react";
import type { Movie, ShowtimeWithCinema } from "@/types";

type GroupedShowtime = {
  movie: Movie;
  cinemas: {
    cinema: ShowtimeWithCinema["cinemas"];
    showtimes: ShowtimeWithCinema[];
  }[];
};

function getWeekDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(date: Date, index: number): string {
  if (index === 0) return "今天";
  if (index === 1) return "明天";
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return `${date.getMonth() + 1}/${date.getDate()}（${days[date.getDay()]}）`;
}

function groupShowtimes(
  showtimes: (ShowtimeWithCinema & { movies: Movie })[]
): GroupedShowtime[] {
  const movieMap = new Map<string, GroupedShowtime>();

  for (const s of showtimes) {
    const movie = s.movies;
    if (!movieMap.has(movie.id)) {
      movieMap.set(movie.id, { movie, cinemas: [] });
    }
    const group = movieMap.get(movie.id)!;
    const cinemaGroup = group.cinemas.find(
      (c) => c.cinema.id === s.cinemas.id
    );
    if (cinemaGroup) {
      cinemaGroup.showtimes.push(s);
    } else {
      group.cinemas.push({ cinema: s.cinemas, showtimes: [s] });
    }
  }

  return Array.from(movieMap.values());
}

function ExpandPanel({ showtime }: { showtime: ShowtimeWithCinema }) {
  const parts = [
    showtime.hall_feature,
    showtime.hall_name,
    showtime.total_seats ? `${showtime.total_seats} 席` : null,
  ].filter(Boolean);

  return (
    <div className="mt-1 px-3 py-2 bg-surface-hover rounded-lg text-[12px] text-text-secondary">
      {parts.length > 0 ? parts.join("・") : "一般廳"}
    </div>
  );
}

interface ShowtimeQuickLookProps {
  initialShowtimes: (ShowtimeWithCinema & { movies: Movie })[];
}

export default function ShowtimeQuickLook({
  initialShowtimes,
}: ShowtimeQuickLookProps) {
  const dates = getWeekDates();
  const [selectedDate, setSelectedDate] = useState(0);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [showNextWeek, setShowNextWeek] = useState(false);

  const grouped = groupShowtimes(initialShowtimes);

  const nextWeekDates: Date[] = [];
  for (let i = 7; i < 14; i++) {
    const d = new Date();
    d.setDate(new Date().getDate() + i);
    nextWeekDates.push(d);
  }

  const allDates = showNextWeek ? [...dates, ...nextWeekDates] : dates;

  return (
    <div>
      {/* Date picker */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
        {allDates.map((date, i) => {
          const isSelected = selectedDate === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                isSelected
                  ? "bg-text-primary text-white"
                  : "bg-surface-muted text-text-secondary"
              }`}
            >
              {formatDateLabel(date, i)}
            </button>
          );
        })}
        {!showNextWeek && (
          <button
            onClick={() => setShowNextWeek(true)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] text-text-muted bg-surface-muted"
          >
            下週 ↓
          </button>
        )}
      </div>

      {/* Showtimes grouped by movie */}
      <div className="px-4 mt-3 space-y-4">
        {grouped.length === 0 ? (
          <p className="text-center text-text-muted text-[13px] py-6">
            {formatDateLabel(allDates[selectedDate], selectedDate)} 沒有場次資料
          </p>
        ) : (
          grouped.map(({ movie, cinemas }) => (
            <div key={movie.id}>
              <p className="text-[15px] font-bold text-text-primary mb-2">
                {movie.title_zh}
              </p>
              <div className="space-y-3 pl-3">
                {cinemas.map(({ cinema, showtimes }) => (
                  <div key={cinema.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[13px] font-medium text-text-secondary">
                        {cinema.name}
                      </p>
                      {cinema.website_url && (
                        <a
                          href={cinema.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-brand-red"
                          onClick={(e) => e.stopPropagation()}
                        >
                          官網 ↗
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {showtimes.map((s) => {
                        const key = `${movie.id}-${cinema.id}-${s.id}`;
                        const isExpanded = expandedKey === key;
                        return (
                          <div key={s.id}>
                            <button
                              onClick={() =>
                                setExpandedKey(isExpanded ? null : key)
                              }
                              className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                                isExpanded
                                  ? "bg-text-primary text-white border-text-primary"
                                  : "bg-surface-muted text-text-primary border-border-default"
                              }`}
                            >
                              {s.show_time.slice(0, 5)}
                            </button>
                            {isExpanded && <ExpandPanel showtime={s} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
