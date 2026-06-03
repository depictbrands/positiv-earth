export type ContactSocialPlatform = "Instagram" | "TikTok" | "WhatsApp";

export type ContactSocialLink = {
  platform: ContactSocialPlatform;
  url: string;
};

export type ContactInfoPhoto = {
  imageUrl: string;
  imageAlt: string;
};

export type ContactInfoContent = {
  /** Advisor name shown as the heading. */
  name: string;
  email: string;
  phone: string;
  socials: ContactSocialLink[];
  /** Profile photos — the first two are rendered as the overlapping pair. */
  photos: ContactInfoPhoto[];
};
