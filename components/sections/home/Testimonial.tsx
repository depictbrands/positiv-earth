import TestimonialCard from "@/components/ui/TestimonialCard";
import type {
  Testimonial,
  TestimonialSectionContent,
} from "@/types/testimonial-section-content";

const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="%23c7c7c7"/></svg>';

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Melanie L.",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Et hac vitae diam gravida sed. Eu volutpat non odio consectetur. Nec ultricies.",
    avatarUrl: DEFAULT_AVATAR,
    avatarAlt: "Portrait placeholder for Melanie L.",
  },
  {
    name: "Melanie L.",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Et hac vitae diam gravida sed. Eu volutpat non odio consectetur. Nec ultricies.",
    avatarUrl: DEFAULT_AVATAR,
    avatarAlt: "Portrait placeholder for Melanie L.",
  },
  {
    name: "Melanie L.",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Et hac vitae diam gravida sed. Eu volutpat non odio consectetur. Nec ultricies.",
    avatarUrl: DEFAULT_AVATAR,
    avatarAlt: "Portrait placeholder for Melanie L.",
  },
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
  return (
    <section
      className="flex w-full justify-center overflow-hidden bg-base-black px-6 py-20 text-base-white sm:px-10 lg:min-h-[var(--size-testimonial-section-height)] lg:px-0 lg:pb-0 lg:pt-[var(--spacing-testimonial-section-offset-top)]"
    >
      <div
        className="flex w-full max-w-[var(--size-testimonial-section-inner-width)] flex-col items-center"
        style={{
          gap: "var(--spacing-testimonial-section-gap)",
        }}
      >
        <div
          className="flex w-full flex-col items-start gap-12 lg:[gap:var(--spacing-testimonial-section-stack-gap)]"
        >
          {content.heading ? (
            <h2 className="w-full text-center font-display text-heading-4 text-base-white">
              {content.heading}
            </h2>
          ) : null}

          <div
            className="grid w-full grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 lg:justify-items-stretch"
            style={{
              gap: "var(--spacing-testimonial-section-cards-gap)",
            }}
          >
            {content.testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                name={testimonial.name}
                quote={testimonial.quote}
                avatarUrl={testimonial.avatarUrl}
                avatarAlt={testimonial.avatarAlt}
              />
            ))}
          </div>
        </div>

        <div
          aria-label="Testimonial pagination"
          className="flex items-center justify-center"
          style={{
            width: "var(--size-testimonial-pagination-width)",
            height: "var(--size-testimonial-pagination-height)",
            gap: "var(--spacing-testimonial-pagination-gap)",
          }}
        >
          {content.testimonials.slice(0, 3).map((testimonial, index) => (
            <span
              key={`${testimonial.name}-dot-${index}`}
              aria-hidden="true"
              className="rounded-full"
              style={{
                width: "var(--size-testimonial-pagination-dot-size)",
                height: "var(--size-testimonial-pagination-dot-size)",
                backgroundColor:
                  index === 0
                    ? "var(--color-base-white)"
                    : "var(--color-testimonial-pagination-inactive)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
