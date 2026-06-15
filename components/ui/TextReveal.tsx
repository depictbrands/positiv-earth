"use client";

import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";

import { initTextReveal } from "@/lib/textReveal";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type TextRevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
};

/**
 * Line-by-line slide-up heading reveal. Renders with the `.text-reveal` class
 * and wires SplitType + GSAP ScrollTrigger on mount.
 *
 * @example
 * <TextReveal as="h1" className="font-display text-heading-2">
 *   Designing journeys that go beyond the itinerary.
 * </TextReveal>
 */
export default function TextReveal({
  children,
  className,
  as: Component = "span",
  style,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    return initTextReveal(el);
  }, [children]);

  return (
    <Component
      ref={ref as never}
      className={cn("text-reveal", className)}
      style={style}
    >
      {children}
    </Component>
  );
}

/** Attach reveal animation to an existing element that already has `.text-reveal`. */
export function useTextReveal(
  ref: RefObject<HTMLElement | null>,
  deps: readonly unknown[] = [],
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el?.classList.contains("text-reveal")) return;
    return initTextReveal(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls deps
  }, deps);
}
