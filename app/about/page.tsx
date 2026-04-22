import type { Metadata } from "next";
import Image from "next/image";
import { business } from "@/lib/business";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import PageHero from "@/components/shared/PageHero";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { CheckCircle, MapPin, ArrowUpRight, Clock } from "lucide-react";

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
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
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
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.1)] aspect-[4/3] lg:aspect-[3/2] bg-[#0A0A0A]">
                <Image
                  src="/images/logo/logo-wide.webp"
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

      {/* ── Our Branches ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-60 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[400px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative container mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">Locations</span>
          </div>
          <h2
            className="font-display text-white uppercase mb-12 lg:mb-14"
            style={{ fontSize: "clamp(32px, 5vw, 68px)", lineHeight: 0.9, letterSpacing: "0.015em" }}
          >
            Our Branches
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {business.branches.map((branch, idx) => (
              <div
                key={branch.id}
                className="group relative rounded-2xl p-7 sm:p-8 lg:p-10 overflow-hidden transition-all duration-350 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Top shimmer on hover */}
                <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Branch label */}
                <div className="flex items-center justify-between mb-5 lg:mb-6">
                  <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.28em] uppercase font-black">
                    {branch.name}
                  </span>
                  {idx === 0 && (
                    <span
                      className="font-label text-[9px] tracking-[0.18em] uppercase px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(232,25,42,0.85)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "white",
                      }}
                    >
                      Main Branch
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4 lg:space-y-5 mb-7 lg:mb-8">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-body text-white/65 text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed pt-0.5">
                      {branch.address}, {branch.city} {branch.pincode}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-body text-white/65 text-[14px] sm:text-[15px] lg:text-[16px]">
                      {business.hours.weekdays}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2 text-primary font-heading font-bold text-[12px] sm:text-[13px] lg:text-[14px] uppercase tracking-[0.14em] hover:text-white transition-colors"
                >
                  Get Directions
                  <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <ServiceCTABanner />
    </>
  );
}
