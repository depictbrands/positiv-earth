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
      {/* The chat itself renders as a fixed floating button, but this mount
          element sits in normal flow (a flex item of <body>) and reserves
          vertical space, which showed as white space below the footer. The
          zero-height clipped wrapper removes that in-flow footprint; the fixed
          widget escapes the clip and still displays. */}
      <div className="h-0 overflow-clip">
        <div
          className={`elfsight-app-${ELFSIGHT_APP_ID}`}
          data-elfsight-app-lazy
        />
      </div>
    </>
  );
}
