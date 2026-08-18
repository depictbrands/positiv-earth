export type LogoContent = {
  headerLogoUrl?: string;
  headerLogoAlt: string;
  faviconUrl?: string;
  /** MIME type of the favicon asset, derived from its Sanity extension. */
  faviconType?: string;
  /** `WxH` for raster favicons, `any` for SVG. */
  faviconSizes?: string;
};

export const DEFAULT_LOGO_CONTENT: LogoContent = {
  headerLogoAlt: "Positiv Earth",
};
