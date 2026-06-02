import Image from "next/image";

type TestimonialCardProps = {
  avatarAlt: string;
  avatarUrl: string;
  className?: string;
  name: string;
  quote: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function TestimonialCard({
  avatarAlt,
  avatarUrl,
  className,
  name,
  quote,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "relative w-full max-w-[var(--size-testimonial-card-width)] overflow-hidden rounded-card-corner bg-base-white lg:max-w-none",
        className,
      )}
      style={{
        minHeight: "var(--size-testimonial-card-height)",
      }}
    >
      <div
        className="flex w-full flex-col items-start"
        style={{
          paddingInline: "var(--spacing-testimonial-card-inset-x)",
          paddingTop: "var(--spacing-testimonial-card-inset-top)",
          paddingBottom: "var(--spacing-testimonial-card-inset-x)",
          gap: "var(--spacing-testimonial-card-gap)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            width: "var(--size-testimonial-card-avatar-size)",
            height: "var(--size-testimonial-card-avatar-size)",
          }}
        >
          <Image src={avatarUrl} alt={avatarAlt} fill className="object-cover" />
        </div>

        <h3 className="w-full font-body text-testimonial-card-name text-base-black">
          {name}
        </h3>

        <p className="w-full font-body text-testimonial-card-quote text-base-black">
          {quote}
        </p>
      </div>
    </article>
  );
}
