// A single credential statement in the intro (Figma about-2). Each is rendered
// two-tone: an emphasised fragment (burnt-orange italic serif) followed by the
// remaining text (black sans). Split into two fields so the CMS keeps editorial
// control over which words are emphasised.
export type AboutIntroStat = {
  emphasis: string; // e.g. "12 years"
  rest: string; // e.g. "in airline industry"
};

export type AboutIntroContent = {
  // The three credential statements that rise from below into their resting
  // positions (MOTION_SPEC §4 / Figma about-2).
  stats: [AboutIntroStat, AboutIntroStat, AboutIntroStat];
  // Centre portrait photo of the advisor (Jorge) shown in about-2.
  portraitImageUrl: string;
  portraitImageAlt: string;
};
