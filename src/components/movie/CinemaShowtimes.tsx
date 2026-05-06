"use client";

import { useState } from "react";
import type { ShowtimeWithCinema } from "@/types";

interface CinemaGroup {
  cinema: ShowtimeWithCinema["cinemas"];
  showtimes: ShowtimeWithCinema[];
}

function ExpandPanel({ showtime }: { showtime: ShowtimeWithCinema }) {
  const parts = [
    showtime.hall_feature,
    showtime.hall_name,
    showtime.total_seats ? `${showtime.total_seats} 席` : null,
  ].filter(Boolean);

  return (
    <div className="mt-1.5 px-3 py-2 bg-surface-hover rounded-lg text-[12px] text-text-secondary">
      {parts.length > 0 ? parts.join("・") : "一般廳"}
    </div>
  );
}

export default function CinemaShowtimes({
  cinemaGroups,
}: {
  cinemaGroups: CinemaGroup[];
}) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  if (cinemaGroups.length === 0) {
    return (
      <p className="text-center text-text-muted text-[13px] py-8">
        此日期沒有場次
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {cinemaGroups.map(({ cinema, showtimes }) => (
        <div
          key={cinema.id}
          className="bg-surface-card rounded-xl px-4 py-3 border border-border-default"
        >
          <div className="flex items-start justify-between mb-1">
            <p className="text-[15px] font-bold text-text-primary">
              {cinema.name}
            </p>
            {cinema.website_url && (
              <a
                href={cinema.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-brand-red flex-shrink-0 ml-2"
              >
                官網 ↗
              </a>
            )}
          </div>
          {cinema.district && (
            <p className="text-[11px] text-text-muted mb-2">{cinema.district}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {showtimes.map((s) => {
              const key = `${cinema.id}-${s.id}`;
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
  );
}
