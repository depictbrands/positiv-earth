import { useEffect, useState, type RefObject } from "react";

export type LogoSurface = "light" | "dark";

const LIGHT_LUMINANCE = 0.9;

function parseRgb(backgroundColor: string): [number, number, number] | null {
  const rgbMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [
      Number(rgbMatch[1]),
      Number(rgbMatch[2]),
      Number(rgbMatch[3]),
    ];
  }

  if (backgroundColor === "white") {
    return [255, 255, 255];
  }

  return null;
}

function luminanceFromRgb([r, g, b]: [number, number, number]): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function isLightBackground(element: Element | null): boolean {
  let node: Element | null = element;

  while (node) {
    if (!(node instanceof HTMLElement)) {
      node = node.parentElement;
      continue;
    }

    const surface = node.dataset.logoSurface;
    if (surface === "light") {
      return true;
    }
    if (surface === "dark") {
      return false;
    }

    const { backgroundColor } = getComputedStyle(node);
    if (
      backgroundColor &&
      backgroundColor !== "rgba(0, 0, 0, 0)" &&
      backgroundColor !== "transparent"
    ) {
      const rgb = parseRgb(backgroundColor);
      if (rgb && luminanceFromRgb(rgb) >= LIGHT_LUMINANCE) {
        return true;
      }
      if (rgb) {
        return false;
      }
    }

    node = node.parentElement;
  }

  return false;
}

function surfaceAtAnchor(anchor: HTMLElement): LogoSurface {
  const rect = anchor.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const stack = document.elementsFromPoint(x, y);
  const content = stack.find((el) => !el.closest("header"));

  return isLightBackground(content ?? null) ? "light" : "dark";
}

// Samples the page background behind a fixed header logo on scroll/resize.
// Light surfaces (e.g. base-white sections) keep the original SVG colors;
// everything else inverts the mark so it stays visible.
export function useAdaptiveLogoSurface(
  anchorRef: RefObject<HTMLElement | null>,
): LogoSurface {
  const [surface, setSurface] = useState<LogoSurface>("dark");

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    let ticking = false;

    const measure = () => {
      setSurface(surfaceAtAnchor(anchor));
      ticking = false;
    };

    const schedule = () => {
      if (!ticking) {
        window.requestAnimationFrame(measure);
        ticking = true;
      }
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [anchorRef]);

  return surface;
}
