// One decorative image in a scene. These parallax over the scene at speeds set
// by MOTION_SPEC §6; the image source/alt are content, the motion params are
// structural and live in the spec.
export type AboutSceneImage = {
  imageUrl: string;
  imageAlt: string;
};

export type AboutSceneContent = {
  // Center-column headline for the scene (MOTION_SPEC §5 — Scene A/B/C).
  headline: string;
  // Supporting paragraph shown beneath the headline (Figma about-3/5/7).
  body: string;
  // The two decorative parallax images that flank the text column
  // (MOTION_SPEC §6 — e.g. img-1.1 / img-1.2 for Scene A).
  images: [AboutSceneImage, AboutSceneImage];
};
