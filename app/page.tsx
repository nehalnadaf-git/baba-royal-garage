import type { Metadata } from "next";
import HomeHero from "@/components/sections/HomeHero";

import ServicesSection from "@/components/sections/ServicesSection";
import GalleryPreviewSection from "@/components/sections/GalleryPreviewSection";
import AboutSection from "@/components/sections/AboutSection";
import WhySpecialistSection from "@/components/sections/WhySpecialistSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FindUsSection from "@/components/sections/FindUsSection";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import { buildHomeBusinessGraphSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Baba Royal Garage | Royal Enfield Specialist Hubli | Expert Service & Repair",
  description:
    "Hubli's most trusted Royal Enfield specialist. Expert servicing, engine repair, genuine parts, and doorstep pickup across Hubli with 2 branches.",
  path: "/",
  keywords: [
    "Royal Enfield specialist Hubli",
    "Royal Enfield service Hubli",
    "Royal Enfield repair Hubli",
    "Baba Royal Garage",
  ],
});

export default function HomePage() {
  const schema = buildHomeBusinessGraphSchema();

  return (
    <div id="home-reveal-root">
      <SchemaMarkup schema={schema} />
      <HomeHero />

      <ServicesSection showViewAll={true} variant="light" />
      <GalleryPreviewSection />
      <AboutSection />
      <WhySpecialistSection />
      <TestimonialsSection />
      <FindUsSection />
    </div>
  );
}
