import { useId, useState } from "react";

import SearchButton from "@/components/ui/SearchButton";

type SearchCriteria = {
  where: string;
  what: string;
  when: string;
};

type SearchBarProps = {
  onSearch: (criteria: SearchCriteria) => void;
};

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

function SearchInputSegment({
  icon,
  onChange,
  placeholder,
  value,
}: {
  icon: "where" | "what" | "when";
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const inputId = useId();

  return (
    <div
      className="flex w-full min-w-0 items-center xl:min-w-0 xl:flex-1 2xl:w-[var(--size-search-bar-segment-width)] 2xl:flex-none"
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
        placeholder={placeholder}
        className="order-2 min-w-0 w-full bg-transparent font-body text-search-bar text-base-black caret-[var(--color-base-black)] focus:outline-none placeholder:font-body placeholder:text-search-bar placeholder:text-[var(--color-search-bar-ink-light)]"
      />
      <span
        aria-hidden="true"
        className="order-1 shrink-0"
        style={{
          width: "var(--size-search-bar-icon-size)",
          height: "var(--size-search-bar-icon-size)",
          color: "var(--color-search-bar-ink-light)",
        }}
      >
        <SegmentIcon kind={icon} />
      </span>
    </div>
  );
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [where, setWhere] = useState("");
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");

  const handleSearch = () => {
    onSearch({ where, what, when });
  };

  return (
    <div
      className="flex w-full max-w-[var(--size-search-bar-width)] flex-col items-stretch gap-4 rounded-card-corner bg-base-white p-4 shadow-[var(--shadow-search-bar)] xl:h-[var(--size-search-bar-height)] xl:flex-row xl:items-center xl:gap-3 xl:rounded-search-bar-corner xl:p-0 xl:px-[var(--spacing-search-bar-padding-x)]"
    >
      <SearchInputSegment
        icon="where"
        value={where}
        onChange={setWhere}
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
        placeholder="What do you want to see?"
      />

      <span
        aria-hidden="true"
        className="block h-px w-full shrink-0 xl:h-[var(--size-search-bar-divider-height)] xl:w-px"
        style={{
          backgroundColor: "var(--color-search-bar-divider)",
        }}
      />

      <SearchInputSegment
        icon="when"
        value={when}
        onChange={setWhen}
        placeholder="When do you want to go?"
      />

      <div className="w-full xl:ml-auto xl:w-auto">
        <SearchButton className="w-full xl:w-[var(--size-search-button-width)]" onClick={handleSearch} />
      </div>
    </div>
  );
}
