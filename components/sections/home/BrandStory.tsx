"use client";

import { useState } from "react";

import type { BrandStoryContent } from "@/types/brand-story-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 854 880"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%2386b6ff"/><stop offset="0.55" stop-color="%2355718a"/><stop offset="1" stop-color="%23181818"/></linearGradient></defs><rect width="854" height="880" fill="url(%23g)"/><circle cx="640" cy="180" r="72" fill="%23ffffff" fill-opacity="0.16"/><circle cx="730" cy="110" r="26" fill="%23ffffff" fill-opacity="0.28"/><rect x="0" y="600" width="854" height="280" fill="%23000000" fill-opacity="0.18"/></svg>';

const DEFAULT_CONTENT: BrandStoryContent = {
  heading:
    "Traveling is an invitation, to grow, to connect, to belong",
  emphasizedWord: "invitation",
  body: [
    "When you travel with PositivEarth, you're not just preparing for a trip — you're stepping into a more curious, confident, and connected version of yourself.",
    "Knowing a culture before you arrive is a quiet act of respect. It opens doors, eases conversations, and lets you move through a place with presence instead of pressure.",
    "And once you arrive, the real journey begins. You'll deepen your awareness, soften your edges, and carry home a way of seeing the world that stays with you long after the suitcase is unpacked.",
  ],
  imageUrl: DEFAULT_IMAGE_URL,
  imageAlt: "Traveler smiling at a mountain destination",
};

type BrandStoryProps = {
  content?: BrandStoryContent;
};

function renderHeading(content: BrandStoryContent) {
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

export default function BrandStory({
  content = DEFAULT_CONTENT,
}: BrandStoryProps) {
  const [expanded, setExpanded] = useState(false);
  const imageUrl = content.imageUrl?.trim() || DEFAULT_CONTENT.imageUrl;
  const imageAlt = content.imageAlt?.trim() || DEFAULT_CONTENT.imageAlt;

  return (
    <section
      aria-labelledby="brand-story-heading"
      className="grid w-full grid-cols-1 overflow-hidden bg-base-black text-base-white lg:min-h-[var(--size-brand-story-height)] lg:[grid-template-columns:782fr_730fr]"
    >
      <div
        className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:h-full lg:py-0 lg:pl-[var(--spacing-brand-story-offset-x)]"
        style={{
          gap: "var(--spacing-brand-story-copy-gap)",
        }}
      >
        <h2
          id="brand-story-heading"
          className="font-display text-heading-4 text-base-white lg:max-w-[var(--size-brand-story-copy-width)]"
        >
          {renderHeading(content)}
        </h2>

        <div
          className="flex w-full flex-col items-start lg:max-w-[var(--size-brand-story-body-width)]"
          style={{
            gap: "var(--spacing-brand-story-body-gap)",
          }}
        >
          <div className="flex w-full flex-col items-start">
            <p
              className={`font-body text-p1 text-base-white ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {content.body.join(" ")}
            </p>

            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="mt-4 inline-flex items-center gap-2.5 font-body text-cta-button text-base-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
            >
              <span>{expanded ? "Less detail" : "More detail"}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className={`size-5 shrink-0 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {imageUrl ? (
        <div className="relative h-64 w-full overflow-hidden sm:h-96 lg:h-full">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="block h-full w-full object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}
