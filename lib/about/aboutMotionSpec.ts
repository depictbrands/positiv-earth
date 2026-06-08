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
export const SCENE_BG_HEXES = ["#c7b97a", "#7297ae", "#c47066"] as const;
export const HEADLINE_EXIT_EM = -0.4; // old headline translateY on exit (§5)

// §4 — System 1 text reposition. Each intro line's start (off-screen) and end
// (about-2 resting) positions, with a per-line stagger. Units: vh / vw.
export type IntroLineMotion = {
  startYvh: number;
  endYvh: number;
  startXvw: number;
  endXvw: number;
  stagger: number; // p offset
};

export const INTRO_LINES: readonly IntroLineMotion[] = [
  { startYvh: 100, endYvh: 15, startXvw: 0, endXvw: 9, stagger: 0.0 },
  { startYvh: 130, endYvh: 42, startXvw: 68, endXvw: 62, stagger: 0.08 },
  { startYvh: 169, endYvh: 74, startXvw: 19, endXvw: 25, stagger: 0.16 },
];

// §6 — decorative parallax images. h is the Figma image height (px); s is the
// speed coefficient. Index-aligned with each scene's two images.
export type SceneImageMotion = { h: number; speed: number };

export const SCENE_IMAGE_MOTION: readonly (readonly [
  SceneImageMotion,
  SceneImageMotion,
])[] = [
  [
    { h: 255, speed: 0.7 }, // img-1.1
    { h: 532, speed: 1.0 }, // img-1.2
  ],
  [
    { h: 431, speed: 1.0 }, // img-2.1
    { h: 209, speed: 0.7 }, // img-2.2
  ],
  [
    { h: 241, speed: 0.7 }, // img-3.1
    { h: 374, speed: 1.0 }, // img-3.2
  ],
];

// §7 — footer CTA band travel-up (NOT pinned).
export const FOOTER_BAND_H = 580; // px
export const FOOTER_BAND_SPEED = 0.8; // < 1
