export type BrandStoryContent = {
  heading: string;
  body: string[];
  emphasizedWord?: string;
  imageUrl?: string;
  imageAlt?: string;
  cta?: {
    label: string;
    href: string;
  };
};
