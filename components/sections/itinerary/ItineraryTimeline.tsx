"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import DayDetailModal from "@/components/sections/itinerary/DayDetailModal";
import DetailButton from "@/components/ui/DetailButton";
import type {
  ItineraryDay,
  ItineraryTimelineContent,
} from "@/types/itinerary-timeline-content";

const PLACEHOLDER_IMAGES = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 331"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23c89b6a"/><stop offset="1" stop-color="%236b4a2b"/></linearGradient></defs><rect width="937" height="331" fill="url(%23g)"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 331"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23b8553f"/><stop offset="1" stop-color="%235c7a8c"/></linearGradient></defs><rect width="937" height="331" fill="url(%23g)"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 331"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%235f7d52"/><stop offset="1" stop-color="%231f2c1c"/></linearGradient></defs><rect width="937" height="331" fill="url(%23g)"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 331"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%237d8a6f"/><stop offset="1" stop-color="%23394231"/></linearGradient></defs><rect width="937" height="331" fill="url(%23g)"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 331"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%234f7d6b"/><stop offset="1" stop-color="%23223b34"/></linearGradient></defs><rect width="937" height="331" fill="url(%23g)"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 331"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23b5824e"/><stop offset="1" stop-color="%23533a22"/></linearGradient></defs><rect width="937" height="331" fill="url(%23g)"/></svg>',
] as const;

const DEFAULT_DAYS: ItineraryDay[] = [
  {
    dayLabel: "DAY 1",
    daySummary: "Arrival in Cusco.\nPlaza de Armas at golden hour.",
    date: "OCT 22, 2026",
    headline: "Welcome to Cusco",
    body: "Begin your journey in Cusco, where centuries of Incan heritage and Andean warmth invite you to slow down and arrive.",
    imageUrl: PLACEHOLDER_IMAGES[0],
    imageAlt: "Cusco rooftops at golden hour",
    detail: {
      city: "Cusco",
      periods: [
        {
          name: "Morning",
          meal: "Breakfast",
          mealPlace: "Hotel in Cusco",
          mealIncluded: true,
          activity:
            "Arrive at Alejandro Velasco Astete International Airport, greeted by an APT representative.",
        },
        {
          name: "Afternoon",
          meal: "Don't include lunch",
          activity:
            "Explore Plaza de Armas, admire Cusco Cathedral and Iglesia de la Compañía de Jesús.",
        },
        {
          name: "Evening",
          meal: "Don't include dinner",
          activity:
            "Relax at a café, enjoying the vibrant atmosphere of the square.",
        },
      ],
    },
  },
  {
    dayLabel: "DAY 2",
    daySummary: "Rainbow Mountain.\nVinicunca's painted peaks.",
    date: "OCT 23, 2026",
    headline: "Color Beyond Imagination",
    body: "Climb into the Andes to meet Rainbow Mountain, where the earth itself becomes art.",
    imageUrl: PLACEHOLDER_IMAGES[1],
    imageAlt: "Rainbow Mountain's mineral-striped slopes",
    detail: {
      city: "Vinicunca",
      periods: [
        {
          name: "Morning",
          meal: "Breakfast",
          mealPlace: "Hotel in Cusco",
          mealIncluded: true,
          activity:
            "Early drive into the Andes toward the trailhead at over 4,000 metres.",
        },
        {
          name: "Afternoon",
          meal: "Lunch",
          mealPlace: "Mountain lodge",
          mealIncluded: true,
          activity:
            "Hike to the Rainbow Mountain viewpoint and take in Vinicunca's mineral colours.",
        },
        {
          name: "Evening",
          meal: "Don't include dinner",
          activity: "Return to Cusco and rest after a high-altitude day.",
        },
      ],
    },
  },
  {
    dayLabel: "DAY 3",
    daySummary: "Short Inca Trail to Wiñay Wayna.",
    date: "OCT 24, 2026",
    headline: "Footsteps on the Inca Trail",
    body: "Walk the ancient path through cloud forest to the timeless ruins of Wiñay Wayna.",
    imageUrl: PLACEHOLDER_IMAGES[2],
    imageAlt: "Inca Trail winding through cloud forest",
    detail: {
      city: "Wiñay Wayna",
      periods: [
        {
          name: "Morning",
          meal: "Breakfast",
          mealPlace: "Trailhead camp",
          mealIncluded: true,
          activity: "Begin the short Inca Trail through lush cloud forest.",
        },
        {
          name: "Afternoon",
          meal: "Lunch",
          mealPlace: "Trail picnic",
          mealIncluded: true,
          activity: "Reach the hillside terraces and ruins of Wiñay Wayna.",
        },
        {
          name: "Evening",
          meal: "Don't include dinner",
          activity: "Overnight near Aguas Calientes at the foot of the mountain.",
        },
      ],
    },
  },
  {
    dayLabel: "DAY 4",
    daySummary: "Sunrise at Machu Picchu.\nPrivate guided tour.",
    date: "OCT 25, 2026",
    headline: "Machu Picchu, At Last",
    body: "The morning the clouds part and a wonder of the world reveals itself.",
    imageUrl: PLACEHOLDER_IMAGES[3],
    imageAlt: "Machu Picchu emerging from morning mist",
    detail: {
      city: "Machu Picchu",
      periods: [
        {
          name: "Morning",
          meal: "Breakfast",
          mealPlace: "Aguas Calientes hotel",
          mealIncluded: true,
          activity: "Sunrise entry to Machu Picchu before the crowds arrive.",
        },
        {
          name: "Afternoon",
          meal: "Don't include lunch",
          activity:
            "Private guided tour of the citadel's temples and terraces.",
        },
        {
          name: "Evening",
          meal: "Dinner",
          mealPlace: "Sacred Valley hotel",
          mealIncluded: true,
          activity: "Travel down to the Sacred Valley for the night.",
        },
      ],
    },
  },
  {
    dayLabel: "DAY 5",
    daySummary: "Ollantaytambo Fortress.\nMaras & Moray.",
    date: "OCT 26, 2026",
    headline: "Sacred Valley Stories",
    body: "Explore fortresses, salt pools, and circular terraces shaped by Incan wisdom.",
    imageUrl: PLACEHOLDER_IMAGES[4],
    imageAlt: "Circular Incan terraces of Moray",
    detail: {
      city: "Sacred Valley",
      periods: [
        {
          name: "Morning",
          meal: "Breakfast",
          mealPlace: "Valley hotel",
          mealIncluded: true,
          activity: "Visit the towering Ollantaytambo fortress.",
        },
        {
          name: "Afternoon",
          meal: "Lunch",
          mealPlace: "Local restaurant",
          mealIncluded: true,
          activity: "Explore the Maras salt pools and the Moray terraces.",
        },
        {
          name: "Evening",
          meal: "Don't include dinner",
          activity: "A free evening to wander the valley's villages.",
        },
      ],
    },
  },
  {
    dayLabel: "DAY 6",
    daySummary: "Peruvian cooking class.\nFarewell to Cusco.",
    date: "OCT 27, 2026",
    headline: "Flavors to Take Home",
    body: "A hands-on farewell through the colors, aromas, and stories of Peruvian cuisine.",
    imageUrl: PLACEHOLDER_IMAGES[5],
    imageAlt: "Colorful spread of Peruvian ingredients",
    detail: {
      city: "Cusco",
      periods: [
        {
          name: "Morning",
          meal: "Breakfast",
          mealPlace: "Hotel in Cusco",
          mealIncluded: true,
          activity: "A hands-on Peruvian cooking class with a local chef.",
        },
        {
          name: "Afternoon",
          meal: "Lunch",
          mealPlace: "Cooking school",
          mealIncluded: true,
          activity: "Share the meal you prepared together.",
        },
        {
          name: "Evening",
          meal: "Don't include dinner",
          activity: "Farewell to Cusco and transfer to the airport.",
        },
      ],
    },
  },
];

const DEFAULT_CONTENT: ItineraryTimelineContent = {
  heading: "Itinerary",
  days: DEFAULT_DAYS,
};

type ItineraryTimelineProps = {
  content?: ItineraryTimelineContent;
};

function resolveContent(content?: ItineraryTimelineContent): ItineraryTimelineContent {
  return {
    heading: content?.heading?.trim() || DEFAULT_CONTENT.heading,
    days: content?.days?.length ? content.days : DEFAULT_CONTENT.days,
  };
}

// Itinerary day-by-day timeline (Figma node 584:1122). A faint base track runs
// down the rail; as the section scrolls through the viewport, an accent-colored
// track grows to cover it and each day "lights up" (dot + label) once the active
// track passes its dot. Presentational — content arrives via props.
export default function ItineraryTimeline({ content }: ItineraryTimelineProps) {
  const resolved = resolveContent(content);
  const days = resolved.days;

  const listRef = useRef<HTMLOListElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [track, setTrack] = useState({ top: 0, height: 0 });
  const [fillHeight, setFillHeight] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!list || dots.length === 0) return;

    const listRect = list.getBoundingClientRect();
    const firstRect = dots[0].getBoundingClientRect();
    const lastRect = dots[dots.length - 1].getBoundingClientRect();
    const firstCenter = firstRect.top + firstRect.height / 2;
    const lastCenter = lastRect.top + lastRect.height / 2;

    const top = firstCenter - listRect.top;
    const height = lastCenter - firstCenter;

    // The "trigger line" sits at the vertical middle of the viewport: the active
    // track fills down to it and dots above it become active.
    const trigger = window.innerHeight * 0.5;
    const fill = Math.min(Math.max(trigger - firstCenter, 0), Math.max(height, 0));

    let active = 0;
    for (const dot of dots) {
      const rect = dot.getBoundingClientRect();
      if (rect.top + rect.height / 2 <= trigger) active += 1;
    }

    setTrack({ top, height });
    setFillHeight(fill);
    setActiveCount(active);
  }, []);

  useEffect(() => {
    measure();

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [measure, days.length]);

  const openDay = openDayIndex !== null ? days[openDayIndex] : null;

  return (
    <>
      <section className="w-full overflow-hidden bg-base-white">
      <div className="mx-auto w-full max-w-[var(--size-itinerary-overview-width)] px-6 py-16 sm:px-10 lg:px-0 lg:py-22">
        <h2 className="font-display text-heading-4 text-base-black">
          {resolved.heading}
        </h2>

        <ol
          ref={listRef}
          className="relative mt-12 flex flex-col lg:mt-16 [--rail-w:2.5rem]"
          style={{ gap: "var(--spacing-itinerary-row-gap)" }}
        >
          {/* Scroll-driven rail (desktop): faint base track covered by the accent fill */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute hidden w-0.5 -translate-x-1/2 lg:block"
            style={{
              left: "calc(var(--rail-w) / 2)",
              top: `${track.top}px`,
              height: `${track.height}px`,
            }}
          >
            <span className="absolute inset-0 bg-itinerary-track" />
            <span
              className="absolute inset-x-0 top-0 bg-itinerary-accent"
              style={{ height: `${fillHeight}px` }}
            />
          </div>

          {days.map((day, index) => {
            const active = index < activeCount;

            return (
              <li
                key={`${day.dayLabel}-${index}`}
                className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-5"
              >
                {/* Rail cell with dot (desktop) */}
                <div className="hidden lg:flex lg:w-[var(--rail-w)] lg:shrink-0 lg:items-center lg:justify-center lg:self-stretch">
                  <span
                    ref={(node) => {
                      dotRefs.current[index] = node;
                    }}
                    className={`block size-5 rounded-full transition-colors duration-300 ${
                      active ? "bg-itinerary-accent" : "bg-itinerary-track"
                    }`}
                  />
                </div>

                {/* Day label + summary */}
                <div className="flex flex-col gap-4 lg:w-[var(--size-itinerary-day-label-width)] lg:shrink-0">
                  <p
                    className={`font-open-sans text-itinerary-day-count uppercase transition-colors duration-300 ${
                      active ? "text-itinerary-accent" : "text-base-black"
                    }`}
                  >
                    {day.dayLabel}
                  </p>
                  <p
                    className={`whitespace-pre-line font-open-sans text-itinerary-day-summary transition-colors duration-300 ${
                      active ? "text-itinerary-accent" : "text-itinerary-day-muted"
                    }`}
                  >
                    {day.daySummary}
                  </p>
                </div>

                {/* Media card */}
                <div className="relative w-full overflow-hidden rounded-card-corner lg:h-[var(--size-itinerary-card-height)] lg:w-[var(--size-itinerary-card-width)]">
                  <Image
                    src={day.imageUrl}
                    alt={day.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 937px, 100vw"
                  />

                  <div
                    className="relative flex w-full flex-col bg-itinerary-card-overlay lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[var(--size-itinerary-card-panel-width)]"
                    style={{
                      gap: "var(--spacing-itinerary-card-content-gap)",
                      padding: "var(--spacing-itinerary-card-inset)",
                    }}
                  >
                    <div
                      className="flex flex-col"
                      style={{ gap: "var(--spacing-itinerary-card-group-gap)" }}
                    >
                      <p className="font-open-sans text-itinerary-day-summary text-base-black">
                        {day.date}
                      </p>

                      <div
                        className="flex flex-col"
                        style={{ gap: "var(--spacing-itinerary-card-headline-gap)" }}
                      >
                        <p className="font-open-sans text-itinerary-headline text-base-black">
                          {day.headline}
                        </p>
                        <p className="font-open-sans text-itinerary-body text-itinerary-body-ink">
                          {day.body}
                        </p>
                      </div>
                    </div>

                    <DetailButton
                      onClick={() => setOpenDayIndex(index)}
                      className="self-start shadow-search-bar"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      </section>

      {openDay ? (
        <DayDetailModal day={openDay} onClose={() => setOpenDayIndex(null)} />
      ) : null}
    </>
  );
}
