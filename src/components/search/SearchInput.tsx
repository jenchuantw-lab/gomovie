"use client";

import { useRef, useEffect } from "react";

export default function SearchInput({
  value,
  onChange,
  onBack,
}: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <button onClick={onBack} aria-label="返回" className="flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div className="flex-1 flex items-center gap-2 bg-surface-muted rounded-full px-4 h-10">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbbbbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜尋電影、戲院"
          className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-placeholder outline-none"
        />
        {value && (
          <button onClick={() => onChange("")} aria-label="清除">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
