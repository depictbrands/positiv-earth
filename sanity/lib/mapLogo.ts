import type { SanityImageSource } from "@sanity/image-url";

import {
  DEFAULT_LOGO_CONTENT,
  type LogoContent,
} from "@/types/logo-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityLogo = {
  headerLogo?: SanityImageWithAlt;
  favicon?: { asset?: SanityImageSource };
};

const FAVICON_MIME_TYPES: Record<string, string> = {
  png: "image/png",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  webp: "image/webp",
};

function imageUrl(source?: SanityImageSource): string | undefined {
  if (!source) {
    return undefined;
  }

  try {
    return urlFor(source).url();
  } catch {
    return undefined;
  }
}

function assetRef(source?: SanityImageSource): string | undefined {
  if (!source || typeof source !== "object" || !("_ref" in source)) {
    return undefined;
  }

  const { _ref } = source as { _ref?: unknown };
  return typeof _ref === "string" ? _ref : undefined;
}

/**
 * Sanity image refs are `image-<hash>-<width>x<height>-<extension>`, so the
 * `type` and `sizes` we hand to `<link rel="icon">` follow whatever the editor
 * actually uploaded rather than assuming a 32x32 PNG.
 */
function faviconHints(source?: SanityImageSource): Pick<
  LogoContent,
  "faviconType" | "faviconSizes"
> {
  const ref = assetRef(source);

  if (!ref) {
    return {};
  }

  const parts = ref.split("-");
  const extension = parts.at(-1);
  const dimensions = parts.at(-2);

  return {
    faviconType: extension ? FAVICON_MIME_TYPES[extension] : undefined,
    faviconSizes:
      extension === "svg"
        ? "any"
        : dimensions && /^\d+x\d+$/.test(dimensions)
          ? dimensions
          : undefined,
  };
}

export function mapLogo(data: SanityLogo | null | undefined): LogoContent {
  if (!data) {
    return DEFAULT_LOGO_CONTENT;
  }

  const headerLogoUrl = data.headerLogo?.asset
    ? imageUrl(data.headerLogo.asset)
    : undefined;

  const faviconUrl = data.favicon?.asset
    ? imageUrl(data.favicon.asset)
    : undefined;

  return {
    headerLogoUrl,
    headerLogoAlt:
      data.headerLogo?.alt?.trim() || DEFAULT_LOGO_CONTENT.headerLogoAlt,
    faviconUrl,
    ...(faviconUrl ? faviconHints(data.favicon?.asset) : {}),
  };
}
