import Image from "next/image";

import ExpeditionOverviewAccordion from "@/components/ui/ExpeditionOverviewAccordion";
import ProcessTimeline from "@/components/ui/ProcessTimeline";
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
  accordionItems: [
    {
      title: "The Expedition at a Glance",
      body:
        "Cusco, Machu Picchu, Rainbow Mountain, and the original Inca Trail — a curated route through Peru's most iconic landscapes and living culture.",
    },
    {
      title: "Where You'll Wander",
      body:
        "Sacred Valley villages and markets, Ollantaytambo, Sacsayhuamán, Moray terraces, and Vinicunca's high-altitude mineral colors.",
    },
    {
      title: "Moments You'll Carry Home",
      body:
        "A Pachamanca feast and cooking class, guided trail days, and time in communities where Andean traditions are still part of daily life.",
    },
    {
      title: "Good to Know Before You Set Out",
      body:
        "Altitude, pacing, and trail permits are built into the itinerary. Your advisor will walk you through preparation before you depart.",
    },
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
    accordionItems: content?.accordionItems?.length
      ? content.accordionItems
      : DEFAULT_CONTENT.accordionItems,
    mapImageUrl: content?.mapImageUrl?.trim() || DEFAULT_CONTENT.mapImageUrl,
    mapImageAlt: content?.mapImageAlt?.trim() || DEFAULT_CONTENT.mapImageAlt,
    process: content?.process?.length ? content.process : DEFAULT_CONTENT.process,
  };
}

// Itinerary "Overview" section (Figma node 584:1098): on a black canvas, an
// "Expedition Overview" heading with expandable panels sits beside an illustrated
// route map, with a horizontal process timeline (Connect → Reflect) below.
// Presentational — content arrives via props.
export default function Overview({ content }: OverviewProps) {
  const resolved = resolveContent(content);

  return (
    <section
      aria-labelledby="itinerary-overview-heading"
      className="w-full overflow-hidden bg-base-black text-base-white"
    >
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
            <h2
              id="itinerary-overview-heading"
              className="w-full font-body text-p2 text-base-white"
            >
              {resolved.heading}
            </h2>

            <ExpeditionOverviewAccordion items={resolved.accordionItems} />
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

        {/* Curation process: titled process timeline, nudged down from the row above */}
        <div
          className="mt-3 flex flex-col"
          style={{ gap: "var(--spacing-itinerary-overview-copy-gap)" }}
        >
          <h3 className="w-full font-body text-p2 text-base-white">
            Curation Process
          </h3>

          <ProcessTimeline steps={resolved.process} />
        </div>
      </div>
    </section>
  );
}
