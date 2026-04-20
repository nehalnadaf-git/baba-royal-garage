import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { reModels } from "@/lib/models";
import { locations } from "@/lib/locations";
import { getServiceImageBySlug } from "@/lib/service-images";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { ChevronRight, MapPin, ArrowUpRight, ArrowRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import type { Service } from "@/types";

const categoryBadgeMap: Record<Service["category"], string> = {
  regular: "General Care",
  engine: "Power & Trans",
  electrical: "Electric",
  suspension: "Stability",
  detailing: "Finish",
  doorstep: "Service Hub",
};

export const metadata: Metadata = buildPageMetadata({
  title: "All Royal Enfield Services in Hubli | Baba Royal Garage",
  description:
    "Complete Royal Enfield services in Hubli including general servicing, engine overhaul, electrical diagnostics, suspension, and detailing.",
  path: "/services",
  keywords: ["Royal Enfield services Hubli", "Baba Royal Garage services", "RE service center Hubli"],
});

export default function ServicesListPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <PageHero
        overline="What We Do"
        title={<>Royal Enfield <br /> Services in Hubli</>}
        subtitle="Every Royal Enfield service you need under one roof. Genuine parts, specialist technicians, 2 branches across Hubli."
      />

      {/* Services Grid */}
      <section className="py-16 sm:py-24 bg-[hsl(210,5%,95%)]">
        <div className="container mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">All Services</span>
          </div>
          <h2 className="font-display text-foreground mb-10"
            style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 0.9, letterSpacing: "0.015em" }}>
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-20 stagger-children">
            {services.map((service) => {
              const serviceImage = getServiceImageBySlug(service.slug);
              // Derived fields for consistent display
              const categoryBadge = categoryBadgeMap[service.category] || service.category;
              const priceDisplay = "Standard Rates"; // Placeholder if not in data

              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={[
                    "group relative rounded-2xl overflow-hidden block cursor-pointer transition-all duration-500 transform-gpu bg-white shadow-sm",
                    "hover:-translate-y-2 hover:shadow-[0_22px_48px_rgba(254,36,20,0.12)] hover:border-primary/30 border border-border/50"
                  ].join(" ")}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                    <Image
                      src={serviceImage.src}
                      alt={serviceImage.alt}
                      fill
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    {/* Glassmorphism Badge */}
                    <span
                      className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-label text-white text-[9px] tracking-[0.22em] uppercase"
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
                      {categoryBadge}
                    </span>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="font-display uppercase mb-3 leading-tight tracking-[0.03em] text-foreground text-lg lg:text-[23px] group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="font-body text-[14px] lg:text-[17px] leading-relaxed lg:leading-[1.85] mb-8 text-muted-foreground line-clamp-2">
                      {service.shortDescription}
                    </p>

                    <div className="space-y-4">
                      <div className="group relative w-full overflow-hidden flex items-center justify-center gap-2.5 bg-primary text-white py-4 rounded-xl font-heading font-bold text-[13px] lg:text-[15px] uppercase tracking-[0.12em] transition-all duration-300 hover:bg-primary-dark hover:shadow-[0_10px_32px_rgba(254,36,20,0.3)] hover:-translate-y-0.5 cursor-pointer">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        Book Now <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1.5 font-subheading font-bold text-[11px] lg:text-[13px] uppercase tracking-[0.14em] text-muted-foreground/60 group-hover:text-primary transition-colors">
                          Learn More <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* RE Models */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">By Model</span>
          </div>
          <h2 className="font-display text-foreground mb-3"
            style={{ fontSize: "clamp(28px,4vw,48px)", lineHeight: 0.9, letterSpacing: "0.015em" }}>
            By Royal Enfield Model
          </h2>
          <p className="font-body text-muted-foreground text-sm mb-8 max-w-lg leading-relaxed">Find specialist service information for your specific Royal Enfield model.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-20">
            {reModels.map((model) => (
              <Link key={model.slug} href={`/${model.slug}`}
                className="group bg-white rounded-xl p-4 border border-[#ebebeb] hover:border-primary/25 hover:shadow-[0_4px_20px_rgba(254,36,20,0.07)] transition-all duration-300 hover:-translate-y-0.5 text-center cursor-pointer">
                <h3 className="font-heading font-bold text-foreground text-[13px] uppercase tracking-wide group-hover:text-primary transition-colors">{model.name}</h3>
                <p className="font-label text-muted-foreground text-[9px] mt-1 tracking-wider">{model.year}</p>
              </Link>
            ))}
          </div>

          {/* Locations */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">Coverage</span>
          </div>
          <h2 className="font-display text-foreground mb-3"
            style={{ fontSize: "clamp(28px,4vw,48px)", lineHeight: 0.9, letterSpacing: "0.015em" }}>
            Areas We Serve
          </h2>
          <p className="font-body text-muted-foreground text-sm mb-8 max-w-lg leading-relaxed">We serve all areas of Hubli with walk-in service at 2 branches or doorstep pickup.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {locations.map((loc) => (
              <Link key={loc.slug} href={`/${loc.slug}`}
                className="group bg-white rounded-xl p-3.5 border border-[#ebebeb] hover:border-primary/25 hover:shadow-[0_4px_20px_rgba(254,36,20,0.07)] transition-all duration-300 text-center cursor-pointer">
                <div className="flex justify-center mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-[12px] uppercase tracking-wide group-hover:text-primary transition-colors">{loc.name}</h3>
                <p className="font-label text-muted-foreground text-[9px] mt-0.5">{loc.distanceFromBranch}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
