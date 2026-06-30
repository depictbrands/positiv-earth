import Link from "next/link";

import MoreDetailButton from "@/components/ui/MoreDetailButton";
import { isExternalHref } from "@/lib/isExternalHref";
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
  const imageUrl = content.imageUrl?.trim() || DEFAULT_CONTENT.imageUrl;
  const ctaLabel = content.cta?.label?.trim() || DEFAULT_CONTENT.cta?.label;
  const ctaHref = content.cta?.href?.trim() || DEFAULT_CONTENT.cta?.href;
  const cta =
    ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref } : undefined;

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative grid w-full grid-cols-1 overflow-hidden bg-base-white lg:min-h-[var(--size-brand-story-height)] lg:items-center lg:[grid-template-columns:var(--size-how-it-works-left-width)_1fr]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-how-it-works-bg-fallback)] bg-cover bg-center bg-no-repeat lg:bg-[position:var(--size-how-it-works-bg-position-x)_0] lg:bg-[length:var(--size-how-it-works-bg-size)]"
        style={{
          backgroundImage: `url("${imageUrl}")`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "var(--gradient-how-it-works-image-fade)",
        }}
      />

      <div
        className="relative z-10 flex w-full items-center justify-center overflow-hidden p-6 sm:p-10 lg:w-[var(--size-how-it-works-left-width)] lg:min-h-[var(--size-how-it-works-height)] lg:p-0"
      >
        <div
          className="relative z-10 flex w-full max-w-[var(--size-how-it-works-turntable-width)] flex-col items-end gap-12 lg:ml-[var(--spacing-how-it-works-turntable-offset-x)] lg:[gap:var(--spacing-how-it-works-turntable-gap)]"
        >
          <div className="w-full">
            <Turntable className="shrink-0" steps={content.steps} />
          </div>
        </div>
      </div>

      <div
        className="relative z-10 flex w-full flex-col items-start px-6 py-16 sm:px-10 lg:w-[var(--size-how-it-works-copy-width)] lg:px-0 lg:py-0 lg:ml-[calc(var(--spacing-how-it-works-copy-offset-x)_-_var(--size-how-it-works-left-width))]"
        style={{
          gap: "var(--spacing-how-it-works-copy-gap)",
        }}
      >
        <h2
          id="how-it-works-heading"
          className="w-full text-left font-display text-heading-4 text-base-black"
        >
          {renderHeading(content)}
        </h2>

        <div
          className="flex w-full flex-col items-start"
          style={{
            gap: "var(--spacing-how-it-works-body-gap)",
          }}
        >
          <p className="w-full text-left font-body text-p1 text-base-black">
            {content.body}
          </p>

          {cta ? (
            isExternalHref(cta.href) ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-black"
              >
                <MoreDetailButton variant="light">{cta.label}</MoreDetailButton>
              </a>
            ) : (
              <Link
                href={cta.href}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-black"
              >
                <MoreDetailButton variant="light">{cta.label}</MoreDetailButton>
              </Link>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}
