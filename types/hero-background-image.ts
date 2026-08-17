/**
 * Resolved, serializable hero background image.
 *
 * `backgroundImageUrl` is the desktop source and the only required part. The
 * tablet / mobile URLs are present only when an editor supplied an art-directed
 * crop for that breakpoint; when they're absent the browser falls back through
 * the `<picture>` sources to the desktop image.
 *
 * The `*Position` values are CSS `object-position` strings (e.g. `"72% 38%"`)
 * derived from each crop's Sanity hotspot, so the subject survives the residual
 * `object-cover` crop at any viewport size.
 *
 * Hero content types spread this in, keeping the flat `imageUrl` / `imageAlt`
 * shape the rest of the section props use.
 */
export type HeroBackgroundImage = {
  backgroundImageUrl: string;
  backgroundImageAlt: string;
  backgroundImageTabletUrl?: string;
  backgroundImageMobileUrl?: string;
  backgroundImagePosition?: string;
  backgroundImageTabletPosition?: string;
  backgroundImageMobilePosition?: string;
};
