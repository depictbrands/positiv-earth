import { type SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./documents/aboutPage";
import { contactPage } from "./documents/contactPage";
import { contactSubmission } from "./documents/contactSubmission";
import { designYourTravelPage } from "./documents/designYourTravelPage";
import { destinations } from "./documents/destinations";
import { faqPage } from "./documents/faqPage";
import { homePage } from "./documents/homePage";
import { logo } from "./documents/logo";
import { itinerary } from "./documents/itinerary";
import { quizSubmission } from "./documents/quizSubmission";
import { searchRequest } from "./documents/searchRequest";
import { servicesPage } from "./documents/servicesPage";
import { aboutIntroStat } from "./objects/aboutIntroStat";
import { contactSocial } from "./objects/contactSocial";
import { ctaLink } from "./objects/ctaLink";
import { faqItem } from "./objects/faqItem";
import { heroImage } from "./objects/heroImage";
import { imageWithAlt } from "./objects/imageWithAlt";
import { itineraryAccommodationCity } from "./objects/itineraryAccommodationCity";
import { itineraryDay } from "./objects/itineraryDay";
import { itineraryDayDetail } from "./objects/itineraryDayDetail";
import { itineraryDayPeriod } from "./objects/itineraryDayPeriod";
import { itineraryHotel } from "./objects/itineraryHotel";
import { itineraryOverviewAccordionItem } from "./objects/itineraryOverviewAccordionItem";
import { itineraryProcessStep } from "./objects/itineraryProcessStep";
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
import { itineraryAccommodationSection } from "./sections/itineraryAccommodationSection";
import { itineraryHeroSection } from "./sections/itineraryHeroSection";
import { itineraryLocalFoodSection } from "./sections/itineraryLocalFoodSection";
import { itineraryNextItinerariesSection } from "./sections/itineraryNextItinerariesSection";
import { itineraryOverviewSection } from "./sections/itineraryOverviewSection";
import { itineraryTimelineSection } from "./sections/itineraryTimelineSection";
import { itineraryWhatsIncludedSection } from "./sections/itineraryWhatsIncludedSection";
import { quizContactFormQuestion } from "./sections/quizContactFormQuestion";
import { quizImageQuestion } from "./sections/quizImageQuestion";
import { quizPartyQuestion } from "./sections/quizPartyQuestion";
import { servicesHeroSection } from "./sections/servicesHeroSection";
import { testimonialSection } from "./sections/testimonialSection";
import { threeServicesSection } from "./sections/threeServicesSection";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    imageWithAlt,
    heroImage,
    ctaLink,
    testimonial,
    service,
    faqItem,
    contactSocial,
    aboutIntroStat,
    quizOption,
    quizTravelerCount,
    quizImageChoice,
    itineraryOverviewAccordionItem,
    itineraryProcessStep,
    itineraryDayPeriod,
    itineraryDayDetail,
    itineraryDay,
    itineraryHotel,
    itineraryAccommodationCity,
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
    itineraryHeroSection,
    itineraryOverviewSection,
    itineraryTimelineSection,
    itineraryLocalFoodSection,
    itineraryAccommodationSection,
    itineraryWhatsIncludedSection,
    itineraryNextItinerariesSection,
    quizPartyQuestion,
    quizImageQuestion,
    quizContactFormQuestion,
    homePage,
    logo,
    servicesPage,
    faqPage,
    contactPage,
    aboutPage,
    designYourTravelPage,
    destinations,
    itinerary,
    quizSubmission,
    searchRequest,
    contactSubmission,
  ],
};
