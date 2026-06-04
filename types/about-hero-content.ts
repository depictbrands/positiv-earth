export type AboutHeroContent = {
  // The headline reads "Meet {name}, {role}" — a small lead word, a large
  // emphasized name, and a small trailing role line. Stored as three plain
  // fields so the CMS keeps editorial control over each part.
  lead: string;
  name: string;
  role: string;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
};
