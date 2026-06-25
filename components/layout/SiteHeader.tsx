"use client";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

// Single site-wide top bar rendered once outside <main> (see SiteChrome) as the
// page's one top-level banner landmark — logo, nav, and quiz CTA all live
// inside this <header>. Pins to the viewport and slides up on downward scroll,
// back in on upward scroll.
export default function SiteHeader() {
  const navHidden = useHideOnScroll();

  const topBarTransition =
    "transition-transform duration-300 ease-out will-change-transform";
  const topBarTransform = navHidden ? "-translate-y-[200%]" : "translate-y-0";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-5 pt-5 sm:px-8 lg:px-0 lg:pt-6 ${topBarTransition} ${topBarTransform}`}
    >
      <div className="relative w-full">
        <div className="flex items-start justify-between gap-4 lg:block">
          <div className="min-w-0 flex-1 lg:w-full lg:flex lg:justify-center">
            <Header />
          </div>
          <div className="shrink-0 lg:absolute lg:top-0 lg:left-[82.0767195767%]">
            <QuizEntryButton href="/design-your-travel">
              Design Your Travel
            </QuizEntryButton>
          </div>
        </div>
      </div>
    </header>
  );
}
