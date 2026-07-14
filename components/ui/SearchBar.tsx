"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import SearchButton from "@/components/ui/SearchButton";
import type { SearchRequestPayload } from "@/types/search-request";

// Scroll target for the featured destinations section (see Destinations.tsx).
const DESTINATIONS_ANCHOR_ID = "destinations";

type SearchCriteria = {
  where: string;
  what: string;
  when: string;
};

type SearchBarProps = {
  /** Notified whenever a search runs, after the enquiry is submitted. */
  onSearch?: (criteria: SearchCriteria) => void;
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

/** Travel window: a start date and (once completed) an end date. */
type DateRange = { start: Date | null; end: Date | null };

const EMPTY_RANGE: DateRange = { start: null, end: null };

/** "Jul 14 – Jul 20, 2026", or just the start while the range is incomplete. */
function formatRange({ start, end }: DateRange) {
  if (!start) return "";
  if (!end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** Local `YYYY-MM-DD` (not `toISOString`, which would shift across time zones). */
function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  range,
  onChange,
  anchorRef,
  popoverRef,
}: {
  range: DateRange;
  onChange: (range: DateRange) => void;
  /** Element the calendar is anchored beneath. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Forwarded to the portalled root so outside-click detection can exclude it. */
  popoverRef: RefObject<HTMLDivElement | null>;
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const initial = range.start ?? range.end ?? today;
  const [view, setView] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });

  // Day being hovered while the range is half-open, so the in-between days can
  // preview the window the user is about to select.
  const [hovered, setHovered] = useState<Date | null>(null);

  // Range selection: the first pick starts a new (open) range; the second pick
  // closes it. Clicking a day before the current start restarts from that day.
  const pickDate = (date: Date) => {
    const { start, end } = range;
    if (!start || end) {
      onChange({ start: date, end: null });
    } else if (date < start) {
      onChange({ start: date, end: null });
    } else {
      onChange({ start, end: date });
    }
  };

  // End used purely for highlighting: the committed end, or the hovered day
  // while the range is still open.
  const previewEnd =
    range.end ?? (range.start && hovered && hovered >= range.start ? hovered : null);

  // The calendar is rendered in a portal on document.body with fixed
  // positioning so it can't be clipped by an ancestor's `overflow-hidden`
  // (the Hero section) or painted over by the following section. Position is
  // measured from the anchor and kept in sync on scroll/resize.
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const MAX_WIDTH = 320; // Tailwind max-w-xs (20rem)
    const GAP = 12; // mt-3
    const EDGE = 8; // viewport breathing room

    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(rect.width, MAX_WIDTH);
      let left = rect.left;
      const overflowRight = left + width + EDGE - window.innerWidth;
      if (overflowRight > 0) left -= overflowRight;
      left = Math.max(EDGE, left);
      setPosition({ top: rect.bottom + GAP, left, width });
    };

    update();
    window.addEventListener("resize", update);
    // Capture phase so scrolling any ancestor repositions the calendar.
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef]);

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Choose travel dates"
      className="fixed z-[100] rounded-card-corner bg-base-white p-4 shadow-[var(--shadow-search-bar)]"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        width: position?.width,
        // Hidden until measured on the client to avoid a flash at (0,0).
        visibility: position ? "visible" : "hidden",
      }}
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

      <div
        className="grid grid-cols-7 gap-y-1"
        onMouseLeave={() => setHovered(null)}
      >
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`blank-${index}`} aria-hidden="true" />;
          }

          const isPast = date < today;
          const isToday = isSameDay(date, today);
          const isStart = range.start ? isSameDay(date, range.start) : false;
          const isEnd = previewEnd ? isSameDay(date, previewEnd) : false;
          const isEndpoint = isStart || isEnd;
          const inRange =
            range.start && previewEnd
              ? date > range.start && date < previewEnd
              : false;
          // Continuous track behind the days that fall inside the range; the
          // endpoints round off the outer edge so the bar reads as one span.
          const showTrack = inRange || (isEndpoint && range.start && previewEnd);

          return (
            <div
              key={date.toISOString()}
              className={[
                "relative flex items-center justify-center",
                showTrack ? "bg-[var(--color-search-bar-divider)]" : "",
                showTrack && isStart ? "rounded-l-full" : "",
                showTrack && isEnd ? "rounded-r-full" : "",
              ].join(" ")}
            >
              <button
                type="button"
                disabled={isPast}
                aria-pressed={isEndpoint}
                aria-label={formatDate(date)}
                onClick={() => pickDate(date)}
                onMouseEnter={() => setHovered(date)}
                className={[
                  "focus-ring-search-button relative z-[1] flex aspect-square w-full items-center justify-center rounded-full font-body text-sm transition-colors",
                  isPast
                    ? "cursor-not-allowed opacity-30"
                    : "hover:bg-[var(--color-search-bar-divider)]",
                  isEndpoint
                    ? "bg-base-black text-base-white"
                    : "text-base-black",
                  isToday && !isEndpoint ? "font-semibold" : "",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [where, setWhere] = useState("");
  const [what, setWhat] = useState("");
  const [whenRange, setWhenRange] = useState<DateRange>(EMPTY_RANGE);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const whenAnchorRef = useRef<HTMLDivElement>(null);
  const calendarPopoverRef = useRef<HTMLDivElement>(null);
  const whenLabelId = useId();

  const whenValue = formatRange(whenRange);

  // Close the calendar on outside click or Escape.
  useEffect(() => {
    if (!calendarOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      // The calendar is portalled to document.body, so it lives outside rootRef;
      // exclude it explicitly or interacting with it would close the popover.
      const insideRoot = rootRef.current?.contains(target);
      const insidePopover = calendarPopoverRef.current?.contains(target);
      if (!insideRoot && !insidePopover) setCalendarOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCalendarOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [calendarOpen]);

  const runSearch = () => {
    setCalendarOpen(false);

    const payload: SearchRequestPayload = {
      where: where.trim(),
      what: what.trim(),
      dateFrom: whenRange.start ? toISODate(whenRange.start) : null,
      dateTo: whenRange.end ? toISODate(whenRange.end) : null,
    };

    // No destination database yet: capture the enquiry for the advisor team
    // (best-effort — never block the hand-off to Destinations on the save) and
    // skip empty searches so we don't create blank leads.
    const hasInput = Boolean(
      payload.where || payload.what || payload.dateFrom || payload.dateTo,
    );
    if (hasInput) {
      void (async () => {
        try {
          const response = await fetch("/api/search-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }
        } catch (error) {
          console.error("Search request failed to save", error);
        }
      })();
    }

    onSearch?.({ where, what, when: whenValue });

    // Every search routes travellers to the featured destinations section.
    document
      .getElementById(DESTINATIONS_ANCHOR_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <div
          ref={whenAnchorRef}
          className="relative flex w-full min-w-0 items-center xl:min-w-0 xl:flex-1"
        >
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
              range={whenRange}
              anchorRef={whenAnchorRef}
              popoverRef={calendarPopoverRef}
              onChange={(next) => {
                setWhenRange(next);
                // Close only once a full range (start + end) is chosen.
                if (next.start && next.end) setCalendarOpen(false);
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
    </div>
  );
}
