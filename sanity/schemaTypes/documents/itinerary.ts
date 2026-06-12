import { defineField, defineType } from "sanity";

export const itinerary = defineType({
  name: "itinerary",
  title: "Itinerary",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Used in Studio and SEO; not shown on the page hero.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accentColor",
      title: "Accent color",
      type: "string",
      description: 'Hex accent for timeline rails and highlights, e.g. "#cf3030".',
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "itineraryHeroSection",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "itineraryOverviewSection",
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "itineraryTimelineSection",
    }),
    defineField({
      name: "localFood",
      title: "Local food",
      type: "itineraryLocalFoodSection",
    }),
    defineField({
      name: "accommodation",
      title: "Accommodation",
      type: "itineraryAccommodationSection",
    }),
    defineField({
      name: "whatsIncluded",
      title: "What's included",
      type: "itineraryWhatsIncludedSection",
    }),
    defineField({
      name: "nextItineraries",
      title: "Next itineraries",
      type: "itineraryNextItinerariesSection",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `/itinerary/${subtitle}` : undefined,
      };
    },
  },
});
