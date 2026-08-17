import type { HeroBackgroundImage } from "@/types/hero-background-image";

/**
 * Resolves a hero's background image props against the section's built-in
 * placeholder, so every hero falls back the same way before Sanity is wired.
 *
 * The art-directed crops only survive when the CMS supplied a desktop image —
 * pairing a real mobile crop with the placeholder desktop photo would show two
 * unrelated pictures at different widths.
 */
export function resolveHeroBackgroundImage(
  content: Partial<HeroBackgroundImage> | undefined,
  fallback: HeroBackgroundImage,
): HeroBackgroundImage {
  const url = content?.backgroundImageUrl?.trim();

  return {
    backgroundImageUrl: url || fallback.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || fallback.backgroundImageAlt,
    backgroundImageTabletUrl: url
      ? content?.backgroundImageTabletUrl
      : undefined,
    backgroundImageMobileUrl: url
      ? content?.backgroundImageMobileUrl
      : undefined,
    backgroundImagePosition: url ? content?.backgroundImagePosition : undefined,
    backgroundImageTabletPosition: url
      ? content?.backgroundImageTabletPosition
      : undefined,
    backgroundImageMobilePosition: url
      ? content?.backgroundImageMobilePosition
      : undefined,
  };
}
