export type HowItWorksStep = {
  title: string;
  body: string;
};

export type HowItWorksSteps = [
  HowItWorksStep,
  HowItWorksStep,
  HowItWorksStep,
  HowItWorksStep,
  HowItWorksStep,
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
