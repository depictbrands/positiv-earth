import { defineField, defineType } from "sanity";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Services page",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "servicesHeroSection",
    }),
    defineField({
      name: "threeServices",
      title: "Three services",
      type: "threeServicesSection",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Services page" };
    },
  },
});
