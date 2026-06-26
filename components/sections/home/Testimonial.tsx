"use client";

import { useEffect, useRef, useState } from "react";

import TestimonialCard from "@/components/ui/TestimonialCard";
import type {
  Testimonial,
  TestimonialSectionContent,
} from "@/types/testimonial-section-content";

const DEFAULT_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 400"><rect width="225" height="400" fill="%23222222"/></svg>';

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { videoUrl: "", posterUrl: DEFAULT_POSTER, alt: "Customer testimonial video" },
  { videoUrl: "", posterUrl: DEFAULT_POSTER, alt: "Customer testimonial video" },
  { videoUrl: "", posterUrl: DEFAULT_POSTER, alt: "Customer testimonial video" },
];

const DEFAULT_CONTENT: TestimonialSectionContent = {
  heading: "What our customers say",
  testimonials: DEFAULT_TESTIMONIALS,
};

type TestimonialSectionProps = {
  content?: TestimonialSectionContent;
};

export default function Testimonial({
  content = DEFAULT_CONTENT,
}: TestimonialSectionProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = cardsRef.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby={content.heading ? "testimonial-heading" : undefined}
      aria-label={content.heading ? undefined : "Testimonials"}
      className="flex w-full justify-center overflow-hidden bg-base-black px-6 py-20 text-base-white sm:px-10 lg:min-h-[var(--size-testimonial-section-height)] lg:px-0 lg:pb-0 lg:pt-[var(--spacing-testimonial-section-offset-top)]"
    >
      <div
        className="flex w-full max-w-[var(--size-testimonial-section-inner-width)] flex-col items-center"
        style={{
          gap: "var(--spacing-testimonial-section-gap)",
        }}
      >
        <div className="flex w-full flex-col items-start gap-12 lg:[gap:var(--spacing-testimonial-section-stack-gap)]">
          {content.heading ? (
            <h2
              id="testimonial-heading"
              className="w-full text-center font-display text-heading-4 text-base-white"
            >
              {content.heading}
            </h2>
          ) : null}

          <div
            ref={cardsRef}
            className="flex w-full flex-wrap items-center justify-center"
            style={{
              gap: "var(--spacing-testimonial-section-cards-gap)",
            }}
          >
            {content.testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name ?? "testimonial"}-${index}`}
                style={{
                  transform: inView ? "translateX(0)" : "translateX(-100vw)",
                  opacity: inView ? 1 : 0,
                  transition:
                    "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out",
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <TestimonialCard
                  videoUrl={testimonial.videoUrl}
                  posterUrl={testimonial.posterUrl}
                  alt={testimonial.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
