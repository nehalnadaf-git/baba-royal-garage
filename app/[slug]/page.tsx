import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { reModels, getModelBySlug } from "@/lib/models";
import { locations, getLocationBySlug } from "@/lib/locations";
import { services } from "@/lib/services";
import { business } from "@/lib/business";
import { buildBreadcrumbSchema, buildFaqSchema, buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import {
  CheckCircle, Wrench, ChevronRight, Phone, MapPin, Clock,
  Navigation, MessageCircle, Shield, Award, Truck, Star, ArrowRight
} from "lucide-react";

// Combine all slugs for static generation
export async function generateStaticParams() {
  const modelSlugs = reModels.map((m) => ({ slug: m.slug }));
  const locationSlugs = locations.map((l) => ({ slug: l.slug }));
  return [...modelSlugs, ...locationSlugs];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (model) {
    return buildPageMetadata({
      title: model.metaTitle,
      description: model.metaDescription,
      path: `/${model.slug}`,
      keywords: [
        `${model.name} service Hubli`,
        "Royal Enfield service Hubli",
        "Baba Royal Garage",
      ],
    });
  }
  const location = getLocationBySlug(slug);
  if (location) {
    return buildPageMetadata({
      title: location.metaTitle,
      description: location.metaDescription,
      path: `/${location.slug}`,
      keywords: [
        `Royal Enfield service ${location.name} Hubli`,
        "Doorstep pickup Hubli",
        "Baba Royal Garage",
      ],
    });
  }
  return { title: "Not Found" };
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // --- MODEL PAGE ---
  const model = getModelBySlug(slug);
  if (model) {
    const recommendedServiceData = services.filter((s) => model.recommendedServices.includes(s.slug));
    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Services", item: "/services" },
      { name: model.fullName, item: `/${model.slug}` },
    ]);
    const modelFaqSchema = model.faqs.length > 0 ? buildFaqSchema(model.faqs) : null;

    // Pre-filled WhatsApp message for this specific model
    const waMessage = `Hi, I'd like to book a service for my Royal Enfield ${model.fullName}. Please confirm the available slot and share the details. Thank you!`;
    const modelWaUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(waMessage)}`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${model.fullName} Service & Repair Hubli`,
      provider: { "@type": "AutoRepair", name: business.name, url: business.url, telephone: business.phone1 },
      areaServed: { "@type": "City", name: "Hubli" },
      url: `${business.url}/${model.slug}`,
    };

    return (
      <>
        <SchemaMarkup schema={schema} />
        <SchemaMarkup schema={breadcrumbSchema} />
        {modelFaqSchema ? <SchemaMarkup schema={modelFaqSchema} /> : null}

        {/* ── HERO ── */}
        <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 bg-[hsl(220,14%,5%)] overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark opacity-70 pointer-events-none" />
          {/* Glow kept well above bottom so it doesn't bleed */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[320px] bg-primary/6 rounded-full blur-[160px] pointer-events-none" />

          <div className="relative container mx-auto px-5 sm:px-8">
            {/* Breadcrumb — centered */}
            <nav className="flex items-center justify-center gap-2 text-[11px] text-white/40 mb-8 font-body flex-wrap" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-white/70">{model.name}</span>
            </nav>

            {/* Hero content — centered */}
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                <Wrench className="h-3.5 w-3.5 text-primary" />
                <span className="font-label text-primary text-[10px] sm:text-[11px] uppercase tracking-widest">Royal Enfield · Hubli Specialist</span>
              </div>

              <h1
                className="font-display text-white uppercase mb-4"
                style={{ fontSize: "clamp(36px,7vw,88px)", lineHeight: 0.88, letterSpacing: "0.015em" }}
              >
                {model.fullName}<br />
                <span className="text-primary">Service in Hubli</span>
              </h1>

              {/* Centered divider */}
              <div className="w-12 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mx-auto mb-5" />

              {/* Meta strip */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <span className="font-label text-white/40 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">{model.year}</span>
                <span className="text-white/20">·</span>
                <span className="font-label text-white/40 text-[10px] sm:text-[11px] tracking-[0.12em]">{model.engineType}</span>
              </div>

              {/* CTAs — centered, full-width on mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={modelWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 overflow-hidden bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.10em] transition-all duration-300 hover:shadow-[0_8px_28px_rgba(232,25,42,0.40)] hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  Book Service
                </a>
                <a
                  href={`tel:${business.phone1}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.10em] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Smooth gradient bridge — eliminates hard colour cut */}
        <div className="h-10 bg-gradient-to-b from-[hsl(220,14%,5%)] to-[hsl(210,5%,95%)]" />

        {/* ── MAIN CONTENT ── */}
        <section className="pt-4 pb-14 sm:pb-24 bg-[hsl(210,5%,95%)]">
          <div className="container mx-auto px-5 sm:px-8">
            <div className="max-w-2xl mx-auto space-y-14">

              {/* Description */}
              <div className="section-fade-in text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-7 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">Model Overview</span>
                  <div className="h-[1px] w-7 bg-primary/60" />
                </div>
                <h2
                  className="font-display text-foreground uppercase mb-6"
                  style={{ fontSize: "clamp(22px,3.5vw,40px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                >
                  {model.fullName} Service at Baba Royal Garage
                </h2>
                <div className="space-y-4 text-left">
                  {model.description.split("\n\n").map((para, i) => (
                    <p key={i} className="font-body text-muted-foreground text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.85]">{para}</p>
                  ))}
                </div>
              </div>

              {/* Common Issues */}
              <div className="section-fade-in text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-7 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">Diagnostics</span>
                  <div className="h-[1px] w-7 bg-primary/60" />
                </div>
                <h2
                  className="font-display text-foreground uppercase mb-6"
                  style={{ fontSize: "clamp(20px,3vw,36px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                >
                  Common {model.name} Issues We Fix
                </h2>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {model.commonIssues.map((issue) => (
                    <span
                      key={issue}
                      className="font-body text-[13px] sm:text-[14px] text-primary bg-primary/8 border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/15 transition-colors"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Services */}
              {recommendedServiceData.length > 0 && (
                <div className="section-fade-in text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-[1px] w-7 bg-primary/60" />
                    <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">Recommended</span>
                    <div className="h-[1px] w-7 bg-primary/60" />
                  </div>
                  <h2
                    className="font-display text-foreground uppercase mb-6"
                    style={{ fontSize: "clamp(20px,3vw,36px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                  >
                    Recommended Services for {model.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
                    {recommendedServiceData.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="group bg-white rounded-2xl p-5 border border-[#e8ebf0] hover:border-primary/25 hover:shadow-[0_6px_24px_rgba(232,25,42,0.07)] transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <h3 className="font-heading font-bold text-foreground text-[13px] uppercase tracking-wide group-hover:text-primary transition-colors mb-1.5">{s.name}</h3>
                        <p className="font-body text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed">{s.shortDescription}</p>
                        <div className="mt-3 flex items-center gap-1 text-primary font-heading font-bold text-[10px] uppercase tracking-[0.12em]">
                          Learn more <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {model.faqs.length > 0 && (
                <div className="section-fade-in text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-[1px] w-7 bg-primary/60" />
                    <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">Questions</span>
                    <div className="h-[1px] w-7 bg-primary/60" />
                  </div>
                  <h2
                    className="font-display text-foreground uppercase mb-6"
                    style={{ fontSize: "clamp(20px,3vw,36px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                  >
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3 text-left">
                    {model.faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="group bg-white rounded-2xl border border-[#e8ebf0] hover:border-primary/25 hover:shadow-[0_6px_24px_rgba(232,25,42,0.07)] transition-all duration-300 overflow-hidden"
                      >
                        <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none select-none min-h-[56px]">
                          <span className="font-heading font-bold text-foreground text-[13px] sm:text-[14px] lg:text-[16px] uppercase tracking-wide leading-snug">{faq.question}</span>
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 rotate-90 group-open:-rotate-90 transition-transform duration-300" />
                        </summary>
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                          <div className="h-px bg-[#eceef2] mb-4" />
                          <p className="font-body text-muted-foreground text-[13px] sm:text-[14px] lg:text-[15.5px] leading-relaxed">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <ServiceCTABanner />
      </>
    );
  }

  // --- LOCATION PAGE ---
  const location = getLocationBySlug(slug);
  if (location) {
    const branch = business.branches.find((b) => b.id === location.nearestBranch)!;
    const topServices = services.slice(0, 8);
    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Services", item: "/services" },
      { name: `${location.name}, Hubli`, item: `/${location.slug}` },
    ]);
    const locationFaqSchema = location.faqs.length > 0 ? buildFaqSchema(location.faqs) : null;

    // Pre-filled WhatsApp message for this location
    const locWaMessage = `Hi, I'd like to book a Royal Enfield service pickup from ${location.name}, Hubli. Please confirm availability. Thank you!`;
    const locWaUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(locWaMessage)}`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "AutoRepair",
      name: `Baba Royal Garage — Royal Enfield Service ${location.name} Hubli`,
      description: location.metaDescription,
      url: `${business.url}/${location.slug}`,
      telephone: business.phone1,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.address,
        addressLocality: `${location.name}, Hubli`,
        addressRegion: "Karnataka",
        postalCode: branch.pincode,
        addressCountry: "IN",
      },
      areaServed: { "@type": "City", name: `${location.name}, Hubli` },
    };

    return (
      <>
        <SchemaMarkup schema={schema} />
        <SchemaMarkup schema={breadcrumbSchema} />
        {locationFaqSchema && <SchemaMarkup schema={locationFaqSchema} />}

        {/* ── HERO ── */}
        <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 bg-[hsl(220,14%,5%)] overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark opacity-70 pointer-events-none" />
          {/* Glow kept well above bottom so it doesn't bleed */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[320px] bg-primary/6 rounded-full blur-[160px] pointer-events-none" />

          <div className="relative container mx-auto px-5 sm:px-8">
            {/* Breadcrumb — centered */}
            <nav className="flex items-center justify-center gap-2 text-[11px] text-white/40 mb-8 font-body flex-wrap" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-white/70">{location.name}, Hubli</span>
            </nav>

            {/* Hero content — centered */}
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="font-label text-primary text-[10px] sm:text-[11px] uppercase tracking-widest">
                  Royal Enfield Service · {location.name}, Hubli
                </span>
              </div>

              <h1
                className="font-display text-white uppercase mb-4"
                style={{ fontSize: "clamp(36px,7vw,88px)", lineHeight: 0.88, letterSpacing: "0.015em" }}
              >
                Royal Enfield Service<br />
                <span className="text-primary">in {location.name}</span>
              </h1>

              <div className="w-12 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mx-auto mb-5" />

              <p className="font-body text-white/60 text-[15px] sm:text-[17px] leading-relaxed mb-6 max-w-xl mx-auto">
                Baba Royal Garage serves <strong className="text-white/90">{location.name}</strong> with specialist
                Royal Enfield care —{" "}
                <strong className="text-primary">{location.distanceFromBranch}</strong> from our nearest branch,
                with free doorstep pickup anywhere in Hubli.
              </p>

              {/* Landmark chips — centered */}
              {location.landmarks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {location.landmarks.map((lm) => (
                    <span
                      key={lm}
                      className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 text-[11px] px-3 py-1.5 rounded-full"
                    >
                      <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                      {lm}
                    </span>
                  ))}
                </div>
              )}

              {/* CTAs — centered, full-width on mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={locWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 overflow-hidden bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.10em] transition-all duration-300 hover:shadow-[0_8px_28px_rgba(232,25,42,0.40)] hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  Book Pickup from {location.name}
                </a>
                <a
                  href={`tel:${business.phone1}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.10em] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Smooth gradient bridge — eliminates hard colour cut */}
        <div className="h-10 bg-gradient-to-b from-[hsl(220,14%,5%)] to-[hsl(210,5%,95%)]" />

        {/* ── MAIN CONTENT ── */}
        <section className="pt-4 pb-14 sm:pb-24 bg-[hsl(210,5%,95%)]">
          <div className="container mx-auto px-5 sm:px-8">
            <div className="max-w-2xl mx-auto space-y-14">

              {/* About This Area */}
              <div className="section-fade-in text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-7 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">About This Area</span>
                  <div className="h-[1px] w-7 bg-primary/60" />
                </div>
                <h2
                  className="font-display text-foreground uppercase mb-6"
                  style={{ fontSize: "clamp(22px,3.5vw,40px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                >
                  Royal Enfield Service for {location.name} Riders
                </h2>
                <div className="space-y-4 text-left">
                  {location.description.split("\n\n").map((para, i) => (
                    <p key={i} className="font-body text-muted-foreground text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.85]">{para}</p>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="section-fade-in text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-7 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">What We Offer</span>
                  <div className="h-[1px] w-7 bg-primary/60" />
                </div>
                <h2
                  className="font-display text-foreground uppercase mb-6"
                  style={{ fontSize: "clamp(20px,3vw,36px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                >
                  Services for {location.name} Customers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
                  {topServices.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group bg-white rounded-2xl p-5 border border-[#e8ebf0] hover:border-primary/25 hover:shadow-[0_6px_24px_rgba(232,25,42,0.07)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <h3 className="font-heading font-bold text-foreground text-[13px] uppercase tracking-wide group-hover:text-primary transition-colors mb-1.5">{s.name}</h3>
                      <p className="font-body text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{s.shortDescription}</p>
                      <div className="mt-3 flex items-center gap-1 text-primary font-heading font-bold text-[10px] uppercase tracking-[0.12em]">
                        Learn more <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-5 text-center">
                  <Link href="/services" className="inline-flex items-center gap-1.5 text-primary text-[13px] font-heading font-bold uppercase tracking-wider hover:underline">
                    View all services <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="section-fade-in text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-7 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">Why Choose Us</span>
                  <div className="h-[1px] w-7 bg-primary/60" />
                </div>
                <h2
                  className="font-display text-foreground uppercase mb-8"
                  style={{ fontSize: "clamp(20px,3vw,36px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                >
                  The {location.name} Rider&apos;s Choice
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {[
                    { icon: Shield,      title: "Royal Enfield Only",    desc: "Every technician works exclusively on RE motorcycles — zero generalist guesswork." },
                    { icon: Award,       title: "6+ Years of Expertise", desc: "Over 1,000 repairs. We've seen every Royal Enfield issue and know how to fix it right." },
                    { icon: CheckCircle, title: "Genuine Parts Only",    desc: "Zero aftermarket shortcuts. Factory-spec parts, every single time." },
                    { icon: Truck,       title: "Free Doorstep Pickup",  desc: `We collect from ${location.name}, service at our workshop, and deliver back to you.` },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-white rounded-2xl p-5 border border-[#e8ebf0] hover:border-primary/20 hover:shadow-[0_4px_16px_rgba(232,25,42,0.06)] transition-all duration-300 flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-foreground text-[12px] uppercase tracking-wide mb-1">{title}</h3>
                        <p className="font-body text-muted-foreground text-[12px] sm:text-[13px] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {location.faqs.length > 0 && (
                <div className="section-fade-in text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-[1px] w-7 bg-primary/60" />
                    <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">Questions</span>
                    <div className="h-[1px] w-7 bg-primary/60" />
                  </div>
                  <h2
                    className="font-display text-foreground uppercase mb-6"
                    style={{ fontSize: "clamp(20px,3vw,36px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
                  >
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3 text-left">
                    {location.faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="group bg-white rounded-2xl border border-[#e8ebf0] hover:border-primary/25 hover:shadow-[0_6px_24px_rgba(232,25,42,0.07)] transition-all duration-300 overflow-hidden"
                      >
                        <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none select-none min-h-[56px]">
                          <span className="font-heading font-bold text-foreground text-[13px] sm:text-[14px] lg:text-[15px] uppercase tracking-wide leading-snug">{faq.question}</span>
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 rotate-90 group-open:-rotate-90 transition-transform duration-300" />
                        </summary>
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                          <div className="h-px bg-[#eceef2] mb-4" />
                          <p className="font-body text-muted-foreground text-[13px] sm:text-[14px] lg:text-[15.5px] leading-relaxed">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        <ServiceCTABanner
          heading={`Book Your Service from ${location.name}`}
          subtitle={`Doorstep pickup from ${location.name} or walk into our nearest branch — ${location.distanceFromBranch} away.`}
        />
      </>
    );
  }

  notFound();
}

