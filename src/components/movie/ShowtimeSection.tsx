"use client";

import { useState, useEffect, useMemo } from "react";
import type { ShowtimeWithCinema } from "@/types";
import DatePicker, { toDateString } from "./DatePicker";
import VersionFilter from "./VersionFilter";
import CinemaShowtimes from "./CinemaShowtimes";

interface ShowtimeSectionProps {
  movieId: string;
  initialShowtimes: ShowtimeWithCinema[];
  initialDate: string;
  isAutoAdvanced?: boolean;
}

export default function ShowtimeSection({
  movieId,
  initialShowtimes,
  initialDate,
  isAutoAdvanced,
}: ShowtimeSectionProps) {
  const [date, setDate] = useState(initialDate);
  const [allShowtimes, setAllShowtimes] = useState(initialShowtimes);
  const [selectedVersion, setSelectedVersion] = useState("全部");
  const [loading, setLoading] = useState(false);

  // Derive available cities from allShowtimes
  const availableCities = useMemo(() => {
    const set = new Set(allShowtimes.map(s => s.cinemas.city).filter(Boolean));
    return Array.from(set);
  }, [allShowtimes]);

  const [city, setCity] = useState(() => availableCities[0] ?? "台北市");

  // Update city when availableCities change (e.g. after date change)
  useEffect(() => {
    if (availableCities.length > 0 && !availableCities.includes(city)) {
      setCity(availableCities[0]);
    }
  }, [availableCities, city]);

  // Fetch new showtimes when date changes
  useEffect(() => {
    if (date === initialDate) return;
    setLoading(true);
    fetch(`/api/showtimes?movieId=${movieId}&date=${date}`)
      .then((r) => r.json())
      .then((data) => setAllShowtimes(data))
      .catch(() => setAllShowtimes([]))
      .finally(() => setLoading(false));
  }, [date, movieId, initialDate]);

  // Extract available hall types
  const availableVersions = Array.from(
    new Set(
      allShowtimes
        .map((s) => s.hall_type)
        .filter((f): f is string => !!f)
    )
  );

  // Filter by city and version
  const cityFiltered = selectedVersion === "全部"
    ? allShowtimes.filter(s => s.cinemas.city === city)
    : allShowtimes.filter(s => s.cinemas.city === city && s.hall_type === selectedVersion);

  // Group by cinema
  const cinemaMap = new Map<
    string,
    { cinema: ShowtimeWithCinema["cinemas"]; showtimes: ShowtimeWithCinema[] }
  >();
  for (const s of cityFiltered) {
    if (!cinemaMap.has(s.cinemas.id)) {
      cinemaMap.set(s.cinemas.id, { cinema: s.cinemas, showtimes: [] });
    }
    cinemaMap.get(s.cinemas.id)!.showtimes.push(s);
  }
  const cinemaGroups = Array.from(cinemaMap.values());

  return (
    <div>
      {isAutoAdvanced && date === initialDate && (
        <p className="text-[11px] text-text-muted px-4 mb-2">⚠ 今日無場次，顯示最近可用日期</p>
      )}
      <div className="px-4 py-3 space-y-3">
        <DatePicker onDateChange={setDate} initialDate={initialDate} />
        {/* City selector */}
        {availableCities.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-text-muted">城市：</span>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {availableCities.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                    city === c
                      ? "bg-text-primary text-white"
                      : "bg-surface-muted text-text-secondary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <VersionFilter
          availableVersions={availableVersions}
          selected={selectedVersion}
          onSelect={setSelectedVersion}
        />
      </div>
      <div className="px-4 pb-6">
        {loading ? (
          <p className="text-center text-text-muted text-[13px] py-8">
            載入中…
          </p>
        ) : (
          <CinemaShowtimes cinemaGroups={cinemaGroups} />
        )}
      </div>
    </div>
  );
}
