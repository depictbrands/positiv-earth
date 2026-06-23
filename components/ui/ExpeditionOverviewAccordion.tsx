"use client";

import { useId, useState } from "react";

import type { ItineraryOverviewAccordionItem } from "@/types/itinerary-overview-content";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-[var(--size-itinerary-overview-accordion-icon)] shrink-0"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-[var(--size-itinerary-overview-accordion-icon)] shrink-0"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type AccordionRowProps = {
  item: ItineraryOverviewAccordionItem;
  open: boolean;
  onToggle: () => void;
};

function AccordionRow({ item, open, onToggle }: AccordionRowProps) {
  const reactId = useId();
  const panelId = `${reactId}-panel`;
  const buttonId = `${reactId}-button`;

  return (
    <div className="flex w-full flex-col border-b border-base-white pb-[var(--spacing-itinerary-overview-accordion-trigger-padding-bottom)]">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-6 rounded-card-corner text-left text-base-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-white focus-visible:ring-offset-2 focus-visible:ring-offset-base-black"
        >
          <span className="font-display text-p1">{item.title}</span>
          <span className="shrink-0 text-base-white">
            {open ? <MinusIcon /> : <PlusIcon />}
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out motion-reduce:transition-none",
          open
            ? "mt-[var(--spacing-itinerary-overview-accordion-body-gap)] grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="font-body text-p1 text-base-white">{item.body}</p>
        </div>
      </div>
    </div>
  );
}

type ExpeditionOverviewAccordionProps = {
  items: ItineraryOverviewAccordionItem[];
};

export default function ExpeditionOverviewAccordion({
  items,
}: ExpeditionOverviewAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className="flex w-full flex-col"
      style={{ gap: "var(--spacing-itinerary-overview-accordion-item-gap)" }}
    >
      {items.map((item, index) => (
        <AccordionRow
          key={`${item.title}-${index}`}
          item={item}
          open={openIndex === index}
          onToggle={() =>
            setOpenIndex((prev) => (prev === index ? null : index))
          }
        />
      ))}
    </div>
  );
}
