import Image from "next/image";

import type { QuizImageChoice } from "@/types/quiz-content";

type QuizImageCardProps = {
  choice: QuizImageChoice;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// A picture-card choice for the image-grid questions (Figma nodes 584:1625 etc.):
// a 182px square image above a centred label. The whole card is one focusable
// button; the selected card gets a white ring.
export default function QuizImageCard({
  choice,
  selected = false,
  onSelect,
}: QuizImageCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect?.(choice.id)}
      className="group flex w-[var(--size-quiz-image-card)] max-w-full flex-col items-center gap-3 rounded-card-corner transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white"
    >
      <span
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-card-corner",
          selected &&
            "outline outline-2 outline-offset-2 outline-base-white",
        )}
      >
        <Image
          src={choice.imageUrl}
          alt={choice.imageAlt}
          fill
          sizes="(min-width: 1024px) 182px, 40vw"
          className="object-cover"
        />
      </span>

      <span className="text-center font-body text-body-1 text-base-white">
        {choice.label}
      </span>
    </button>
  );
}
