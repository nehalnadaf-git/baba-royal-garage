import type { Metadata } from "next";
import Image from "next/image";
import { business } from "@/lib/business";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import PageHero from "@/components/shared/PageHero";
import FindUsSection from "@/components/sections/FindUsSection";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "About Baba Royal Garage | Royal Enfield Specialist Hubli",
  description:
    "Learn about Baba Royal Garage, Hubli's trusted Royal Enfield specialist founded by Babajan Nadaf with 6+ years of focused expertise.",
  path: "/about",
  keywords: ["About Baba Royal Garage", "Royal Enfield specialist Hubli", "Babajan Nadaf"],
});

const values = [
  {
    title: "Specialist Expertise",
    desc: "We work exclusively on Royal Enfield motorcycles. This focused expertise means deeper knowledge of every model, every quirk, and every issue.",
  },
  {
    title: "Genuine Parts Only",
    desc: "We never compromise with aftermarket alternatives when genuine Royal Enfield parts are available. Your bike deserves authentic components.",
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden charges, no surprise bills. We explain what needs to be done and why before any work begins.",
  },
  {
    title: "Doorstep Convenience",
    desc: "Our pickup and drop service comes to you anywhere in Hubli. Your time is valuable and we respect that.",
  },
];



export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "About", item: "/about" },
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: business.name,
    description: business.fullDescription,
    url: business.url,
    telephone: business.phone1,
    foundingDate: "2018",
    founder: { "@type": "Person", name: business.owner.name },
    address: {
      "@type": "PostalAddress",
      streetAddress: business.branches[0].address,
      addressLocality: business.branches[0].city,
      addressRegion: "Karnataka",
      postalCode: business.branches[0].pincode,
      addressCountry: "IN",
    },
  };

  return (
    <>
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        overline="Our Story"
        title="About Baba Royal Garage"
        subtitle={business.fullDescription}
      />


      {/* ── Our Story ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[hsl(210,5%,95%)]">
        <div className="container mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <div className="reveal-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-6 bg-primary" />
                <span className="font-label text-primary text-[10px] lg:text-[11px] tracking-[0.25em] uppercase font-bold">Our Journey</span>
              </div>
              <h2
                className="font-display text-[#121212] uppercase mb-6"
                style={{ fontSize: "clamp(42px, 6vw, 84px)", lineHeight: 0.85, letterSpacing: "-0.01em" }}
              >
                Our Story
              </h2>
              <div className="w-12 h-[3.5px] bg-primary rounded-full mb-8" />
              
              <div className="space-y-6">
                <p className="font-body text-[#555] text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.8] lg:leading-[1.9]">
                  Baba Royal Garage was founded by Babajan Nadaf in Hubballi, Karnataka, driven by a deep passion for Royal Enfield motorcycles and a belief that RE riders in Hubli deserved a dedicated specialist — not a general-purpose mechanic.
                </p>
                <p className="font-body text-[#555] text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.8] lg:leading-[1.9]">
                  Starting with a single workshop in Keshwapur, Babajan built the garage on three principles: specialist expertise, genuine parts, and complete customer honesty. Word spread quickly among Hubli&apos;s Royal Enfield community, and within years we expanded to our second branch at Nehru Stadium.
                </p>
                <p className="font-body text-[#555] text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.8] lg:leading-[1.9]">
                  Today, Baba Royal Garage has completed over 1000 Royal Enfield repairs across Hubli-Dharwad. From routine oil changes to complete engine overhauls, every bike receives the same meticulous attention that has earned us 5-star reviews from riders across Karnataka.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="reveal-right">
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.10)] aspect-[4/3] lg:aspect-[3/2] bg-[hsl(210,5%,92%)]">
                <Image
                  src="/images/Baba Royal/Baba Royal wide.webp"
                  alt="Baba Royal Garage — Royal Enfield Specialist Hubli Story"
                  fill
                  className="object-cover scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Why Riders Trust Us ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[hsl(210,5%,96%)]">
        <div className="container mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">Our Principles</span>
          </div>
          <h2
            className="font-display text-foreground uppercase mb-12 lg:mb-16"
            style={{ fontSize: "clamp(32px, 5vw, 68px)", lineHeight: 0.9, letterSpacing: "0.015em" }}
          >
            Why Riders Trust Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="group relative bg-white rounded-2xl p-7 sm:p-8 lg:p-10 border border-[#e8ebf0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-primary/20 hover:shadow-[0_10px_40px_rgba(254,36,20,0.08)] transition-all duration-350 overflow-hidden"
              >
                {/* Animated bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-primary-light scale-x-0 group-hover:scale-x-100 transition-transform duration-400 rounded-b-2xl" />

                <div className="flex items-start gap-4 lg:gap-5">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-primary/8 border border-primary/12 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                  </div>
                  <div>
                    <h3
                      className="font-heading font-bold text-foreground uppercase tracking-wide mb-3"
                      style={{ fontSize: "clamp(13px, 1.1vw, 17px)" }}
                    >
                      {v.title}
                    </h3>
                    <p
                      className="font-body text-muted-foreground leading-[1.75] lg:leading-[1.85]"
                      style={{ fontSize: "clamp(14px, 1.05vw, 17px)" }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Find Us ───────────────────────────────────────────────────── */}
      <FindUsSection />

      <TestimonialsSection />
      <ServiceCTABanner />
    </>
  );
}
