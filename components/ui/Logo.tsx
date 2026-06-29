import Link from "next/link";

type LogoProps = {
  variant?: "header" | "footer";
  className?: string;
  imageClassName?: string;
  imageUrl?: string;
  imageAlt?: string;
  priority?: boolean;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Logo({
  variant = "header",
  className,
  imageClassName,
  imageUrl,
  imageAlt = "Positiv Earth",
  priority = false,
}: LogoProps) {
  const textClass =
    variant === "footer"
      ? "font-display text-footer-logo text-base-white"
      : "font-display text-header-logo text-base-white";

  const showHeaderImage =
    variant === "header" && Boolean(imageUrl?.trim());

  return (
    <Link
      href="/"
      aria-label="Positiv Earth home"
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white",
        className,
      )}
    >
      {showHeaderImage ? (
        // SVG/PNG from Sanity — native <img> keeps vector logos crisp.
        <img
          src={imageUrl}
          alt={imageAlt}
          width={240}
          height={56}
          fetchPriority={priority ? "high" : undefined}
          className={cn(
            "h-[var(--size-header-height)] w-auto max-w-none object-contain object-left",
            imageClassName,
          )}
        />
      ) : (
        <span aria-hidden="true" className={cn(textClass, imageClassName)}>
          [logo]
        </span>
      )}
    </Link>
  );
}
