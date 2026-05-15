"use client";

import { useState } from "react";

function getWeekDates(includeNextWeek = false): Date[] {
  const dates: Date[] = [];
  const total = includeNextWeek ? 14 : 7;
  const today = new Date();
  for (let i = 0; i < total; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
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

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DatePicker({
  onDateChange,
  initialDate,
}: {
  onDateChange: (date: string) => void;
  initialDate?: string;
}) {
  const [showNextWeek, setShowNextWeek] = useState(false);
  const dates = getWeekDates(showNextWeek);

  const findInitialIndex = () => {
    if (!initialDate) return 0;
    const idx = dates.findIndex((d) => toDateString(d) === initialDate);
    return idx >= 0 ? idx : 0;
  };

  const [selected, setSelected] = useState(() => findInitialIndex());

  const handleSelect = (index: number) => {
    setSelected(index);
    onDateChange(toDateString(dates[index]));
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
      {dates.map((date, i) => (
        <button
          key={i}
          onClick={() => handleSelect(i)}
          className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
            selected === i
              ? "bg-text-primary text-white"
              : "bg-surface-muted text-text-secondary"
          }`}
        >
          <DateChipLabel date={date} idx={i} />
        </button>
      ))}
      {!showNextWeek && (
        <button
          onClick={() => setShowNextWeek(true)}
          className="flex-shrink-0 px-2.5 py-1.5 rounded-full text-[12px] text-text-muted bg-surface-muted"
        >
          下週 ↓
        </button>
      )}
    </div>
  );
}
