import type {
  Service,
  ThreeServicesContent,
} from "@/types/three-services-content";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const DEFAULT_COACHING_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1216 678"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%2390c6e8"/><stop offset="0.5" stop-color="%23b9a06a"/><stop offset="1" stop-color="%23556b3a"/></linearGradient></defs><rect width="1216" height="678" fill="url(%23g)"/><path d="M0 300C180 230 360 250 540 200C720 150 900 200 1216 140V678H0Z" fill="%23e9eef2" fill-opacity="0.35"/><path d="M0 420C200 370 420 400 620 360C840 315 1020 350 1216 320V678H0Z" fill="%235f7a3c"/></svg>';

const DEFAULT_BOOKING_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1216 678"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23bfe0f2"/><stop offset="0.6" stop-color="%23a99b86"/><stop offset="1" stop-color="%236b6256"/></linearGradient></defs><rect width="1216" height="678" fill="url(%23g)"/><rect x="120" y="360" width="980" height="220" fill="%238a8073" fill-opacity="0.6"/><path d="M0 470C220 440 460 470 700 440C940 410 1080 440 1216 420V678H0Z" fill="%23577a3e"/></svg>';

const DEFAULT_ASSISTANCE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1216 678"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23a9d4ef"/><stop offset="0.5" stop-color="%237bae6a"/><stop offset="1" stop-color="%2335552c"/></linearGradient></defs><rect width="1216" height="678" fill="url(%23g)"/><path d="M0 280C200 220 420 250 640 210C860 170 1040 210 1216 170V678H0Z" fill="%235f8a45"/><path d="M0 430C220 390 460 420 700 390C940 360 1080 390 1216 370V678H0Z" fill="%2335552c"/></svg>';

const DEFAULT_CONTENT: ThreeServicesContent = {
  services: [
    {
      title: "Customized Coaching",
      description:
        "Guided, one-on-one preparation tailored to your destination, needs, and travel style.",
      imageUrl: DEFAULT_COACHING_IMAGE,
      imageAlt: "Andean valley with grazing llamas beneath snow-capped peaks",
    },
    {
      title: "Personalized Booking",
      description:
        "Thoughtfully planned and handled travel arrangements designed around you.",
      imageUrl: DEFAULT_BOOKING_IMAGE,
      imageAlt: "Ancient stone ruins along a grassy hillside path",
    },
    {
      title: "Curated Assistance",
      description:
        "Ongoing support with practical insights, tools, and real-life guidance every step of the way.",
      imageUrl: DEFAULT_ASSISTANCE_IMAGE,
      imageAlt: "Terraced green valley framed by mountains",
    },
  ],
};

// First word renders white (over the photo); the remainder renders black.
function splitTitle(title: string): [string, string] {
  const trimmed = title.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) {
    return [trimmed, ""];
  }
  return [trimmed.slice(0, spaceIndex), trimmed.slice(spaceIndex + 1)];
}

type ServiceRowProps = {
  service: Service;
  // Even rows mirror the layout: image to the right, title straddling the
  // image's bottom-right, description to the left.
  reversed?: boolean;
};

function ServiceRow({ service, reversed = false }: ServiceRowProps) {
  const [leadWord, restWords] = splitTitle(service.title);

  return (
    <article
      className={cn(
        "relative flex flex-col",
        reversed ? "items-end" : "items-start",
      )}
    >
      {/* Photo — full width on mobile, 80.42% (1216/1512) on desktop, rounded
          only on the inner corner so it bleeds to the outer edge. */}
      <div
        className={cn(
          "relative z-10 aspect-[608/339] w-full overflow-hidden lg:w-[80.42%]",
          reversed
            ? "rounded-l-[var(--radius-card-corner)]"
            : "rounded-r-[var(--radius-card-corner)]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.imageUrl}
          alt={service.imageAlt}
          className="block h-full w-full object-cover"
        />
        {reversed ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1]"
            style={{
              backgroundColor: "var(--color-three-services-image-overlay)",
            }}
          />
        ) : null}
        {/* Lead word aligns horizontally with the black line in the h3 below. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 z-10 font-display text-heading-4 text-base-white",
            reversed
              ? "right-0 w-max text-left lg:mr-[var(--spacing-three-services-caption-inset)]"
              : "left-0 lg:ml-[var(--spacing-three-services-caption-inset)]",
          )}
        >
          {reversed ? (
            leadWord
          ) : (
            <>
              {/* Match the h3 width so the lead word's right edge lines up with the black word. */}
              {restWords ? (
                <span
                  className="block opacity-0 select-none"
                  aria-hidden="true"
                >
                  {restWords}
                </span>
              ) : null}
              <span className="block text-right">{leadWord}</span>
            </>
          )}
        </span>
      </div>

      {/* Caption lifts up by one title line so the black remainder drops just
          below the photo while the white lead word stays on the image above. */}
      <div
        className={cn(
          "relative z-0 flex w-full flex-col gap-[var(--spacing-three-services-caption-gap)] mt-[calc(var(--spacing-three-services-title-lift)*-1)] lg:items-end lg:px-[var(--spacing-three-services-caption-inset)]",
          reversed ? "items-end lg:flex-row-reverse" : "items-start lg:flex-row",
        )}
      >
        <h3
          aria-label={service.title}
          className={cn(
            "shrink-0 font-display text-heading-4",
            reversed ? "text-left" : "text-right",
          )}
        >
          {/* Invisible spacer keeps the black line aligned with the design grid. */}
          <span className="block opacity-0 select-none" aria-hidden="true">
            {leadWord}
          </span>
          {restWords ? (
            <span className="block text-base-black">{restWords}</span>
          ) : null}
        </h3>

        <p className="w-full font-body text-turntable-tag text-base-black lg:w-auto lg:flex-1">
          {service.description}
        </p>
      </div>
    </article>
  );
}

type ThreeServicesProps = {
  content?: ThreeServicesContent;
};

export default function ThreeServices({
  content = DEFAULT_CONTENT,
}: ThreeServicesProps) {
  const services = content.services?.length
    ? content.services
    : DEFAULT_CONTENT.services;

  return (
    <section className="w-full bg-base-white">
      <div className="mx-auto flex w-full max-w-[var(--size-three-services-width)] flex-col gap-[var(--spacing-three-services-row-gap)] px-6 pt-[var(--spacing-three-services-top)] pb-[var(--spacing-three-services-bottom)] sm:px-8 lg:px-0">
        {services.map((service, index) => (
          <ServiceRow
            key={`${service.title}-${index}`}
            service={service}
            reversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
