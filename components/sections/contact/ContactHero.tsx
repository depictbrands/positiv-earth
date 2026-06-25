"use client";

import Image from "next/image";

import TextReveal from "@/components/ui/TextReveal";
import type { ContactHeroContent } from "@/types/contact-hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23bcdcef"/><stop offset="0.5" stop-color="%23c7a87a"/><stop offset="1" stop-color="%235f4a30"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><rect y="430" width="1512" height="360" fill="%23a07c4d"/><rect y="430" width="1512" height="40" fill="%238a6a3f"/><rect y="540" width="1512" height="36" fill="%238a6a3f"/><rect y="650" width="1512" height="36" fill="%238a6a3f"/><rect y="790" width="1512" height="192" fill="%235a7a3a"/></svg>';

const DEFAULT_CONTENT: ContactHeroContent = {
  headline: "Contact Us",
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Historic stone citadel above a green valley",
};

type ContactHeroProps = {
  content?: ContactHeroContent;
};

function resolveContactHeroContent(
  content?: ContactHeroContent,
): ContactHeroContent {
  return {
    headline: content?.headline?.trim() || DEFAULT_CONTENT.headline,
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || DEFAULT_CONTENT.backgroundImageAlt,
  };
}

export default function ContactHero({ content }: ContactHeroProps) {
  const resolved = resolveContactHeroContent(content);

  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative flex w-full flex-col overflow-hidden min-h-[100svh] lg:min-h-[var(--size-hero-height)]"
    >
      <Image
        src={resolved.backgroundImageUrl}
        alt={resolved.backgroundImageAlt}
        fill
        className="object-cover"
        priority
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-hero-overlay)" }}
      />

      {/* Centered hero title — sr-only h1 carries the readable title; the
          TextReveal line is visual/decorative only. */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 py-12 text-center text-base-white">
        <h1 id="contact-hero-heading" className="sr-only">
          {resolved.headline}
        </h1>
        <div aria-hidden="true">
          <TextReveal className="font-display text-heading-2 text-base-white">
            {resolved.headline}
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
