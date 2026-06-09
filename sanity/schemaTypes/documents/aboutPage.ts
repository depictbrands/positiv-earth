import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "About page",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "aboutHeroSection",
    }),
    defineField({
      name: "intro",
      title: "Intro — credentials",
      type: "aboutIntroSection",
    }),
    defineField({
      name: "sceneA",
      title: "Scene A — olive (Built for meaningful travel)",
      type: "aboutSceneSection",
    }),
    defineField({
      name: "sceneB",
      title: "Scene B — blue (Guiding You Beyond the Itinerary)",
      type: "aboutSceneSection",
    }),
    defineField({
      name: "sceneC",
      title: "Scene C — coral (Why Us)",
      type: "aboutSceneSection",
    }),
    defineField({
      name: "cta",
      title: "CTA band (Let's Plan Your Trip)",
      type: "ctaSection",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About page" };
    },
  },
});
