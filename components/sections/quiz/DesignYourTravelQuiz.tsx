"use client";

import Image from "next/image";
import { useState } from "react";

import Header from "@/components/layout/Header";
import TextReveal from "@/components/ui/TextReveal";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import QuizOption from "@/components/ui/QuizOption";
import QuizContactForm from "@/components/sections/quiz/QuizContactForm";
import QuizImageChoiceGrid from "@/components/sections/quiz/QuizImageChoiceGrid";
import QuizSceneFrame from "@/components/sections/quiz/QuizSceneFrame";
import QuizTravelerCount from "@/components/sections/quiz/QuizTravelerCount";
import type { QuizContactValues, QuizContent } from "@/types/quiz-content";

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

  // Gather every answer. No backend is wired yet, so submit logs the payload —
  // the seam for posting to a real endpoint (mirrors SearchBar's placeholder).
  const submit = () => {
    console.log("Design Your Travel submission", {
      selections: selectionByQuestion,
      imageSelections,
      adults,
      addChildren,
      childrenAges,
      contact,
    });
  };

  // Next advances to the following question (and the progress bar); on the last
  // step it submits instead.
  const goNext = () => {
    if (isLastStep) {
      submit();
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
  // public/quiz). The four questions map 1:1 by order to quotes-motion-1..4; the
  // traveller-count sub-scene uses the fifth file.
  const quoteLottieSrc = inTravelerCount
    ? "/quiz/quotes-motion-5.json"
    : `/quiz/quotes-motion-${stepIndex + 1}.json`;

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden">
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

      {/* Top bar — desktop: nav centered, quiz button pinned right (matches heroes). */}
      <div className="hidden lg:block">
        <div className="fixed inset-x-0 top-6 z-50 flex justify-center">
          <Header />
        </div>
        <div className="fixed top-6 z-50" style={{ left: "82.0767195767%" }}>
          <QuizEntryButton href="/design-your-travel">
            Design Your Travel
          </QuizEntryButton>
        </div>
      </div>

      {/* Top bar — mobile / tablet. */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 lg:hidden">
        <Header />
        <QuizEntryButton href="/design-your-travel">
          Design Your Travel
        </QuizEntryButton>
      </div>

      {/* Title + quiz panel */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 pb-12 pt-28 lg:pt-32">
        <div className="mx-auto flex w-full flex-col gap-6 max-w-[var(--size-quiz-block-width)]">
          <TextReveal
            as="h1"
            className="font-body text-quiz-title text-base-white"
          >
            {content.title}
          </TextReveal>

          {question ? (
            <QuizSceneFrame
              stepIndex={stepIndex}
              totalSteps={content.totalSteps}
              prompt={prompt}
              quoteLottieSrc={quoteLottieSrc}
              showBack={showBack}
              canGoNext={canGoNext}
              nextLabel={isLastStep ? "Submit" : "Next"}
              onBack={goBack}
              onNext={goNext}
            >
              {question.kind === "contact-form" ? (
                <QuizContactForm
                  content={question}
                  values={contact}
                  onChange={setContactField}
                />
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
