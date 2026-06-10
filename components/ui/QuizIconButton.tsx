type QuizIconButtonProps = {
  icon: "plus" | "minus";
  onClick?: () => void;
  /** Accessible label, e.g. "Add another child". */
  label: string;
  disabled?: boolean;
};

// Round add / remove control for the children lines (Figma node 584:1471): a
// 40px circular button with a white hairline and a plus/minus glyph, finished
// with the same Apple-style liquid glass as the nav buttons.
export default function QuizIconButton({
  icon,
  onClick,
  label,
  disabled = false,
}: QuizIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-[var(--size-quiz-step-button)] shrink-0 items-center justify-center rounded-full border border-glass-border bg-glass-surface text-base-white shadow-glass backdrop-blur-glass backdrop-saturate-[var(--glass-saturate)] transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white disabled:pointer-events-none disabled:opacity-40"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        {icon === "plus" ? <path d="M12 5v14" /> : null}
      </svg>
    </button>
  );
}
