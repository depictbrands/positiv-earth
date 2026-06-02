import { type SchemaTypeDefinition } from "sanity";

import { homePage } from "./documents/homePage";
import { ctaLink } from "./objects/ctaLink";
import { destination } from "./objects/destination";
import { imageWithAlt } from "./objects/imageWithAlt";
import { testimonial } from "./objects/testimonial";
import { brandStorySection } from "./sections/brandStorySection";
import { ctaSection } from "./sections/ctaSection";
import { destinationsSection } from "./sections/destinationsSection";
import { heroSection } from "./sections/heroSection";
import { howItWorksSection } from "./sections/howItWorksSection";
import { testimonialSection } from "./sections/testimonialSection";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    imageWithAlt,
    ctaLink,
    destination,
    testimonial,
    heroSection,
    brandStorySection,
    howItWorksSection,
    destinationsSection,
    testimonialSection,
    ctaSection,
    homePage,
  ],
};
