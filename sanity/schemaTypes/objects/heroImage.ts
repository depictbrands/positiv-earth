import { defineField, defineType } from "sanity";

/**
 * Full-bleed hero background image with optional art-directed crops.
 *
 * Heroes are `object-cover` on a viewport that is far narrower than the 1512px
 * desktop frame, so a landscape photo gets cropped hard on phones and a subject
 * near an edge falls out of frame. Editors have two levers, cheapest first:
 *
 *  1. Drag the hotspot on the desktop image. It becomes the CSS
 *     `object-position`, so that point stays in frame at every viewport width.
 *  2. Fill in the tablet / mobile fields — pick the *same* photo from the media
 *     library, then use the crop tool to draw a narrower crop. Sanity stores
 *     crop and hotspot per field, so one upload can serve three framings.
 *
 * The `asset` and `alt` field names deliberately match `imageWithAlt` so hero
 * documents authored before this type existed keep their image and alt text.
 */
export const heroImage = defineType({
  name: "heroImage",
  title: "Hero image",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Image (desktop)",
      description:
        "Used from 1024px up, and as the fallback on smaller screens. Drag the hotspot onto the subject so it stays in frame wherever the image is cropped.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      description:
        "Describes the image for screen readers. Shared by all three crops.",
      type: "string",
    }),
    defineField({
      name: "tablet",
      title: "Tablet crop (768–1023px)",
      description:
        "Optional. Pick the same photo from the media library, then use the crop tool to choose the part that stays visible on tablets. Leave empty to use the desktop image.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "mobile",
      title: "Mobile crop (up to 767px)",
      description:
        "Optional. Same idea as the tablet crop, usually a tall portrait crop centred on the subject. Leave empty to fall back to the tablet crop, then the desktop image.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "alt", media: "asset" },
  },
});
