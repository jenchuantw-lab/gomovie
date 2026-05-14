"use client";

import { useState, useEffect } from "react";
import type { ShowtimeWithCinema } from "@/types";
import DatePicker, { toDateString } from "./DatePicker";
import VersionFilter from "./VersionFilter";
import CinemaShowtimes from "./CinemaShowtimes";

interface ShowtimeSectionProps {
  movieId: string;
  initialShowtimes: ShowtimeWithCinema[];
  initialDate: string;
}

export default function ShowtimeSection({
  movieId,
  initialShowtimes,
  initialDate,
}: ShowtimeSectionProps) {
  const [date, setDate] = useState(initialDate);
  const [allShowtimes, setAllShowtimes] = useState(initialShowtimes);
  const [selectedVersion, setSelectedVersion] = useState("全部");
  const [loading, setLoading] = useState(false);

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

  // Filter by version
  const filtered =
    selectedVersion === "全部"
      ? allShowtimes
      : allShowtimes.filter((s) => s.hall_type === selectedVersion);

  // Group by cinema
  const cinemaMap = new Map<
    string,
    { cinema: ShowtimeWithCinema["cinemas"]; showtimes: ShowtimeWithCinema[] }
  >();
  for (const s of filtered) {
    if (!cinemaMap.has(s.cinemas.id)) {
      cinemaMap.set(s.cinemas.id, { cinema: s.cinemas, showtimes: [] });
    }
    cinemaMap.get(s.cinemas.id)!.showtimes.push(s);
  }
  const cinemaGroups = Array.from(cinemaMap.values());

  return (
    <div>
      <div className="px-4 py-3 space-y-3">
        <DatePicker onDateChange={setDate} />
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
