import type { CSSProperties } from "react";

import type { HeroBackgroundImage as HeroBackgroundImageContent } from "@/types/hero-background-image";

type HeroBackgroundImageProps = {
  content: HeroBackgroundImageContent;
  className?: string;
};

// Breakpoints mirror Tailwind's `md` (768px) and `lg` (1024px) so the media
// queries below and the `md:` / `lg:` utilities on the <img> switch together.
const MOBILE_MEDIA = "(max-width: 767px)";
const TABLET_MEDIA = "(max-width: 1023px)";

/**
 * Full-bleed hero background, positioned to fill its nearest positioned
 * ancestor (the hero `<section>`).
 *
 * Uses a native `<picture>` rather than `next/image` because the three sources
 * are *art direction*, not resolution switching: each breakpoint can be a
 * different crop of the same photo, so the browser has to choose by media
 * query. Sanity's CDN already handles sizing and format negotiation (`w` and
 * `auto=format` are baked into the URLs by `mapHeroImage`), so stepping around
 * the Next image optimizer costs little.
 */
export default function HeroBackgroundImage({
  content,
  className = "",
}: HeroBackgroundImageProps) {
  const {
    backgroundImageUrl,
    backgroundImageAlt,
    backgroundImageTabletUrl,
    backgroundImageMobileUrl,
    backgroundImagePosition,
    backgroundImageTabletPosition,
    backgroundImageMobilePosition,
  } = content;

  // `object-position` can't vary per <source>, so each breakpoint's focal point
  // travels as a custom property and the utilities below pick which applies.
  const focalPoints = {
    "--hero-image-position": backgroundImagePosition ?? "center",
    "--hero-image-position-tablet":
      backgroundImageTabletPosition ?? backgroundImagePosition ?? "center",
    "--hero-image-position-mobile":
      backgroundImageMobilePosition ??
      backgroundImageTabletPosition ??
      backgroundImagePosition ??
      "center",
  } as CSSProperties;

  return (
    <picture className="absolute inset-0" style={focalPoints}>
      {/* Ordered narrowest-first: the first matching source wins, so a missing
          mobile crop falls through to the tablet crop, then to the <img>. */}
      {backgroundImageMobileUrl && (
        <source media={MOBILE_MEDIA} srcSet={backgroundImageMobileUrl} />
      )}
      {backgroundImageTabletUrl && (
        <source media={TABLET_MEDIA} srcSet={backgroundImageTabletUrl} />
      )}
      {/* Plain <img>: art direction needs <picture>/<source>, which next/image
          can't express — Sanity's CDN does the sizing and format work instead. */}
      <img
        src={backgroundImageUrl}
        alt={backgroundImageAlt}
        fetchPriority="high"
        decoding="async"
        className={`h-full w-full object-cover [object-position:var(--hero-image-position-mobile)] md:[object-position:var(--hero-image-position-tablet)] lg:[object-position:var(--hero-image-position)] ${className}`.trim()}
      />
    </picture>
  );
}
