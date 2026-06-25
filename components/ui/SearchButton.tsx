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
        "focus-ring-search-button inline-flex h-[var(--size-search-button-height)] items-center justify-center whitespace-nowrap rounded-search-button-corner bg-search-button-surface py-[var(--spacing-search-button-padding-y)] pl-[var(--spacing-search-button-padding-left)] pr-[var(--spacing-search-button-padding-right)] font-body text-search-bar-button text-base-black transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
