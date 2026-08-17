import type { SanityImageSource } from "@sanity/image-url";

import type { ContactHeroContent } from "@/types/contact-hero-content";
import type {
  ContactInfoContent,
  ContactSocialLink,
  ContactSocialPlatform,
} from "@/types/contact-info-content";

import { urlFor } from "./image";
import { mapHeroImage, type SanityHeroImage } from "./mapHeroImage";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityContactPage = {
  hero?: {
    headline?: string;
    backgroundImage?: SanityHeroImage;
  };
  info?: {
    name?: string;
    email?: string;
    phone?: string;
    socials?: Array<{
      platform?: ContactSocialPlatform;
      url?: string;
    }>;
    photos?: SanityImageWithAlt[];
  };
};

function mapImage(image?: SanityImageWithAlt) {
  if (!image?.asset) {
    return undefined;
  }

  try {
    return {
      imageUrl: urlFor(image.asset).url(),
      imageAlt: image.alt?.trim() || "",
    };
  } catch {
    return undefined;
  }
}

function mapHero(
  hero: NonNullable<SanityContactPage["hero"]>,
): ContactHeroContent {
  return {
    headline: hero.headline ?? "",
    ...mapHeroImage(hero.backgroundImage),
  };
}

function mapSocial(
  social: NonNullable<
    NonNullable<SanityContactPage["info"]>["socials"]
  >[number],
): ContactSocialLink {
  return {
    platform: social.platform ?? "Instagram",
    url: social.url ?? "",
  };
}

function mapInfo(
  section: NonNullable<SanityContactPage["info"]>,
): ContactInfoContent {
  return {
    name: section.name ?? "",
    email: section.email ?? "",
    phone: section.phone ?? "",
    socials: (section.socials ?? []).map(mapSocial),
    photos: (section.photos ?? [])
      .map(mapImage)
      .filter(
        (photo): photo is NonNullable<ReturnType<typeof mapImage>> =>
          photo !== undefined,
      )
      .map((photo) => ({
        imageUrl: photo.imageUrl,
        imageAlt: photo.imageAlt,
      })),
  };
}

export type ContactPageContent = {
  hero: ContactHeroContent;
  info: ContactInfoContent;
};

export function mapContactPage(
  data: SanityContactPage | null,
): ContactPageContent | null {
  if (!data?.hero || !data.info) {
    return null;
  }

  return {
    hero: mapHero(data.hero),
    info: mapInfo(data.info),
  };
}
