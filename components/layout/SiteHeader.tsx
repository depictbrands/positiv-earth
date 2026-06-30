"use client";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { LogoContent } from "@/types/logo-content";

type SiteHeaderProps = {
  logo?: LogoContent;
};

// Single site-wide top bar rendered once outside <main> (see SiteChrome) as the
// page's one top-level banner landmark — logo, nav, and quiz CTA all live
// inside this <header>. Pins to the viewport and slides up on downward scroll,
// back in on upward scroll.
export default function SiteHeader({ logo }: SiteHeaderProps) {
  const navHidden = useHideOnScroll();

  const topBarTransition =
    "transition-transform duration-300 ease-out will-change-transform";
  const topBarTransform = navHidden ? "-translate-y-[200%]" : "translate-y-0";

  return (
    <header
      className={`header-scale fixed inset-x-0 top-0 z-50 px-5 pt-5 sm:px-8 lg:px-0 lg:pt-6 ${topBarTransition} ${topBarTransform}`}
    >
      <div className="relative w-full">
        <div className="flex items-start justify-between gap-4 lg:block">
          <div className="min-w-0 flex-1 lg:w-full lg:flex lg:justify-center">
            <Header logo={logo} />
          </div>
          {/* Anchored to the right with the same inset as the logo's left, so
              the header stays symmetric (equal gap to both viewport edges) at
              every width instead of drifting via a left-percentage. */}
          <div className="shrink-0 lg:absolute lg:top-0 lg:right-[var(--spacing-header-inset-x)]">
            <QuizEntryButton href="/design-your-travel">
              Design Your Travel
            </QuizEntryButton>
          </div>
        </div>
      </div>
    </header>
  );
}
