"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type LottiePlayerProps = {
  /** Path to the Lottie JSON (served from /public), e.g. "/quiz/quotes-motion.json". */
  src: string;
  /** Accessible label for the animation. */
  ariaLabel?: string;
  loop?: boolean;
  className?: string;
  style?: CSSProperties;
};

// Thin wrapper around lottie-web. The animation JSON is fetched at runtime via
// the `path` option (not bundled), and the player is fully torn down on unmount.
// Under reduced-motion the animation loads paused on its first frame so the
// artwork (and any baked-in copy) still renders without movement.
export default function LottiePlayer({
  src,
  ariaLabel,
  loop = true,
  className,
  style,
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    // lottie-web pulls in browser-only globals, so import it lazily on the client.
    let animation: { destroy: () => void } | null = null;

    import("lottie-web").then(({ default: lottie }) => {
      if (destroyed || !containerRef.current) return;
      animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: !reduced && loop,
        autoplay: !reduced,
        path: src,
      });
    });

    return () => {
      destroyed = true;
      animation?.destroy();
    };
  }, [src, loop, reduced]);

  return (
    <div
      ref={containerRef}
      {...(ariaLabel
        ? { role: "img" as const, "aria-label": ariaLabel }
        : { "aria-hidden": true as const })}
      className={className}
      style={style}
    />
  );
}
