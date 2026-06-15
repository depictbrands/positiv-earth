"use client";

import { useId, useState } from "react";

import type { FaqContent, FaqItem } from "@/types/faq-content";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const DEFAULT_CONTENT: FaqContent = {
  heading: "Frequently Asked Questions",
  items: [
    {
      question: "Is the service really bilingual",
      answer:
        "Yes! All materials and support are available in both English and Spanish.",
    },
    {
      question: "Do you handle visas or medical travel",
      answer:
        "We guide you through visa requirements and can coordinate medical-travel logistics with trusted partners, so every detail is handled before you depart.",
    },
    {
      question: "How much does it cost",
      answer:
        "Pricing depends on the scope of your journey. After a short consultation we share a transparent, all-in quote with no hidden fees.",
    },
    {
      question: "How do you pay",
      answer:
        "We accept major cards and bank transfers, with the option to split payment across a deposit and a final balance before travel.",
    },
  ],
};

// Wide, shallow chevron matching the Figma vector (≈20×11). Points down when
// collapsed; the parent rotates it 180° when the item is open.
function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 11"
      fill="none"
      className="h-[0.6875rem] w-5 shrink-0"
    >
      <path
        d="M1 1L10 10L19 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FaqRowProps = {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
  withDivider: boolean;
};

function FaqRow({ item, open, onToggle, withDivider }: FaqRowProps) {
  const reactId = useId();
  const panelId = `${reactId}-panel`;
  const buttonId = `${reactId}-button`;

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        // Dividers sit between consecutive items: a top border plus matching
        // space above and below it (24px each, per Figma).
        withDivider &&
          "mt-[var(--spacing-faq-item-gap)] border-t border-faq-divider pt-[var(--spacing-faq-item-gap)]",
      )}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-start justify-between gap-6 rounded-card-corner text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-black focus-visible:ring-offset-4 focus-visible:ring-offset-cream-white"
        >
          <span className="font-body text-p2 text-faq-question transition-colors group-hover:text-base-black">
            {item.question}
          </span>
          <span
            className={cn(
              "mt-3 flex text-faq-question transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:text-base-black",
              open && "rotate-180",
            )}
          >
            <Chevron />
          </span>
        </button>
      </h3>

      {/* Answer expands/collapses smoothly via a 0fr→1fr grid row. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out motion-reduce:transition-none",
          open
            ? "mt-[var(--spacing-faq-answer-gap)] grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="font-body text-p1 text-faq-answer">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

type FAQProps = {
  content?: FaqContent;
};

export default function FAQ({ content = DEFAULT_CONTENT }: FAQProps) {
  const heading = content.heading?.trim() || DEFAULT_CONTENT.heading;
  const items = content.items?.length ? content.items : DEFAULT_CONTENT.items;

  // Single-open accordion; the first question starts open to match the design.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-cream-white">
      <div className="mx-auto flex w-full max-w-[var(--size-faq-width)] flex-col gap-12 px-6 pt-[var(--spacing-faq-top)] pb-[var(--spacing-faq-bottom)] sm:px-8 lg:flex-row lg:justify-between lg:gap-0 lg:px-12">
        <h2 className="font-display text-heading-4 text-base-black lg:w-[var(--size-faq-heading-width)] lg:shrink-0">
          {heading}
        </h2>

        <div className="flex w-full flex-col lg:w-[var(--size-faq-list-width)] lg:shrink-0">
          {items.map((item, index) => (
            <FaqRow
              key={`${item.question}-${index}`}
              item={item}
              open={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? null : index))
              }
              withDivider={index > 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
