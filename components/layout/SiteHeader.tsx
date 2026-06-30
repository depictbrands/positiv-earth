"use client";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { LogoContent } from "@/types/logo-content";

type SiteHeaderProps = {
  logo?: LogoContent;
};

const QUIZ_HREF = "/design-your-travel";
const QUIZ_LABEL = "Design Your Travel";

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
      className={`header-scale fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-8 lg:px-0 lg:pt-6 ${topBarTransition} ${topBarTransform}`}
    >
      <div className="relative w-full">
        {/* Mobile/tablet: the bar centers logo+hamburger and the menu opens as a
            full-viewport overlay (handled inside Header, with the quiz CTA at
            its bottom-right). Desktop reverts to centered nav + absolute CTA. */}
        <div className="w-full lg:flex lg:justify-center">
          <Header
            logo={logo}
            quizCta={{ href: QUIZ_HREF, label: QUIZ_LABEL }}
          />
        </div>
        {/* Desktop-only quiz CTA, anchored top-right with the same inset as the
            logo's left so the header stays symmetric. On mobile this CTA lives
            inside the menu overlay instead. */}
        <div className="hidden lg:absolute lg:top-0 lg:right-[var(--spacing-header-inset-x)] lg:block">
          <QuizEntryButton href={QUIZ_HREF}>{QUIZ_LABEL}</QuizEntryButton>
        </div>
      </div>
    </header>
  );
}
