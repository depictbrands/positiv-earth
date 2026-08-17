import { defineField, defineType } from "sanity";

export const itineraryHeroSection = defineType({
  name: "itineraryHeroSection",
  title: "Itinerary hero",
  type: "object",
  fields: [
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description: 'Eyebrow above the title, e.g. "Peru"',
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'Trip title, e.g. "Cusco, Machu Picchu"',
    }),
    defineField({
      name: "durationDays",
      title: "Duration (days)",
      type: "number",
    }),
    defineField({
      name: "nights",
      title: "Nights",
      type: "number",
    }),
    defineField({
      name: "travelers",
      title: "Travelers",
      type: "number",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "heroImage",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "country", media: "backgroundImage.asset" },
  },
});
