import Image from "next/image";

import type {
  ItineraryOverviewContent,
  ItineraryProcessStep,
} from "@/types/itinerary-overview-content";

const DEFAULT_PROCESS: ItineraryProcessStep[] = [
  {
    title: "Connect",
    description:
      "A warm conversation to understand your travel style, curiosities, and goals.",
  },
  {
    title: "Customize",
    description:
      "We craft an itinerary tailored to you: destinations, culture, pacing, and personal touches.",
  },
  {
    title: "Prepare",
    description:
      "Cultural insights, packing tips, and practical guidance so you arrive ready and confident.",
  },
  {
    title: "Experience",
    description:
      "On-trip support and check-ins so you can stay fully present in every moment.",
  },
  {
    title: "Reflect",
    description:
      "A welcome-home conversation to celebrate your journey and stay connected beyond it.",
  },
];

const DEFAULT_CONTENT: ItineraryOverviewContent = {
  heading: "Expedition Overview",
  highlights: [
    "Cusco, Machu Picchu, Rainbow Mountain",
    "Original Inca Trail hike",
    "Sacred Valley villages and markets",
    "Ollantaytambo, Sacsayhuamán, Moray terraces",
    "Pachamanca feast and cooking class",
    "Vinicunca’s high-altitude mineral colors",
  ],
  mapImageUrl: "/itinerary/peru-map.png",
  mapImageAlt: "Illustrated map of the Peru route with key stops",
  process: DEFAULT_PROCESS,
};

type OverviewProps = {
  content?: ItineraryOverviewContent;
};

function resolveContent(content?: ItineraryOverviewContent): ItineraryOverviewContent {
  return {
    heading: content?.heading?.trim() || DEFAULT_CONTENT.heading,
    highlights:
      content?.highlights?.length ? content.highlights : DEFAULT_CONTENT.highlights,
    mapImageUrl: content?.mapImageUrl?.trim() || DEFAULT_CONTENT.mapImageUrl,
    mapImageAlt: content?.mapImageAlt?.trim() || DEFAULT_CONTENT.mapImageAlt,
    process: content?.process?.length ? content.process : DEFAULT_CONTENT.process,
  };
}

// Itinerary "Overview" section (Figma node 584:1098): on a black canvas, an
// "Expedition Overview" heading with highlight bullets sits beside an illustrated
// route map, with a horizontal process timeline (Connect → Reflect) below.
// Presentational — content arrives via props.
export default function Overview({ content }: OverviewProps) {
  const resolved = resolveContent(content);
  const lastStep = resolved.process.length - 1;

  return (
    <section className="w-full overflow-hidden bg-base-black text-base-white">
      <div
        className="mx-auto flex w-full max-w-[var(--size-itinerary-overview-width)] flex-col px-6 py-16 sm:px-10 lg:px-0 lg:py-22"
        style={{ gap: "var(--spacing-itinerary-overview-section-gap)" }}
      >
        {/* Top row: overview copy + route map */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div
            className="flex w-full flex-col lg:w-[var(--size-itinerary-overview-copy-width)]"
            style={{ gap: "var(--spacing-itinerary-overview-copy-gap)" }}
          >
            <h2 className="w-full font-body text-p2 text-base-white">
              {resolved.heading}
            </h2>

            <ul className="w-full list-disc space-y-6 ps-8 font-body text-p1 text-base-white">
              {resolved.highlights.map((highlight, index) => (
                <li key={`${highlight}-${index}`}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[704/396] w-full lg:aspect-auto lg:h-[var(--size-itinerary-overview-map-height)] lg:w-[var(--size-itinerary-overview-map-width)] lg:shrink-0">
            <Image
              src={resolved.mapImageUrl}
              alt={resolved.mapImageAlt}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 704px, 100vw"
            />
          </div>
        </div>

        {/* Process timeline */}
        <ol className="flex flex-col gap-10 lg:flex-row lg:gap-0">
          {resolved.process.map((step, index) => (
            <li key={`${step.title}-${index}`} className="flex flex-1 flex-col gap-4">
              <div className="flex items-center" aria-hidden="true">
                <span className="block size-2 shrink-0 rounded-full bg-base-white" />
                {index < lastStep ? (
                  <span className="hidden h-px flex-1 bg-base-white lg:block" />
                ) : null}
              </div>

              <div className="flex flex-col gap-1 lg:pr-4">
                <p className="font-body text-itinerary-overview-step-title text-base-white">
                  {step.title}
                </p>
                <p className="font-open-sans text-itinerary-overview-step-text text-base-white">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
