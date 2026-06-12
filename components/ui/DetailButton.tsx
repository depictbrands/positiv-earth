import Link from "next/link";
import type { ReactNode } from "react";

type DetailButtonProps = {
  children?: ReactNode;
  /** When set, the control renders as a link to this route instead of a button. */
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

// White pill with dark label (Figma node 584:1220 "Details"). Reusable UI
// primitive: renders as a link when `href` is set, otherwise a button. Includes
// hover / active / disabled states and a visible keyboard focus ring.
const baseClassName =
  "inline-flex items-center justify-center rounded-full bg-base-white px-6 py-3 text-center font-open-sans text-itinerary-detail-button text-itinerary-body-ink transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-itinerary-body-ink disabled:cursor-not-allowed disabled:opacity-50";

export default function DetailButton({
  children = "Details",
  href,
  disabled = false,
  onClick,
  className,
}: DetailButtonProps) {
  const classes = className ? `${baseClassName} ${className}` : baseClassName;

  if (href && !disabled) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
