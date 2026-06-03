export type Service = {
  // The first word renders white (over the photo); the rest renders black
  // (below the photo). Stored as a single string for clean CMS authoring.
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

export type ThreeServicesContent = {
  services: Service[];
};
