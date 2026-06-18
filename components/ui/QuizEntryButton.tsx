import Link from "next/link";
import type { ReactNode } from "react";

type QuizEntryButtonProps = {
  children: ReactNode;
  /** When set, the control renders as a link to this route instead of a button. */
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
};

// Apple-style liquid glass: heavy backdrop blur + saturation boost, a bright
// hairline border, a specular top highlight and soft depth shadow. All values
// come from the --*-glass design tokens (see globals.css).
// Hover: a white fill and black label slide up from the bottom in sync.
const baseClassName =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-glass-border bg-glass-surface px-6 py-3 text-center font-body text-cta-button text-base-white shadow-glass backdrop-blur-glass backdrop-saturate-[var(--glass-saturate)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white group-hover:focus-visible:outline-base-black disabled:cursor-not-allowed disabled:opacity-50";

function QuizEntryButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 translate-y-full bg-base-white transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full"
      />
      <span className="relative z-10 inline-grid overflow-hidden">
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
  href,
  disabled = false,
  onClick,
}: QuizEntryButtonProps) {
  if (href && !disabled) {
    return (
      <Link href={href} onClick={onClick} className={baseClassName}>
        <QuizEntryButtonContent>{children}</QuizEntryButtonContent>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClassName}
    >
      <QuizEntryButtonContent>{children}</QuizEntryButtonContent>
    </button>
  );
}
