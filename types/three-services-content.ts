export type Service = {
  // Rendered in full inside the caption card. Stored as a single string for
  // clean CMS authoring.
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

export type ThreeServicesContent = {
  services: Service[];
};
