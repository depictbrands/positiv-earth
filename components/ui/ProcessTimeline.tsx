"use client";

import { useState } from "react";

import type { ItineraryProcessStep } from "@/types/itinerary-overview-content";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ProcessTimelineProps = {
  steps: ItineraryProcessStep[];
  className?: string;
};

// Horizontal process timeline (Connect → Reflect). Default state shows only the
// continuous track line with a dot per step and the titles tilted 30° above each
// dot. Hovering (or keyboard-focusing) a title turns that step the accent color
// and reveals its left-aligned description below the dot, while the other titles
// fade. Leaving the title returns the whole timeline to its default state.
//
// Responsive: the root sets its font-size to the step-title token, and all
// structural geometry (row heights, dot size, description box) is expressed in
// `em`, so it stays pixel-faithful at the 1512px frame and scales up in lockstep
// with the token above it (matching the route's `.itinerary-scale` behavior).
export default function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastStep = steps.length - 1;

  return (
    <ol
      className={cn("relative flex w-full text-itinerary-overview-step-title", className)}
    >
      {steps.map((step, index) => {
        const isActive = activeIndex === index;
        const isDimmed = activeIndex !== null && !isActive;

        // On mobile the description box (w-16em) overflows the viewport for the
        // trailing steps, whose dots sit near the right edge. Anchor the last two
        // descriptions to the third-from-last dot so they open leftward and stay
        // on screen; each li is flex-1, so one -100% offset equals one dot step.
        // Desktop keeps every description left-aligned under its own dot.
        const anchorIndex = steps.length - 3;
        const mobileShift =
          anchorIndex >= 0 && index > anchorIndex ? index - anchorIndex : 0;
        const mobileLeftClass =
          ["left-0", "left-[-100%]", "left-[-200%]"][mobileShift] ?? "left-0";

        return (
          <li key={`${step.title}-${index}`} className="relative flex flex-1 flex-col">
            {/* Title, tilted 30° above the dot. Drives the hover/focus state. */}
            <div className="relative h-[5em]">
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className={cn(
                  "absolute bottom-0 left-0 origin-bottom-left rotate-[-30deg] whitespace-nowrap rounded-card-corner font-body text-itinerary-overview-step-title transition-[color,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-white focus-visible:ring-offset-2 focus-visible:ring-offset-base-black motion-reduce:transition-none",
                  isActive ? "text-itinerary-accent" : "text-base-white",
                  isDimmed ? "opacity-30" : "opacity-100",
                )}
              >
                {step.title}
              </button>
            </div>

            {/* Dot sitting on the continuous track line. Each step but the last
                draws the segment reaching the next dot, so the line is unbroken. */}
            <div className="relative flex h-[0.5em] items-center">
              {index < lastStep ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-base-white"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="relative block size-[0.5em] rounded-full bg-base-white"
              />
            </div>

            {/* Description, left-aligned under the dot, revealed only while active. */}
            <div className="relative h-[6em]">
              <p
                aria-hidden={!isActive}
                className={cn(
                  "pointer-events-none absolute top-[1.143em] w-[16em] text-left font-open-sans text-itinerary-overview-step-text text-base-white transition-opacity duration-300 motion-reduce:transition-none",
                  mobileLeftClass,
                  "lg:left-0",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              >
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
