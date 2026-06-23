import DesignYourTravelQuiz from "@/components/sections/quiz/DesignYourTravelQuiz";
import { client } from "@/sanity/lib/client";
import { mapQuizPage } from "@/sanity/lib/mapQuizPage";
import { QUIZ_PAGE_QUERY } from "@/sanity/lib/queries";
import type { QuizContent } from "@/types/quiz-content";

// Coloured placeholder background until real (CMS) photography is wired in —
// matches the gradient-placeholder convention used by the site heroes.
const DEFAULT_BACKGROUND =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23b9c2c4"/><stop offset="0.5" stop-color="%238a7f63"/><stop offset="1" stop-color="%235a4a30"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><path d="M0 240C200 180 360 230 560 180C760 130 940 190 1160 140C1320 105 1430 120 1512 100V982H0V240Z" fill="%23837a55"/><path d="M0 520C220 470 380 520 600 470C820 420 1020 470 1512 380V982H0V520Z" fill="%235d6240"/></svg>';

// Distinct gradient placeholder per picture card until real (CMS) photography is
// wired in — matches the gradient-placeholder convention used by the heroes.
const cardImage = (from: string, to: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182 182"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23${from}"/><stop offset="1" stop-color="%23${to}"/></linearGradient></defs><rect width="182" height="182" fill="url(%23g)"/></svg>`;

// First quiz step (Figma node 939:1414). Editorial content is mock for now but
// shaped to map onto Sanity later; data fetching will move to this server
// component, leaving the quiz section presentational.
const QUIZ_CONTENT: QuizContent = {
  title: "Let's Plan Your Perfect Journey.",
  backgroundImageUrl: DEFAULT_BACKGROUND,
  backgroundImageAlt:
    "A traveller and a llama in traditional Andean dress in a highland valley",
  totalSteps: 4,
  questions: [
    {
      kind: "party",
      id: "who-is-traveling",
      prompt: "Who Will Be Traveling",
      options: [
        { id: "just-me", label: "Just me", icon: "just-me", branch: "solo" },
        {
          id: "with-friends",
          label: "With friends",
          icon: "friends",
          branch: "group",
        },
        {
          id: "with-partner",
          label: "With my partner",
          icon: "partner",
          branch: "group",
        },
        {
          id: "with-family",
          label: "With my family",
          icon: "family",
          branch: "group",
        },
        {
          id: "corporation",
          label: "Corporation",
          icon: "corporation",
          branch: "group",
        },
        { id: "other", label: "Other", icon: "other", branch: "group" },
      ],
      // Follow-up sub-scene for "group" choices (Figma node 947:1426). Same step,
      // so the progress bar stays on "Question 1 / 4".
      travelerCount: {
        prompt: "Who Will Be Travelling?",
        adultsLabel: "Adults",
        adultsPlaceholder: "Number of adults",
        addChildrenLabel: "Add children",
        childrenLabel: "Children / Infants",
        childAgePlaceholder: "Age",
      },
    },
    // Question 2 — traveller archetype (Figma node 939:1412). 8 cards, 2 rows of 4.
    {
      kind: "image-choice",
      id: "traveler-type",
      prompt: "Which Traveler Resonates With You Most?",
      columns: 4,
      choices: [
        { id: "romantic", label: "The Romantic", imageUrl: cardImage("c98a86", "7a4a52"), imageAlt: "" },
        { id: "explorer", label: "The Explorer", imageUrl: cardImage("8fa68a", "4d6047"), imageAlt: "" },
        { id: "connoisseur", label: "The Connoisseur", imageUrl: cardImage("d8b24a", "8a5a22"), imageAlt: "" },
        { id: "seeker", label: "The Seeker", imageUrl: cardImage("c4615a", "6e2f2c"), imageAlt: "" },
        { id: "storyteller", label: "The Storyteller", imageUrl: cardImage("c79a4a", "6e4a1f"), imageAlt: "" },
        { id: "aesthete", label: "The Aesthete", imageUrl: cardImage("9aa0a6", "4a4f55"), imageAlt: "" },
        { id: "adventurer", label: "The Adventurer", imageUrl: cardImage("8fb6cf", "3f6076"), imageAlt: "" },
        { id: "bon-vivant", label: "The Bon Vivant", imageUrl: cardImage("7ab0a0", "3f6e62"), imageAlt: "" },
      ],
    },
    // Question 3 — landscapes (Figma node 939:1413). 9 cards, rows of 5 then 4.
    {
      kind: "image-choice",
      id: "landscapes",
      prompt: "Which Landscapes Pull At You?",
      columns: 5,
      choices: [
        { id: "coastlines", label: "Sun-drenched coastlines", imageUrl: cardImage("8fd0d8", "3f8a92"), imageAlt: "" },
        { id: "ancient-cities", label: "Ancient cities & ruins", imageUrl: cardImage("cdb98a", "8a6e3f"), imageAlt: "" },
        { id: "peaks", label: "Snow-capped peaks", imageUrl: cardImage("bcccd6", "5a6e7a"), imageAlt: "" },
        { id: "savannahs", label: "Savannahs & wildlife", imageUrl: cardImage("d8a24a", "8a521f"), imageAlt: "" },
        { id: "islands", label: "Tropical islands", imageUrl: cardImage("7ad0b0", "3f8a6e"), imageAlt: "" },
        { id: "deserts", label: "Deserts & dunes", imageUrl: cardImage("d89a5a", "9a5a2f"), imageAlt: "" },
        { id: "polar", label: "Polar wilderness", imageUrl: cardImage("c2d6e6", "7a96aa"), imageAlt: "" },
        { id: "vineyards", label: "Vineyards & rolling hills", imageUrl: cardImage("aec24a", "6e7a22"), imageAlt: "" },
        { id: "jungles", label: "Jungles & rainforests", imageUrl: cardImage("5aa05a", "2f6e2f"), imageAlt: "" },
      ],
    },
    // Question 4 — contact lead form (Figma node 957:924). Final step: progress
    // fills to 100% and the forward control reads "Submit".
    {
      kind: "contact-form",
      id: "contact",
      prompt: "Your Contact Information",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      phoneLabel: "Phone",
      emailLabel: "Email",
      countryLabel: "Country",
      countryOptions: [
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Mexico",
        "Peru",
        "Other",
      ],
      notesLabel: "Additional Notes",
    },
  ],
  successTitle: "Thank You.",
  successMessage:
    "Your journey is in good hands. One of our travel advisors will be in touch shortly to start shaping your perfect trip.",
};

// Server component data layer: fetch the quiz from Sanity, map it to the typed
// QuizContent, and fall back to the bundled default per-field so a missing
// document (or a partially-filled one) still renders cleanly.
export default async function DesignYourTravelPage() {
  const sanityQuiz = client ? await client.fetch(QUIZ_PAGE_QUERY) : null;
  const mapped = mapQuizPage(sanityQuiz);

  const content: QuizContent = mapped
    ? {
        title: mapped.title || QUIZ_CONTENT.title,
        backgroundImageUrl:
          mapped.backgroundImageUrl || QUIZ_CONTENT.backgroundImageUrl,
        backgroundImageAlt:
          mapped.backgroundImageAlt || QUIZ_CONTENT.backgroundImageAlt,
        totalSteps: mapped.totalSteps || QUIZ_CONTENT.totalSteps,
        questions: mapped.questions.length
          ? mapped.questions
          : QUIZ_CONTENT.questions,
        successTitle: mapped.successTitle || QUIZ_CONTENT.successTitle,
        successMessage: mapped.successMessage || QUIZ_CONTENT.successMessage,
      }
    : QUIZ_CONTENT;

  return (
    <main className="quiz-scale w-full">
      <DesignYourTravelQuiz content={content} />
    </main>
  );
}
