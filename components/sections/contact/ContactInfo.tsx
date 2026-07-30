import Image from "next/image";

import SocialIcon from "@/components/ui/SocialIcon";
import type {
  ContactInfoContent,
  ContactInfoPhoto,
} from "@/types/contact-info-content";

const DEFAULT_PHOTO_PRIMARY =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 468"><defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23bcdcef"/><stop offset="1" stop-color="%237a9a5a"/></linearGradient></defs><rect width="393" height="468" fill="url(%23g1)"/><circle cx="196" cy="200" r="70" fill="%23ffffff" fill-opacity="0.35"/><rect x="120" y="300" width="153" height="168" rx="76" fill="%23ffffff" fill-opacity="0.3"/></svg>';

const DEFAULT_PHOTO_SECONDARY =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 468"><defs><linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23c7a87a"/><stop offset="1" stop-color="%235f4a30"/></linearGradient></defs><rect width="393" height="468" fill="url(%23g2)"/><circle cx="196" cy="200" r="70" fill="%23ffffff" fill-opacity="0.35"/><rect x="120" y="300" width="153" height="168" rx="76" fill="%23ffffff" fill-opacity="0.3"/></svg>';

const DEFAULT_CONTENT: ContactInfoContent = {
  name: "Jorge Rivera",
  email: "positivearth@jorgefrivera.com",
  phone: "+1 (401) 538-4703",
  socials: [
    { platform: "Instagram", url: "#" },
    { platform: "TikTok", url: "#" },
    { platform: "WhatsApp", url: "#" },
    { platform: "Facebook", url: "#" },
    { platform: "LinkedIn", url: "#" },
  ],
  photos: [
    {
      imageUrl: DEFAULT_PHOTO_PRIMARY,
      imageAlt: "Travel advisor exploring an archaeological site",
    },
    {
      imageUrl: DEFAULT_PHOTO_SECONDARY,
      imageAlt: "Travel advisor crossing a rustic wooden bridge",
    },
  ],
};

type ContactInfoProps = {
  content?: ContactInfoContent;
};

function resolveContactInfoContent(
  content?: ContactInfoContent,
): ContactInfoContent {
  const photos = content?.photos?.length
    ? content.photos
    : DEFAULT_CONTENT.photos;
  return {
    name: content?.name?.trim() || DEFAULT_CONTENT.name,
    email: content?.email?.trim() || DEFAULT_CONTENT.email,
    phone: content?.phone?.trim() || DEFAULT_CONTENT.phone,
    socials: content?.socials?.length
      ? content.socials
      : DEFAULT_CONTENT.socials,
    photos,
  };
}

function ProfilePhoto({
  photo,
  className,
  style,
}: {
  photo: ContactInfoPhoto;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      // Position is supplied by the caller (absolute on desktop, relative on
      // mobile) so the `fill` image always has a positioned ancestor.
      className={`overflow-hidden rounded-card-corner ${className ?? ""}`}
      style={style}
    >
      <Image
        src={photo.imageUrl}
        alt={photo.imageAlt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 26vw, 100vw"
      />
    </div>
  );
}

export default function ContactInfo({ content }: ContactInfoProps) {
  const resolved = resolveContactInfoContent(content);
  const [primary, secondary] = resolved.photos;

  return (
    <section
      aria-labelledby="contact-info-heading"
      className="w-full bg-secondary-black"
    >
      {/* Edge gutter matches the rest of the site (e.g. Footer / FAQ): the
          container spans the full 1512px frame and insets by the 48px side
          offset, so the 1416px content row sits 48px from the viewport edge. */}
      {/* From `lg` up the row is the design composition; the geometry tokens
          scale with the viewport between 1024px and the 1512px frame so the
          photos and the detail column shrink together. The column gap is a
          justify-between minimum — free space exceeds it at every width in
          that range, so it only kicks in as a guard against collision. */}
      <div
        className="mx-auto flex w-full max-w-[calc(var(--size-contact-info-width)_+_var(--spacing-contact-info-side-offset)_*_2)] flex-col items-center gap-12 px-6 sm:px-10 lg:flex-row lg:justify-between lg:gap-[var(--spacing-contact-info-column-gap)] lg:px-[var(--spacing-contact-info-side-offset)]"
        style={{
          paddingBlock: "var(--spacing-contact-info-block-offset)",
        }}
      >
        {/* Profile photos */}
        {/* Desktop: the two photos overlap in a staggered composition. */}
        <div
          className="relative hidden shrink-0 lg:block"
          style={{
            width: "var(--size-contact-info-photos-width)",
            height: "var(--size-contact-info-photos-height)",
          }}
        >
          {primary ? (
            <ProfilePhoto
              photo={primary}
              className="absolute left-0 top-0"
              style={{
                width: "var(--size-contact-info-photo-width)",
                height: "var(--size-contact-info-photo-height)",
              }}
            />
          ) : null}
          {secondary ? (
            <ProfilePhoto
              photo={secondary}
              className="absolute"
              style={{
                width: "var(--size-contact-info-photo-width)",
                height: "var(--size-contact-info-photo-height)",
                left: "var(--spacing-contact-info-photo-offset-x)",
                top: "var(--spacing-contact-info-photo-offset-y)",
              }}
            />
          ) : null}
        </div>

        {/* Mobile / tablet: photos stack, capped at the design photo width. */}
        <div className="flex w-full flex-col items-center gap-6 lg:hidden">
          {primary ? (
            <ProfilePhoto
              photo={primary}
              className="relative aspect-[393/468] w-full max-w-[var(--size-contact-info-photo-width)]"
            />
          ) : null}
          {secondary ? (
            <ProfilePhoto
              photo={secondary}
              className="relative aspect-[393/468] w-full max-w-[var(--size-contact-info-photo-width)]"
            />
          ) : null}
        </div>

        {/* Contact details */}
        {/* Below `lg` the column is centered under the stacked photos and capped
            at the same photo width, so the details read as one centered stack;
            from `lg` it returns to the design's left-aligned column. */}
        <div
          className="flex w-full max-w-[var(--size-contact-info-photo-width)] flex-col items-center text-center lg:w-[var(--size-contact-info-column-width)] lg:max-w-none lg:items-start lg:text-left"
          style={{ gap: "var(--spacing-contact-info-column-gap)" }}
        >
          <h2
            id="contact-info-heading"
            className="font-display text-heading-4 text-base-white"
          >
            {resolved.name}
          </h2>

          <div
            className="flex w-full flex-col items-center lg:items-start"
            style={{ gap: "var(--spacing-contact-info-details-gap)" }}
          >
            <div
              className="flex w-full flex-col items-center lg:items-start"
              style={{ gap: "var(--spacing-contact-info-detail-gap)" }}
            >
              <a
                href={`mailto:${resolved.email}`}
                className="font-merriweather-sans text-p1 text-base-white underline decoration-from-font transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
                style={{ wordBreak: "break-word" }}
              >
                {resolved.email}
              </a>
              <p className="font-merriweather-sans text-p1 text-base-white">
                {resolved.phone}
              </p>
            </div>

            <div
              className="flex flex-wrap items-center justify-center text-base-white lg:justify-start"
              style={{ gap: "var(--spacing-contact-info-social-gap)" }}
            >
              {resolved.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
                  style={{
                    width: "var(--size-contact-info-social-icon)",
                    height: "var(--size-contact-info-social-icon)",
                  }}
                >
                  <span className="sr-only">{social.platform}</span>
                  <SocialIcon label={social.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
