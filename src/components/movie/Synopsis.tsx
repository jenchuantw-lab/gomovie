"use client";

import { useState } from "react";

export default function Synopsis({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 py-3 border-b border-border-muted">
      <p
        className={`text-[13px] text-text-secondary leading-relaxed ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1.5 text-[12px] text-text-muted"
      >
        {expanded ? "收起 ↑" : "展開簡介 ↓"}
      </button>
    </div>
  );
}
