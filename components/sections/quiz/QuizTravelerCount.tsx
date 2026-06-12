import QuizIconButton from "@/components/ui/QuizIconButton";
import QuizToggle from "@/components/ui/QuizToggle";
import type { QuizTravelerCountContent } from "@/types/quiz-content";

type QuizTravelerCountProps = {
  content: QuizTravelerCountContent;
  adults: string;
  onAdultsChange: (value: string) => void;
  addChildren: boolean;
  onAddChildrenChange: (checked: boolean) => void;
  /** One entry per children line; the string is that child's age. */
  childrenAges: string[];
  onChildAgeChange: (index: number, value: string) => void;
  onAddChild: () => void;
  onRemoveChild: (index: number) => void;
};

const fieldClassName =
  "h-[var(--size-quiz-input-height)] w-full rounded-card-corner border border-base-white bg-transparent px-4 text-left font-body text-body-1 text-base-white placeholder:text-base-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white";

// The "Who Will Be Travelling?" sub-scene body (Figma nodes 947:1426 / 947:1427):
// a number-of-adults field with an "add children" toggle, and — when the toggle
// is on — one or more "Children / Infants" age lines, each with add (+) and
// remove (−) controls. Used as the body of a QuizSceneFrame; prompt / quote /
// nav live in the frame. Purely presentational — all state lives in the shell.
export default function QuizTravelerCount({
  content,
  adults,
  onAdultsChange,
  addChildren,
  onAddChildrenChange,
  childrenAges,
  onChildAgeChange,
  onAddChild,
  onRemoveChild,
}: QuizTravelerCountProps) {
  return (
    <div className="flex w-full flex-col items-center gap-[var(--spacing-quiz-fields-stack-gap)]">
      {/* Adults number + add-children toggle */}
      <div className="flex w-full flex-wrap items-end justify-center gap-[var(--spacing-quiz-count-row-gap)]">
        <div className="flex w-full flex-col items-start gap-[var(--spacing-quiz-field-label-gap)] max-w-[var(--size-quiz-adults-field-width)]">
          <label
            htmlFor="quiz-adults"
            className="font-body text-body-1 text-base-white"
          >
            {content.adultsLabel}
          </label>
          <input
            id="quiz-adults"
            type="number"
            inputMode="numeric"
            min={1}
            value={adults}
            onChange={(event) => onAdultsChange(event.target.value)}
            placeholder={content.adultsPlaceholder}
            className={fieldClassName}
          />
        </div>

        <div className="flex items-center gap-[var(--spacing-quiz-toggle-gap)]">
          <QuizToggle
            checked={addChildren}
            onChange={onAddChildrenChange}
            label={content.addChildrenLabel}
          />
          <span className="whitespace-nowrap font-body text-body-1 text-base-white">
            {content.addChildrenLabel}
          </span>
        </div>
      </div>

      {/* Children / infants lines — one per child, each with add / remove. */}
      {addChildren
        ? childrenAges.map((age, index) => (
            <div
              key={index}
              className="flex w-full flex-wrap items-end justify-center gap-[var(--spacing-quiz-children-row-gap)]"
            >
              <div className="flex w-full flex-col items-start gap-[var(--spacing-quiz-field-label-gap)] max-w-[var(--size-quiz-adults-field-width)]">
                <label
                  htmlFor={`quiz-child-${index}`}
                  className="font-body text-body-1 text-base-white"
                >
                  {content.childrenLabel}
                </label>
                <input
                  id={`quiz-child-${index}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={age}
                  onChange={(event) => onChildAgeChange(index, event.target.value)}
                  placeholder={content.childAgePlaceholder}
                  className={fieldClassName}
                />
              </div>

              <div className="flex items-center gap-4">
                <QuizIconButton
                  icon="plus"
                  onClick={onAddChild}
                  label="Add another child"
                />
                <QuizIconButton
                  icon="minus"
                  onClick={() => onRemoveChild(index)}
                  label="Remove this child"
                />
              </div>
            </div>
          ))
        : null}
    </div>
  );
}
