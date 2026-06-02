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
        "inline-flex items-center justify-center whitespace-nowrap rounded-search-button-corner bg-search-button-surface font-body text-search-bar text-base-black transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline",
        className,
      )}
      style={{
        height: "var(--size-search-button-height)",
        paddingLeft: "var(--spacing-search-button-padding-left)",
        paddingRight: "var(--spacing-search-button-padding-right)",
        paddingTop: "var(--spacing-search-button-padding-y)",
        paddingBottom: "var(--spacing-search-button-padding-y)",
        outlineColor: "var(--color-base-black)",
        outlineOffset: "var(--spacing-search-button-focus-ring-offset)",
        outlineWidth: "var(--size-search-button-focus-ring-width)",
      }}
    >
      {children}
    </button>
  );
}
