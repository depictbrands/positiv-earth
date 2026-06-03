export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  heading: string;
  items: FaqItem[];
};
