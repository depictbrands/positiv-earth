"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_STEPS = [
  "Curated Travel Experience",
  "Pre-Trip Sessions",
  "Cultural Briefing",
  "Real-World Preparation",
  "On-Trip Resources",
] as const;

// Structural geometry of the Figma "turntable" frame (node 630:787): a 702×408
// viewBox with an offset 357px-diameter ring. Nodes sit evenly around the ring,
// the first one at the top (12 o'clock).
const BOX_W = 702;
const BOX_H = 408;
const CENTER_X = 315.5;
const CENTER_Y = 229.5;
const RING_RADIUS = 178.5;
const LABEL_RADIUS = 206;
const DOT_RADIUS = 5;

// "Nomads Airplane" mark that leads the highlight arc. Its native viewBox is
// 2106×1053 and the nose points right (+x). It keeps a fixed 0° heading while
// riding the ring so it does not spin with the clockwise tangent.
const PLANE_VIEW_W = 2106;
const PLANE_VIEW_H = 1053;
const PLANE_CENTER_X = PLANE_VIEW_W / 2;
const PLANE_CENTER_Y = PLANE_VIEW_H / 2;
// Rendered width in viewBox units; scale keeps the native proportions.
const PLANE_WIDTH = 52;
const PLANE_SCALE = PLANE_WIDTH / PLANE_VIEW_W;
const PLANE_PATHS = [
  "M0 185.884C76.1785 173.683 146.984 162.457 224.612 150.013C318.193 220.538 417.329 295.253 511.208 365.901C641.639 345.021 760.893 326.085 886.306 306.058L673.173 34.5134C725.854 12.2368 769.772 14.1809 810.128 3.68125C857.369 -8.76249 893.255 12.602 932.705 34.0294C1063.26 104.189 1195.68 170.647 1327.44 238.442C1473.7 215.197 1619.05 191.225 1764.69 169.072C1886.18 150.68 2019.63 221.085 2070.45 327.784C1919.97 351.699 1769.78 375.611 1624.73 398.737C1593.74 427.506 1566.91 451.295 1541.48 476.544C1523.78 494.388 1482.28 549.136 1472.61 559.211C1353.11 681.63 1233.02 803.503 1113.03 925.252C1077.03 961.548 1040.48 997.114 1009.25 1027.89C952.217 1036.99 901.835 1045 853.442 1052.77C840.637 1035.35 844.441 1022.12 851.632 1006.82C903.646 895.816 932.947 775.643 985.807 664.575C990.699 654.255 1036.31 549.255 1046.34 491.416C997.995 499.126 949.915 506.793 902.042 514.429C701.184 546.469 290.67 614.688 290.67 614.688C290.67 614.688 34.0115 239.839 0 185.884Z",
  "M306.584 608.27C322.906 602.733 801.242 529.441 1051.26 486.045C1041.28 548.709 1034.73 599.535 990.531 632.344C861.009 654.373 731.25 674.494 602.209 699.019C554.886 708.095 511.111 705.596 467.337 685.605C416.348 662.265 333.496 656.411 290.261 613.803C290.261 613.803 290.261 613.803 306.584 608.27Z",
  "M1626.08 385.897C1767.64 363.062 1914.25 339.445 2061.25 315.832C2091.96 345.021 2103.89 381.64 2105.54 430.25C1905.65 462.433 1691.56 494.441 1493.62 526.386C1493.62 526.386 1595.76 414.304 1626.08 385.897Z",
] as const;

const ENTRY_THRESHOLD = 0.4;
// One full clockwise turn for the intro draw and click sweeps (within the
// 1200–1600ms brief).
const FULL_TURN_MS = 1400;
// Floor so a single short click hop still eases noticeably.
const MIN_STEP_MS = 220;
// Auto-advance glides one node at a noticeably slower, calmer pace than a click
// so the resting wheel visibly drifts and reads as interactive.
const AUTO_STEP_MS = 1600;
const EPSILON = 0.0005;

type LabelAlign = "left" | "center" | "right";

type TurntableProps = {
  className?: string;
  intervalMs?: number;
  steps?: readonly string[];
};

type Point = {
  x: number;
  y: number;
};

type Phase = "idle" | "intro" | "steady";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function toRadians(angle: number) {
  return (angle * Math.PI) / 180;
}

// Angle convention matches the SVG screen space (y grows downward): -90° is the
// top, 0° is the right, and the angle increases clockwise.
function getPoint(angle: number, radius: number): Point {
  const theta = toRadians(angle);

  return {
    x: CENTER_X + radius * Math.cos(theta),
    y: CENTER_Y + radius * Math.sin(theta),
  };
}

// Clockwise easing shared by the intro draw, auto-advance, and click sweep so
// every motion reads with the same acceleration curve.
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

export default function Turntable({
  className,
  intervalMs = 4000,
  steps = DEFAULT_STEPS,
}: TurntableProps) {
  const itemCount = steps.length;
  const prefersReducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const introPlayedRef = useRef(false);

  // Mirror state into refs so the rAF loop and timers read current values
  // without re-subscribing on every render.
  const activeRef = useRef(0);
  const frontRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const pausedRef = useRef(false);
  const animatingRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  // Fraction of the ring (0–1) the highlight arc reveals, clockwise from the top.
  const [frontFraction, setFrontFraction] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  // Even 72° spacing for five nodes, first node at the top, plus a derived
  // clockwise fraction (0 at top) used to place the highlight arc endpoint.
  const geometry = useMemo(() => {
    return steps.map((label, index) => {
      const fraction = index / itemCount;
      const angle = -90 + fraction * 360;
      const dot = getPoint(angle, RING_RADIUS);
      const labelPoint = getPoint(angle, LABEL_RADIUS);

      const dx = labelPoint.x - CENTER_X;
      const isCentered = Math.abs(dx) < 40;

      let align: LabelAlign;
      let translateX: string;

      if (isCentered) {
        align = "center";
        translateX = "-50%";
      } else if (dx > 0) {
        align = "left";
        translateX = "0";
      } else {
        align = "right";
        translateX = "-100%";
      }

      const labelStyle: CSSProperties = {
        left: `${(labelPoint.x / BOX_W) * 100}%`,
        top: `${(labelPoint.y / BOX_H) * 100}%`,
        maxWidth: isCentered ? "46%" : "30%",
        transform: `translate(${translateX}, -50%)`,
        // Scale labels with the turntable so they stay proportional on small
        // screens; 3.4cqw == the 24px turntable-tag token at the design width.
        fontSize: "min(var(--text-turntable-tag), 3.4cqw)",
        lineHeight: "1.25",
      };

      return { angle, fraction, dot, label, align, labelStyle };
    });
  }, [itemCount, steps]);

  // Single full-circle path starting at the top and sweeping clockwise, so a
  // stroke-dashoffset reveal exposes the arc from the top onward.
  const ringPath = useMemo(() => {
    const top = getPoint(-90, RING_RADIUS);
    const bottom = getPoint(90, RING_RADIUS);
    return `M ${top.x} ${top.y} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${bottom.x} ${bottom.y} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${top.x} ${top.y}`;
  }, []);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const cancelRaf = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    animatingRef.current = false;
  };

  useEffect(() => {
    return () => {
      cancelRaf();
      clearTimer();
    };
  }, []);

  // Drive the highlight arc from its current position by `delta` of the ring
  // (always positive == clockwise) over `duration` ms, settling exactly on
  // `finalFraction`.
  function animateFront(
    delta: number,
    finalFraction: number,
    duration: number,
    onDone?: () => void,
  ) {
    cancelRaf();

    const from = frontRef.current;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      let value = from + delta * easeInOut(t);

      // Keep the rendered fraction in [0,1); crossing the top wraps once.
      if (value > 1) value -= 1;
      if (value < 0) value += 1;

      frontRef.current = value;
      setFrontFraction(value);

      if (t < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      frontRef.current = finalFraction;
      setFrontFraction(finalFraction);
      rafRef.current = null;
      animatingRef.current = false;
      onDone?.();
    };

    animatingRef.current = true;
    rafRef.current = window.requestAnimationFrame(tick);
  }

  function scheduleNext() {
    clearTimer();

    if (
      prefersReducedMotion ||
      pausedRef.current ||
      animatingRef.current ||
      phaseRef.current !== "steady" ||
      itemCount <= 1
    ) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      runStepTo((activeRef.current + 1) % itemCount, "auto");
    }, intervalMs);
  }

  // Move the active node (and arc endpoint) to `target`, sweeping clockwise.
  // Auto-advance glides slowly; clicks track the faster intro rate.
  function runStepTo(target: number, source: "auto" | "click") {
    clearTimer();

    if (itemCount === 0) {
      return;
    }

    const targetFraction = geometry[target].fraction;

    if (prefersReducedMotion) {
      // Switch instantly; the arc endpoint is derived from the active node.
      cancelRaf();
      activeRef.current = target;
      frontRef.current = targetFraction;
      phaseRef.current = "steady";
      setActiveIndex(target);
      return;
    }

    let delta = (targetFraction - frontRef.current) % 1;
    if (delta < 0) delta += 1;

    // Clicking the already-active node: nothing to sweep.
    if (delta < EPSILON) {
      scheduleNext();
      return;
    }

    phaseRef.current = "steady";
    activeRef.current = target;
    setPhase("steady");
    setActiveIndex(target);

    const duration =
      source === "auto"
        ? AUTO_STEP_MS
        : Math.max(FULL_TURN_MS * delta, MIN_STEP_MS);

    animateFront(delta, targetFraction, duration, scheduleNext);
  }

  function playIntro() {
    phaseRef.current = "intro";
    activeRef.current = 0;
    setPhase("intro");
    setActiveIndex(0);

    // Draw a full clockwise turn, then settle into the steady carousel with the
    // top node active and the arc reset to undrawn.
    animateFront(1, 0, FULL_TURN_MS, () => {
      phaseRef.current = "steady";
      activeRef.current = 0;
      setPhase("steady");
      setActiveIndex(0);
      scheduleNext();
    });
  }

  // Reduced motion: stop any running motion. The final state is derived during
  // render (see renderFront / renderPhase below), so no setState is needed here.
  useEffect(() => {
    if (!prefersReducedMotion) {
      return;
    }

    cancelRaf();
    clearTimer();
    introPlayedRef.current = true;
    phaseRef.current = "steady";
  }, [prefersReducedMotion]);

  // Trigger A: play the intro once the wheel is ~40% on screen.
  useEffect(() => {
    if (prefersReducedMotion || itemCount === 0) {
      return;
    }

    const node = rootRef.current;

    if (!node || introPlayedRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || introPlayedRef.current) {
          return;
        }

        introPlayedRef.current = true;
        observer.disconnect();
        playIntro();
      },
      { threshold: ENTRY_THRESHOLD },
    );

    observer.observe(node);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, itemCount]);

  const handleMouseEnter = () => {
    pausedRef.current = true;
    clearTimer();
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
    scheduleNext();
  };

  const handleFocusCapture = () => {
    pausedRef.current = true;
    clearTimer();
  };

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && rootRef.current?.contains(nextTarget)) {
      return;
    }

    pausedRef.current = false;
    scheduleNext();
  };

  const handleNodeClick =
    (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
      if (event.currentTarget.disabled) {
        return;
      }

      // Trigger B.
      introPlayedRef.current = true;
      runStepTo(index, "click");
    };

  if (itemCount === 0) {
    return null;
  }

  const safeActiveIndex = activeIndex < itemCount ? activeIndex : 0;

  // With reduced motion we render the final state directly: the arc endpoint
  // sits at the active node and there is no intro phase.
  const renderPhase: Phase = prefersReducedMotion ? "steady" : phase;
  const renderFront = prefersReducedMotion
    ? (geometry[safeActiveIndex]?.fraction ?? 0)
    : frontFraction;

  // A node lights to 100% when the draw front has passed it (intro) or when it
  // is the active node (steady / idle default).
  const isLit = (index: number, fraction: number) => {
    if (renderPhase === "intro") {
      return fraction <= renderFront + EPSILON;
    }

    return index === safeActiveIndex;
  };

  // The plane rides the leading edge of the highlight arc at a fixed orientation
  // (no rotation) while tracing the ring.
  const leadAngle = -90 + renderFront * 360;
  const leadPoint = getPoint(leadAngle, RING_RADIUS);
  const planeTransform = `translate(${leadPoint.x} ${leadPoint.y}) scale(${PLANE_SCALE}) translate(${-PLANE_CENTER_X} ${-PLANE_CENTER_Y})`;
  const showPlane = renderPhase !== "idle";

  return (
    <div
      ref={rootRef}
      className={cn(
        "@container relative aspect-[702/408] w-full text-base-black",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      <svg
        viewBox={`0 0 ${BOX_W} ${BOX_H}`}
        className="block size-full overflow-visible"
        aria-hidden="true"
      >
        {/* Faint base track. */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RING_RADIUS}
          className="fill-none stroke-base-black opacity-20"
          strokeWidth="1.5"
        />

        {/* 100%-opacity highlight arc, revealed clockwise from the top. */}
        <path
          d={ringPath}
          pathLength={1}
          className="fill-none stroke-base-black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset={1 - renderFront}
        />

        {geometry.map((item, index) => (
          <circle
            key={`dot-${item.label}`}
            cx={item.dot.x}
            cy={item.dot.y}
            r={DOT_RADIUS}
            className={cn(
              "fill-base-black transition-opacity duration-300",
              isLit(index, item.fraction) ? "opacity-100" : "opacity-40",
            )}
          />
        ))}

        {/* Plane leading the highlight arc at a fixed heading. */}
        {showPlane && (
          <g transform={planeTransform} className="fill-base-black">
            {PLANE_PATHS.map((d, index) => (
              <path key={`plane-${index}`} d={d} fillRule="evenodd" clipRule="evenodd" />
            ))}
          </g>
        )}
      </svg>

      {geometry.map((item, index) => {
        const isActive = index === safeActiveIndex;
        const lit = isLit(index, item.fraction);
        const textAlign =
          item.align === "center"
            ? "text-center"
            : item.align === "left"
              ? "text-left"
              : "text-right";

        return (
          <div key={item.label} className="absolute" style={item.labelStyle}>
            <button
              type="button"
              aria-current={isActive ? "step" : undefined}
              onClick={handleNodeClick(index)}
              className={cn(
                "focus-ring-ink rounded-sm bg-transparent font-body font-semibold text-base-black transition-opacity duration-300 disabled:pointer-events-none",
                textAlign,
                lit ? "opacity-100" : "opacity-65",
              )}
            >
              {item.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
