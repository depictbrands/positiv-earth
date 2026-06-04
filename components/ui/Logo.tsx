import Link from "next/link";

type LogoProps = {
  variant?: "header" | "footer";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Logo({
  variant = "header",
  className,
  imageClassName,
}: LogoProps) {
  const textClass =
    variant === "footer"
      ? "font-display text-footer-logo text-base-white"
      : "font-display text-header-logo text-base-white";

  return (
    <Link
      href="/"
      aria-label="Positiv Earth home"
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white",
        className,
      )}
    >
      <span className={cn(textClass, imageClassName)}>[logo]</span>
    </Link>
  );
}
