/**
 * The JSON payload the Design-Your-Travel quiz POSTs to `/api/quiz` when a
 * traveller finishes the quiz. The client resolves option/choice ids to their
 * human labels (from the quiz `content`) before sending, so the persisted lead
 * and the notification email read as text rather than raw ids.
 */

import type { QuizContactValues } from "@/types/quiz-content";

/** The Question 1 party choice, with its resolved label. */
export type QuizPartySelection = {
  optionId: string;
  label: string;
};

/** The traveller-count sub-scene answer (only present for "group" parties). */
export type QuizTravelerSelection = {
  adults: number;
  childrenAges: number[];
};

/** One image-choice question (Q2/Q3) with its selected cards resolved. */
export type QuizInterestSelection = {
  questionId: string;
  prompt: string;
  choices: { id: string; label: string }[];
};

export type QuizSubmissionPayload = {
  party: QuizPartySelection | null;
  travelers: QuizTravelerSelection | null;
  interests: QuizInterestSelection[];
  contact: QuizContactValues;
};
