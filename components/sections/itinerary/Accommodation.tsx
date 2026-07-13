"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";

import type {
  ItineraryAccommodationCity,
  ItineraryAccommodationContent,
  ItineraryHotel,
} from "@/types/itinerary-accommodation-content";

const PLACEHOLDER_FEATURED =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 455"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23b89a72"/><stop offset="1" stop-color="%234a3624"/></linearGradient></defs><rect width="937" height="455" fill="url(%23g)"/></svg>';

const PLACEHOLDER_HOTEL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 458 374"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%237a8a9a"/><stop offset="1" stop-color="%232a3440"/></linearGradient></defs><rect width="458" height="374" fill="url(%23g)"/></svg>';

const DEFAULT_CITIES: ItineraryAccommodationCity[] = [
  {
    id: "cusco",
    label: "Cusco Hotels",
    hotels: [
      {
        name: "Palacio del Inka",
        imageUrl: PLACEHOLDER_FEATURED,
        imageAlt: "Palacio del Inka luxury suite interior",
      },
      {
        name: "Novotel Cusco",
        imageUrl: PLACEHOLDER_HOTEL,
        imageAlt: "Novotel Cusco guest room",
      },
      {
        name: "Casa San Blas Boutique",
        imageUrl: PLACEHOLDER_HOTEL,
        imageAlt: "Casa San Blas Boutique twin room",
      },
    ],
  },
  {
    id: "aguas-calientes",
    label: "Aguas Calientes Hotels",
    hotels: [
      {
        name: "Inkaterra Machu Picchu",
        imageUrl: PLACEHOLDER_FEATURED,
        imageAlt: "Inkaterra Machu Picchu lodge room",
      },
      {
        name: "Sumaq Machu Picchu",
        imageUrl: PLACEHOLDER_HOTEL,
        imageAlt: "Sumaq Machu Picchu hotel suite",
      },
      {
        name: "El Mapi by Inkaterra",
        imageUrl: PLACEHOLDER_HOTEL,
        imageAlt: "El Mapi hotel guest room",
      },
    ],
  },
  {
    id: "ollantaytambo",
    label: "Ollantaytambo Hotels",
    hotels: [
      {
        name: "Hotel Pakaritampu",
        imageUrl: PLACEHOLDER_FEATURED,
        imageAlt: "Hotel Pakaritampu garden view room",
      },
      {
        name: "El Albergue",
        imageUrl: PLACEHOLDER_HOTEL,
        imageAlt: "El Albergue boutique room",
      },
      {
        name: "Sauce Ollantaytambo",
        imageUrl: PLACEHOLDER_HOTEL,
        imageAlt: "Sauce Ollantaytambo guest room",
      },
    ],
  },
];

const DEFAULT_CONTENT: ItineraryAccommodationContent = {
  heading: "Accommodation",
  cities: DEFAULT_CITIES,
};

type AccommodationProps = {
  content?: ItineraryAccommodationContent;
};

function resolveHotel(hotel: ItineraryHotel | undefined, fallbackName: string) {
  return {
    name: hotel?.name?.trim() || fallbackName,
    imageUrl: hotel?.imageUrl?.trim() || PLACEHOLDER_HOTEL,
    imageAlt: hotel?.imageAlt?.trim() || fallbackName,
  };
}

function resolveContent(
  content?: ItineraryAccommodationContent,
): ItineraryAccommodationContent {
  const cities =
    content?.cities?.length ? content.cities : DEFAULT_CONTENT.cities;

  return {
    heading: content?.heading?.trim() || DEFAULT_CONTENT.heading,
    cities: cities.map((city, cityIndex) => {
      const fallbackCity = DEFAULT_CITIES[cityIndex] ?? DEFAULT_CITIES[0];
      return {
        id: city.id?.trim() || fallbackCity.id,
        label: city.label?.trim() || fallbackCity.label,
        hotels: (city.hotels?.length ? city.hotels : fallbackCity.hotels).map(
          (hotel, hotelIndex) =>
            resolveHotel(
              hotel,
              fallbackCity.hotels[hotelIndex]?.name ?? "Hotel",
            ),
        ),
      };
    }),
  };
}

type HotelCardProps = {
  hotel: ItineraryHotel;
  featured?: boolean;
};

function HotelCard({ hotel, featured = false }: HotelCardProps) {
  return (
    <article
      className={`relative w-full overflow-hidden rounded-card-corner ${
        featured
          ? "aspect-[937/455] lg:aspect-auto lg:h-[var(--size-itinerary-accommodation-featured-height)]"
          : "aspect-[458/374] lg:aspect-auto lg:h-[var(--size-itinerary-accommodation-hotel-height)]"
      }`}
    >
      <Image
        src={hotel.imageUrl}
        alt={hotel.imageAlt}
        fill
        className="object-cover"
        sizes={
          featured
            ? "(min-width: 1024px) 937px, 100vw"
            : "(min-width: 1024px) 458px, 50vw"
        }
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-card-corner"
        style={{ backgroundColor: "var(--color-itinerary-accommodation-card-overlay)" }}
      />

      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          padding:
            "var(--spacing-itinerary-accommodation-name-inset)",
          borderRadius:
            "0 0 var(--radius-card-corner) var(--radius-card-corner)",
          backgroundImage:
            "linear-gradient(180deg, var(--color-destination-card-portrait-overlay-end) 7.02%, var(--color-base-black) 100%)",
        }}
      >
        <p className="font-open-sans font-light uppercase text-itinerary-hotel-name text-base-white">
          {hotel.name}
        </p>
      </div>
    </article>
  );
}

// Itinerary "Accommodation" section (Figma node 584:1231): city tabs on the left
// switch the hotel panel on the right — one featured card plus a two-up row.
// Presentational content via props; tab selection is client-side.
export default function Accommodation({ content }: AccommodationProps) {
  const resolved = resolveContent(content);
  const baseId = useId();
  const [selectedCityId, setSelectedCityId] = useState(resolved.cities[0]?.id ?? "");

  const selectedCity = useMemo(
    () =>
      resolved.cities.find((city) => city.id === selectedCityId) ??
      resolved.cities[0],
    [resolved.cities, selectedCityId],
  );

  const featuredHotel = selectedCity?.hotels[0];
  const gridHotels = selectedCity?.hotels.slice(1) ?? [];

  return (
    <section
      aria-labelledby="itinerary-accommodation-heading"
      className="w-full overflow-hidden bg-secondary-black"
    >
      <div className="mx-auto flex w-full max-w-[var(--size-itinerary-overview-width)] flex-col gap-12 px-6 py-16 sm:px-10 lg:gap-y-[var(--spacing-itinerary-accommodation-heading-gap)] lg:px-0 lg:py-22">
        <h2
          id="itinerary-accommodation-heading"
          className="font-display text-heading-4 text-base-white"
        >
          {resolved.heading}
        </h2>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div
            role="tablist"
            aria-label="Accommodation cities"
            className="flex w-full shrink-0 flex-col lg:max-w-[var(--size-itinerary-accommodation-nav-width)]"
            style={{ gap: "var(--spacing-itinerary-accommodation-grid-gap)" }}
          >
            {resolved.cities.map((city) => {
              const selected = city.id === selectedCity?.id;
              const tabId = `${baseId}-tab-${city.id}`;
              const panelId = `${baseId}-panel-${city.id}`;

              return (
                <button
                  key={city.id}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  onClick={() => setSelectedCityId(city.id)}
                  className="group relative w-full overflow-hidden text-left font-open-sans text-base-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white"
                  style={{
                    padding: "var(--spacing-itinerary-accommodation-city-inset)",
                    fontSize: "var(--text-turntable-body)",
                    lineHeight: "var(--text-turntable-body--line-height)",
                    letterSpacing: "var(--text-turntable-body--letter-spacing)",
                    fontWeight: "var(--font-weight-open-sans-bold)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out ${
                      selected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-active:opacity-100"
                    }`}
                    style={{
                      backgroundColor: "var(--color-quiz-entry-glass-fill)",
                      boxShadow: "var(--shadow-quiz-entry-glass-edge)",
                      border: "1px solid var(--color-glass-border)",
                      borderRadius: "var(--radius-header-active-pill-corner)",
                      backdropFilter: "blur(var(--blur-glass)) saturate(var(--glass-saturate))",
                      WebkitBackdropFilter:
                        "blur(var(--blur-glass)) saturate(var(--glass-saturate))",
                      filter: "drop-shadow(var(--shadow-quiz-entry-drop))",
                    }}
                  />
                  <span
                    className={`relative z-10 transition-colors ${
                      selected
                        ? "text-base-white"
                        : "text-base-white"
                    }`}
                  >
                    {city.label}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedCity && featuredHotel ? (
            <div
              id={`${baseId}-panel-${selectedCity.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${selectedCity.id}`}
              className="flex w-full min-w-0 flex-1 flex-col"
              style={{ gap: "var(--spacing-itinerary-accommodation-grid-gap)" }}
            >
            <HotelCard hotel={featuredHotel} featured />

            {gridHotels.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: "var(--spacing-itinerary-accommodation-grid-gap)" }}
              >
                {gridHotels.map((hotel, index) => (
                  <HotelCard key={`${hotel.name}-${index}`} hotel={hotel} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        </div>
      </div>
    </section>
  );
}
