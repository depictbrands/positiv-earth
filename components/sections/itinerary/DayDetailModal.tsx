"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";

import type { ItineraryDay } from "@/types/itinerary-timeline-content";

type DayDetailModalProps = {
  day: ItineraryDay;
  onClose: () => void;
};

function LocationPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 20"
      className="h-5 w-4 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1C4.41 1 1.5 3.91 1.5 7.5c0 4.5 6.5 11 6.5 11s6.5-6.5 6.5-11C14.5 3.91 11.59 1 8 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Per-day "Details" pop-up (Figma node 584:1758): a centered white dialog over a
// dark scrim, with a hero image and a Morning / Afternoon / Evening day plan.
// Closes on Escape, scrim click, or the close button; locks body scroll while open.
export default function DayDetailModal({ day, onClose }: DayDetailModalProps) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const detail = day.detail;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-itinerary-detail-overlay"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 flex max-h-[90vh] w-full max-w-[var(--size-itinerary-detail-width)] flex-col overflow-hidden rounded-card-corner bg-base-white shadow-footer-submit outline-none"
      >
        <div className="relative h-56 shrink-0 sm:h-[var(--size-itinerary-detail-image-height)]">
          <Image
            src={day.imageUrl}
            alt={day.imageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1194px, 100vw"
          />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full bg-base-white/85 p-2 text-base-black transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div
          className="flex flex-col gap-8 overflow-y-auto"
          style={{ padding: "var(--spacing-itinerary-detail-inset)" }}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-x-6 lg:flex-wrap lg:justify-start lg:gap-x-12 lg:gap-y-2">
              <p
                id={headingId}
                className="font-open-sans text-itinerary-day-count uppercase text-base-black"
              >
                {day.dayLabel}
              </p>
              {detail?.city ? (
                <span className="inline-flex items-center gap-3 text-base-black">
                  <LocationPinIcon />
                  <span className="font-display text-itinerary-detail-city">
                    {detail.city}
                  </span>
                </span>
              ) : null}
            </div>

            <span
              aria-hidden="true"
              className="block w-full border-t border-itinerary-track"
            />
          </div>

          {detail?.periods?.length ? (
            <div className="flex flex-col gap-8 md:grid md:grid-cols-3">
              {detail.periods.map((period, index) => (
                <div
                  key={`${period.name}-${index}`}
                  className="flex gap-6 md:flex-col md:gap-4"
                >
                  <div className="flex w-2/5 shrink-0 flex-col gap-3 md:w-auto md:gap-4">
                    <h3 className="font-open-sans text-itinerary-headline text-base-black">
                      {period.name}
                    </h3>

                    <div
                      className="flex flex-col"
                      style={{ minHeight: "var(--size-itinerary-detail-meal-min-h)" }}
                    >
                      <p
                        className={`font-open-sans text-itinerary-day-summary ${
                          period.mealIncluded
                            ? "text-itinerary-accent"
                            : "text-base-black"
                        }`}
                      >
                        {period.meal}
                      </p>
                      {period.mealIncluded && period.mealPlace ? (
                        <p className="font-open-sans text-itinerary-day-summary italic text-itinerary-accent">
                          {period.mealPlace}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p className="flex-1 font-open-sans text-itinerary-body text-base-black md:flex-none">
                    {period.activity}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-open-sans text-itinerary-body text-itinerary-body-ink">
              {day.body}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
