"use client";

import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TurntableStep = {
  title: string;
  body: string;
};

const DEFAULT_STEPS: readonly TurntableStep[] = [
  {
    title: "Curated Travel\nExperience",
    body: "Personalized itineraries crafted around your interests and travel style.",
  },
  {
    title: "Pre-Trip Sessions",
    body: "A one-on-one planning session before you depart.",
  },
  {
    title: "Cultural\nBriefing",
    body: "Clear, practical cultural guidance for your specific destination.",
  },
  {
    title: "Real-World Preparation",
    body: "Real-life scenarios and examples, not theory.",
  },
  {
    title: "On-Trip\nTools",
    body: "Technological tools and materials you can review.",
  },
];

// Structural geometry of the Figma "turntable" frame: a 702×408 viewBox with an
// offset 357px-diameter ring. Nodes sit evenly around the ring, the first one at
// the top (12 o'clock).
const BOX_W = 702;
const BOX_H = 408;
const CENTER_X = 315.5;
const CENTER_Y = 229.5;
const RING_RADIUS = 178.5;
// Labels sit further out than the ring so the gliding plane never crowds the
// type — the gap (LABEL_RADIUS − RING_RADIUS) is the clearance the plane keeps.
const LABEL_RADIUS = 224;
const DOT_RADIUS = 5;
// Label line-height; halved, it's the vertical offset that keeps the title's
// first line centered on its node so the body block flows off the node instead
// of shifting the title when it appears.
const LABEL_LINE_HEIGHT = 1.25;

// Desktop body-block type/size, expressed in container-query units so the block
// tracks the fluid tag type as the turntable shrinks. 2.28cqw == the 16px
// turntable-body token at the 702px design width.
const DESKTOP_BODY_FONT = "min(var(--text-turntable-body), 2.28cqw)";
const DESKTOP_BODY_MAX_WIDTH = "25cqw";

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
const EPSILON = 0.0005;

// ---- Mobile linear timeline ----
// Below the lg breakpoint HowItWorks stacks, so the ring is re-expressed as a
// vertical timeline. Values per design: the tag type scales fluidly, the icon
// column is as wide as the plane, labels sit a fixed gap to its right, rows are
// evenly spaced, and the timeline clears the top of the section. The animation
// state itself is shared with the ring — only the projection differs.
const MOBILE_TAG_FONT = "clamp(1rem, 1.59vw, 1.5rem)";
const MOBILE_LINE_HEIGHT = 1.25;
const MOBILE_TRACK_WIDTH = "1.5rem";
const MOBILE_LABEL_GAP = "0.75rem";
const MOBILE_TAG_GAP = "3rem";
const MOBILE_TOP_OFFSET = "4rem";

type LabelAlign = "left" | "center" | "right";

type TurntableProps = {
  className?: string;
  steps?: readonly TurntableStep[];
};

type Point = {
  x: number;
  y: number;
};

type Phase = "idle" | "intro" | "steady";

type MobileMetrics = {
  lineX: number;
  columnWidth: number;
  width: number;
  height: number;
  dotYs: number[];
};

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

// Clockwise easing shared by the intro draw and click sweep so every motion
// reads with the same acceleration curve.
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Project a ring fraction (0–1, the shared animation value) onto a vertical
// pixel position on the mobile timeline. Nodes sit at i/itemCount; the final
// segment wraps from the last node back to the first so the loop-based engine
// (intro full sweep) reads as the plane returning to the top.
function mapFractionToY(fraction: number, dotYs: number[], itemCount: number) {
  const seg = fraction * itemCount;
  const index = ((Math.floor(seg) % itemCount) + itemCount) % itemCount;
  const t = seg - Math.floor(seg);
  const from = dotYs[index];
  const to = dotYs[(index + 1) % itemCount];
  return from + (to - from) * t;
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
  steps = DEFAULT_STEPS,
}: TurntableProps) {
  const itemCount = steps.length;
  const prefersReducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const mobileRootRef = useRef<HTMLDivElement>(null);
  const spanRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const introPlayedRef = useRef(false);

  // Mirror state into refs so the rAF loop reads current values without
  // re-subscribing on every render.
  const activeRef = useRef(0);
  const frontRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const animatingRef = useRef(false);

  // Where the plane is parked (drives the plane target + lit dot).
  const [activeIndex, setActiveIndex] = useState(0);
  // The clicked node keeps its title inked even after the pointer leaves; a
  // hovered node inks only while hovered. Null == nothing selected on load.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Fraction of the ring (0–1) the highlight arc reveals, clockwise from the top.
  const [frontFraction, setFrontFraction] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mobileMetrics, setMobileMetrics] = useState<MobileMetrics | null>(null);

  // Even 72° spacing for five nodes, first node at the top, plus a derived
  // clockwise fraction (0 at top) used to place the highlight arc endpoint.
  const geometry = useMemo(() => {
    return steps.map((step, index) => {
      const fraction = index / itemCount;
      const angle = -90 + fraction * 360;
      const dot = getPoint(angle, RING_RADIUS);
      const labelPoint = getPoint(angle, LABEL_RADIUS);

      const dx = labelPoint.x - CENTER_X;
      const dy = labelPoint.y - CENTER_Y;
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

      // Anchor the title on its node so multi-line titles grow AWAY from the
      // ring: labels above the ring's middle pin their LAST line on the node
      // (extra lines stack upward, clear of the plane), labels below pin their
      // FIRST line (extra lines flow downward). A single-line title stays
      // centered on the node either way. The body block is absolutely positioned
      // (top-full), so it never affects the title's own placement.
      const translateY =
        dy < -40
          ? `calc(-100% + ${LABEL_LINE_HEIGHT / 2}em)`
          : `-${LABEL_LINE_HEIGHT / 2}em`;

      const labelStyle: CSSProperties = {
        left: `${(labelPoint.x / BOX_W) * 100}%`,
        top: `${(labelPoint.y / BOX_H) * 100}%`,
        maxWidth: isCentered ? "46%" : "30%",
        transform: `translate(${translateX}, ${translateY})`,
        // Scale labels with the turntable so they stay proportional on small
        // screens; 3.4cqw == the 24px turntable-tag token at the design width.
        fontSize: "min(var(--text-turntable-tag), 3.4cqw)",
        lineHeight: `${LABEL_LINE_HEIGHT}`,
      };

      return {
        angle,
        fraction,
        dot,
        title: step.title,
        body: step.body,
        align,
        labelStyle,
      };
    });
  }, [itemCount, steps]);

  // Single full-circle path starting at the top and sweeping clockwise, so a
  // stroke-dashoffset reveal exposes the arc from the top onward.
  const ringPath = useMemo(() => {
    const top = getPoint(-90, RING_RADIUS);
    const bottom = getPoint(90, RING_RADIUS);
    return `M ${top.x} ${top.y} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${bottom.x} ${bottom.y} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${top.x} ${top.y}`;
  }, []);

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
    };
  }, []);

  // Measure the mobile timeline's node positions so the shared animation state
  // (front fraction / lit nodes) can be projected onto the vertical line. Runs
  // whenever layout can change; the width==0 guard skips it while the block is
  // display:none (desktop), and the ResizeObserver re-measures when it appears.
  useEffect(() => {
    const root = mobileRootRef.current;

    if (!root) {
      return;
    }

    const measure = () => {
      const rootRect = root.getBoundingClientRect();

      if (rootRect.width === 0) {
        return;
      }

      const dotYs: number[] = [];
      let lineX = 0;
      let columnWidth = 0;

      for (let index = 0; index < itemCount; index += 1) {
        const span = spanRefs.current[index];

        if (!span) {
          return;
        }

        const rect = span.getBoundingClientRect();
        dotYs[index] = rect.top - rootRect.top + rect.height / 2;
        lineX = rect.left - rootRect.left + rect.width / 2;
        columnWidth = rect.width;
      }

      setMobileMetrics({
        lineX,
        columnWidth,
        width: rootRect.width,
        height: rootRect.height,
        dotYs,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [itemCount, steps]);

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
    // Seed the clock from the first rAF timestamp so the loop stays pure (no
    // impure performance.now() read); the first frame lands at t=0.
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) {
        start = now;
      }
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

  // Move the parked node (and arc endpoint) to `target`, sweeping clockwise from
  // the plane's current position.
  function runStepTo(target: number) {
    if (itemCount === 0) {
      return;
    }

    const targetFraction = geometry[target].fraction;

    if (prefersReducedMotion) {
      // Switch instantly; the arc endpoint is derived from the parked node.
      cancelRaf();
      activeRef.current = target;
      frontRef.current = targetFraction;
      phaseRef.current = "steady";
      setActiveIndex(target);
      return;
    }

    let delta = (targetFraction - frontRef.current) % 1;
    if (delta < 0) delta += 1;

    // Clicking the already-parked node: nothing to sweep.
    if (delta < EPSILON) {
      return;
    }

    phaseRef.current = "steady";
    activeRef.current = target;
    setPhase("steady");
    setActiveIndex(target);

    const duration = Math.max(FULL_TURN_MS * delta, MIN_STEP_MS);

    animateFront(delta, targetFraction, duration);
  }

  function playIntro() {
    phaseRef.current = "intro";
    activeRef.current = 0;
    setPhase("intro");
    setActiveIndex(0);

    // Draw a full clockwise turn, then settle with the top node parked and the
    // arc reset to undrawn.
    animateFront(1, 0, FULL_TURN_MS, () => {
      phaseRef.current = "steady";
      activeRef.current = 0;
      setPhase("steady");
      setActiveIndex(0);
    });
  }

  // Reduced motion: stop any running motion. The final state is derived during
  // render (see renderFront / renderPhase below), so no setState is needed here.
  useEffect(() => {
    if (!prefersReducedMotion) {
      return;
    }

    cancelRaf();
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

  const handleNodeClick =
    (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
      if (event.currentTarget.disabled) {
        return;
      }

      // Trigger B: park the plane on the clicked node and keep its title inked.
      introPlayedRef.current = true;
      setSelectedIndex(index);
      runStepTo(index);
    };

  const handleNodeEnter = (index: number) => () => setHoveredIndex(index);
  const handleNodeLeave = (index: number) => () =>
    setHoveredIndex((current) => (current === index ? null : current));

  if (itemCount === 0) {
    return null;
  }

  const safeActiveIndex = activeIndex < itemCount ? activeIndex : 0;

  // With reduced motion we render the final state directly: the arc endpoint
  // sits at the parked node and there is no intro phase.
  const renderPhase: Phase = prefersReducedMotion ? "steady" : phase;
  const renderFront = prefersReducedMotion
    ? (geometry[safeActiveIndex]?.fraction ?? 0)
    : frontFraction;

  // A dot inks to base-black once the drawn arc front has reached it (measuring
  // clockwise from the top), and stays base-white ahead of the front.
  const isReached = (fraction: number) => fraction <= renderFront + EPSILON;

  // The plane rides the leading edge of the highlight arc at a fixed orientation
  // (no rotation) while tracing the ring.
  const leadAngle = -90 + renderFront * 360;
  const leadPoint = getPoint(leadAngle, RING_RADIUS);
  const planeTransform = `translate(${leadPoint.x} ${leadPoint.y}) scale(${PLANE_SCALE}) translate(${-PLANE_CENTER_X} ${-PLANE_CENTER_Y})`;
  const showPlane = renderPhase !== "idle";

  // Mobile timeline projection of the same state. Dot/stroke sizes derive from
  // the measured column so they track the fluid tag type. The plane keeps its
  // fixed heading (as on the ring); it just rides the vertical line.
  const mobileDotRadius = mobileMetrics ? mobileMetrics.columnWidth / 6 : 0;
  const mobileStroke = mobileMetrics ? mobileMetrics.columnWidth / 16 : 0;
  const mobileTrackTop = mobileMetrics ? mobileMetrics.dotYs[0] : 0;
  const mobileTrackBottom = mobileMetrics
    ? mobileMetrics.dotYs[itemCount - 1]
    : 0;
  const mobilePlaneY = mobileMetrics
    ? mapFractionToY(renderFront, mobileMetrics.dotYs, itemCount)
    : 0;
  const mobilePlaneScale = mobileMetrics
    ? mobileMetrics.columnWidth / PLANE_VIEW_W
    : 0;
  const mobilePlaneTransform = mobileMetrics
    ? `translate(${mobileMetrics.lineX} ${mobilePlaneY}) scale(${mobilePlaneScale}) translate(${-PLANE_CENTER_X} ${-PLANE_CENTER_Y})`
    : "";
  const showMobileHighlight =
    mobileMetrics != null && mobilePlaneY - mobileTrackTop > 0.5;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {/* Desktop (lg+): the circular turntable. */}
      <div className="@container relative hidden aspect-[702/408] w-full overflow-visible lg:block">
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
            className="fill-none stroke-base-white opacity-40"
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

          {geometry.map((item) => (
            <circle
              key={`dot-${item.title}`}
              cx={item.dot.x}
              cy={item.dot.y}
              r={DOT_RADIUS}
              className={cn(
                "transition-colors duration-300",
                isReached(item.fraction) ? "fill-base-black" : "fill-base-white",
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
          const selected = selectedIndex === index;
          const hovered = hoveredIndex === index;
          const alignItems =
            item.align === "center"
              ? "items-center"
              : item.align === "left"
                ? "items-start"
                : "items-end";
          const textAlign =
            item.align === "center"
              ? "text-center"
              : item.align === "left"
                ? "text-left"
                : "text-right";
          const blockAlign =
            item.align === "center"
              ? "left-1/2 -translate-x-1/2"
              : item.align === "left"
                ? "left-0"
                : "right-0";

          return (
            <div key={item.title} className="absolute" style={item.labelStyle}>
              <div className={cn("relative flex flex-col", alignItems)}>
                <button
                  type="button"
                  aria-current={selected ? "step" : undefined}
                  onClick={handleNodeClick(index)}
                  onMouseEnter={handleNodeEnter(index)}
                  onMouseLeave={handleNodeLeave(index)}
                  onFocus={handleNodeEnter(index)}
                  onBlur={handleNodeLeave(index)}
                  className={cn(
                    "focus-ring-ink whitespace-pre-line rounded-sm bg-transparent font-body font-semibold text-base-black disabled:pointer-events-none",
                    textAlign,
                  )}
                >
                  {item.title}
                </button>

                {/* Body block: revealed on hover of the title, hidden otherwise. */}
                {hovered && item.body && (
                  <div
                    className={cn(
                      "home-scale pointer-events-none absolute top-full z-10 mt-2 flex items-center justify-center rounded-[var(--radius-turntable-tag-corner)] bg-base-white px-3 py-2.5",
                      blockAlign,
                    )}
                    style={{ width: "max-content", maxWidth: DESKTOP_BODY_MAX_WIDTH }}
                  >
                    <p
                      className="font-body font-normal break-words text-base-black"
                      style={{ fontSize: DESKTOP_BODY_FONT, lineHeight: 1.26 }}
                    >
                      {item.body}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile (< lg): the same steps as a vertical timeline. */}
      <div
        ref={mobileRootRef}
        className="relative w-full overflow-visible lg:hidden"
        style={{ paddingTop: MOBILE_TOP_OFFSET }}
      >
        {mobileMetrics && (
          <svg
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            viewBox={`0 0 ${mobileMetrics.width} ${mobileMetrics.height}`}
            aria-hidden="true"
          >
            {/* Faint base track spanning every node. */}
            <line
              x1={mobileMetrics.lineX}
              y1={mobileTrackTop}
              x2={mobileMetrics.lineX}
              y2={mobileTrackBottom}
              className="stroke-base-white opacity-40"
              strokeWidth={mobileStroke}
            />

            {/* Highlight covering the track from the top down to the plane. */}
            {showMobileHighlight && (
              <line
                x1={mobileMetrics.lineX}
                y1={mobileTrackTop}
                x2={mobileMetrics.lineX}
                y2={mobilePlaneY}
                className="stroke-base-black"
                strokeWidth={mobileStroke}
                strokeLinecap="round"
              />
            )}

            {mobileMetrics.dotYs.map((y, index) => (
              <circle
                key={`mobile-dot-${geometry[index].title}`}
                cx={mobileMetrics.lineX}
                cy={y}
                r={mobileDotRadius}
                className={cn(
                  "transition-colors duration-300",
                  isReached(geometry[index].fraction)
                    ? "fill-base-black"
                    : "fill-base-white",
                )}
              />
            ))}

            {/* Plane leading the highlight at the same fixed heading as the ring. */}
            {showPlane && (
              <g transform={mobilePlaneTransform} className="fill-base-black">
                {PLANE_PATHS.map((d, index) => (
                  <path
                    key={`mobile-plane-${index}`}
                    d={d}
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                ))}
              </g>
            )}
          </svg>
        )}

        <ol
          className="relative m-0 flex list-none flex-col p-0"
          style={{ gap: MOBILE_TAG_GAP }}
        >
          {geometry.map((item, index) => {
            const selected = selectedIndex === index;
            const hovered = hoveredIndex === index;
            // Touch has no hover, so the tapped (selected) node keeps its body
            // block open here in addition to the hover reveal.
            const showBody = (hovered || selected) && Boolean(item.body);

            return (
              <li
                key={item.title}
                className="flex items-start"
                style={{ gap: MOBILE_LABEL_GAP }}
              >
                {/* Icon column: reserves the plane-wide track and anchors the
                    node dot on the label's first line (measured for the SVG). */}
                <span
                  ref={(element) => {
                    spanRefs.current[index] = element;
                  }}
                  aria-hidden="true"
                  className="block shrink-0"
                  style={{
                    width: MOBILE_TRACK_WIDTH,
                    height: `${MOBILE_LINE_HEIGHT}em`,
                    fontSize: MOBILE_TAG_FONT,
                  }}
                />
                <div
                  className="flex min-w-0 flex-col items-start"
                  style={{ gap: "0.5rem" }}
                >
                  <button
                    type="button"
                    aria-current={selected ? "step" : undefined}
                    onClick={handleNodeClick(index)}
                    onMouseEnter={handleNodeEnter(index)}
                    onMouseLeave={handleNodeLeave(index)}
                    onFocus={handleNodeEnter(index)}
                    onBlur={handleNodeLeave(index)}
                    className={cn(
                      "focus-ring-ink whitespace-pre-line rounded-sm bg-transparent text-left font-body font-semibold text-base-black disabled:pointer-events-none",
                    )}
                    style={{
                      fontSize: MOBILE_TAG_FONT,
                      lineHeight: MOBILE_LINE_HEIGHT,
                    }}
                  >
                    {item.title}
                  </button>

                  {showBody && (
                    <div className="home-scale flex w-fit max-w-full items-center justify-center rounded-[var(--radius-turntable-tag-corner)] bg-base-white px-3 py-2.5">
                      <p
                        className="font-body font-normal break-words text-base-black"
                        style={{
                          fontSize: "var(--text-turntable-body)",
                          lineHeight: 1.26,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
