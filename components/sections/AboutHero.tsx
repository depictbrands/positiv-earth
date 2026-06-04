"use client";

import Image from "next/image";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { AboutHeroContent } from "@/types/about-hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23f4a13c"/><stop offset="0.4" stop-color="%23c64b2c"/><stop offset="1" stop-color="%23792a3a"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><path d="M0 560L756 300L1512 560V982H0V560Z" fill="%23b8693a"/><path d="M0 600L300 500L620 600L900 500L1220 600L1512 510V982H0V600Z" fill="%23d98b3f"/><path d="M0 680L260 600L560 680L820 600L1120 680L1512 600V982H0V680Z" fill="%237f8a5b"/><path d="M0 760L300 690L600 760L900 690L1200 760L1512 690V982H0V760Z" fill="%23a23b32"/><path d="M0 840L320 780L640 840L960 780L1280 840L1512 790V982H0V840Z" fill="%23512a3e"/></svg>';

const DEFAULT_CONTENT: AboutHeroContent = {
  lead: "Meet",
  name: "Jorge",
  role: "Your Travel Expert & Cultural Connector",
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Rainbow Mountain in the Peruvian Andes at sunset",
};

type AboutHeroProps = {
  content?: AboutHeroContent;
};

function resolveAboutHeroContent(content?: AboutHeroContent): AboutHeroContent {
  return {
    lead: content?.lead?.trim() || DEFAULT_CONTENT.lead,
    name: content?.name?.trim() || DEFAULT_CONTENT.name,
    role: content?.role?.trim() || DEFAULT_CONTENT.role,
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || DEFAULT_CONTENT.backgroundImageAlt,
  };
}

export default function AboutHero({ content }: AboutHeroProps) {
  const resolved = resolveAboutHeroContent(content);
  const navHidden = useHideOnScroll();

  // The top bar (Header + "Design Your Travel") matches the other heroes
  // exactly: it pins to the viewport and slides up on downward scroll, back in
  // on up.
  const topBarTransition =
    "transition-transform duration-300 ease-out will-change-transform";
  const topBarTransform = navHidden ? "-translate-y-[200%]" : "translate-y-0";

  return (
    <section className="relative flex w-full flex-col overflow-hidden min-h-[100svh] lg:min-h-[var(--size-hero-height)]">
      <Image
        src={resolved.backgroundImageUrl}
        alt={resolved.backgroundImageAlt}
        fill
        className="object-cover"
        priority
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-hero-overlay)" }}
      />

      {/* Top bar — desktop: nav centered at the top, quiz button pinned right.
          Both pin to the viewport and hide/reveal with scroll direction. */}
      <div className="hidden lg:block">
        <div
          className={`fixed inset-x-0 top-6 z-50 flex justify-center ${topBarTransition} ${topBarTransform}`}
        >
          <Header />
        </div>

        <div
          className={`fixed top-6 z-50 ${topBarTransition} ${topBarTransform}`}
          style={{
            left: "82.0767195767%",
          }}
        >
          <QuizEntryButton>Design Your Travel</QuizEntryButton>
        </div>
      </div>

      {/* Top bar — mobile / tablet: pinned, hides/reveals with scroll direction */}
      <div
        className={`fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 lg:hidden ${topBarTransition} ${topBarTransform}`}
      >
        <Header />
        <QuizEntryButton>Design Your Travel</QuizEntryButton>
      </div>

      {/* Hero title — centered composition (Figma node 722:951): a small lead
          word ("Meet"), the large emphasized name ("JORGE"), and a small
          trailing role. The pieces flow in a centered, wrapping row baseline-
          aligned to the name; on the 1512px frame the role wraps under the
          name as in the design, and on small screens the words stack. A single
          sr-only <h1> carries the full readable title. */}
      <h1 className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 text-center font-display text-base-white">
        <span className="sr-only">{`${resolved.lead} ${resolved.name}, ${resolved.role}`}</span>

        <span
          aria-hidden="true"
          className="flex max-w-[var(--size-hero-content-width)] flex-wrap items-center justify-center gap-x-[var(--spacing-hero-headline-gap)] gap-y-2"
        >
          <span className="text-heading-3">{resolved.lead}</span>
          <span className="text-heading-1 uppercase">{resolved.name}</span>
          <span className="text-heading-3">{resolved.role}</span>
        </span>
      </h1>
    </section>
  );
}
