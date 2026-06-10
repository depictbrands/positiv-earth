import type { QuizIcon } from "@/types/quiz-content";

type QuizOptionIconProps = {
  name: QuizIcon;
  className?: string;
};

// Hand-drawn line icons for the "Who Will Be Traveling" options, replacing the
// raster icons that were pulled from Figma. All are stroked with `currentColor`
// on a 64×64 grid, so they inherit the option's text colour and stay crisp at
// any size. They are decorative — the option label is the accessible name — so
// each <svg> is aria-hidden.
const ICONS: Record<QuizIcon, React.ReactNode> = {
  // One standing figure.
  "just-me": (
    <>
      <circle cx="32" cy="14" r="7" />
      <path d="M32 21v19" />
      <path d="M32 25 21 36" />
      <path d="M32 25l11 11" />
      <path d="M32 40 24 55" />
      <path d="M32 40l8 15" />
    </>
  ),
  // Two adults side by side (a pair of overlapping figures).
  friends: (
    <>
      <circle cx="22" cy="22" r="8" />
      <path d="M9 49a13 12 0 0 1 26 0" />
      <circle cx="42" cy="22" r="8" />
      <path d="M29 49a13 12 0 0 1 26 0" />
    </>
  ),
  // Two adults with a heart between them.
  partner: (
    <>
      <circle cx="19" cy="27" r="7" />
      <path d="M8 51a11 11 0 0 1 22 0" />
      <circle cx="45" cy="27" r="7" />
      <path d="M34 51a11 11 0 0 1 22 0" />
      <path
        transform="translate(23 5) scale(0.75)"
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"
      />
    </>
  ),
  // Two adults and a smaller child between them.
  family: (
    <>
      <circle cx="17" cy="23" r="7" />
      <path d="M6 49a11 11 0 0 1 22 0" />
      <circle cx="47" cy="23" r="7" />
      <path d="M36 49a11 11 0 0 1 22 0" />
      <circle cx="32" cy="33" r="5" />
      <path d="M24 53a8 8 0 0 1 16 0" />
    </>
  ),
  // A group of three (the center figure sits slightly behind).
  corporation: (
    <>
      <circle cx="32" cy="17" r="7" />
      <path d="M21 39a11 11 0 0 1 22 0" />
      <circle cx="15" cy="28" r="6.5" />
      <path d="M5 51a11 10 0 0 1 22 0" />
      <circle cx="49" cy="28" r="6.5" />
      <path d="M37 51a11 10 0 0 1 22 0" />
    </>
  ),
  // One figure plus an ellipsis (something else / unspecified).
  other: (
    <>
      <circle cx="25" cy="22" r="8" />
      <path d="M11 50a15 14 0 0 1 28 0" />
      <circle cx="48" cy="45" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="54" cy="45" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="60" cy="45" r="2.2" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function QuizOptionIcon({ name, className }: QuizOptionIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}
