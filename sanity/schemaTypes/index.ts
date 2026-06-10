import { type SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./documents/aboutPage";
import { contactPage } from "./documents/contactPage";
import { designYourTravelPage } from "./documents/designYourTravelPage";
import { faqPage } from "./documents/faqPage";
import { homePage } from "./documents/homePage";
import { servicesPage } from "./documents/servicesPage";
import { aboutIntroStat } from "./objects/aboutIntroStat";
import { contactSocial } from "./objects/contactSocial";
import { ctaLink } from "./objects/ctaLink";
import { destination } from "./objects/destination";
import { faqItem } from "./objects/faqItem";
import { imageWithAlt } from "./objects/imageWithAlt";
import { quizImageChoice } from "./objects/quizImageChoice";
import { quizOption } from "./objects/quizOption";
import { quizTravelerCount } from "./objects/quizTravelerCount";
import { service } from "./objects/service";
import { testimonial } from "./objects/testimonial";
import { aboutHeroSection } from "./sections/aboutHeroSection";
import { aboutIntroSection } from "./sections/aboutIntroSection";
import { aboutSceneSection } from "./sections/aboutSceneSection";
import { brandStorySection } from "./sections/brandStorySection";
import { contactHeroSection } from "./sections/contactHeroSection";
import { contactInfoSection } from "./sections/contactInfoSection";
import { ctaSection } from "./sections/ctaSection";
import { destinationsSection } from "./sections/destinationsSection";
import { faqHeroSection } from "./sections/faqHeroSection";
import { faqSection } from "./sections/faqSection";
import { heroSection } from "./sections/heroSection";
import { howItWorksSection } from "./sections/howItWorksSection";
import { quizContactFormQuestion } from "./sections/quizContactFormQuestion";
import { quizImageQuestion } from "./sections/quizImageQuestion";
import { quizPartyQuestion } from "./sections/quizPartyQuestion";
import { servicesHeroSection } from "./sections/servicesHeroSection";
import { testimonialSection } from "./sections/testimonialSection";
import { threeServicesSection } from "./sections/threeServicesSection";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    imageWithAlt,
    ctaLink,
    destination,
    testimonial,
    service,
    faqItem,
    contactSocial,
    aboutIntroStat,
    quizOption,
    quizTravelerCount,
    quizImageChoice,
    heroSection,
    brandStorySection,
    howItWorksSection,
    destinationsSection,
    testimonialSection,
    ctaSection,
    servicesHeroSection,
    threeServicesSection,
    faqHeroSection,
    faqSection,
    contactHeroSection,
    contactInfoSection,
    aboutHeroSection,
    aboutIntroSection,
    aboutSceneSection,
    quizPartyQuestion,
    quizImageQuestion,
    quizContactFormQuestion,
    homePage,
    servicesPage,
    faqPage,
    contactPage,
    aboutPage,
    designYourTravelPage,
  ],
};
