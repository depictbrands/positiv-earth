export type Testimonial = {
  name: string;
  quote: string;
  avatarUrl: string;
  avatarAlt: string;
};

export type TestimonialSectionContent = {
  heading?: string;
  testimonials: Testimonial[];
};
