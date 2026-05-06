"use client";

const ALL_VERSIONS = ["全部", "2D", "IMAX", "4DX", "ScreenX"];

export default function VersionFilter({
  availableVersions,
  selected,
  onSelect,
}: {
  availableVersions: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const versions = ["全部", ...availableVersions.filter((v) =>
    ALL_VERSIONS.includes(v)
  )];

  if (versions.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none">
      {versions.map((v) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
            selected === v
              ? "bg-text-primary text-white border-text-primary"
              : "bg-surface-card text-text-secondary border-border-default"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
