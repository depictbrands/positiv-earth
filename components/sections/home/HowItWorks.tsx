import Link from "next/link";

import MoreDetailButton from "@/components/ui/MoreDetailButton";
import Turntable from "@/components/ui/Turntable";
import type {
  HowItWorksContent,
  HowItWorksSteps,
} from "@/types/how-it-works-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 936 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%234aa6e8"/><stop offset="1" stop-color="%23f6fbff"/></linearGradient></defs><rect width="936" height="982" fill="url(%23sky)"/><rect x="0" y="560" width="936" height="422" fill="%23ffffff" fill-opacity="0.35"/><path d="M470 160 L860 360 L470 460 Z" fill="%23d9e1eb" fill-opacity="0.92"/><path d="M540 240 L892 392 L540 448 Z" fill="%23b7c3d2" fill-opacity="0.95"/></svg>';

const DEFAULT_STEPS: HowItWorksSteps = [
  "Curated Travel Experience",
  "Pre-Trip Sessions",
  "Cultural Briefing",
  "Real-World Preparation",
  "On-Trip Resources",
];

const DEFAULT_CONTENT: HowItWorksContent = {
  heading: "Curating your journey",
  emphasizedWord: "Curating",
  steps: DEFAULT_STEPS,
  body:
    "Travel planning and booking for a done-for-you experience focus on connection and cultural immersion.",
  cta: {
    label: "Start Your Travel Planning",
    href: "#",
  },
  imageUrl: DEFAULT_IMAGE_URL,
  imageAlt: "Airplane wing above clouds",
};

type HowItWorksProps = {
  content?: HowItWorksContent;
};

function renderHeading(content: HowItWorksContent) {
  const { heading, emphasizedWord } = content;

  if (!emphasizedWord || !heading.includes(emphasizedWord)) {
    return heading;
  }

  const [before, after] = heading.split(emphasizedWord);

  return (
    <>
      {before}
      <em className="font-display font-normal italic">{emphasizedWord}</em>
      {after}
    </>
  );
}

export default function HowItWorks({
  content = DEFAULT_CONTENT,
}: HowItWorksProps) {
  const imageUrl = content.imageUrl ?? DEFAULT_CONTENT.imageUrl;
  const imageAlt = content.imageAlt ?? DEFAULT_CONTENT.imageAlt;

  return (
    <section
      className="grid w-full grid-cols-1 overflow-hidden bg-base-white lg:min-h-[var(--size-how-it-works-height)] lg:[grid-template-columns:var(--size-how-it-works-left-width)_1fr]"
    >
      <div
        className="relative flex w-full items-center justify-center overflow-hidden p-6 sm:p-10 lg:w-[var(--size-how-it-works-left-width)] lg:min-h-[var(--size-how-it-works-height)] lg:p-0"
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: "var(--color-how-it-works-overlay)" }}
        />

        <div
          className="relative z-10 flex w-full max-w-[var(--size-how-it-works-turntable-width)] flex-col items-end gap-12 lg:[gap:var(--spacing-how-it-works-turntable-gap)]"
        >
          <h2 className="w-full font-display text-heading-4 text-base-white lg:whitespace-nowrap">
            {renderHeading(content)}
          </h2>

          <div className="w-full">
            <Turntable className="shrink-0" steps={content.steps} />
          </div>
        </div>
      </div>

      <div
        className="flex w-full flex-col items-start px-6 py-16 sm:px-10 lg:w-[var(--size-how-it-works-copy-width)] lg:px-0 lg:py-0 lg:ml-[calc(var(--spacing-how-it-works-copy-offset-x)_-_var(--size-how-it-works-left-width))] lg:mt-[var(--spacing-how-it-works-copy-offset-top)]"
        style={{
          gap: "var(--spacing-how-it-works-copy-gap)",
        }}
      >
        <p className="font-body text-p2 text-base-black">{content.body}</p>

        {content.cta ? (
          <Link
            href={content.cta.href}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-black"
            style={{ filter: "invert(1)" }}
          >
            <MoreDetailButton>{content.cta.label}</MoreDetailButton>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
