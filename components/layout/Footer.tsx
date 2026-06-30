import Link from "next/link";

import Logo from "@/components/ui/Logo";
import type { LogoContent } from "@/types/logo-content";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

/** Set each profile URL here. Leave empty to hide that icon from the footer row. */
const FOOTER_SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/travel_positivearth/" },
  { label: "TikTok", href: "https://www.tiktok.com/@travel_positivearth" },
  { label: "WhatsApp", href: "https://wa.me/14015384703" },
  { label: "Facebook", href: "https://www.facebook.com/people/PositivEarth/61583837501564/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/travel-positivearth/" },
] as const;

type FooterSocialLabel = (typeof FOOTER_SOCIAL_LINKS)[number]["label"];

type FooterProps = {
  className?: string;
  logo?: LogoContent;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SocialIcon({ label }: { label: FooterSocialLabel }) {
  const commonProps = {
    "aria-hidden": true,
    className: "size-full",
    fill: "currentColor",
    viewBox: "0 0 24 24",
  };

  if (label === "Instagram") {
    return (
      <svg {...commonProps}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.415.56.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.896 1.382 3.744 3.744 0 0 1-1.382.896c-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.074c-1.17-.061-1.805-.256-2.227-.421a3.716 3.716 0 0 1-1.382-.896 3.71 3.71 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.074-4.85c.061-1.17.256-1.805.421-2.227.217-.562.477-.96.896-1.382a3.728 3.728 0 0 1 1.382-.896c.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zM12 0C8.741 0 8.332.014 7.052.072 5.775.132 4.905.333 4.14.63a5.882 5.882 0 0 0-2.126 1.384A5.868 5.868 0 0 0 .63 4.14C.333 4.905.131 5.775.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.06 1.277.261 2.148.558 2.913a5.898 5.898 0 0 0 1.384 2.126 5.868 5.868 0 0 0 2.126 1.384c.766.296 1.636.498 2.913.558C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 0 0 2.126-1.384 5.86 5.86 0 0 0 1.384-2.126c.296-.765.498-1.636.558-2.913.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.06-1.277-.262-2.148-.558-2.913a5.89 5.89 0 0 0-1.384-2.126A5.847 5.847 0 0 0 19.86.63c-.765-.297-1.636-.498-2.913-.558C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    );
  }

  if (label === "TikTok") {
    return (
      <svg {...commonProps}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );
  }

  if (label === "Facebook") {
    return (
      <svg {...commonProps}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg {...commonProps}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (label === "WhatsApp") {
    return (
      <svg {...commonProps}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    );
  }

  return null;
}

function FooterField({
  label,
  placeholder,
  className,
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col text-base-white", className)}>
      <span className="font-raleway text-footer-form-label">{label}</span>
      {placeholder ? (
        <span
          className="font-raleway text-footer-form-placeholder"
          style={{
            marginTop: "var(--spacing-footer-form-message-gap)",
          }}
        >
          {placeholder}
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className="block border-t"
        style={{
          borderColor: "var(--color-footer-divider)",
          marginTop: placeholder
            ? "var(--spacing-footer-form-message-gap)"
            : "var(--spacing-footer-form-line-offset-top)",
        }}
      />
    </label>
  );
}

export default function Footer({ className, logo }: FooterProps) {
  return (
    <footer
      className={cn("footer-scale relative w-full overflow-hidden", className)}
      style={{
        backgroundColor: "var(--color-footer-surface)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-footer-overlay)" }}
      />

      <div className="relative mx-auto w-full max-w-[var(--size-footer-width)] px-6 py-14 sm:px-10 lg:px-[var(--spacing-footer-logo-offset-x)] lg:py-[var(--spacing-footer-logo-offset-top)]">
        <Logo
          variant="footer"
          imageUrl={logo?.headerLogoUrl}
          imageAlt={logo?.headerLogoAlt}
          surface="dark"
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-[var(--spacing-footer-connect-gap)] lg:grid-cols-2 lg:gap-x-16">
          {/* Left column: connect copy + contact stacked, with quick links
              pulled up beside them so it top-aligns with the heading and form */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-[var(--spacing-footer-contact-gap)]">
            <div className="flex flex-col gap-12 lg:max-w-[var(--size-footer-support-width)]">
              <section
                aria-labelledby="footer-connect-heading"
                className="flex flex-col items-start"
                style={{ gap: "var(--spacing-footer-connect-gap)" }}
              >
                <div
                  className="flex w-full max-w-[var(--size-footer-support-width)] flex-col items-start"
                  style={{ gap: "var(--spacing-footer-connect-copy-gap)" }}
                >
                  <h2
                    id="footer-connect-heading"
                    className="font-body text-footer-heading text-base-white"
                  >
                    Connect with Us
                  </h2>
                  <p className="font-body text-footer-support text-base-white">
                    <span className="font-semibold">
                      Travel confidently. Connect deeply. Experience more.
                    </span>
                    <br />
                    Cultural travel planning + coaching—so you don&apos;t just visit
                    places… you belong in them.
                  </p>
                </div>

                <div
                  className="flex flex-wrap items-center text-base-white"
                  style={{ gap: "var(--spacing-footer-social-gap)" }}
                >
                  {FOOTER_SOCIAL_LINKS.map((item) => {
                    const iconBoxClassName =
                      "focus-ring-white inline-flex size-[var(--size-footer-social-icon)] transition-opacity hover:opacity-80 active:opacity-70 focus-visible:rounded-full";
                    const icon = (
                      <>
                        <span className="sr-only">{item.label}</span>
                        <SocialIcon label={item.label} />
                      </>
                    );

                    if (item.href.trim()) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={iconBoxClassName}
                        >
                          {icon}
                        </a>
                      );
                    }

                    return (
                      <span
                        key={item.label}
                        className={iconBoxClassName}
                        aria-hidden="true"
                      >
                        {icon}
                      </span>
                    );
                  })}
                </div>
              </section>

              <section
                aria-label="Contact information"
                className="flex w-full max-w-[var(--size-footer-contact-column-width)] flex-col items-start text-base-white"
                style={{ gap: "var(--spacing-footer-contact-copy-gap)" }}
              >
                <a
                  href="mailto:positivearth@jorgefrivera.com"
                  className="font-open-sans text-body-1 underline transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
                >
                  positivearth@jorgefrivera.com
                </a>
                <p className="font-open-sans text-body-1">+1 (401) 538-4703</p>
                <p className="font-open-sans text-body-1">
                  Rhode Island • Serving travelers worldwide
                </p>
              </section>
            </div>

            <nav
              aria-label="Footer"
              className="flex flex-col items-start text-base-white"
              style={{ gap: "var(--spacing-footer-quick-links-gap)" }}
            >
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-open-sans text-body-1 transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right column: contact form */}
          <section
            aria-label="Contact form"
            className="flex w-full max-w-[var(--size-footer-form-width)] flex-col items-start lg:ml-auto"
          >
            <div
              className="flex w-full flex-col items-start"
              style={{ gap: "var(--spacing-footer-form-sections-gap)" }}
            >
              <div
                className="flex w-full flex-col sm:flex-row"
                style={{ gap: "var(--spacing-footer-form-row-gap)" }}
              >
                <FooterField label="First Name" className="w-full flex-1" />
                <FooterField label="Last Name" className="w-full flex-1" />
              </div>

              <div
                className="flex w-full flex-col sm:flex-row"
                style={{ gap: "var(--spacing-footer-form-row-gap)" }}
              >
                <FooterField label="Email" className="w-full flex-1" />
                <FooterField label="Phone Number" className="w-full flex-1" />
              </div>

              <FooterField
                label="Message"
                placeholder="Write your message."
                className="w-full"
              />
            </div>

            <button
              type="button"
              className="focus-ring-white mt-10 inline-flex w-auto min-w-[var(--size-footer-submit-width)] items-center justify-center self-end whitespace-nowrap rounded-search-button-corner border border-base-white bg-transparent px-[var(--spacing-footer-submit-padding-x)] py-[var(--spacing-footer-submit-padding-y)] font-body text-cta-button text-base-white shadow-[var(--shadow-footer-submit)] transition-opacity hover:opacity-80 active:opacity-70"
            >
              Send Message
            </button>
          </section>
        </div>

        <div
          aria-hidden="true"
          className="mt-14 w-full border-t"
          style={{ borderColor: "var(--color-footer-divider)" }}
        />

        <section
          aria-label="Legal information"
          className="mt-6 flex flex-col items-start gap-4 text-base-white sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <p className="font-open-sans text-footer-legal">
            © 2026 PositivEarth. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <Link
              href="#"
              className="font-open-sans text-footer-legal transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-base-white">
              •
            </span>
            <Link
              href="#"
              className="font-open-sans text-footer-legal transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
            >
              Terms of Use
            </Link>
          </div>

          <p className="font-open-sans text-footer-legal">
            Design &amp; Development by{" "}
            <a
              href="https://depictbrands.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white"
            >
              Depict Brands
            </a>
          </p>
        </section>
      </div>
    </footer>
  );
}
