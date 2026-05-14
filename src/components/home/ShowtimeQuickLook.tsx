"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Movie, ShowtimeWithCinema } from "@/types";

// ── City data ────────────────────────────────────────────────────────────────

const CITY_GROUPS = [
  { label: "熱門", cities: ["台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市"] },
  { label: "北部", cities: ["基隆市", "新竹市", "新竹縣", "宜蘭縣"] },
  { label: "中部", cities: ["苗栗縣", "彰化縣", "南投縣", "雲林縣"] },
  { label: "南部", cities: ["嘉義市", "嘉義縣", "屏東縣"] },
  { label: "東部", cities: ["花蓮縣", "台東縣"] },
];

const TIME_SLOTS = [
  { label: "全天", check: (_: string) => true },
  { label: "上午", check: (t: string) => t < "12:00" },
  { label: "下午", check: (t: string) => t >= "12:00" && t < "17:00" },
  { label: "晚上", check: (t: string) => t >= "17:00" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function getUpcomingDates(count: number): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

const DAYS = ["日", "一", "二", "三", "四", "五", "六"];

function DateChipLabel({ date, idx }: { date: Date; idx: number }) {
  if (idx === 0) return <span>今天</span>;
  if (idx === 1) return <span>明天</span>;
  return (
    <span className="flex flex-col items-center leading-tight gap-0.5">
      <span>{date.getMonth() + 1}/{date.getDate()}</span>
      <span className="text-[10px] opacity-80">{DAYS[date.getDay()]}</span>
    </span>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

type ShowtimeRow = ShowtimeWithCinema & { movies: Movie };
type CinemaGroup = { cinema: ShowtimeWithCinema["cinemas"]; showtimes: ShowtimeRow[] };
type MovieGroup = { movie: Movie; cinemas: CinemaGroup[] };

function groupShowtimes(rows: ShowtimeRow[]): MovieGroup[] {
  const map = new Map<string, MovieGroup>();
  for (const s of rows) {
    if (!map.has(s.movies.id)) map.set(s.movies.id, { movie: s.movies, cinemas: [] });
    const mg = map.get(s.movies.id)!;
    let cg = mg.cinemas.find((c) => c.cinema.id === s.cinemas.id);
    if (!cg) {
      cg = { cinema: s.cinemas, showtimes: [] };
      mg.cinemas.push(cg);
    }
    cg.showtimes.push(s);
  }
  return Array.from(map.values());
}

function ExpandPanel({ showtime }: { showtime: ShowtimeRow }) {
  const parts = [showtime.hall_type, showtime.hall_name, showtime.lang, showtime.subtitle].filter(Boolean);
  return (
    <div className="mt-2 px-3 py-2 bg-surface-hover rounded-lg text-[12px] text-text-secondary">
      {parts.length > 0 ? parts.join("・") : "一般廳"}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  initialShowtimes: ShowtimeRow[];
}

export default function ShowtimeQuickLook({ initialShowtimes }: Props) {
  const todayStr = useMemo(() => toDateStr(new Date()), []);
  const dates14 = useMemo(() => getUpcomingDates(14), []);

  const [showtimes, setShowtimes] = useState<ShowtimeRow[]>(initialShowtimes);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [showNextWeek, setShowNextWeek] = useState(false);
  const [city, setCity] = useState("台北市");
  const [cityOpen, setCityOpen] = useState(false);
  const [timeSlot, setTimeSlot] = useState("全天");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  // In-memory cache for fetched dates
  const cache = useRef<Map<string, ShowtimeRow[]>>(new Map());

  const allDates = showNextWeek ? dates14 : dates14.slice(0, 7);

  // Preload next 3 days on mount
  useEffect(() => {
    dates14.slice(1, 4).forEach((date) => {
      const ds = toDateStr(date);
      if (cache.current.has(ds)) return;
      fetch(`/api/showtimes-by-date?date=${ds}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) cache.current.set(ds, data);
        })
        .catch(() => {});
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch / serve from cache when date changes
  useEffect(() => {
    if (selectedDate === todayStr) {
      setShowtimes(initialShowtimes);
      setLoading(false);
      return;
    }
    const cached = cache.current.get(selectedDate);
    if (cached) {
      setShowtimes(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    setExpandedKey(null);
    fetch(`/api/showtimes-by-date?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        const result = Array.isArray(data) ? data : [];
        cache.current.set(selectedDate, result);
        setShowtimes(result);
      })
      .catch(() => setShowtimes([]))
      .finally(() => setLoading(false));
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click outside → close city dropdown
  useEffect(() => {
    if (!cityOpen) return;
    const handler = (e: MouseEvent) => {
      if (!cityRef.current?.contains(e.target as Node)) setCityOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cityOpen]);

  // Filter
  const filtered = showtimes
    .filter((s) => s.cinemas.city === city)
    .filter((s) => {
      const t = s.show_time.slice(0, 5);
      return TIME_SLOTS.find((sl) => sl.label === timeSlot)?.check(t) ?? true;
    });

  const grouped = groupShowtimes(filtered);

  const selectedDateLabel = (() => {
    const idx = allDates.findIndex((d) => toDateStr(d) === selectedDate);
    if (idx < 0) return selectedDate;
    if (idx === 0) return "今天";
    if (idx === 1) return "明天";
    const d = allDates[idx];
    return `${d.getMonth() + 1}/${d.getDate()}（${DAYS[d.getDay()]}）`;
  })();

  return (
    <div>
      {/* Section header: title + city selector inline */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-[15px] font-bold text-text-primary">場次快查</h2>

        <div ref={cityRef} className="relative">
          <button
            onClick={() => setCityOpen((o) => !o)}
            className="flex items-center gap-1 text-[13px] font-medium text-text-primary"
          >
            <span>📍</span>
            <span>{city}</span>
            <span className="text-[10px] text-text-muted ml-0.5">
              {cityOpen ? "▲" : "▾"}
            </span>
          </button>

          {cityOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-surface-card border border-border-default rounded-xl shadow-lg z-10 p-3">
              {CITY_GROUPS.map((group) => (
                <div key={group.label} className="mb-2.5 last:mb-0">
                  <p className="text-[10px] text-text-muted font-medium mb-1.5">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.cities.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCity(c);
                          setCityOpen(false);
                          setExpandedKey(null);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[12px] transition-colors ${
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date chips — compact two-line format */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-none">
        {allDates.map((date, i) => {
          const ds = toDateStr(date);
          return (
            <button
              key={ds}
              onClick={() => { setSelectedDate(ds); setExpandedKey(null); }}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                selectedDate === ds
                  ? "bg-text-primary text-white"
                  : "bg-surface-muted text-text-secondary"
              }`}
            >
              <DateChipLabel date={date} idx={i} />
            </button>
          );
        })}
        {!showNextWeek && (
          <button
            onClick={() => setShowNextWeek(true)}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-full text-[12px] text-text-muted bg-surface-muted"
          >
            下週↓
          </button>
        )}
      </div>

      {/* Time filter chips */}
      <div className="flex gap-1.5 px-4 mt-2">
        {TIME_SLOTS.map(({ label }) => (
          <button
            key={label}
            onClick={() => setTimeSlot(label)}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
              timeSlot === label
                ? "bg-text-primary text-white"
                : "bg-surface-muted text-text-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Showtimes list */}
      <div className="px-4 mt-3 space-y-4">
        {loading ? (
          <p className="text-center text-text-muted text-[13px] py-6">載入中…</p>
        ) : grouped.length === 0 ? (
          <p className="text-center text-text-muted text-[13px] py-6">
            {city}・{selectedDateLabel} 沒有場次資料
          </p>
        ) : (
          grouped.map(({ movie, cinemas }) => (
            <div key={movie.id}>
              <p className="text-[15px] font-bold text-text-primary mb-2">
                {movie.title_zh}
              </p>
              <div className="space-y-3 pl-3">
                {cinemas.map(({ cinema, showtimes: cs }) => {
                  const expandedShowtime = cs.find(
                    (s) => expandedKey === `${movie.id}-${cinema.id}-${s.id}`
                  );
                  return (
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
                        {cs.map((s) => {
                          const key = `${movie.id}-${cinema.id}-${s.id}`;
                          const isExpanded = expandedKey === key;
                          return (
                            <button
                              key={s.id}
                              onClick={() => setExpandedKey(isExpanded ? null : key)}
                              className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                                isExpanded
                                  ? "bg-text-primary text-white border-text-primary"
                                  : "bg-surface-muted text-text-primary border-border-default"
                              }`}
                            >
                              {s.show_time.slice(0, 5)}
                            </button>
                          );
                        })}
                      </div>
                      {expandedShowtime && <ExpandPanel showtime={expandedShowtime} />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
