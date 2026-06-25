type QuizToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Id of the visible label element that names this switch. */
  labelledById: string;
};

// The "add children" switch (Figma node 584:1432): a white track with a soft
// grey knob that slides from left (off) to right (on). The knob travel equals
// the track width minus the knob and its two inset gaps, derived from tokens so
// the geometry stays in sync if the sizes change.
const KNOB_TRAVEL =
  "calc(var(--size-quiz-toggle-track-width) - var(--size-quiz-toggle-knob-size) - 2 * var(--spacing-quiz-toggle-inset))";

export default function QuizToggle({
  checked,
  onChange,
  labelledById,
}: QuizToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledById}
      onClick={() => onChange(!checked)}
      className="relative shrink-0 rounded-full bg-base-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white w-[var(--size-quiz-toggle-track-width)] h-[var(--size-quiz-toggle-track-height)]"
    >
      <span
        aria-hidden="true"
        className="absolute rounded-full border border-quiz-toggle-knob-border bg-quiz-toggle-knob transition-transform duration-200 ease-out size-[var(--size-quiz-toggle-knob-size)] top-[var(--spacing-quiz-toggle-inset)] left-[var(--spacing-quiz-toggle-inset)]"
        style={{
          transform: checked ? `translateX(${KNOB_TRAVEL})` : "translateX(0)",
        }}
      />
    </button>
  );
}
