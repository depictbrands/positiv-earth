import type { SanityImageSource } from "@sanity/image-url";

import type {
  QuizContactFormQuestion,
  QuizContent,
  QuizIcon,
  QuizImageChoice,
  QuizImageQuestion,
  QuizOption,
  QuizOptionBranch,
  QuizPartyQuestion,
  QuizQuestionContent,
  QuizTravelerCountContent,
} from "@/types/quiz-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityQuizOption = {
  id?: string;
  label?: string;
  icon?: string;
  branch?: string;
};

type SanityTravelerCount = {
  prompt?: string;
  adultsLabel?: string;
  adultsPlaceholder?: string;
  addChildrenLabel?: string;
  childrenLabel?: string;
  childAgePlaceholder?: string;
};

type SanityImageChoice = {
  id?: string;
  label?: string;
  image?: SanityImageWithAlt;
};

// A single array member of the questions list. `_type` is the discriminant and
// every kind's fields are optional so one shape covers all three.
type SanityQuestion = {
  _type?: string;
  _key?: string;
  id?: string;
  prompt?: string;
  options?: SanityQuizOption[];
  travelerCount?: SanityTravelerCount;
  columns?: number;
  choices?: SanityImageChoice[];
  firstNameLabel?: string;
  lastNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  countryLabel?: string;
  countryOptions?: string[];
  notesLabel?: string;
};

type SanityQuizPage = {
  title?: string;
  backgroundImage?: SanityImageWithAlt;
  totalSteps?: number;
  questions?: SanityQuestion[];
  successTitle?: string;
  successMessage?: string;
};

const ICON_VALUES: readonly QuizIcon[] = [
  "just-me",
  "friends",
  "partner",
  "family",
  "corporation",
  "other",
];

function mapImage(image?: SanityImageWithAlt) {
  if (!image?.asset) {
    return undefined;
  }

  try {
    return {
      imageUrl: urlFor(image.asset).url(),
      imageAlt: image.alt?.trim() || "",
    };
  } catch {
    return undefined;
  }
}

function mapIcon(icon?: string): QuizIcon {
  return ICON_VALUES.includes(icon as QuizIcon) ? (icon as QuizIcon) : "other";
}

function mapBranch(branch?: string): QuizOptionBranch {
  return branch === "solo" ? "solo" : "group";
}

function mapOption(option: SanityQuizOption, index: number): QuizOption {
  return {
    id: option.id?.trim() || `option-${index}`,
    label: option.label ?? "",
    icon: mapIcon(option.icon),
    branch: mapBranch(option.branch),
  };
}

function mapTravelerCount(
  count: SanityTravelerCount,
): QuizTravelerCountContent {
  return {
    prompt: count.prompt ?? "",
    adultsLabel: count.adultsLabel ?? "",
    adultsPlaceholder: count.adultsPlaceholder ?? "",
    addChildrenLabel: count.addChildrenLabel ?? "",
    childrenLabel: count.childrenLabel ?? "",
    childAgePlaceholder: count.childAgePlaceholder ?? "",
  };
}

function mapImageChoice(
  choice: SanityImageChoice,
  index: number,
): QuizImageChoice {
  const image = mapImage(choice.image);

  return {
    id: choice.id?.trim() || `choice-${index}`,
    label: choice.label ?? "",
    imageUrl: image?.imageUrl ?? "",
    imageAlt: image?.imageAlt ?? "",
  };
}

function mapPartyQuestion(
  question: SanityQuestion,
  index: number,
): QuizPartyQuestion {
  return {
    kind: "party",
    id: question.id?.trim() || `question-${index}`,
    prompt: question.prompt ?? "",
    options: (question.options ?? []).map(mapOption),
    travelerCount: question.travelerCount
      ? mapTravelerCount(question.travelerCount)
      : undefined,
  };
}

function mapImageQuestion(
  question: SanityQuestion,
  index: number,
): QuizImageQuestion {
  return {
    kind: "image-choice",
    id: question.id?.trim() || `question-${index}`,
    prompt: question.prompt ?? "",
    choices: (question.choices ?? []).map(mapImageChoice),
    columns: question.columns,
  };
}

function mapContactFormQuestion(
  question: SanityQuestion,
  index: number,
): QuizContactFormQuestion {
  return {
    kind: "contact-form",
    id: question.id?.trim() || `question-${index}`,
    prompt: question.prompt ?? "",
    firstNameLabel: question.firstNameLabel ?? "",
    lastNameLabel: question.lastNameLabel ?? "",
    phoneLabel: question.phoneLabel ?? "",
    emailLabel: question.emailLabel ?? "",
    countryLabel: question.countryLabel ?? "",
    countryOptions: question.countryOptions ?? [],
    notesLabel: question.notesLabel ?? "",
  };
}

// Map one array member to its typed question shape based on the Sanity `_type`.
// Unknown types are dropped so a malformed entry can't break the quiz.
function mapQuestion(
  question: SanityQuestion,
  index: number,
): QuizQuestionContent | null {
  switch (question._type) {
    case "quizPartyQuestion":
      return mapPartyQuestion(question, index);
    case "quizImageQuestion":
      return mapImageQuestion(question, index);
    case "quizContactFormQuestion":
      return mapContactFormQuestion(question, index);
    default:
      return null;
  }
}

// Maps the Sanity Design-Your-Travel document into typed, serializable quiz
// content. Returns null when there is no document or no questions, so the page
// can fall back to its bundled default content.
export function mapQuizPage(data: SanityQuizPage | null): QuizContent | null {
  if (!data) {
    return null;
  }

  const questions = (data.questions ?? [])
    .map(mapQuestion)
    .filter((question): question is QuizQuestionContent => question !== null);

  if (questions.length === 0) {
    return null;
  }

  const background = mapImage(data.backgroundImage);

  return {
    title: data.title ?? "",
    backgroundImageUrl: background?.imageUrl ?? "",
    backgroundImageAlt: background?.imageAlt ?? "",
    totalSteps: data.totalSteps ?? questions.length,
    questions,
    successTitle: data.successTitle ?? "",
    successMessage: data.successMessage ?? "",
  };
}
