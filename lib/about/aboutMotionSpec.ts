// Transcription of MOTION_SPEC.md numbers. Code reads its motion values from
// here so there is one source of truth in the codebase. Each entry cites the
// spec section it comes from; do NOT invent values — update the spec first.

// §3 — global scroll budget (vh)
export const HERO_INTRO_VH = 100; // System 1 travel distance
export const SCENE_LAYER_VH = 300; // pinned scene stage travel

// §3 — scene boundaries within the pinned range (local p) + crossfade window
export const SCENE_MIDPOINTS = [0.33, 0.66] as const; // A→B, B→C
export const CROSSFADE_HALF = 0.05; // ± window around each midpoint

// §5 — scene background hexes (also tokenised in globals.css) and headlines.
// Ordered A → B → C; background interpolates linearly across these.
export const SCENE_BG_HEXES = ["#454545", "#61796C", "#333336"] as const;
export const HEADLINE_EXIT_EM = -0.4; // old headline translateY on exit (§5)

// §4 — System 1 text reveal. Each intro line's resting (about-2) position plus
// the side it reveals from. On enter, each line fades in (invisible → visible)
// while sliding in from one full span of itself: line 1 from one width to its
// left, line 2 from one width to its right, line 3 from one height below. The
// travel distance is the element's own measured width/height, so it is not
// stored here. Positions: vh / vw.
export type IntroLineMotion = {
  endYvh: number;
  endXvw: number;
  slide: "left" | "right" | "bottom"; // side the line reveals in from
  stagger: number; // p offset
};

// End positions are the exact about-2 (node 1150:1734) box top-lefts, expressed
// as %s of the 1512×982 frame: line 1 (174,151), line 2 (991,314), line 3 (829,779).
// Line 3 Y is nudged down to clear the portrait overlap while X stays at Figma.
export const INTRO_LINES: readonly IntroLineMotion[] = [
  { endXvw: 11.508, endYvh: 15.377, slide: "left", stagger: 0.0 },
  { endXvw: 65.542, endYvh: 31.976, slide: "right", stagger: 0.08 },
  { endXvw: 54.827, endYvh: 90, slide: "bottom", stagger: 0.16 },
];

// §4 — System 1 plays as a one-shot Smart-Animate transition when the intro
// enters view: custom cubic-bezier easing over a fixed duration (Figma transition
// settings). Stagger above is interpreted as a fraction of this duration.
export const INTRO_DURATION_MS = 1500;
export const INTRO_EASE_BEZIER = [0.82, 0, 0.15, 1] as const;

// §6 — decorative parallax images. w×h are the Figma image sizes (px); speed is
// the parallax coefficient. Index-aligned with each scene's images — about-3 has
// one image, about-5 and about-7 have two. Resting positions live in the scene
// stage component (layout, not motion).
export type SceneImageMotion = { w: number; h: number; speed: number };

export const SCENE_IMAGE_MOTION: readonly (readonly SceneImageMotion[])[] = [
  // Scene A (about-3): centred image + a taller image in the right column.
  [
    { w: 446, h: 485, speed: 1.0 },
    { w: 464, h: 532, speed: 0.7 },
  ],
  // Scene B (about-5): tall image left, landscape image top-right.
  [
    { w: 464, h: 626, speed: 1.0 },
    { w: 464, h: 349, speed: 0.7 },
  ],
  // Scene C (about-7): image top-left, image bottom-right.
  [
    { w: 461, h: 373, speed: 0.7 },
    { w: 464, h: 357, speed: 1.0 },
  ],
];
