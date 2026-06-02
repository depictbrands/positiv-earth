export type HowItWorksSteps = [
  string,
  string,
  string,
  string,
  string,
];

export type HowItWorksContent = {
  heading: string;
  steps: HowItWorksSteps;
  body: string;
  emphasizedWord?: string;
  imageUrl?: string;
  imageAlt?: string;
  cta?: {
    label: string;
    href: string;
  };
};
