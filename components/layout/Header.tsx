"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import Logo from "@/components/ui/Logo";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useAdaptiveLogoSurface } from "@/hooks/useAdaptiveLogoSurface";
import type { LogoContent } from "@/types/logo-content";

/** Editorial CTA shown bottom-right of the mobile menu overlay. */
type QuizCta = { href: string; label: string };

type NavItem = {
  label: string;
  href: string;
  pillVariant?: "fixed" | "content";
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Destinations",
    href: "/destinations",
    pillVariant: "content",
  },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

type HeaderProps = {
  className?: string;
  style?: CSSProperties;
  logo?: LogoContent;
  /** Quiz CTA rendered inside the mobile menu overlay (bottom-right). */
  quizCta?: QuizCta;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// True only after client mount (false during SSR/first paint), so the menu
// overlay portal — which needs document.body — never runs on the server.
const subscribeNoop = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

const glassStyle: CSSProperties = {
  backgroundColor: "var(--color-header-glass-surface)",
  backdropFilter: "blur(var(--blur-header-glass))",
  WebkitBackdropFilter: "blur(var(--blur-header-glass))",
};

// The hover / active pill is half the header's corner radius and keeps an equal
// `offset` gap on top, bottom and (for the leftmost item) the left, so it reads
// as nested concentrically inside the header.
const PILL_CORNER = "calc(var(--radius-header-corner) / 2)";
const PILL_OFFSET = "var(--spacing-header-active-pill-offset)";

const pillClassName =
  "pointer-events-none absolute bg-base-white/15 backdrop-blur-header-nav-pill opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100";

const pillVisualStyle: CSSProperties = {
  borderRadius: PILL_CORNER,
};

// Every desktop item shares the active pill's footprint: pill-width plus an
// `offset` gutter on each side, so the nested pill is exactly
// `--size-header-active-pill-width` wide with the label centered over it.
const navCellStyle: CSSProperties = {
  width:
    "calc(var(--size-header-active-pill-width) + 2 * var(--spacing-header-active-pill-offset))",
};

const navButtonClassName =
  "relative font-body text-nav text-base-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white";

type HeaderNavButtonProps = {
  children: ReactNode;
  href?: string;
  isActive?: boolean;
  onNavigate?: () => void;
  // "fixed": pill matches the design's pill-width and nests an equal `offset`
  // gap on every side — shared by every desktop item so they all read like the
  // active "About" pill. "content": auto-width pill with
  // `--spacing-header-nav-pill-padding-x` between label and border.
  // "menu": mobile stacked item — pill expands `offset` around the full-width
  // button.
  variant?: "fixed" | "content" | "menu";
  className?: string;
  buttonClassName?: string;
  style?: CSSProperties;
};

const PILL_OFFSET_NEG = `calc(-1 * ${PILL_OFFSET})`;

const outerClassByVariant: Record<
  NonNullable<HeaderNavButtonProps["variant"]>,
  string
> = {
  fixed:
    "group relative flex h-full w-full items-center justify-center",
  content:
    "group relative flex h-full w-auto items-center justify-center px-[var(--spacing-header-nav-pill-padding-x)]",
  menu: "group relative flex w-full items-center",
};

const pillInsetByVariant: Record<
  NonNullable<HeaderNavButtonProps["variant"]>,
  CSSProperties
> = {
  // Inset equally on all sides → offset gap top/bottom/left and a pill that is
  // exactly `--size-header-active-pill-width` wide.
  fixed: { top: PILL_OFFSET, right: PILL_OFFSET, bottom: PILL_OFFSET, left: PILL_OFFSET },
  // Horizontal padding on the link supplies the label-to-border gap; only
  // inset top/bottom so the pill spans the padded width.
  content: { top: PILL_OFFSET, right: 0, bottom: PILL_OFFSET, left: 0 },
  // Expand `offset` around the full-width mobile button.
  menu: { top: PILL_OFFSET_NEG, right: PILL_OFFSET_NEG, bottom: PILL_OFFSET_NEG, left: PILL_OFFSET_NEG },
};

function HeaderNavButton({
  children,
  href,
  isActive = false,
  onNavigate,
  variant = "fixed",
  className,
  buttonClassName,
  style,
}: HeaderNavButtonProps) {
  const pillStyle: CSSProperties = {
    ...pillVisualStyle,
    ...pillInsetByVariant[variant],
  };

  const interactiveClassName = cn(
    outerClassByVariant[variant],
    navButtonClassName,
    buttonClassName,
    className,
  );

  const label = <span className="relative z-10">{children}</span>;

  const pill = (
    <span
      aria-hidden="true"
      className={cn(pillClassName, isActive && "opacity-100")}
      style={pillStyle}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={interactiveClassName}
        style={style}
        onClick={onNavigate}
      >
        {pill}
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={interactiveClassName}
      style={style}
      onClick={onNavigate}
    >
      {pill}
      {label}
    </button>
  );
}

export default function Header({
  className,
  style,
  logo,
  quizCta,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  // The overlay is portaled to <body> so it escapes the header's transform
  // (the slide-on-scroll translate makes the header a containing block for
  // fixed descendants, which would otherwise clip a fixed inset-0 overlay to
  // the bar). Gate the portal on mount so SSR/first paint stay identical.
  const mounted = useHasMounted();
  const pathname = usePathname();
  const logoAnchorRef = useRef<HTMLDivElement>(null);
  const logoSurface = useAdaptiveLogoSurface(logoAnchorRef);

  const closeMenu = () => setOpen(false);

  // While the menu is open: lock body scroll and close on Escape.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={cn("relative w-full", className)} style={style}>
      {/* Desktop: logo pinned left, glass pill nav centered in the viewport */}
      <div
        className="relative hidden lg:flex lg:w-full lg:items-center lg:px-[var(--spacing-header-inset-x)]"
        style={{
          height: "var(--size-header-height)",
        }}
      >
        <div ref={logoAnchorRef} className="relative z-10 shrink-0">
          <Logo
            variant="header"
            priority
            imageUrl={logo?.headerLogoUrl}
            imageAlt={logo?.headerLogoAlt}
            surface={logoSurface}
          />
        </div>

        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ height: "var(--size-header-height)" }}
        >
          <div className="relative h-full w-fit max-w-full">
            <nav
              aria-label="Main navigation"
              className="relative z-10 flex h-full items-center gap-2 text-base-white"
            >
              {NAV_ITEMS.map((item) => (
                <HeaderNavButton
                  key={item.label}
                  style={item.pillVariant === "content" ? undefined : navCellStyle}
                  variant={item.pillVariant ?? "fixed"}
                  href={item.href}
                  isActive={pathname === item.href}
                >
                  {item.label}
                </HeaderNavButton>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: logo + hamburger centered together in a glass bar.
          The menu opens as a full-viewport overlay (portaled below). */}
      <div className="lg:hidden">
        <div
          className="relative z-50 flex items-center justify-center gap-2 rounded-header-corner px-4 sm:gap-4 sm:px-5"
          style={{ height: "var(--size-header-height)", ...glassStyle }}
        >
          <Logo
            variant="header"
            priority
            imageUrl={logo?.headerLogoUrl}
            imageAlt={logo?.headerLogoAlt}
            surface={logoSurface}
          />

          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-9 items-center justify-center text-base-white transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M6 6 18 18" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Full-viewport menu overlay — fades in/out (never an instant swap) and
          is invisible + untabbable when closed. Portaled to <body> so it fills
          the viewport instead of being clipped by the header's transform. */}
      {mounted
        ? createPortal(
            <div
              id="mobile-nav"
              aria-hidden={!open}
              onClick={(event) => {
                // Tap on the empty backdrop (not a link/CTA) closes the menu.
                if (event.target === event.currentTarget) closeMenu();
              }}
              className={cn(
                "fixed inset-0 z-40 flex flex-col px-6 pb-12 pt-[calc(var(--size-header-height)+5rem)] transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden",
                open ? "visible opacity-100" : "invisible opacity-0",
              )}
              style={{
                backgroundColor: "var(--color-quiz-overlay)",
                backdropFilter: "blur(var(--blur-header-glass))",
                WebkitBackdropFilter: "blur(var(--blur-header-glass))",
              }}
            >
              <nav
                aria-label="Main navigation menu"
                className="flex flex-col items-center gap-6 text-center"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={closeMenu}
                      className={cn(
                        "font-display text-heading-3 text-base-white transition-opacity focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white",
                        isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {quizCta ? (
                <div className="mt-auto flex justify-end">
                  <QuizEntryButton href={quizCta.href} onClick={closeMenu}>
                    {quizCta.label}
                  </QuizEntryButton>
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
