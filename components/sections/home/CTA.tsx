import Image from "next/image";

import QuizEntryButton from "@/components/ui/QuizEntryButton";
import type { CTAContent } from "@/types/cta-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 711"><defs><linearGradient id="sky" x1="0" x2="0.4" y1="0" y2="1"><stop stop-color="%23c9b88f"/><stop offset="1" stop-color="%232f3a2a"/></linearGradient><linearGradient id="ridge" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%235a6b4a"/><stop offset="1" stop-color="%231d241a"/></linearGradient></defs><rect width="1512" height="711" fill="url(%23sky)"/><path d="M0 430 L360 250 L620 410 L900 210 L1180 400 L1512 280 L1512 711 L0 711 Z" fill="url(%23ridge)"/></svg>';

const DEFAULT_CONTENT: CTAContent = {
  heading: "Ready to travel with confidence?",
  buttonLabel: "Book Free Consultation",
  imageUrl: DEFAULT_IMAGE_URL,
  imageAlt: "Mountain landscape at sunrise",
};

type CTAProps = {
  content?: CTAContent;
};

export default function CTA({ content = DEFAULT_CONTENT }: CTAProps) {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden px-6 py-24 sm:px-10 lg:min-h-[var(--size-cta-height)] lg:py-0">
      <Image
        src={content.imageUrl}
        alt={content.imageAlt}
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
        <h2 className="font-display text-heading-4 text-base-white lg:max-w-[var(--size-cta-heading-width)] lg:whitespace-nowrap">
          {content.heading}
        </h2>

        <QuizEntryButton>{content.buttonLabel}</QuizEntryButton>
      </div>
    </section>
  );
}
