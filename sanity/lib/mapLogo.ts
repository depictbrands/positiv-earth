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
  };
}
