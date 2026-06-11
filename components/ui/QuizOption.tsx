import QuizOptionIcon from "@/components/ui/QuizOptionIcon";
import type { QuizOption as QuizOptionData } from "@/types/quiz-content";

type QuizOptionProps = {
  option: QuizOptionData;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// A single quiz answer (Figma nodes 939:1415–939:1422): a drawn line icon above
// its label. The label always reserves the white "active-status" pill footprint
// (Figma node 584:1388) so hovering or selecting never shifts the layout — the
// pill simply fades in behind the text and the text flips to black for contrast.
// The whole option is one focusable button so clicking the icon or label selects
// it (and, later, drives conditional routing).
export default function QuizOption({
  option,
  selected = false,
  onSelect,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect?.(option.id)}
      className="group flex flex-col items-center gap-[14px] rounded-card-corner p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white"
    >
      {/* 64px square, matching the Figma icon footprint (--size-quiz-icon-size). */}
      <QuizOptionIcon
        name={option.icon}
        className="shrink-0 size-[var(--size-quiz-icon-size)] text-base-white"
      />

      {/* Padding is always present so the pill's footprint is reserved in every
          state — the pill itself is a separate layer that only fades in. */}
      <span className="relative inline-flex items-center justify-center rounded-full px-6 py-[10px] font-body text-body-1 text-center">
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-base-white transition-opacity duration-200 group-hover:opacity-100",
            selected ? "opacity-100" : "opacity-0",
          )}
        />
        <span
          className={cn(
            "relative z-10 transition-colors duration-200 group-hover:text-base-black",
            selected ? "text-base-black" : "text-base-white",
          )}
        >
          {option.label}
        </span>
      </span>
    </button>
  );
}
