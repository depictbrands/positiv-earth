export type Testimonial = {
  videoUrl: string;
  posterUrl?: string;
  alt: string;
  name?: string;
};

export type TestimonialSectionContent = {
  heading?: string;
  testimonials: Testimonial[];
};
