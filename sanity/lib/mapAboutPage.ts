import type { SanityImageSource } from "@sanity/image-url";

import type { AboutHeroContent } from "@/types/about-hero-content";
import type { AboutIntroContent } from "@/types/about-intro-content";
import type { AboutSceneContent } from "@/types/about-scene-content";
import type { CTAContent } from "@/types/cta-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityScene = {
  headline?: string;
  body?: string;
  images?: SanityImageWithAlt[];
};

type SanityAboutPage = {
  hero?: {
    lead?: string;
    name?: string;
    role?: string;
    backgroundImage?: SanityImageWithAlt;
  };
  intro?: {
    stats?: Array<{ emphasis?: string; rest?: string }>;
    portrait?: SanityImageWithAlt;
  };
  sceneA?: SanityScene;
  sceneB?: SanityScene;
  sceneC?: SanityScene;
  cta?: {
    heading?: string;
    buttonLabel?: string;
    image?: SanityImageWithAlt;
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

function mapHero(hero: NonNullable<SanityAboutPage["hero"]>): AboutHeroContent {
  const background = mapImage(hero.backgroundImage);

  return {
    lead: hero.lead ?? "",
    name: hero.name ?? "",
    role: hero.role ?? "",
    backgroundImageUrl: background?.imageUrl ?? "",
    backgroundImageAlt: background?.imageAlt ?? "",
  };
}

function mapIntro(
  intro: NonNullable<SanityAboutPage["intro"]>,
): AboutIntroContent {
  const portrait = mapImage(intro.portrait);
  const stat = (i: number) => ({
    emphasis: intro.stats?.[i]?.emphasis ?? "",
    rest: intro.stats?.[i]?.rest ?? "",
  });

  return {
    // The section component resolves any blank field to its default.
    stats: [stat(0), stat(1), stat(2)],
    portraitImageUrl: portrait?.imageUrl ?? "",
    portraitImageAlt: portrait?.imageAlt ?? "",
  };
}

function mapScene(scene: SanityScene): AboutSceneContent {
  const image = (i: number) => mapImage(scene.images?.[i]);

  return {
    headline: scene.headline ?? "",
    body: scene.body ?? "",
    images: [
      {
        imageUrl: image(0)?.imageUrl ?? "",
        imageAlt: image(0)?.imageAlt ?? "",
      },
      {
        imageUrl: image(1)?.imageUrl ?? "",
        imageAlt: image(1)?.imageAlt ?? "",
      },
    ],
  };
}

function mapCtaSection(cta: NonNullable<SanityAboutPage["cta"]>): CTAContent {
  const image = mapImage(cta.image);

  return {
    heading: cta.heading ?? "",
    buttonLabel: cta.buttonLabel ?? "",
    imageUrl: image?.imageUrl ?? "",
    imageAlt: image?.imageAlt ?? "",
  };
}

export type AboutPageContent = {
  hero?: AboutHeroContent;
  intro?: AboutIntroContent;
  sceneA?: AboutSceneContent;
  sceneB?: AboutSceneContent;
  sceneC?: AboutSceneContent;
  cta?: CTAContent;
};

// Maps the Sanity About document into typed, serializable section content.
// Every field is optional — absent sections/fields stay undefined so the
// presentational components fall back to their built-in defaults.
export function mapAboutPage(
  data: SanityAboutPage | null,
): AboutPageContent | null {
  if (!data) {
    return null;
  }

  return {
    hero: data.hero ? mapHero(data.hero) : undefined,
    intro: data.intro ? mapIntro(data.intro) : undefined,
    sceneA: data.sceneA ? mapScene(data.sceneA) : undefined,
    sceneB: data.sceneB ? mapScene(data.sceneB) : undefined,
    sceneC: data.sceneC ? mapScene(data.sceneC) : undefined,
    cta: data.cta ? mapCtaSection(data.cta) : undefined,
  };
}
