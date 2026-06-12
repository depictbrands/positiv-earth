"use client";

import { useEffect } from "react";

import { recordItineraryView } from "@/lib/itinerary/behaviorStore";

type RecordItineraryViewProps = {
  slug: string;
};

/** Writes the current itinerary slug to localStorage for Next Itineraries scoring. */
export default function RecordItineraryView({ slug }: RecordItineraryViewProps) {
  useEffect(() => {
    recordItineraryView(slug);
  }, [slug]);

  return null;
}
