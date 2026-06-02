import Footer from "@/components/layout/Footer";
import BrandStory from "@/components/sections/home/BrandStory";
import CTA from "@/components/sections/home/CTA";
import Destinations from "@/components/sections/home/Destinations";
import Hero from "@/components/sections/home/Hero";
import HowItWorks from "@/components/sections/home/HowItWorks";
import Testimonial from "@/components/sections/home/Testimonial";

export default function Home() {
  return (
    <main className="flex w-full flex-col items-center">
      <Hero />
      <BrandStory />
      <HowItWorks />
      <Destinations />
      <Testimonial />
      <CTA />
      <Footer />
    </main>
  );
}
