"use client";

import Image from "next/image";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { ServicesHeroContent } from "@/types/services-hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23bfe3f2"/><stop offset="0.55" stop-color="%236fae6a"/><stop offset="1" stop-color="%232f4a2c"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><path d="M0 540C220 470 360 520 540 470C700 425 860 470 1040 420C1220 370 1360 410 1512 360V982H0V540Z" fill="%23507a3f"/><path d="M0 680C200 630 340 675 520 630C690 588 880 625 1040 580C1220 530 1380 565 1512 520V982H0V680Z" fill="%2335552c"/><rect y="780" width="1512" height="202" fill="%231b2a16" fill-opacity="0.35"/></svg>';

const DEFAULT_CONTENT: ServicesHeroContent = {
  headline: "Luxury Cultural-First Planning",
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Lush green valley viewed from inside a cave opening",
};

type ServicesHeroProps = {
  content?: ServicesHeroContent;
};

function resolveServicesHeroContent(
  content?: ServicesHeroContent,
): ServicesHeroContent {
  return {
    headline: content?.headline?.trim() || DEFAULT_CONTENT.headline,
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || DEFAULT_CONTENT.backgroundImageAlt,
  };
}

// The headline is a staggered three-word display (Figma node 731:429/432/433):
// a small lead word, a large emphasized middle word, and a small trailing word.
// We derive the three parts from the single headline string so the CMS field
// stays a plain string. "Cultural-First" is one (hyphenated) token, so the
// default "Luxury Cultural-First Planning" splits cleanly into three.
function splitHeadline(headline: string): {
  lead: string;
  emphasis: string;
  trail: string;
} {
  const words = headline.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 3) {
    return {
      lead: words[0],
      emphasis: words.slice(1, -1).join(" "),
      trail: words[words.length - 1],
    };
  }

  if (words.length === 2) {
    return { lead: words[0], emphasis: words[1], trail: "" };
  }

  return { lead: "", emphasis: words[0] ?? "", trail: "" };
}

export default function ServicesHero({ content }: ServicesHeroProps) {
  const resolved = resolveServicesHeroContent(content);
  const { lead, emphasis, trail } = splitHeadline(resolved.headline);
  const navHidden = useHideOnScroll();

  // The top bar (Header + "Design Your Travel") matches the home hero exactly:
  // it pins to the viewport and slides up on downward scroll, back in on up.
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
          <QuizEntryButton href="/design-your-travel">Design Your Travel</QuizEntryButton>
        </div>
      </div>

      {/* Top bar — mobile / tablet: pinned, hides/reveals with scroll direction */}
      <div
        className={`fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 lg:hidden ${topBarTransition} ${topBarTransform}`}
      >
        <Header />
        <QuizEntryButton href="/design-your-travel">Design Your Travel</QuizEntryButton>
      </div>

      {/* Hero title — staggered display composition (Figma node 731:429/432/433):
          small lead word, large emphasized middle, small trailing word. The
          desktop percentages reproduce each word's center point within the
          1512×982 frame so the layout scales fluidly; below lg it collapses to a
          centered stack. A single sr-only <h1> carries the full title. */}
      <h1 className="relative z-10 flex w-full flex-1 flex-col font-display text-base-white">
        <span className="sr-only">{resolved.headline}</span>

        {/* Mobile / tablet: centered stack */}
        <span
          aria-hidden="true"
          className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center lg:hidden"
        >
          {lead ? <span className="text-heading-2">{lead}</span> : null}
          {emphasis ? <span className="text-heading-1">{emphasis}</span> : null}
          {trail ? <span className="text-heading-2">{trail}</span> : null}
        </span>

        {/* Desktop: staggered diagonal composition */}
        <span
          aria-hidden="true"
          className="absolute inset-0 hidden lg:block"
        >
          {lead ? (
            <span className="absolute left-[32.14%] top-[35.39%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-heading-2">
              {lead}
            </span>
          ) : null}
          {emphasis ? (
            <span className="absolute left-[50.23%] top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-heading-1">
              {emphasis}
            </span>
          ) : null}
          {trail ? (
            <span className="absolute left-[53.47%] top-[64.61%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-heading-2">
              {trail}
            </span>
          ) : null}
        </span>
      </h1>
    </section>
  );
}
