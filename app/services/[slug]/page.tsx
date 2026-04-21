import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { services, getServiceBySlug } from "@/lib/services";
import { business } from "@/lib/business";
import { getServiceImageBySlug } from "@/lib/service-images";
import { buildBreadcrumbSchema, buildFaqSchema, buildPageMetadata } from "@/lib/seo";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import ServiceBookButton from "@/components/shared/ServiceBookButton";
import { CheckCircle, Clock, ChevronRight, Wrench, Phone, ArrowRight } from "lucide-react";
import type { Service } from "@/types";

const categoryBadgeMap: Record<Service["category"], string> = {
  regular: "General Care",
  engine: "Power & Trans",
  electrical: "Electric",
  suspension: "Stability",
  detailing: "Finish",
  doorstep: "Service Hub",
};

export async function generateStaticParams() {
  return services.filter(Boolean).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return buildPageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    keywords: [service.primaryKeyword, "Royal Enfield service Hubli", "Baba Royal Garage"],
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const serviceImage = getServiceImageBySlug(service.slug);

  const related = services.filter((s) => (service.relatedServices ?? []).includes(s.slug)).slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: service.name, item: `/services/${service.slug}` },
  ]);

  const faqSchema = (service.faqs ?? []).length > 0 ? buildFaqSchema(service.faqs ?? []) : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    provider: {
      "@type": "AutoRepair",
      name: business.name,
      url: business.url,
      telephone: business.phone1,
    },
    areaServed: { "@type": "City", name: "Hubli" },
    url: `${business.url}/services/${service.slug}`,
  };

  return (
    <>
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      {faqSchema ? <SchemaMarkup schema={faqSchema} /> : null}

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-22 bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-5 sm:px-8 flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-primary-foreground/50 mb-6 font-body" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary-foreground/80">{service.name}</span>
          </nav>

          <div className="max-w-4xl w-full">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
              <Wrench className="h-3.5 w-3.5 text-primary" />
              <span className="font-label text-primary text-[10px] sm:text-[11px] uppercase tracking-widest">
                {service.category}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-primary-foreground uppercase mb-5"
              style={{ fontSize: "clamp(38px, 7vw, 96px)", lineHeight: 0.9, letterSpacing: "0.015em" }}
            >
              {service.name}
            </h1>
            <div className="red-divider mb-6 mx-auto" />
            <p className="font-body text-primary-foreground/65 text-[16px] sm:text-[18px] lg:text-[21px] leading-relaxed lg:leading-[1.8] mb-9 max-w-2xl mx-auto">
              {service.shortDescription}
            </p>


            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <ServiceBookButton
                serviceName={service.name}
                variant="filled"
                label="Book This Service"
                className="px-8 sm:px-10 py-4 text-[13px] sm:text-[14px]"
              />
              <a
                href={`tel:${business.phone1}`}
                className="flex items-center justify-center gap-2 glass-dark text-primary-foreground border border-white/20 hover:border-primary/50 px-8 sm:px-10 py-4 rounded-xl font-heading font-bold text-[13px] sm:text-[14px] uppercase tracking-[0.12em] transition-all"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-5 sm:px-8">

          {/* ── Top: Hero image + Sidebar ─────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-8 xl:gap-14 mb-14 sm:mb-20">

            {/* Service hero image */}
            <div className="section-fade-in">
              <div className="relative aspect-[16/9] sm:aspect-[16/9] overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-surface shadow-sm">
                <Image
                  src={serviceImage.src}
                  alt={serviceImage.alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 65vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <span
                  className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-label text-white text-[10px] sm:text-[11px] tracking-[0.20em] uppercase"
                  style={{
                    background: "rgba(15,17,23,0.45)",
                    backdropFilter: "blur(20px) saturate(1.8)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                    border: "1px solid rgba(255,255,255,0.20)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(0,0,0,0.30)",
                    textShadow: "0 1px 3px rgba(0,0,0,0.50)",
                  }}
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full shrink-0 animate-pulse"
                    style={{ background: "#E8192A", boxShadow: "0 0 8px rgba(232,25,42,0.90)" }}
                  />
                  {service.name}
                </span>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              {/* CTA card */}
              <div className="glass rounded-2xl p-6 sm:p-7 border-t-4 border-t-primary shadow-sm">
                <h3 className="font-heading font-bold text-foreground text-[16px] sm:text-[18px] lg:text-[20px] uppercase tracking-wider mb-5">
                  Book This Service
                </h3>
                <div className="space-y-3.5 mb-6">
                  {[
                    { icon: Clock, label: service.timeEstimate },
                    { icon: CheckCircle, label: "100% Genuine RE Parts" },
                    { icon: Phone, label: "Doorstep Pickup Available" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-body text-[13px] sm:text-[14px] lg:text-[15px] text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5">
                  <ServiceBookButton
                    serviceName={service.name}
                    variant="filled"
                    label="Book on WhatsApp"
                    className="w-full py-3.5 lg:py-4 text-[12px] lg:text-[13px] hover:shadow-hover"
                  />
                  <a
                    href={`tel:${business.phone1}`}
                    className="block w-full text-center glass border border-primary/30 text-foreground hover:text-primary py-3.5 lg:py-4 rounded-xl font-heading font-bold text-[12px] lg:text-[13px] uppercase tracking-[0.12em] transition-all"
                  >
                    Call Now
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[11px] sm:text-xs text-muted-foreground text-center">
                    2 branches in Hubli · Open Mon–Sat 10AM–8PM
                  </p>
                </div>
              </div>

              {/* RE Models Covered */}
              <div className="glass rounded-2xl p-6 sm:p-7 shadow-sm">
                <h3 className="font-heading font-bold text-foreground text-[14px] sm:text-[16px] lg:text-[17px] uppercase tracking-wider mb-4">
                  RE Models Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(service.brandsModels ?? []).map((m) => (
                    <span
                      key={m}
                      className="font-body text-[12px] sm:text-[13px] lg:text-[14px] text-foreground bg-surface px-3.5 py-1.5 rounded-full border border-border hover:border-primary/30 hover:text-primary transition-colors"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Body Content sections ─── */}
          <div className="max-w-4xl">

            {/* About This Service */}
            <div className="section-fade-in mb-12 sm:mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-6 bg-primary/60" />
                <span className="font-label text-primary text-[10px] tracking-[0.28em] uppercase">Service Overview</span>
              </div>
              <h2
                className="font-display uppercase text-foreground mb-6"
                style={{ fontSize: "clamp(24px, 3.5vw, 44px)", lineHeight: 1, letterSpacing: "0.02em" }}
              >
                About This Service
              </h2>
              <div>
                {service.fullDescription.split("\n\n").map((para, i) => (
                  <p key={i} className="font-body text-muted-foreground text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed lg:leading-[1.9] mb-4 lg:mb-5">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* What We Include */}
            {(service.whatWeInclude ?? []).length > 0 && (
              <div className="section-fade-in mb-12 sm:mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-6 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] tracking-[0.28em] uppercase">Included</span>
                </div>
                <h2
                  className="font-display uppercase text-foreground mb-7"
                  style={{ fontSize: "clamp(22px, 3vw, 40px)", lineHeight: 1, letterSpacing: "0.02em" }}
                >
                  What We Include
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {(service.whatWeInclude ?? []).map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3.5 glass rounded-xl p-4 lg:p-5 border border-border hover:border-primary/25 transition-colors"
                    >
                      <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-body text-[13px] sm:text-[14px] lg:text-[16px] text-foreground leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Problems */}
            {(service.commonProblems ?? []).length > 0 && (
              <div className="section-fade-in mb-12 sm:mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-6 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] tracking-[0.28em] uppercase">Diagnostics</span>
                </div>
                <h2
                  className="font-display uppercase text-foreground mb-7"
                  style={{ fontSize: "clamp(22px, 3vw, 40px)", lineHeight: 1, letterSpacing: "0.02em" }}
                >
                  Common Problems We Fix
                </h2>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {(service.commonProblems ?? []).map((prob) => (
                    <span
                      key={prob}
                      className="font-body text-[13px] sm:text-[14px] lg:text-[15px] text-primary bg-primary/8 border border-primary/20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-primary/15 transition-colors"
                    >
                      {prob}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Signs You Need It */}
            {(service.signsYouNeed ?? []).length > 0 && (
              <div className="section-fade-in mb-12 sm:mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-6 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] tracking-[0.28em] uppercase">Warning Signs</span>
                </div>
                <h2
                  className="font-display uppercase text-foreground mb-7"
                  style={{ fontSize: "clamp(22px, 3vw, 40px)", lineHeight: 1, letterSpacing: "0.02em" }}
                >
                  Signs You Need This Service
                </h2>
                <ul className="space-y-3 sm:space-y-4">
                  {(service.signsYouNeed ?? []).map((sign, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="font-body text-[14px] sm:text-[15px] lg:text-[17px] text-muted-foreground leading-relaxed pt-0.5">{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {(service.faqs ?? []).length > 0 && (
              <div className="section-fade-in mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-6 bg-primary/60" />
                  <span className="font-label text-primary text-[10px] tracking-[0.28em] uppercase">Questions</span>
                </div>
                <h2
                  className="font-display uppercase text-foreground mb-7"
                  style={{ fontSize: "clamp(22px, 3vw, 40px)", lineHeight: 1, letterSpacing: "0.02em" }}
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {(service.faqs ?? []).map((faq, i) => (
                    <details key={i} className="group glass rounded-2xl border border-border hover:border-primary/25 transition-colors overflow-hidden">
                      <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 lg:p-7 cursor-pointer list-none select-none">
                        <h3 className="font-heading font-bold text-foreground text-[14px] sm:text-[15px] lg:text-[18px] uppercase tracking-wide leading-snug pr-2">
                          {faq.question}
                        </h3>
                        <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 rotate-90 group-open:-rotate-90 transition-transform duration-300" />
                      </summary>
                      <div className="px-5 sm:px-6 lg:px-7 pb-5 sm:pb-6 lg:pb-7">
                        <div className="h-px bg-border mb-4 lg:mb-5" />
                        <p className="font-body text-muted-foreground text-[13px] sm:text-[14px] lg:text-[17px] leading-relaxed lg:leading-[1.85]">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Related Services ─────────────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-20 sm:mt-24 section-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-7 bg-primary/60" />
                <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">You May Also Need</span>
              </div>
              <h2
                className="font-display uppercase text-foreground mb-10 sm:mb-12"
                style={{ fontSize: "clamp(28px, 4.5vw, 60px)", lineHeight: 0.92, letterSpacing: "0.02em" }}
              >
                Related Services
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
                {related.map((s) => {
                  const sImage = getServiceImageBySlug(s.slug);
                  const categoryBadge = categoryBadgeMap[s.category] || s.category;

                  return (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#e4e4e4] shadow-[0_2px_12px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(254,36,20,0.14)] hover:border-primary/25"
                    >
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                        style={{ boxShadow: "inset 0 0 0 1.5px rgba(232,25,42,0.22)" }}
                      />

                      {/* Image — 16:9 gives more visual weight */}
                      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                        <Image
                          src={sImage.src}
                          alt={sImage.alt}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Glassmorphism badge */}
                        <span
                          className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label text-white text-[9px] tracking-[0.22em] uppercase"
                          style={{
                            background: "rgba(15,17,23,0.40)",
                            backdropFilter: "blur(20px) saturate(1.8)",
                            WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                            border: "1px solid rgba(255,255,255,0.22)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.30)",
                            textShadow: "0 1px 3px rgba(0,0,0,0.50)",
                          }}
                        >
                          <span
                            className="w-[5px] h-[5px] rounded-full shrink-0 animate-pulse"
                            style={{ background: "#E8192A", boxShadow: "0 0 8px rgba(232,25,42,0.90)" }}
                          />
                          {categoryBadge}
                        </span>
                      </div>

                      {/* Card body */}
                      <div className="flex flex-col flex-1 p-5 sm:p-6 lg:p-8">
                        {/* Accent bar — grows on hover */}
                        <div className="w-9 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mb-4 lg:mb-5 transition-all duration-300 group-hover:w-16" />

                        {/* Title — fluid, prominent on all sizes */}
                        <h3
                          className="font-display uppercase text-foreground leading-tight tracking-[0.03em] mb-3 group-hover:text-primary transition-colors duration-250"
                          style={{ fontSize: "clamp(15px, 1.4vw, 22px)" }}
                        >
                          {s.name}
                        </h3>

                        {/* Description — clearly readable on desktop */}
                        <p
                          className="font-body text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-6"
                          style={{ fontSize: "clamp(13px, 1vw, 16px)" }}
                        >
                          {s.shortDescription}
                        </p>

                        {/* CTA row */}
                        <div className="flex items-center gap-3 lg:gap-4">
                          <a
                            href={buildServiceWhatsAppUrl(s.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group/cta relative flex-1 flex items-center justify-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-[0.12em] rounded-xl overflow-hidden transition-all duration-300 hover:bg-primary-dark hover:shadow-[0_6px_20px_rgba(232,25,42,0.30)]"
                            style={{ fontSize: "clamp(11px, 0.85vw, 13px)", padding: "clamp(10px, 1vw, 14px) 0" }}
                            aria-label={`Book ${s.name} on WhatsApp`}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-600 ease-in-out" />
                            Book Now
                            <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                          </a>
                          <span
                            className="inline-flex items-center gap-1 text-muted-foreground font-heading font-bold uppercase tracking-[0.10em] group-hover:text-primary transition-colors shrink-0"
                            style={{ fontSize: "clamp(11px, 0.85vw, 13px)" }}
                          >
                            Details
                            <ArrowRight className="h-3 w-3 lg:h-3.5 lg:w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <ServiceCTABanner serviceName={service.name} />
    </>
  );
}
