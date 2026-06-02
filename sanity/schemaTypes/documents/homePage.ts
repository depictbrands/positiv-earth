import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Home page",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "heroSection",
    }),
    defineField({
      name: "brandStory",
      title: "Brand story",
      type: "brandStorySection",
    }),
    defineField({
      name: "howItWorks",
      title: "How it works",
      type: "howItWorksSection",
    }),
    defineField({
      name: "destinations",
      title: "Destinations",
      type: "destinationsSection",
    }),
    defineField({
      name: "testimonial",
      title: "Testimonials",
      type: "testimonialSection",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "ctaSection",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home page" };
    },
  },
});
