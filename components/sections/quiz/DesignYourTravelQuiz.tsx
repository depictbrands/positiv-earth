"use client";

import Image from "next/image";
import { useState } from "react";

import TextReveal from "@/components/ui/TextReveal";
import QuizOption from "@/components/ui/QuizOption";
import QuizContactForm from "@/components/sections/quiz/QuizContactForm";
import QuizImageChoiceGrid from "@/components/sections/quiz/QuizImageChoiceGrid";
import QuizSceneFrame from "@/components/sections/quiz/QuizSceneFrame";
import QuizTravelerCount from "@/components/sections/quiz/QuizTravelerCount";
import type { QuizContactValues, QuizContent } from "@/types/quiz-content";
import type { QuizSubmissionPayload } from "@/types/quiz-submission";

const EMPTY_CONTACT: QuizContactValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  country: "",
  notes: "",
};

type DesignYourTravelQuizProps = {
  content: QuizContent;
};

// Which view of the current step is showing. "options" is the choice grid (or
// image grid); "traveler-count" is the follow-up sub-scene reached by a "group"
// choice on Question 1 — it shares the step (and progress bar) with "options".
type StepView = "options" | "traveler-count";

// The page-turn quiz shell (Figma nodes 584:1372, 947:1426, 939:1412/1413).
// Owns the step index, the per-question selection, and which view of the step is
// showing. Renders the background + top bar like the site heroes, then pages
// through one QuizSceneFrame at a time. Each step advances the progress bar; the
// Question 1 "group" → traveller-count branch is the one move that does not.
export default function DesignYourTravelQuiz({
  content,
}: DesignYourTravelQuizProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [view, setView] = useState<StepView>("options");
  // Single-select answers (the party question), keyed by question id.
  const [selectionByQuestion, setSelectionByQuestion] = useState<
    Record<string, string>
  >({});
  // Multi-select answers (the image-choice questions), keyed by question id.
  const [imageSelections, setImageSelections] = useState<
    Record<string, string[]>
  >({});
  const [adults, setAdults] = useState("");
  const [addChildren, setAddChildren] = useState(false);
  // One entry per children line; the string is that child's age.
  const [childrenAges, setChildrenAges] = useState<string[]>([]);
  const [contact, setContact] = useState<QuizContactValues>(EMPTY_CONTACT);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const question = content.questions[stepIndex];
  const selectedId = question ? selectionByQuestion[question.id] : undefined;
  const selectedImageIds = question ? (imageSelections[question.id] ?? []) : [];

  // Single-select for the party question. A "group" option also opens the
  // traveller-count sub-scene in the same step; everything else just selects.
  const selectOption = (optionId: string) => {
    if (question?.kind !== "party") return;
    setSelectionByQuestion((prev) => ({ ...prev, [question.id]: optionId }));

    const option = question.options.find((item) => item.id === optionId);
    setView(
      option?.branch === "group" && question.travelerCount
        ? "traveler-count"
        : "options",
    );
  };

  // Multi-select for the image-choice questions: toggle a card in/out.
  const toggleImageChoice = (choiceId: string) => {
    if (!question) return;
    setImageSelections((prev) => {
      const current = prev[question.id] ?? [];
      const next = current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId];
      return { ...prev, [question.id]: next };
    });
  };

  // Toggling "add children" reveals the first children line (or clears them
  // all). It never advances the scene.
  const toggleAddChildren = (checked: boolean) => {
    setAddChildren(checked);
    setChildrenAges(checked ? [""] : []);
  };

  const setChildAge = (index: number, value: string) => {
    setChildrenAges((prev) =>
      prev.map((age, i) => (i === index ? value : age)),
    );
  };

  const addChild = () => setChildrenAges((prev) => [...prev, ""]);

  // Remove a children line; removing the last one turns the toggle back off.
  const removeChild = (index: number) => {
    setChildrenAges((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setAddChildren(false);
      return next;
    });
  };

  const setContactField = (field: keyof QuizContactValues, value: string) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const isLastStep = stepIndex === content.questions.length - 1;

  // Resolve the raw selection ids into a serialisable payload with human labels
  // (pulled from `content`), so the persisted lead and notification email read
  // as text rather than ids.
  const buildPayload = (): QuizSubmissionPayload => {
    const partyQuestion = content.questions.find((q) => q.kind === "party");
    const partyId = partyQuestion
      ? selectionByQuestion[partyQuestion.id]
      : undefined;
    const partyOption =
      partyQuestion?.kind === "party"
        ? partyQuestion.options.find((option) => option.id === partyId)
        : undefined;

    // Only the "group" branch opens the traveller-count sub-scene, so only then
    // do we have an adult count to report.
    const hasTravelers = partyOption?.branch === "group" && Number(adults) >= 1;

    const interests = content.questions
      .filter((q) => q.kind === "image-choice")
      .map((q) => {
        const selectedIds = imageSelections[q.id] ?? [];
        return {
          questionId: q.id,
          prompt: q.prompt,
          choices: q.choices
            .filter((choice) => selectedIds.includes(choice.id))
            .map((choice) => ({ id: choice.id, label: choice.label })),
        };
      })
      .filter((interest) => interest.choices.length > 0);

    return {
      party: partyOption
        ? { optionId: partyOption.id, label: partyOption.label }
        : null,
      travelers: hasTravelers
        ? {
            adults: Number(adults),
            childrenAges: addChildren
              ? childrenAges
                  .map((age) => Number(age))
                  .filter((age) => Number.isFinite(age) && age > 0)
              : [],
          }
        : null,
      interests,
      contact,
    };
  };

  // Post every answer to the backend (persists to Sanity + emails the team).
  const submit = async () => {
    setSubmitState("submitting");
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setSubmitState("success");
    } catch (error) {
      console.error("Design Your Travel submission failed", error);
      setSubmitState("error");
    }
  };

  // Next advances to the following question (and the progress bar); on the last
  // step it submits instead.
  const goNext = () => {
    if (isLastStep) {
      if (submitState === "submitting") return;
      void submit();
      return;
    }
    setStepIndex((index) => index + 1);
    setView("options");
  };

  // Back: step out of the traveller-count view first, otherwise to the previous
  // question.
  const goBack = () => {
    if (view === "traveler-count") {
      setView("options");
      return;
    }
    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
      setView("options");
    }
  };

  const inTravelerCount =
    question?.kind === "party" &&
    view === "traveler-count" &&
    Boolean(question.travelerCount);

  const showBack = inTravelerCount || stepIndex > 0;
  const canGoNext = inTravelerCount
    ? Number(adults) >= 1
    : question?.kind === "contact-form"
      ? // Basic gate: a name and email before the form can be submitted.
        Boolean(contact.firstName.trim() && contact.email.trim())
      : question?.kind === "image-choice"
        ? selectedImageIds.length > 0
        : Boolean(selectedId);

  const prompt =
    inTravelerCount && question?.kind === "party" && question.travelerCount
      ? question.travelerCount.prompt
      : (question?.prompt ?? "");

  // Each scene shows its own decorative quote animation (repo assets in
  // public/quiz). The four questions map 1:1 by order to quote-1..4; the
  // traveller-count sub-scene uses the fifth file.
  const quoteLottieSrc = inTravelerCount
    ? "/quiz/quote-5.json"
    : `/quiz/quote-${stepIndex + 1}.json`;

  const submitting = submitState === "submitting";
  const nextLabel = isLastStep
    ? submitting
      ? "Submitting…"
      : "Submit"
    : "Next";

  return (
    <section
      aria-labelledby="quiz-heading"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      <Image
        src={content.backgroundImageUrl}
        alt={content.backgroundImageAlt}
        fill
        className="object-cover"
        priority
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-quiz-bg-overlay)" }}
      />

      {/* Title + quiz panel */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 pb-12 pt-28 lg:pt-32">
        <div className="mx-auto flex w-full flex-col gap-6 max-w-[var(--size-quiz-block-width)]">
          <h1 id="quiz-heading" className="sr-only">
            {content.title}
          </h1>
          <div aria-hidden="true">
            <TextReveal className="font-body text-quiz-title text-base-white">
              {content.title}
            </TextReveal>
          </div>

          {submitState === "success" ? (
            <div className="flex w-full flex-col items-center gap-4 rounded-card-corner bg-quiz-overlay max-w-[var(--size-quiz-block-width)] p-[var(--spacing-quiz-block-inset)] text-center">
              <h2 className="font-body text-quiz-question text-base-white">
                {content.successTitle}
              </h2>
              <p className="font-body text-cta-button text-base-white">
                {content.successMessage}
              </p>
            </div>
          ) : question ? (
            <QuizSceneFrame
              stepIndex={stepIndex}
              totalSteps={content.totalSteps}
              prompt={prompt}
              quoteLottieSrc={quoteLottieSrc}
              showBack={showBack}
              canGoNext={canGoNext && !submitting}
              nextLabel={nextLabel}
              onBack={goBack}
              onNext={goNext}
            >
              {question.kind === "contact-form" ? (
                <div className="flex w-full flex-col gap-4">
                  <QuizContactForm
                    content={question}
                    values={contact}
                    onChange={setContactField}
                  />
                  {submitState === "error" ? (
                    <p
                      role="alert"
                      className="text-center font-body text-cta-button text-base-white"
                    >
                      Something went wrong sending your details. Please try
                      again.
                    </p>
                  ) : null}
                </div>
              ) : question.kind === "image-choice" ? (
                <QuizImageChoiceGrid
                  choices={question.choices}
                  selectedIds={selectedImageIds}
                  onToggle={toggleImageChoice}
                  columns={question.columns}
                />
              ) : inTravelerCount && question.travelerCount ? (
                <QuizTravelerCount
                  content={question.travelerCount}
                  adults={adults}
                  onAdultsChange={setAdults}
                  addChildren={addChildren}
                  onAddChildrenChange={toggleAddChildren}
                  childrenAges={childrenAges}
                  onChildAgeChange={setChildAge}
                  onAddChild={addChild}
                  onRemoveChild={removeChild}
                />
              ) : (
                <div className="grid w-full grid-cols-2 justify-items-center gap-[var(--spacing-quiz-options-gap)] lg:grid-cols-3">
                  {question.options.map((option) => (
                    <QuizOption
                      key={option.id}
                      option={option}
                      selected={option.id === selectedId}
                      onSelect={selectOption}
                    />
                  ))}
                </div>
              )}
            </QuizSceneFrame>
          ) : null}
        </div>
      </div>
    </section>
  );
}
