"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import ElfsightWhatsAppChat from "@/components/layout/ElfsightWhatsAppChat";
import Footer from "@/components/layout/Footer";
import SiteHeader from "@/components/layout/SiteHeader";
import type { LogoContent } from "@/types/logo-content";

// Renders the single top-level banner (SiteHeader) and contentinfo (Footer) as
// siblings of each page's <main>, so the header/footer are proper top-level
// landmarks instead of being nested inside <main>. Route-aware exceptions:
//   - /studio (Sanity Studio): no site chrome at all.
//   - /design-your-travel (quiz flow): header only, no footer (matches the
//     previous design where the quiz page had no footer).
export default function SiteChrome({
  children,
  logo,
}: {
  children: ReactNode;
  logo?: LogoContent;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  const showFooter = pathname !== "/design-your-travel";

  return (
    <>
      <SiteHeader logo={logo} />
      {children}
      {showFooter ? <Footer logo={logo} /> : null}
      <ElfsightWhatsAppChat />
    </>
  );
}
