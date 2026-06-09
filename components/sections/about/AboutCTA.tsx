import Image from "next/image";

import QuizEntryButton from "@/components/ui/QuizEntryButton";
import type { CTAContent } from "@/types/cta-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 580"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%231f7fd6"/><stop offset="1" stop-color="%23a9d2f0"/></linearGradient><linearGradient id="hill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%236f9b4a"/><stop offset="1" stop-color="%234a6f33"/></linearGradient></defs><rect width="1512" height="580" fill="url(%23sky)"/><path d="M0 470L380 300L760 360L1140 300L1512 420V580H0V470Z" fill="url(%23hill)"/></svg>';

const DEFAULT_CONTENT: CTAContent = {
  heading: "Let's Plan Your Trip",
  buttonLabel: "Book Free Consultation",
  imageUrl: DEFAULT_IMAGE_URL,
  imageAlt: "Andes mountain under a bright blue sky",
};

type AboutCTAProps = {
  content?: CTAContent;
};

function resolveCtaContent(content?: CTAContent): CTAContent {
  return {
    ...DEFAULT_CONTENT,
    ...content,
    heading: content?.heading?.trim() || DEFAULT_CONTENT.heading,
    buttonLabel: content?.buttonLabel?.trim() || DEFAULT_CONTENT.buttonLabel,
    imageUrl: content?.imageUrl?.trim() || DEFAULT_CONTENT.imageUrl,
    imageAlt: content?.imageAlt?.trim() || DEFAULT_CONTENT.imageAlt,
  };
}

// The "Let's Plan Your Trip" band (about-8). Static in document flow; the dark
// footer sits below it and never animates.
export default function AboutCTA({ content }: AboutCTAProps) {
  const resolved = resolveCtaContent(content);

  // Heading is two-tone (about-8): first word upright, remainder italic.
  const [headFirst, ...headRest] = resolved.heading.split(" ");
  const headItalic = headRest.join(" ");

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden px-6 py-24 sm:px-10 lg:min-h-[var(--size-about-cta-band-height)] lg:py-0">
      <Image
        src={resolved.imageUrl}
        alt={resolved.imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-cta-overlay)" }}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{ gap: "var(--spacing-cta-content-gap)" }}
      >
        <h2 className="font-display text-heading-2 text-base-white">
          {headFirst}
          {headItalic ? <span className="italic"> {headItalic}</span> : null}
        </h2>

        <QuizEntryButton>{resolved.buttonLabel}</QuizEntryButton>
      </div>
    </section>
  );
}
