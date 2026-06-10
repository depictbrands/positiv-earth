type QuizNavButtonProps = {
  /** "next" places the arrow after the label, "back" before it. */
  direction: "next" | "back";
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// lucide arrow-right / arrow-left, inlined so the quiz carries no icon asset.
function ArrowIcon({ direction }: { direction: "next" | "back" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "next" ? (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      ) : (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      )}
    </svg>
  );
}

// The quiz progress controls (Figma "Back" node 584:1421 / "Next" node
// 947:1429): a pill with a 20px Raleway SemiBold label and a directional arrow.
// Finished with the same Apple-style liquid glass as QuizEntryButton — heavy
// backdrop blur + saturation boost, a bright hairline border, specular top
// highlight and soft depth shadow (the --*-glass tokens in globals.css).
export default function QuizNavButton({
  direction,
  label,
  onClick,
  disabled = false,
  className,
}: QuizNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-[10px] rounded-full border border-glass-border bg-glass-surface px-6 py-3 font-body text-cta-button text-base-white shadow-glass backdrop-blur-glass backdrop-saturate-[var(--glass-saturate)] transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      {direction === "back" ? <ArrowIcon direction="back" /> : null}
      <span className="whitespace-nowrap">{label}</span>
      {direction === "next" ? <ArrowIcon direction="next" /> : null}
    </button>
  );
}
