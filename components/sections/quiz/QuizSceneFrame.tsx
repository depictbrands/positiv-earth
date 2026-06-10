import type { ReactNode } from "react";

import LottiePlayer from "@/components/ui/LottiePlayer";
import QuizNavButton from "@/components/ui/QuizNavButton";

type QuizSceneFrameProps = {
  /** Zero-based index of the current step (drives the progress bar). */
  stepIndex: number;
  totalSteps: number;
  /** Prompt shown above the body, e.g. "Who Will Be Traveling". */
  prompt: string;
  /** Scene body (options grid, traveller-count form, …). */
  children: ReactNode;
  showBack?: boolean;
  canGoNext?: boolean;
  /** Label for the forward control — "Next" by default, "Submit" on the last step. */
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
};

// The motion graphic (airplane + handwritten quotes) baked into the Lottie file
// the client supplied. It is decorative and shared across every scene, so it
// lives inline rather than in the quiz content shape.
const QUOTE_LOTTIE_SRC = "/quiz/quotes-motion.json";

// Shared chrome for every quiz scene (Figma node 939:1414): the overlay panel,
// the progress header, the prompt, the swappable body, the animated quote, and
// the Back / Next controls. Purely presentational — selection, navigation and
// which body to render are owned by the parent shell.
export default function QuizSceneFrame({
  stepIndex,
  totalSteps,
  prompt,
  children,
  showBack = false,
  canGoNext = true,
  nextLabel = "Next",
  onBack,
  onNext,
}: QuizSceneFrameProps) {
  const progress = Math.min(Math.max((stepIndex + 1) / totalSteps, 0), 1);

  return (
    <div className="relative flex w-full flex-col rounded-card bg-quiz-overlay max-w-[var(--size-quiz-block-width)] p-[var(--spacing-quiz-block-inset)]">
      {/* Progress header */}
      <div className="flex flex-col gap-4">
        <p className="font-body text-cta-button text-base-white">
          {`Question ${stepIndex + 1} / ${totalSteps}`}
        </p>
        <div
          className="h-[6px] w-full overflow-hidden rounded-full bg-quiz-progress-track"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={stepIndex + 1}
        >
          <div
            className="h-full rounded-full bg-quiz-progress transition-[width] duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Prompt + body */}
      <div className="mt-12 flex flex-col items-center gap-[var(--spacing-quiz-prompt-gap)]">
        <h2 className="w-full text-center font-body text-quiz-question text-base-white">
          {prompt}
        </h2>
        <div className="w-full">{children}</div>
      </div>

      {/* Animated quote (airplane + handwritten line) */}
      <div className="mt-12 flex justify-center">
        <LottiePlayer
          src={QUOTE_LOTTIE_SRC}
          ariaLabel="An animated travel quote"
          className="w-full max-w-[31.125rem]"
          style={{ aspectRatio: "2320 / 760" }}
        />
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <div className="min-h-[1px]">
          {showBack ? (
            <QuizNavButton direction="back" label="Back" onClick={onBack} />
          ) : null}
        </div>
        <QuizNavButton
          direction="next"
          label={nextLabel}
          onClick={onNext}
          disabled={!canGoNext}
        />
      </div>
    </div>
  );
}
