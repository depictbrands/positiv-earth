"use client";

import { useState, type CSSProperties } from "react";

const NAV_ITEMS = ["About", "Services", "FAQ", "Contact"] as const;

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

export default function Header({ className, style }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("relative", className)} style={style}>
      {/* Desktop: glass pill navigation */}
      <div
        className="relative hidden lg:block"
        style={{
          width: "var(--size-header-width)",
          height: "var(--size-header-height)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-header-corner"
          style={glassStyle}
        />

        <div
          aria-hidden="true"
          className="absolute"
          style={{
            left: "var(--spacing-header-active-pill-offset)",
            top: "var(--spacing-header-active-pill-offset)",
            width: "var(--size-header-active-pill-width)",
            height: "var(--size-header-active-pill-height)",
            borderRadius: "var(--radius-header-active-pill-corner)",
            backgroundColor: "var(--color-header-active-pill)",
          }}
        />

        <nav
          aria-label="Primary"
          className="absolute inset-y-0 z-10 flex items-center text-base-white"
          style={{
            left: "var(--spacing-header-menu-left)",
            right: "var(--spacing-header-menu-right)",
            gap: "var(--spacing-header-menu-gap)",
          }}
        >
          <button
            type="button"
            aria-current="page"
            className="inline-flex items-center justify-center font-body text-nav text-base-white transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-[var(--radius-header-active-pill-corner)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
            style={{
              width: "var(--size-header-active-pill-width)",
              height: "var(--size-header-active-pill-height)",
            }}
          >
            About
          </button>

          <button
            type="button"
            className="font-body text-nav text-base-white transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-[var(--radius-header-active-pill-corner)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
          >
            Services
          </button>

          <span className="font-body text-header-logo text-base-white">[logo]</span>

          {NAV_ITEMS.slice(2).map((item) => (
            <button
              key={item}
              type="button"
              className="font-body text-nav text-base-white transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-[var(--radius-header-active-pill-corner)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile / tablet: compact glass bar with a toggleable menu */}
      <div className="relative lg:hidden">
        <div
          className="flex items-center gap-4 rounded-header-corner px-5"
          style={{ height: "var(--size-header-height)", ...glassStyle }}
        >
          <span className="font-body text-header-logo text-base-white">[logo]</span>

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
              <button
                key={item}
                type="button"
                className="rounded-[var(--radius-header-active-pill-corner)] px-4 py-2 text-left font-body text-nav text-base-white transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
              >
                {item}
              </button>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
