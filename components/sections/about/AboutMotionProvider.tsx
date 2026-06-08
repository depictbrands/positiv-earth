"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import AboutDebugOverlay from "./AboutDebugOverlay";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Sets up the single global scroll/progress source for the About page: Lenis
// smooth scroll driving GSAP ScrollTrigger (CLAUDE_AboutUI tech decisions).
// Under reduced motion, Lenis is skipped and native scroll is used. Mounts the
// dev-only debug overlay.
export default function AboutMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Native scroll only; still let ScrollTrigger compute resting/scrubbed
      // states so reduced-motion fallbacks render.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis();
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  return (
    <>
      {children}
      <AboutDebugOverlay />
    </>
  );
}
