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

function formatDateLabel(date: Date, index: number): string {
  if (index === 0) return "今天";
  if (index === 1) return "明天";
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return `${date.getMonth() + 1}/${date.getDate()}（${days[date.getDay()]}）`;
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DatePicker({
  onDateChange,
}: {
  onDateChange: (date: string) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [showNextWeek, setShowNextWeek] = useState(false);
  const dates = getWeekDates(showNextWeek);

  const handleSelect = (index: number) => {
    setSelected(index);
    onDateChange(toDateString(dates[index]));
  };

  return (
    <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none">
      {dates.map((date, i) => (
        <button
          key={i}
          onClick={() => handleSelect(i)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
            selected === i
              ? "bg-text-primary text-white"
              : "bg-surface-muted text-text-secondary"
          }`}
        >
          {formatDateLabel(date, i)}
        </button>
      ))}
      {!showNextWeek && (
        <button
          onClick={() => setShowNextWeek(true)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] text-text-muted bg-surface-muted"
        >
          下週 ↓
        </button>
      )}
    </div>
  );
}
