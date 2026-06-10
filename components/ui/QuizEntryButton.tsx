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
const baseClassName =
  "inline-flex items-center justify-center rounded-full border border-glass-border bg-glass-surface px-6 py-3 text-center font-body text-cta-button text-base-white shadow-glass backdrop-blur-glass backdrop-saturate-[var(--glass-saturate)] transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white disabled:cursor-not-allowed disabled:opacity-50";

export default function QuizEntryButton({
  children,
  href,
  disabled = false,
  onClick,
}: QuizEntryButtonProps) {
  if (href && !disabled) {
    return (
      <Link href={href} onClick={onClick} className={baseClassName}>
        {children}
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
      {children}
    </button>
  );
}
