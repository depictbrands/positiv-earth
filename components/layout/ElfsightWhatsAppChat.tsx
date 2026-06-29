import Script from "next/script";

const ELFSIGHT_APP_ID = "9bdd7f0c-f549-4b25-9548-e8317b00ff38";

// Floating WhatsApp chat widget (Elfsight). Loaded lazily on all public pages;
// excluded from /studio via SiteChrome.
export default function ElfsightWhatsAppChat() {
  return (
    <>
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />
      <div
        className={`elfsight-app-${ELFSIGHT_APP_ID}`}
        data-elfsight-app-lazy
      />
    </>
  );
}
