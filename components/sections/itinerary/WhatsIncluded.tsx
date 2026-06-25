import type { ItineraryWhatsIncludedContent } from "@/types/itinerary-whats-included-content";

const DEFAULT_INCLUDES = [
  "Professional English-speaking guide (extra for groups over 8)",
  "Pre-Inca Trail briefing",
  "Airport transfers to/from Cusco hotel",
  "All Sacred Valley site admission fees",
  "Transportation from Cusco to Ollantaytambo train station",
  "Expedition train Ollantaytambo to KM 104",
  "Bus tickets: Machu Picchu to Aguas Calientes (Day 3), round-trip Aguas Calientes to Machu Picchu (Day 4)",
  "Return Expedition train Aguas Calientes to Ollantaytambo",
  "Inca Trail & Machu Picchu admission tickets",
  "1 box lunch on Short Inca Trail",
  "1 dinner in Aguas Calientes & 1 at Sky Lodge",
  "3 hotel breakfasts",
  "2 nights Cusco hotel (double occupancy)",
  "1 night Ollantaytambo hotel (double occupancy)",
  "1 night Aguas Calientes hotel (double occupancy)",
  "Private guided Machu Picchu tour (Circuit 3) & all package sites",
  "Cooking class activity",
  "First-aid kit with emergency oxygen for all tours.",
] as const;

const DEFAULT_NOT_INCLUDES = [
  "Flights",
  "Airport taxes",
  "Hiking poles for Short Inca Trail",
  "Meals (unless specified)",
  "Tips for staff",
  "Huayna Picchu permit",
  "Travel insurance (strongly recommended)",
] as const;

const DEFAULT_CONTENT: ItineraryWhatsIncludedContent = {
  heading: "What is included / not included",
  includesHeading: "Includes",
  notIncludesHeading: "Not Includes",
  includes: [...DEFAULT_INCLUDES],
  notIncludes: [...DEFAULT_NOT_INCLUDES],
};

type WhatsIncludedProps = {
  content?: ItineraryWhatsIncludedContent;
};

function resolveContent(
  content?: ItineraryWhatsIncludedContent,
): ItineraryWhatsIncludedContent {
  return {
    heading: content?.heading?.trim() || DEFAULT_CONTENT.heading,
    includesHeading:
      content?.includesHeading?.trim() || DEFAULT_CONTENT.includesHeading,
    notIncludesHeading:
      content?.notIncludesHeading?.trim() || DEFAULT_CONTENT.notIncludesHeading,
    includes: content?.includes?.length ? content.includes : DEFAULT_CONTENT.includes,
    notIncludes: content?.notIncludes?.length
      ? content.notIncludes
      : DEFAULT_CONTENT.notIncludes,
  };
}

// Itinerary "WhatsIncluded" section (Figma node 584:1298): on a black canvas, a
// centered heading over two columns — a long "Includes" list and a shorter
// "Not Includes" list. Presentational — content arrives via props.
export default function WhatsIncluded({ content }: WhatsIncludedProps) {
  const resolved = resolveContent(content);

  return (
    <section
      aria-labelledby="itinerary-whats-included-heading"
      className="w-full overflow-hidden bg-base-black text-base-white"
    >
      <div
        className="mx-auto flex w-full max-w-[var(--size-itinerary-whats-included-width)] flex-col items-center px-6 py-16 sm:px-10 lg:px-0 lg:py-22"
        style={{ gap: "var(--spacing-itinerary-whats-included-section-gap)" }}
      >
        <h2
          id="itinerary-whats-included-heading"
          className="w-full text-center font-display text-heading-4 text-base-white"
        >
          {resolved.heading}
        </h2>

        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div
            className="flex w-full flex-col lg:w-[var(--size-itinerary-whats-included-includes-width)]"
            style={{
              gap: "var(--spacing-itinerary-whats-included-includes-heading-gap)",
            }}
          >
            <h3 className="font-body text-p2 text-base-white">
              {resolved.includesHeading}
            </h3>

            <ul className="w-full list-disc space-y-0 ps-8 font-body text-p1 text-base-white">
              {resolved.includes.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div
            className="flex w-full flex-col lg:w-[var(--size-itinerary-whats-included-excludes-width)]"
            style={{
              gap: "var(--spacing-itinerary-whats-included-excludes-heading-gap)",
            }}
          >
            <h3 className="font-body text-p2 text-base-white">
              {resolved.notIncludesHeading}
            </h3>

            <ul className="w-full list-disc space-y-0 ps-8 font-body text-p1 text-base-white">
              {resolved.notIncludes.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
