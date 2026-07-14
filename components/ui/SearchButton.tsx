import type { ReactNode } from "react";

type SearchButtonProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function SearchButton({
  children = "Search",
  className,
  disabled = false,
  onClick,
}: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Default surface is brick-red; on hover the three-services-blue fill and
        // black label slide up from the bottom in sync (same motion as QuizEntryButton).
        "focus-ring-search-button group relative inline-flex h-[var(--size-search-button-height)] items-center justify-center overflow-hidden whitespace-nowrap rounded-search-button-corner bg-brick-red py-[var(--spacing-search-button-padding-y)] pl-[var(--spacing-search-button-padding-left)] pr-[var(--spacing-search-button-padding-right)] font-body text-search-bar-button text-base-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] translate-y-full bg-three-services-blue transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full"
      />
      <span className="relative z-10 inline-grid shrink-0 overflow-hidden">
        <span className="col-start-1 row-start-1 transition-transform duration-300 ease-out group-hover:-translate-y-full group-disabled:translate-y-0">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 translate-y-full text-base-black transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full"
        >
          {children}
        </span>
      </span>
    </button>
  );
}
