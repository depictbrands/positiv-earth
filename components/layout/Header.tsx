"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";

import Logo from "@/components/ui/Logo";

const NAV_ITEMS = [
  { label: "About" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

type HeaderProps = {
  className?: string;
  style?: CSSProperties;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const glassStyle: CSSProperties = {
  backgroundColor: "var(--color-header-glass-surface)",
  border: "1px solid var(--color-header-glass-border)",
  backdropFilter: "blur(var(--blur-header-glass))",
  WebkitBackdropFilter: "blur(var(--blur-header-glass))",
};

// The hover / active pill is half the bar's corner radius and keeps an equal
// `offset` gap to the bar on top, bottom and (for the leftmost item) the left,
// so it nests concentrically inside the rounded header.
const PILL_CORNER = "calc(var(--radius-header-corner) / 2)";
const PILL_OFFSET = "var(--spacing-header-active-pill-offset)";

const pillClassName =
  "pointer-events-none absolute opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100";

const pillVisualStyle: CSSProperties = {
  borderRadius: PILL_CORNER,
  backgroundColor: "var(--color-header-active-pill)",
};

// Every desktop item shares the active pill's footprint: pill-width plus an
// `offset` gutter on each side, so the nested pill is exactly
// `--size-header-active-pill-width` wide with the label centered over it.
const navCellStyle: CSSProperties = {
  width:
    "calc(var(--size-header-active-pill-width) + 2 * var(--spacing-header-active-pill-offset))",
};

const navButtonClassName =
  "relative z-10 inline-flex items-center justify-center font-body text-nav text-base-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white";

type HeaderNavButtonProps = {
  children: ReactNode;
  href?: string;
  isActive?: boolean;
  onNavigate?: () => void;
  // "fixed": pill matches the design's pill-width and nests an equal `offset`
  // gap on every side — shared by every desktop item so they all read like the
  // active "About" pill. "menu": mobile stacked item — pill expands `offset`
  // around the full-width button.
  variant?: "fixed" | "menu";
  className?: string;
  buttonClassName?: string;
  style?: CSSProperties;
};

const PILL_OFFSET_NEG = `calc(-1 * ${PILL_OFFSET})`;

const pillInsetByVariant: Record<
  NonNullable<HeaderNavButtonProps["variant"]>,
  CSSProperties
> = {
  // Inset equally on all sides → offset gap top/bottom/left and a pill that is
  // exactly `--size-header-active-pill-width` wide.
  fixed: { top: PILL_OFFSET, right: PILL_OFFSET, bottom: PILL_OFFSET, left: PILL_OFFSET },
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
  const wrapperClassName =
    variant === "menu"
      ? "group relative"
      : "group relative flex h-full items-center justify-center";

  const pillStyle: CSSProperties = {
    ...pillVisualStyle,
    ...pillInsetByVariant[variant],
  };

  return (
    <div className={cn(wrapperClassName, className)} style={style}>
      <span
        aria-hidden="true"
        className={cn(pillClassName, isActive && "opacity-100")}
        style={pillStyle}
      />

      {href ? (
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          className={cn(navButtonClassName, buttonClassName)}
          onClick={onNavigate}
        >
          {children}
        </Link>
      ) : (
        <button
          type="button"
          aria-current={isActive ? "page" : undefined}
          className={cn(navButtonClassName, buttonClassName)}
          onClick={onNavigate}
        >
          {children}
        </button>
      )}
    </div>
  );
}

export default function Header({ className, style }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setOpen(false);

  return (
    <header className={cn("relative", className)} style={style}>
      {/* Desktop: glass pill navigation */}
      <div
        className="relative hidden lg:block lg:w-fit lg:max-w-full"
        style={{
          height: "var(--size-header-height)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-header-corner"
          style={glassStyle}
        />

        <nav
          aria-label="Primary"
          className="relative z-10 flex h-full items-center gap-2 text-base-white"
          style={{
            paddingRight: "var(--spacing-header-menu-right)",
          }}
        >
          <HeaderNavButton style={navCellStyle}>
            {NAV_ITEMS[0].label}
          </HeaderNavButton>

          <HeaderNavButton
            style={navCellStyle}
            href={NAV_ITEMS[1].href}
            isActive={pathname === NAV_ITEMS[1].href}
          >
            {NAV_ITEMS[1].label}
          </HeaderNavButton>

          <Logo variant="header" priority className="shrink-0" />

          {NAV_ITEMS.slice(2).map((item) => (
            <HeaderNavButton
              key={item.label}
              style={navCellStyle}
              href={"href" in item ? item.href : undefined}
              isActive={"href" in item ? pathname === item.href : false}
            >
              {item.label}
            </HeaderNavButton>
          ))}
        </nav>
      </div>

      {/* Mobile / tablet: compact glass bar with a toggleable menu */}
      <div className="relative lg:hidden">
        <div
          className="flex items-center gap-4 rounded-header-corner px-5"
          style={{ height: "var(--size-header-height)", ...glassStyle }}
        >
          <Logo variant="header" priority />

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto inline-flex size-9 items-center justify-center text-base-white transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
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

        {open ? (
          <nav
            id="mobile-nav"
            aria-label="Primary"
            className="absolute left-0 z-30 mt-2 flex min-w-48 flex-col gap-1 rounded-[var(--radius-header-active-pill-corner)] p-2 text-base-white"
            style={glassStyle}
          >
            {NAV_ITEMS.map((item) => (
              <HeaderNavButton
                key={item.label}
                variant="menu"
                className="w-full"
                buttonClassName="w-full px-4 py-2 text-left"
                href={"href" in item ? item.href : undefined}
                isActive={"href" in item ? pathname === item.href : false}
                onNavigate={closeMenu}
              >
                {item.label}
              </HeaderNavButton>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
