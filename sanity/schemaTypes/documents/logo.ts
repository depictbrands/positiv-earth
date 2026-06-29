import { defineField, defineType } from "sanity";

export const logo = defineType({
  name: "logo",
  title: "Logo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Site logo",
    }),
    defineField({
      name: "headerLogo",
      title: "Header logo",
      description:
        "Shown in the site header on every page. Best: SVG (vector, sharp at any size). " +
        "Alternative: PNG with transparent background, about 240×56 px (2× for retina). " +
        "Keep the artwork within ~24 px cap height so it fits the header bar.",
      type: "imageWithAlt",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      description:
        "Browser tab icon. Best: square PNG, 32×32 px (also upload 180×180 for Apple touch if needed later). " +
        "SVG favicons are supported in modern browsers but PNG is the safest default.",
      type: "image",
      options: { accept: "image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon" },
    }),
  ],
  preview: {
    select: { title: "title", media: "headerLogo.asset" },
    prepare({ title, media }) {
      return { title: title || "Logo", media };
    },
  },
});
