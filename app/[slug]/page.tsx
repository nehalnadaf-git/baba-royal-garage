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
        <section className="relative pt-24 sm:pt-32 pb-16 bg-foreground overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
          <div className="absolute -top-32 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative container mx-auto px-4">
            <nav className="flex items-center gap-2 text-xs text-primary-foreground/50 mb-6 font-body" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary-foreground/80">{model.name}</span>
            </nav>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                <Wrench className="h-3.5 w-3.5 text-primary" />
                <span className="text-label text-primary text-[10px]">Royal Enfield · Hubli Specialist</span>
              </div>
              <h1 className="text-hero text-primary-foreground mb-4 text-4xl sm:text-5xl">{model.fullName} Service in Hubli</h1>
              <div className="red-divider mb-6" />
              <p className="text-body text-primary-foreground/70 text-lg mb-8 max-w-2xl">{model.year} · {model.engineType}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-xl text-cta transition-all hover:shadow-hover">
                  Book Service
                </a>
                <a href={`tel:${business.phone1}`}
                  className="flex items-center justify-center gap-2 glass-dark text-primary-foreground border border-white/20 px-8 py-4 rounded-xl text-cta transition-all">
                  {business.phone1Display}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-10">
                <div className="section-fade-in">
                  <h2 className="font-heading text-2xl font-bold text-foreground uppercase tracking-wider mb-6">
                    {model.fullName} Service at Baba Royal Garage, Hubli
                  </h2>
                  {model.description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-body text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">{para}</p>
                  ))}
                </div>

                <div className="section-fade-in">
                  <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mb-5">Common {model.name} Issues We Fix</h2>
                  <div className="flex flex-wrap gap-2">
                    {model.commonIssues.map((issue) => (
                      <span key={issue} className="bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-2 rounded-full">{issue}</span>
                    ))}
                  </div>
                </div>

                {recommendedServiceData.length > 0 && (
                  <div className="section-fade-in">
                    <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mb-5">Recommended Services for {model.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recommendedServiceData.map((s) => (
                        <Link key={s.slug} href={`/services/${s.slug}`}
                          className="group glass rounded-xl p-4 hover:border-primary/30 border border-border transition-all hover:-translate-y-0.5">
                          <h3 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wide group-hover:text-primary transition-colors mb-1">{s.name}</h3>
                          <p className="text-xs text-muted-foreground">{s.shortDescription}</p>
                          <div className="mt-2 flex items-center gap-1 text-primary text-xs font-semibold uppercase">
                            Learn more <ChevronRight className="h-3 w-3" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {model.faqs.length > 0 && (
                  <div className="section-fade-in">
                    <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {model.faqs.map((faq, i) => (
                        <div key={i} className="glass rounded-xl p-5">
                          <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base mb-2">{faq.question}</h3>
                          <p className="text-body text-muted-foreground text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="glass rounded-2xl p-6 border-t-4 border-t-primary sticky top-24">
                  <h3 className="font-heading font-bold text-foreground text-lg uppercase tracking-wider mb-4">Book {model.name} Service</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" /> {model.fullName} Specialist</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" /> Genuine RE Parts Only</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-primary" /> Doorstep Pickup Available</div>
                  </div>
                  <div className="space-y-3">
                    <a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"
                      className="block w-full text-center bg-primary hover:bg-primary-dark text-primary-foreground py-3 rounded-xl text-cta transition-all">
                      Book on WhatsApp
                    </a>
                    <a href={`tel:${business.phone1}`}
                      className="block w-full text-center glass border border-primary/30 text-foreground hover:text-primary py-3 rounded-xl text-cta transition-all">
                      {business.phone1Display}
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-4">2 Hubli branches · Mon–Sat 10AM–8PM</p>
                </div>
              </div>
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
        <section
          className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden"
          style={{ background: "linear-gradient(160deg,#0B0D18 0%,#0F111A 55%,#12060A 100%)" }}
        >
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none opacity-60" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="relative container mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 font-body flex-wrap" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-white/70">{location.name}, Hubli</span>
            </nav>

            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="font-label text-primary text-[10px] tracking-widest uppercase">
                  Royal Enfield Service · {location.name}, Hubli
                </span>
              </div>

              {/* H1 */}
              <h1
                className="font-display text-primary-foreground leading-none mb-4"
                style={{ fontSize: "clamp(2.6rem,6.5vw,5.5rem)", letterSpacing: "0.04em" }}
              >
                Royal Enfield Service<br />
                <span className="text-primary">in {location.name}</span>
              </h1>

              <div className="red-divider mb-6" />

              <p className="font-body text-primary-foreground/60 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl">
                Baba Royal Garage serves <strong className="text-primary-foreground/90">{location.name}</strong> with specialist
                Royal Enfield care —{" "}
                <strong className="text-primary">{location.distanceFromBranch}</strong> from our nearest branch,
                with free doorstep pickup available anywhere in Hubli.
              </p>

              {/* Landmark chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {location.landmarks.map((lm) => (
                  <span
                    key={lm}
                    className="inline-flex items-center gap-1.5 glass-dark text-primary-foreground/60 text-xs px-3 py-1.5 rounded-full border border-white/10"
                  >
                    <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                    {lm}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={business.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-primary px-8 py-4 text-cta text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-hover"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  Book Pickup from {location.name}
                </a>
                <a
                  href={`tel:${business.phone1}`}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl glass-dark border border-white/15 px-8 py-4 text-cta text-primary-foreground/80 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:text-primary-foreground"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {business.phone1Display}
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* ── MAIN CONTENT ── */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-14">

              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-14">

                {/* Description */}
                <div className="section-fade-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-[2px] w-8 bg-primary rounded-full" />
                    <span className="font-label text-primary text-[10px] uppercase tracking-widest">About This Area</span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-wide mb-6">
                    Royal Enfield Service for {location.name} Riders
                  </h2>
                  <div className="space-y-4">
                    {location.description.split("\n\n").map((para, i) => (
                      <p key={i} className="font-body text-muted-foreground text-sm sm:text-base leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>

                {/* Services grid */}
                <div className="section-fade-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-[2px] w-8 bg-primary rounded-full" />
                    <span className="font-label text-primary text-[10px] uppercase tracking-widest">What We Offer</span>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide mb-6">
                    Services Available for {location.name} Customers
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topServices.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="group relative glass rounded-xl p-5 border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/3 transition-all duration-500 pointer-events-none" />
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wide group-hover:text-primary transition-colors mb-1">{s.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{s.shortDescription}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary/40 group-hover:text-primary shrink-0 mt-0.5 transition-all group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5">
                    <Link href="/services" className="inline-flex items-center gap-1.5 text-primary text-sm font-heading font-semibold uppercase tracking-wider hover:underline">
                      View all services <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Why choose us */}
                <div
                  className="section-fade-in rounded-2xl overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#0B0D18 0%,#12060A 100%)" }}
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-[2px] w-8 bg-primary rounded-full" />
                      <span className="font-label text-primary text-[10px] uppercase tracking-widest">Why Choose Us</span>
                    </div>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary-foreground uppercase tracking-wide mb-6">
                      The {location.name}{" "}Rider&apos;s Choice
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { icon: Shield,       title: "Royal Enfield Only",     desc: "Every technician works exclusively on RE motorcycles — zero generalist guesswork." },
                        { icon: Award,        title: "6+ Years of Expertise",  desc: "Over 1,000 repairs. We've seen every Royal Enfield issue and know how to fix it right." },
                        { icon: CheckCircle,  title: "Genuine Parts Only",     desc: "Zero aftermarket shortcuts. Factory-spec parts, every single time." },
                        { icon: Truck,        title: "Free Doorstep Pickup",   desc: `We collect from ${location.name}, service at our workshop, and deliver back to you.` },
                      ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-primary-foreground text-sm uppercase tracking-wide mb-1">{title}</h3>
                            <p className="font-body text-primary-foreground/50 text-xs leading-relaxed">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                {location.faqs.length > 0 && (
                  <div className="section-fade-in">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-[2px] w-8 bg-primary rounded-full" />
                      <span className="font-label text-primary text-[10px] uppercase tracking-widest">Common Questions</span>
                    </div>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide mb-6">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                      {location.faqs.map((faq, i) => (
                        <div
                          key={i}
                          className="glass rounded-xl border border-border group hover:border-primary/30 transition-all duration-300"
                        >
                          <div className="p-5">
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="font-label text-primary text-[9px]">{String(i + 1).padStart(2, "0")}</span>
                              </span>
                              <div>
                                <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                                  {faq.question}
                                </h3>
                                <p className="font-body text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SIDEBAR */}
              <div className="space-y-5">
                <div className="sticky top-24 space-y-5">

                  {/* Branch card with map */}
                  <div
                    className="rounded-2xl overflow-hidden border border-border shadow-card"
                    style={{ background: "linear-gradient(160deg,#0B0D18 0%,#0F111A 100%)" }}
                  >

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-[2px] w-5 bg-primary rounded-full" />
                        <span className="font-label text-primary text-[9px] uppercase tracking-widest">Nearest Branch</span>
                      </div>
                      <p className="font-heading font-bold text-primary-foreground text-base uppercase tracking-wide mb-4">{branch.name}</p>

                      <div className="space-y-3 mb-5">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="font-body text-primary-foreground/60 text-xs leading-relaxed">{branch.address}, {branch.city} – {branch.pincode}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone className="h-4 w-4 text-primary shrink-0" />
                          <a href={`tel:${business.phone1}`} className="font-body text-primary-foreground/60 text-xs hover:text-primary transition-colors">{business.phone1Display}</a>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-body text-primary-foreground/60 text-xs">{business.hours.short}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Navigation className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-body text-primary-foreground/60 text-xs">{location.distanceFromBranch} from {location.name}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <a
                          href={branch.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex items-center justify-center gap-2.5 w-full overflow-hidden rounded-xl bg-primary px-5 py-3.5 text-cta text-primary-foreground transition-all duration-300 hover:bg-primary-dark hover:shadow-hover"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          <Navigation className="h-4 w-4 shrink-0" /> Get Directions
                        </a>
                        <a
                          href={business.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2.5 w-full rounded-xl glass-dark border border-white/15 px-5 py-3.5 text-cta text-primary-foreground/80 transition-all duration-300 hover:border-primary/40 hover:text-primary-foreground"
                        >
                          <MessageCircle className="h-4 w-4 shrink-0" /> Book Doorstep Pickup
                        </a>
                        <a
                          href={`tel:${business.phone1}`}
                          className="flex items-center justify-center gap-2.5 w-full rounded-xl border border-white/10 px-5 py-3 text-cta text-primary-foreground/50 transition-all hover:text-primary-foreground/80"
                        >
                          <Phone className="h-3.5 w-3.5 shrink-0" /> {business.phone1Display}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Trust checklist */}
                  <div className="glass rounded-2xl p-5 border border-border">
                    <p className="font-heading font-bold text-foreground text-sm uppercase tracking-wider mb-4">Why Choose Us</p>
                    <div className="space-y-3">
                      {[
                        "Royal Enfield Specialists Only",
                        "Genuine RE Spare Parts",
                        "Free Doorstep Pickup in Hubli",
                        "Same-Day Service Available",
                        "WhatsApp Updates Throughout",
                        "6+ Years · 1000+ Bikes Serviced",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-body text-muted-foreground text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Models served */}
                  <div className="glass rounded-2xl p-5 border border-border">
                    <p className="font-heading font-bold text-foreground text-sm uppercase tracking-wider mb-4">Models We Service</p>
                    <div className="flex flex-wrap gap-2">
                      {["Classic 350","Meteor 350","Hunter 350","Bullet 350","Himalayan 411","Himalayan 450","Interceptor 650","Continental GT 650","Super Meteor 650","Shotgun 650"].map((m) => (
                        <span key={m} className="bg-primary/8 border border-primary/20 text-primary text-[10px] font-label px-3 py-1 rounded-full uppercase tracking-wider">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
