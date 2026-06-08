// Pure motion math for the About scroll experience. No DOM, no GSAP — just the
// functions the scenes map their progress through. Kept framework-free so each
// system can be reasoned about and unit-checked in isolation.

export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Progress of `v` within [a, b], clamped to 0..1.
export function rangeProgress(v: number, a: number, b: number): number {
  if (a === b) return v >= b ? 1 : 0;
  return clamp((v - a) / (b - a));
}

// ease-out — MOTION_SPEC §8 cubic-bezier(0, 0, 0.2, 1), approximated by a cubic
// ease-out. Used for System 1 text settling.
export function easeOut(t: number): number {
  const c = clamp(t);
  return 1 - Math.pow(1 - c, 3);
}

// ---- Colour interpolation (System 2 background) -------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Linear RGB interpolation between two hex colours, returning a CSS rgb() string.
export function hexLerp(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const ct = clamp(t);
  const r = Math.round(lerp(a[0], b[0], ct));
  const g = Math.round(lerp(a[1], b[1], ct));
  const bl = Math.round(lerp(a[2], b[2], ct));
  return `rgb(${r}, ${g}, ${bl})`;
}

// Interpolate linearly across N colour stops spread evenly over 0..1
// (MOTION_SPEC §5: "linear between scene hexes across the pinned range").
export function multiHexLerp(stops: readonly string[], t: number): string {
  if (stops.length === 1) return hexLerp(stops[0], stops[0], 0);
  const ct = clamp(t);
  const seg = 1 / (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(ct / seg));
  const localT = (ct - i * seg) / seg;
  return hexLerp(stops[i], stops[i + 1], localT);
}

// ---- Crossfade (System 2 headline/panel swap) ---------------------------------

// Opacity of the panel whose active window is centred on `mid`, given the
// boundary midpoints and a ± crossfade half-window (MOTION_SPEC §3).
// `index` is this panel's position; `mids` are the swap midpoints between panels.
export function panelOpacity(
  p: number,
  index: number,
  mids: readonly number[],
  half: number,
  instant = false,
): number {
  // Lower edge: the swap INTO this panel (mids[index - 1]); upper edge: the swap
  // OUT of this panel (mids[index]).
  const lower = index > 0 ? mids[index - 1] : -Infinity;
  const upper = index < mids.length ? mids[index] : Infinity;

  if (instant) {
    return p >= (lower === -Infinity ? -Infinity : lower) &&
      p < (upper === Infinity ? Infinity : upper)
      ? 1
      : 0;
  }

  let opacity = 1;
  if (lower !== -Infinity) {
    opacity = Math.min(opacity, rangeProgress(p, lower - half, lower + half));
  }
  if (upper !== Infinity) {
    opacity = Math.min(opacity, 1 - rangeProgress(p, upper - half, upper + half));
  }
  return clamp(opacity);
}

// ---- Parallax (System 3) ------------------------------------------------------

// translateY (px) for a decorative image at scene-local progress `localP`.
// total travel = H + h; centred (translateY 0) at localP 0.5.
// with speed s: +s·(H+h)/2 → -s·(H+h)/2   (MOTION_SPEC §6, easing linear).
export function parallaxY(
  viewportH: number,
  imageH: number,
  speed: number,
  localP: number,
): number {
  const half = (speed * (viewportH + imageH)) / 2;
  return lerp(half, -half, clamp(localP));
}
