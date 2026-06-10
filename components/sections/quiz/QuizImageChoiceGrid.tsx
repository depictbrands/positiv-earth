import QuizImageCard from "@/components/ui/QuizImageCard";
import type { QuizImageChoice } from "@/types/quiz-content";

type QuizImageChoiceGridProps = {
  choices: QuizImageChoice[];
  /** Ids of the currently-selected cards (multi-select). */
  selectedIds?: string[];
  onToggle?: (id: string) => void;
  /** Cards per row on desktop (caps the block so it wraps into design rows). */
  columns?: number;
};

// The picture-card grid for Questions 2 & 3 (Figma nodes 939:1412 / 939:1413).
// Multi-select: any number of cards can be chosen. Cards are a fixed width with
// a 12px column gap and 28px row gap. The block is capped to `columns` cards
// wide so it wraps into the designed rows on desktop, and reflows to fewer per
// row on smaller screens.
export default function QuizImageChoiceGrid({
  choices,
  selectedIds = [],
  onToggle,
  columns = 4,
}: QuizImageChoiceGridProps) {
  return (
    <div
      className="mx-auto flex flex-wrap justify-center gap-x-3 gap-y-7"
      style={{
        maxWidth: `calc(${columns} * var(--size-quiz-image-card) + ${columns - 1} * 0.75rem)`,
      }}
    >
      {choices.map((choice) => (
        <QuizImageCard
          key={choice.id}
          choice={choice}
          selected={selectedIds.includes(choice.id)}
          onSelect={onToggle}
        />
      ))}
    </div>
  );
}
