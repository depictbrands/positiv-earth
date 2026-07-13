"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import DestinationCard from "@/components/ui/DestinationCard";
import SearchButton from "@/components/ui/SearchButton";
import { DEFAULT_DESTINATIONS } from "@/components/sections/home/Destinations";
import type { Destination } from "@/types/destination";

type SearchCriteria = {
  where: string;
  what: string;
  when: string;
};

type SearchBarProps = {
  /** Notified whenever a search runs. Results are also rendered inline. */
  onSearch?: (criteria: SearchCriteria) => void;
  /** Pool searched against. Defaults to the itinerary-linked destinations. */
  destinations?: Destination[];
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Case-insensitive AND match across a destination's name and locations. */
function matchesCriteria(destination: Destination, terms: string[]) {
  if (terms.length === 0) return true;
  const haystack = [destination.name, ...destination.locations]
    .join(" ")
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function SegmentIcon({
  kind,
}: {
  kind: "where" | "what" | "when";
}) {
  const commonClassName = "size-full";

  if (kind === "where") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={commonClassName}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="10"
          r="2.25"
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    );
  }

  if (kind === "when") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={commonClassName}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3.5"
          y="5.5"
          width="17"
          height="15"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M8 3.5V7.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M16 3.5V7.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M3.5 9.5H20.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <circle cx="8.25" cy="13.25" r="1" fill="currentColor" />
        <circle cx="12" cy="13.25" r="1" fill="currentColor" />
        <circle cx="15.75" cy="13.25" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={commonClassName}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 20.5H20.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6 20.5V9.5L12 5.5L18 9.5V20.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 20.5V13H15.5V20.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.5H16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SegmentGlyph({ kind }: { kind: "where" | "what" | "when" }) {
  return (
    <span
      aria-hidden="true"
      className="order-1 shrink-0"
      style={{
        width: "var(--size-search-bar-icon-size)",
        height: "var(--size-search-bar-icon-size)",
        color: "var(--color-search-bar-ink-light)",
      }}
    >
      <SegmentIcon kind={kind} />
    </span>
  );
}

function SearchInputSegment({
  icon,
  onChange,
  onEnter,
  placeholder,
  value,
}: {
  icon: "where" | "what";
  onChange: (value: string) => void;
  onEnter: () => void;
  placeholder: string;
  value: string;
}) {
  const inputId = useId();

  return (
    <div
      className="flex w-full min-w-0 items-center xl:min-w-0 xl:flex-1"
      style={{
        gap: "var(--spacing-search-bar-segment-gap)",
      }}
    >
      {/* Visually-hidden but programmatically associated label; the placeholder
          remains as the visible cue. */}
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onEnter();
          }
        }}
        placeholder={placeholder}
        className="order-2 min-w-0 w-full bg-transparent font-body text-search-bar text-base-black caret-[var(--color-base-black)] focus:outline-none placeholder:font-body placeholder:text-search-bar placeholder:text-[var(--color-search-bar-ink-light)]"
      />
      <SegmentGlyph kind={icon} />
    </div>
  );
}

function CalendarPopover({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (date: Date) => void;
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const initial = selected ?? today;
  const [view, setView] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const leadingBlanks = new Date(view.year, view.month, 1).getDay();

  const cells: Array<Date | null> = [];
  for (let i = 0; i < leadingBlanks; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(view.year, view.month, day));
  }

  const goToMonth = (delta: number) =>
    setView((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  return (
    <div
      role="dialog"
      aria-label="Choose a travel date"
      className="absolute left-0 top-full z-30 mt-3 w-full max-w-xs rounded-card-corner bg-base-white p-4 shadow-[var(--shadow-search-bar)]"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Previous month"
          className="focus-ring-search-button flex size-8 items-center justify-center rounded-full text-base-black transition-opacity hover:opacity-70"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="font-body text-search-bar text-base-black">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="Next month"
          className="focus-ring-search-button flex size-8 items-center justify-center rounded-full text-base-black transition-opacity hover:opacity-70"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className="grid grid-cols-7 text-center"
        style={{ color: "var(--color-search-bar-ink-light)" }}
      >
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            aria-hidden="true"
            className="py-1 font-body text-xs"
          >
            {weekday}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`blank-${index}`} aria-hidden="true" />;
          }

          const isPast = date < today;
          const isSelected = selected ? isSameDay(date, selected) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              aria-pressed={isSelected}
              aria-label={formatDate(date)}
              onClick={() => onSelect(date)}
              className={[
                "focus-ring-search-button flex aspect-square items-center justify-center rounded-full font-body text-sm transition-colors",
                isPast
                  ? "cursor-not-allowed opacity-30"
                  : "hover:bg-[var(--color-search-bar-divider)]",
                isSelected ? "bg-base-black text-base-white" : "text-base-black",
                isToday && !isSelected ? "font-semibold" : "",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultsPanel({
  results,
  onClose,
}: {
  results: Destination[];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute left-0 top-full z-20 mt-3 max-h-[70vh] w-full overflow-y-auto rounded-card-corner bg-base-white p-4 shadow-[var(--shadow-search-bar)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-body text-search-bar text-base-black">
          {results.length === 0
            ? "No matching destinations"
            : `${results.length} destination${results.length === 1 ? "" : "s"}`}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close results"
          className="focus-ring-search-button flex size-8 items-center justify-center rounded-full text-base-black transition-opacity hover:opacity-70"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {results.length === 0 ? (
        <p
          className="font-body text-search-bar"
          style={{ color: "var(--color-search-bar-ink-light)" }}
        >
          Try a different place or clear your filters to see every itinerary.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((destination, index) => (
            <DestinationCard
              key={destination.href ?? `${destination.name}-${index}`}
              destination={destination}
              layout="next-itinerary"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchBar({
  onSearch,
  destinations = DEFAULT_DESTINATIONS,
}: SearchBarProps) {
  const [where, setWhere] = useState("");
  const [what, setWhat] = useState("");
  const [whenDate, setWhenDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [results, setResults] = useState<Destination[] | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const whenLabelId = useId();

  const whenValue = whenDate ? formatDate(whenDate) : "";

  // Close both popovers on outside click or Escape.
  useEffect(() => {
    if (!calendarOpen && results === null) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
        setResults(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
        setResults(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [calendarOpen, results]);

  const runSearch = () => {
    const terms = [where, what]
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean);
    const matched = destinations.filter(
      (destination) =>
        Boolean(destination.href?.trim()) &&
        matchesCriteria(destination, terms),
    );

    setCalendarOpen(false);
    setResults(matched);
    onSearch?.({ where, what, when: whenValue });
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-[var(--size-search-bar-width)]"
    >
      <div className="flex w-full flex-col items-stretch gap-4 rounded-card-corner bg-base-white p-4 shadow-[var(--shadow-search-bar)] xl:h-[var(--size-search-bar-height)] xl:flex-row xl:items-center xl:gap-3 xl:rounded-search-bar-corner xl:p-0 xl:px-[var(--spacing-search-bar-padding-x)]">
        <SearchInputSegment
          icon="where"
          value={where}
          onChange={setWhere}
          onEnter={runSearch}
          placeholder="Where do you want to go?"
        />

        <span
          aria-hidden="true"
          className="block h-px w-full shrink-0 xl:h-[var(--size-search-bar-divider-height)] xl:w-px"
          style={{
            backgroundColor: "var(--color-search-bar-divider)",
          }}
        />

        <SearchInputSegment
          icon="what"
          value={what}
          onChange={setWhat}
          onEnter={runSearch}
          placeholder="What do you want to see?"
        />

        <span
          aria-hidden="true"
          className="block h-px w-full shrink-0 xl:h-[var(--size-search-bar-divider-height)] xl:w-px"
          style={{
            backgroundColor: "var(--color-search-bar-divider)",
          }}
        />

        {/* When — opens a calendar dropdown instead of free text entry. */}
        <div className="relative flex w-full min-w-0 items-center xl:min-w-0 xl:flex-1">
          <span id={whenLabelId} className="sr-only">
            When do you want to go?
          </span>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            aria-labelledby={whenLabelId}
            onClick={() => setCalendarOpen((open) => !open)}
            className="flex w-full min-w-0 items-center rounded-search-button-corner text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-base-black)]"
            style={{ gap: "var(--spacing-search-bar-segment-gap)" }}
          >
            <span
              className={`order-2 min-w-0 w-full truncate font-body text-search-bar ${
                whenValue
                  ? "text-base-black"
                  : "text-[var(--color-search-bar-ink-light)]"
              }`}
            >
              {whenValue || "When do you want to go?"}
            </span>
            <SegmentGlyph kind="when" />
          </button>

          {calendarOpen ? (
            <CalendarPopover
              selected={whenDate}
              onSelect={(date) => {
                setWhenDate(date);
                setCalendarOpen(false);
              }}
            />
          ) : null}
        </div>

        <div className="w-full xl:ml-auto xl:w-auto">
          <SearchButton
            className="w-full xl:w-[var(--size-search-button-width)]"
            onClick={runSearch}
          />
        </div>
      </div>

      {results !== null ? (
        <ResultsPanel results={results} onClose={() => setResults(null)} />
      ) : null}
    </div>
  );
}
