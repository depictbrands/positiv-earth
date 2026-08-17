import type { HeroBackgroundImage } from "./hero-background-image";

export type HeroContent = {
  headline: {
    pre: string;
    emphasis: string;
    post: string;
  };
  subcopy: string;
} & HeroBackgroundImage;
