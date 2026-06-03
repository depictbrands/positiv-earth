import { useEffect, useState } from "react";

/**
 * Tracks scroll direction and reports whether a pinned bar should be hidden:
 * hide while scrolling down (past the top), reveal while scrolling up.
 *
 * @param threshold Minimum px of movement before toggling, to ignore jitter.
 */
export function useHideOnScroll(threshold = 8) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const diff = y - lastY;

      if (Math.abs(diff) > threshold) {
        // Scrolling down (and away from the very top) hides; up reveals.
        setHidden(diff > 0 && y > 0);
        lastY = y;
      } else if (y <= 0) {
        // Always reveal once back at the top.
        setHidden(false);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
