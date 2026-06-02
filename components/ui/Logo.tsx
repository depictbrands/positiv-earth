import Image from "next/image";
import Link from "next/link";

const LOGO_WIDTH = 649;
const LOGO_HEIGHT = 141;

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
  priority = false,
}: LogoProps) {
  const heightClass =
    variant === "footer" ? "h-[var(--text-footer-logo)]" : "h-[var(--text-header-logo)]";

  return (
    <Link
      href="/"
      aria-label="Positiv Earth home"
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="Positiv Earth"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        className={cn("w-auto brightness-0 invert", heightClass, imageClassName)}
      />
    </Link>
  );
}
