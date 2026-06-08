import AboutHero from "@/components/sections/AboutHero";
import AboutMotionProvider from "@/components/sections/about/AboutMotionProvider";
import AboutIntro from "@/components/sections/about/AboutIntro";
import AboutSceneStage from "@/components/sections/about/AboutSceneStage";
import AboutCTA from "@/components/sections/about/AboutCTA";
import Footer from "@/components/layout/Footer";
import type { AboutSceneContent } from "@/types/about-scene-content";
import { client } from "@/sanity/lib/client";
import { mapAboutPage } from "@/sanity/lib/mapAboutPage";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";

// Simple coloured placeholder until real (CMS) photography is wired in.
const placeholder = (w: number, h: number, c1: string, c2: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23${c1}"/><stop offset="1" stop-color="%23${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" rx="20" fill="url(%23g)"/></svg>`;

const SCENE_A: AboutSceneContent = {
  headline: "Built for meaningful travel",
  body: "I founded PositivEarth to help guests travel smarter, connect deeper, and experience more. My work blends cultural insight with practical expertise so every traveler feels supported, confident, and fully prepared for meaningful global experiences.",
  images: [
    { imageUrl: placeholder(360, 255, "8a7d4a", "b3a667"), imageAlt: "" },
    { imageUrl: placeholder(420, 532, "6f7d52", "566441"), imageAlt: "" },
  ],
};

const SCENE_B: AboutSceneContent = {
  headline: "Guiding You Beyond the Itinerary",
  body: "My mission is to help you travel with confidence and cultural depth — by transforming overwhelm into clarity through personalized, done-for-you planning and expert guidance every step of the way. I blend real travel experience with cultural understanding so you feel supported, empowered, and fully prepared to explore the world with ease, authenticity, and connection.",
  images: [
    { imageUrl: placeholder(360, 431, "5b7790", "486079"), imageAlt: "" },
    { imageUrl: placeholder(360, 209, "6d8aa6", "3f566e"), imageAlt: "" },
  ],
};

// "Why Us" / coral (Figma about-7). The body is four short benefit statements,
// one per line (rendered via whitespace-pre-line).
const SCENE_C: AboutSceneContent = {
  headline: "Why Us",
  body: "Personalized, bilingual service (English & Spanish)\nOne-on-one support, always with me, never outsourced\nCulturally immersive, stress-free meetings and itineraries\nTrusted by travelers and industry professionals alike.",
  images: [
    { imageUrl: placeholder(360, 241, "7d8a6a", "566441"), imageAlt: "" },
    { imageUrl: placeholder(420, 374, "b06a5f", "8f4f46"), imageAlt: "" },
  ],
};

export default async function AboutPage() {
  const sanityAboutPage = client ? await client.fetch(ABOUT_PAGE_QUERY) : null;

  const content = mapAboutPage(sanityAboutPage);

  // Hero (about-1) → Intro (about-2, System 1) → pinned scene layer A/B/C
  // (about-3..7, Systems 2+3) → Footer CTA band (about-8/9, travel-up) → dark
  // footer. AboutMotionProvider sets up the shared Lenis + ScrollTrigger source
  // and the dev debug overlay.
  return (
    <main className="flex w-full flex-col items-center">
      <AboutMotionProvider>
        <AboutHero content={content?.hero} />
        <AboutIntro />
        <AboutSceneStage scenes={[SCENE_A, SCENE_B, SCENE_C]} />
        <AboutCTA />
        <Footer />
      </AboutMotionProvider>
    </main>
  );
}
