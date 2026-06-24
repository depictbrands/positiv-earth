import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type QuizEntryButtonProps = {
  children: ReactNode;
  /** Accessible name; defaults to string `children` when omitted. */
  ariaLabel?: string;
  /** When set, the control renders as a link to this route instead of a button. */
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
};

// Liquid glass: transparent root with a ::before fill (see globals.css
// .quiz-entry-button), backdrop blur, hairline border, drop shadow. Hover:
// white fill and black label slide up from the bottom in sync.
const baseClassName =
  "quiz-entry-button group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-glass-border bg-transparent px-6 text-center font-body text-cta-button text-base-white backdrop-blur-glass backdrop-saturate-[var(--glass-saturate)] disabled:cursor-not-allowed disabled:opacity-50";

const baseStyle: CSSProperties = {
  height: "var(--size-header-height)",
};

function resolveAriaLabel(
  ariaLabel: string | undefined,
  children: ReactNode,
): string | undefined {
  const explicit = ariaLabel?.trim();
  if (explicit) return explicit;

  if (typeof children === "string") {
    const fromChildren = children.trim();
    return fromChildren || undefined;
  }

  return undefined;
}

function QuizEntryButtonContent({
  children,
  hideLabelFromAssistiveTech,
}: {
  children: ReactNode;
  hideLabelFromAssistiveTech: boolean;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] translate-y-full bg-base-white transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full"
      />
      <span
        aria-hidden={hideLabelFromAssistiveTech ? true : undefined}
        className="relative z-10 inline-grid overflow-hidden"
      >
        <span className="col-start-1 row-start-1 transition-transform duration-300 ease-out group-hover:-translate-y-full group-disabled:translate-y-0">
          {children}
        </span>
        <span className="col-start-1 row-start-1 translate-y-full text-base-black transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full">
          {children}
        </span>
      </span>
    </>
  );
}

export default function QuizEntryButton({
  children,
  ariaLabel,
  href,
  disabled = false,
  onClick,
}: QuizEntryButtonProps) {
  const resolvedAriaLabel = resolveAriaLabel(ariaLabel, children);

  if (href && !disabled) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={resolvedAriaLabel}
        className={baseClassName}
        style={baseStyle}
      >
        <QuizEntryButtonContent hideLabelFromAssistiveTech={Boolean(resolvedAriaLabel)}>
          {children}
        </QuizEntryButtonContent>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={resolvedAriaLabel}
      className={baseClassName}
      style={baseStyle}
    >
      <QuizEntryButtonContent hideLabelFromAssistiveTech={Boolean(resolvedAriaLabel)}>
        {children}
      </QuizEntryButtonContent>
    </button>
  );
}
