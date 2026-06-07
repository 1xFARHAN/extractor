"use client";

type SearchBarProps = {
  value: string;
  mode: "name" | "descriptor";
  onChange: (value: string) => void;
  onModeChange: (value: "name" | "descriptor") => void;
};

export function SearchBar({ value, mode, onChange, onModeChange }: SearchBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-emerald-900">
          <input
            type="radio"
            name="search-mode"
            checked={mode === "name"}
            onChange={() => onModeChange("name")}
            className="h-4 w-4 border-emerald-300 text-emerald-700 focus:ring-emerald-500"
          />
          Name
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-emerald-900">
          <input
            type="radio"
            name="search-mode"
            checked={mode === "descriptor"}
            onChange={() => onModeChange("descriptor")}
            className="h-4 w-4 border-emerald-300 text-emerald-700 focus:ring-emerald-500"
          />
          Descriptor
        </label>
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m0 0A7.95 7.95 0 1 0 5.4 5.4a7.95 7.95 0 0 0 11.25 11.25Z"
            />
          </svg>
        </span>
        <input
          id="search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={mode === "name" ? "Search by name" : "Search by key descriptor"}
          className="w-full rounded-2xl border border-emerald-200 bg-white py-3 pl-12 pr-4 text-sm text-emerald-950 shadow-sm outline-none transition focus:border-emerald-500"
        />
      </div>    
    </div>
  );
}
