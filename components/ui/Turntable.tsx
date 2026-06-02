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

// Figma "turntable" frame (node 630:787): 702×408 box with an offset 357px ring.
const BOX_W = 702;
const BOX_H = 408;
const CENTER_X = 315.5;
const CENTER_Y = 229.5;
const RING_RADIUS = 178.5;
const LABEL_RADIUS = 214;
const DOT_RADIUS = 5;
const ENTRY_THRESHOLD = 0.4;
const SEGMENT_DURATION_MS = 420;

type LabelAlign = "left" | "center" | "right";

type FigmaNode = {
  angle: number;
  label: { left: number; top: number; width: number; align: LabelAlign };
};

// Explicit label placement (percent of the box) lifted from the Figma frame so
// the five default steps land exactly where the design shows them.
const FIGMA_LAYOUT: FigmaNode[] = [
  { angle: -90, label: { left: 23.65, top: 0, width: 42.59, align: "center" } },
  { angle: -17.18, label: { left: 72.22, top: 39.71, width: 27.78, align: "left" } },
  { angle: 46.1, label: { left: 66.24, top: 85.54, width: 26.35, align: "left" } },
  { angle: 135.5, label: { left: 1.99, top: 81.86, width: 21.09, align: "left" } },
  { angle: -162.8, label: { left: 0, top: 36.03, width: 18.52, align: "left" } },
];

type TurntableProps = {
  className?: string;
  intervalMs?: number;
  steps?: readonly string[];
};

type Point = {
  x: number;
  y: number;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function toRadians(angle: number) {
  return (angle * Math.PI) / 180;
}

function getPoint(angle: number, radius: number): Point {
  const theta = toRadians(angle);

  return {
    x: CENTER_X + radius * Math.cos(theta),
    y: CENTER_Y + radius * Math.sin(theta),
  };
}

function getArcPath(start: Point, end: Point) {
  return `M ${start.x} ${start.y} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${end.x} ${end.y}`;
}

function getClockwiseSegments(from: number, to: number, count: number) {
  if (count <= 1 || from === to) {
    return [];
  }

  const segments: number[] = [];
  let cursor = from;

  while (cursor !== to) {
    segments.push(cursor);
    cursor = (cursor + 1) % count;
  }

  return segments;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);
  const hasPlayedIntroRef = useRef(false);
  const activeIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedSegment, setAnimatedSegment] = useState<number | null>(null);
  const [segmentProgress, setSegmentProgress] = useState(0);

  activeIndexRef.current = activeIndex;

  const useFigmaLayout = itemCount === FIGMA_LAYOUT.length;

  const geometry = useMemo(() => {
    return steps.map((label, index) => {
      const node = useFigmaLayout ? FIGMA_LAYOUT[index] : null;
      const angle = node ? node.angle : -90 + index * (360 / itemCount);
      const dot = getPoint(angle, RING_RADIUS);

      let align: LabelAlign;
      let labelStyle: CSSProperties;

      if (node) {
        align = node.label.align;
        labelStyle = {
          left: `${node.label.left}%`,
          top: `${node.label.top}%`,
          width: `${node.label.width}%`,
        };
      } else {
        const point = getPoint(angle, LABEL_RADIUS);
        align =
          Math.abs(point.x - CENTER_X) < 6
            ? "center"
            : point.x > CENTER_X
              ? "left"
              : "right";
        labelStyle = {
          left: `${(point.x / BOX_W) * 100}%`,
          top: `${(point.y / BOX_H) * 100}%`,
          width: align === "center" ? "40%" : "28%",
          transform: "translate(-50%, -50%)",
        };
      }

      // Scale labels with the turntable so they stay proportional on small
      // screens; 3.4cqw == the 24px turntable-tag token at the 706px design width.
      labelStyle.fontSize = "min(var(--text-turntable-tag), 3.4cqw)";
      labelStyle.lineHeight = "1.25";

      return { angle, dot, label, align, labelStyle };
    });
  }, [itemCount, steps, useFigmaLayout]);

  const segmentPaths = useMemo(() => {
    return geometry.map((item, index) => {
      const next = geometry[(index + 1) % itemCount];
      return getArcPath(item.dot, next.dot);
    });
  }, [geometry, itemCount]);

  useEffect(() => {
    if (activeIndex >= itemCount) {
      setActiveIndex(0);
    }
  }, [activeIndex, itemCount]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      if (autoAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  const clearAutoAdvance = () => {
    if (autoAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  };

  const clearSweep = () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isAnimatingRef.current = false;
    setAnimatedSegment(null);
    setSegmentProgress(0);
  };

  const maybeScheduleAutoAdvance = () => {
    clearAutoAdvance();

    if (
      prefersReducedMotion ||
      pausedRef.current ||
      isAnimatingRef.current ||
      !hasPlayedIntroRef.current ||
      itemCount <= 1
    ) {
      return;
    }

    autoAdvanceTimeoutRef.current = window.setTimeout(() => {
      const nextIndex = (activeIndexRef.current + 1) % itemCount;
      runSweepTo(nextIndex);
    }, intervalMs);
  };

  const finishSweep = (nextIndex: number) => {
    clearSweep();
    setActiveIndex(nextIndex);
    maybeScheduleAutoAdvance();
  };

  const animateSegments = (
    segments: number[],
    nextIndex: number,
    segmentIndex = 0,
  ) => {
    if (segmentIndex >= segments.length) {
      finishSweep(nextIndex);
      return;
    }

    const currentSegment = segments[segmentIndex];
    const startTime = performance.now();

    setAnimatedSegment(currentSegment);
    setSegmentProgress(0);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SEGMENT_DURATION_MS, 1);

      setSegmentProgress(progress);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      setAnimatedSegment(null);
      setSegmentProgress(0);
      animateSegments(segments, nextIndex, segmentIndex + 1);
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  };

  function runSweepTo(nextIndex: number) {
    clearAutoAdvance();

    if (itemCount === 0) {
      return;
    }

    const fromIndex = activeIndexRef.current;

    if (prefersReducedMotion) {
      clearSweep();
      setActiveIndex(nextIndex);
      return;
    }

    clearSweep();

    const segments = getClockwiseSegments(fromIndex, nextIndex, itemCount);

    if (segments.length === 0) {
      setActiveIndex(nextIndex);
      maybeScheduleAutoAdvance();
      return;
    }

    setActiveIndex(nextIndex);
    isAnimatingRef.current = true;
    animateSegments(segments, nextIndex);
  }

  useEffect(() => {
    if (prefersReducedMotion || itemCount === 0) {
      clearAutoAdvance();
      clearSweep();
      return;
    }

    const node = rootRef.current;

    if (!node || hasPlayedIntroRef.current) {
      maybeScheduleAutoAdvance();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || hasPlayedIntroRef.current) {
          return;
        }

        hasPlayedIntroRef.current = true;
        clearAutoAdvance();
        clearSweep();
        isAnimatingRef.current = true;
        animateSegments(Array.from({ length: itemCount }, (_, index) => index), 0);
        observer.disconnect();
      },
      { threshold: ENTRY_THRESHOLD },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [itemCount, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      hasPlayedIntroRef.current = true;
      clearAutoAdvance();
      clearSweep();
      return;
    }

    if (hasPlayedIntroRef.current) {
      maybeScheduleAutoAdvance();
    }
  }, [activeIndex, intervalMs, prefersReducedMotion]);

  const handleMouseEnter = () => {
    pausedRef.current = true;
    clearAutoAdvance();
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
    maybeScheduleAutoAdvance();
  };

  const handleFocusCapture = () => {
    pausedRef.current = true;
    clearAutoAdvance();
  };

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && rootRef.current?.contains(nextTarget)) {
      return;
    }

    pausedRef.current = false;
    maybeScheduleAutoAdvance();
  };

  const handleNodeClick = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.disabled) {
      return;
    }

    runSweepTo(index);
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={cn("@container relative aspect-[702/408] w-full text-base-black", className)}
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
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RING_RADIUS}
          className="fill-none stroke-base-black opacity-20"
          strokeWidth="1.5"
        />

        {segmentPaths.map((path, index) => {
          const isCurrentSegment = animatedSegment === index;

          return (
            <path
              key={path}
              d={path}
              pathLength={1}
              className={cn(
                "fill-none stroke-base-black transition-opacity",
                isCurrentSegment ? "opacity-100" : "opacity-0",
              )}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={isCurrentSegment ? 1 - segmentProgress : 1}
            />
          );
        })}

        {geometry.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <circle
              key={`dot-${item.label}`}
              cx={item.dot.x}
              cy={item.dot.y}
              r={DOT_RADIUS}
              className={cn(
                "fill-base-black transition-opacity",
                isActive ? "opacity-100" : "opacity-40",
              )}
            />
          );
        })}
      </svg>

      {geometry.map((item, index) => {
        const isActive = index === activeIndex;
        const textAlign =
          item.align === "center"
            ? "text-center"
            : item.align === "left"
              ? "text-left"
              : "text-right";

        return (
          <button
            key={item.label}
            type="button"
            aria-current={isActive ? "step" : undefined}
            onClick={handleNodeClick(index)}
            className={cn(
              "absolute bg-transparent font-body font-semibold text-base-black transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-black disabled:pointer-events-none",
              textAlign,
              isActive ? "opacity-100" : "opacity-65",
            )}
            style={item.labelStyle}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
