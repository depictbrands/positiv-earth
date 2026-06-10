/**
 * Content shapes for the Design-Your-Travel quiz (Figma node 584:1372).
 *
 * These are plain serializable fields so they map cleanly onto a Sanity schema
 * later: each question carries its prompt and a list of selectable options, and
 * the quiz as a whole carries the intro title, background imagery and the total
 * step count used by the progress bar. The animated quote graphic is a fixed
 * decorative element (a Lottie motion graphic) and is intentionally NOT part of
 * this content shape.
 */

/**
 * Identifier for one of the drawn (inline SVG) option icons. Stored as a small
 * enum string rather than an image URL so a content editor picks from a fixed
 * set and the artwork stays vector-crisp and recolourable.
 */
export type QuizIcon =
  | "just-me"
  | "friends"
  | "partner"
  | "family"
  | "corporation"
  | "other";

/**
 * Where selecting an option leads next. "solo" stays on the options scene (the
 * traveller count is implied), "group" opens the traveller-count sub-scene
 * within the same step (the progress bar does not advance).
 */
export type QuizOptionBranch = "solo" | "group";

export type QuizOption = {
  /** Stable id used for selection state and (later) conditional branching. */
  id: string;
  label: string;
  /** Which drawn icon to render above the label. */
  icon: QuizIcon;
  /** The follow-up path this choice routes to. */
  branch: QuizOptionBranch;
};

/**
 * The "Who Will Be Travelling?" sub-scene (Figma node 947:1426) shown when a
 * "group" option is chosen — number of adults plus an "add children" toggle.
 * It belongs to the same step as its parent question, so it shares the progress.
 */
export type QuizTravelerCountContent = {
  prompt: string;
  adultsLabel: string;
  adultsPlaceholder: string;
  addChildrenLabel: string;
  /** Shown for each children line when "add children" is on (Figma 947:1427). */
  childrenLabel: string;
  childAgePlaceholder: string;
};

/** A picture-card choice for the image-grid questions (Figma 939:1412/1413). */
export type QuizImageChoice = {
  id: string;
  label: string;
  /** Resolved image URL + alt, so the section never touches Sanity directly. */
  imageUrl: string;
  imageAlt: string;
};

/**
 * Question 1 — the travelling-party picker (icon options + the "group"
 * traveller-count sub-scene).
 */
export type QuizPartyQuestion = {
  kind: "party";
  id: string;
  prompt: string;
  options: QuizOption[];
  /** Follow-up sub-scene for "group" options. Same step, no progress advance. */
  travelerCount?: QuizTravelerCountContent;
};

/**
 * Questions 2 & 3 — a grid of picture cards the traveller chooses from. The
 * optional `columns` caps how many cards sit on a desktop row (so the grid
 * wraps into the designed rows); it reflows to fewer columns on small screens.
 */
export type QuizImageQuestion = {
  kind: "image-choice";
  id: string;
  prompt: string;
  choices: QuizImageChoice[];
  columns?: number;
};

/**
 * Question 4 — the contact lead form (Figma node 957:924). A set of
 * underline-style fields; this is the final step, so its Next control submits.
 */
export type QuizContactFormQuestion = {
  kind: "contact-form";
  id: string;
  prompt: string;
  firstNameLabel: string;
  lastNameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  countryLabel: string;
  countryOptions: string[];
  notesLabel: string;
};

export type QuizQuestionContent =
  | QuizPartyQuestion
  | QuizImageQuestion
  | QuizContactFormQuestion;

/** The shape of a completed contact form (mirrors QuizContactFormQuestion). */
export type QuizContactValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  notes: string;
};

export type QuizContent = {
  /** Intro line above the quiz panel, e.g. "Let's Plan Your Perfect Journey." */
  title: string;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
  /** Total number of steps, drives the "Question X / N" label + progress bar. */
  totalSteps: number;
  questions: QuizQuestionContent[];
};
