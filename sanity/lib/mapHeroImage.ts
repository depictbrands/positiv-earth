import type { SanityImageSource } from "@sanity/image-url";

import type { HeroBackgroundImage } from "@/types/hero-background-image";

import { urlFor } from "./image";

/** Raw value of a single `image` field, including its hotspot and crop. */
type SanityImageValue = {
  asset?: { _ref?: string };
  hotspot?: { x?: number; y?: number };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
};

/** Raw value of the `heroImage` object type. */
export type SanityHeroImage = {
  asset?: SanityImageValue;
  alt?: string;
  tablet?: SanityImageValue;
  mobile?: SanityImageValue;
};

// Delivery widths per breakpoint. Only one source is ever downloaded, so these
// are sized for a retina-ish render of that breakpoint rather than kept small.
const DESKTOP_WIDTH = 2400;
const TABLET_WIDTH = 1600;
const MOBILE_WIDTH = 1200;

// Sanity's URL builder applies the field's crop rectangle as long as we don't
// ask for both a width and a height — so requesting width alone keeps whatever
// aspect ratio the editor cropped to, and the hotspot is left to CSS below.
function toUrl(image: SanityImageValue | undefined, width: number) {
  if (!image?.asset?._ref) {
    return undefined;
  }

  try {
    return urlFor(image as SanityImageSource)
      .width(width)
      .auto("format")
      .quality(80)
      .url();
  } catch {
    return undefined;
  }
}

function toPercent(value: number) {
  return Math.round(Math.min(Math.max(value, 0), 1) * 1000) / 10;
}

// Turns the hotspot into a CSS `object-position`. The delivered image is the
// crop rectangle, but the hotspot is stored in coordinates of the *original*
// asset, so remap it into the crop's space first.
function toObjectPosition(image: SanityImageValue | undefined) {
  const { x, y } = image?.hotspot ?? {};

  if (typeof x !== "number" || typeof y !== "number") {
    return undefined;
  }

  const crop = image?.crop;
  const left = crop?.left ?? 0;
  const top = crop?.top ?? 0;
  const width = 1 - left - (crop?.right ?? 0);
  const height = 1 - top - (crop?.bottom ?? 0);

  const cropX = width > 0 ? (x - left) / width : x;
  const cropY = height > 0 ? (y - top) / height : y;

  return `${toPercent(cropX)}% ${toPercent(cropY)}%`;
}

/**
 * Maps a `heroImage` value onto the flat, serializable fields a hero section
 * takes as props. Every breakpoint is optional; the positions cascade the same
 * way the `<picture>` sources do (mobile → tablet → desktop) so the focal point
 * always belongs to the image that is actually being shown.
 */
export function mapHeroImage(image?: SanityHeroImage): HeroBackgroundImage {
  const tabletUrl = toUrl(image?.tablet, TABLET_WIDTH);
  const mobileUrl = toUrl(image?.mobile, MOBILE_WIDTH);

  const desktopPosition = toObjectPosition(image?.asset);
  const tabletPosition = tabletUrl
    ? toObjectPosition(image?.tablet)
    : desktopPosition;
  const mobilePosition = mobileUrl
    ? toObjectPosition(image?.mobile)
    : tabletPosition;

  return {
    backgroundImageUrl: toUrl(image?.asset, DESKTOP_WIDTH) ?? "",
    backgroundImageAlt: image?.alt?.trim() ?? "",
    backgroundImageTabletUrl: tabletUrl,
    backgroundImageMobileUrl: mobileUrl,
    backgroundImagePosition: desktopPosition,
    backgroundImageTabletPosition: tabletPosition,
    backgroundImageMobilePosition: mobilePosition,
  };
}
