import Link from "next/link";

import MoreDetailButton from "@/components/ui/MoreDetailButton";
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
  cta: {
    label: "About PositivEarth",
    href: "/about",
  },
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
  const imageUrl = content.imageUrl?.trim() || DEFAULT_CONTENT.imageUrl;
  const imageAlt = content.imageAlt?.trim() || DEFAULT_CONTENT.imageAlt;
  const ctaLabel = content.cta?.label?.trim() || DEFAULT_CONTENT.cta?.label;
  const ctaHref = content.cta?.href?.trim() || DEFAULT_CONTENT.cta?.href;
  const cta =
    ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref } : undefined;

  return (
    <section
      className="grid w-full grid-cols-1 overflow-hidden bg-base-black text-base-white lg:min-h-[var(--size-brand-story-height)] lg:[grid-template-columns:782fr_730fr]"
    >
      <div
        className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:h-full lg:py-0 lg:pl-[var(--spacing-brand-story-offset-x)]"
        style={{
          gap: "var(--spacing-brand-story-copy-gap)",
        }}
      >
        <h2 className="font-display text-heading-4 text-base-white lg:max-w-[var(--size-brand-story-copy-width)]">
          {renderHeading(content)}
        </h2>

        <div
          className="flex w-full flex-col items-start lg:max-w-[var(--size-brand-story-body-width)]"
          style={{
            gap: "var(--spacing-brand-story-body-gap)",
          }}
        >
          <p className="font-body text-p1 text-base-white">
            {content.body.join(" ")}
          </p>

          {cta ? (
            <Link
              href={cta.href}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
            >
              <MoreDetailButton>{cta.label}</MoreDetailButton>
            </Link>
          ) : null}
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
