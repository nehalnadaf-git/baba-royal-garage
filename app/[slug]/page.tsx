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
import { CheckCircle, Wrench, ChevronRight, Phone, MapPin, Clock, Navigation } from "lucide-react";

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
    const topServices = services.slice(0, 6);
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
        {locationFaqSchema ? <SchemaMarkup schema={locationFaqSchema} /> : null}
        <section className="relative pt-24 sm:pt-32 pb-16 bg-foreground overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
          <div className="relative container mx-auto px-4">
            <nav className="flex items-center gap-2 text-xs text-primary-foreground/50 mb-6 font-body" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary-foreground/80">{location.name}</span>
            </nav>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-label text-primary text-[10px]">Royal Enfield Service · {location.name}, Hubli</span>
              </div>
              <h1 className="text-hero text-primary-foreground mb-4 text-4xl sm:text-5xl">
                Royal Enfield Service in {location.name}, Hubli
              </h1>
              <div className="red-divider mb-6" />
              <p className="text-body text-primary-foreground/70 text-lg mb-8 max-w-2xl">
                Baba Royal Garage serves {location.name} with specialist Royal Enfield care — {location.distanceFromBranch} from our nearest branch, with doorstep pickup available.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {location.landmarks.map((lm) => (
                  <span key={lm} className="glass-dark text-primary-foreground/70 text-xs px-3 py-1.5 rounded-full border border-white/10">{lm}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-xl text-cta transition-all hover:shadow-hover">
                  Book Pickup from {location.name}
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
                    Royal Enfield Service for {location.name} Riders
                  </h2>
                  {location.description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-body text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">{para}</p>
                  ))}
                </div>

                <div className="section-fade-in">
                  <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mb-5">
                    Services Available for {location.name} Customers
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topServices.map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`}
                        className="group flex items-center gap-3 glass rounded-lg p-3 hover:border-primary/30 border border-border transition-all">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">{s.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/services" className="inline-flex items-center gap-1 text-primary text-sm font-heading font-semibold uppercase tracking-wider hover:underline">
                      View all services <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {location.faqs.length > 0 && (
                  <div className="section-fade-in">
                    <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {location.faqs.map((faq, i) => (
                        <div key={i} className="glass rounded-xl p-5">
                          <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base mb-2">{faq.question}</h3>
                          <p className="text-body text-muted-foreground text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="glass rounded-2xl p-6 border-t-4 border-t-primary sticky top-24">
                  <h3 className="font-heading font-bold text-foreground text-base uppercase tracking-wider mb-4">Nearest Branch</h3>
                  <p className="text-sm font-heading font-semibold text-primary mb-2">{branch.name}</p>
                  <div className="space-y-3 text-sm text-muted-foreground mb-5">
                    <div className="flex gap-2"><MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{branch.address}, {branch.city} {branch.pincode}</span></div>
                    <div className="flex gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /><a href={`tel:${business.phone1}`} className="hover:text-primary transition-colors">{business.phone1Display}</a></div>
                    <div className="flex gap-2"><Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{business.hours.weekdays}</span></div>
                  </div>
                  <div className="space-y-3">
                    <a href={branch.mapsUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground py-3 rounded-xl text-cta transition-all w-full">
                      <Navigation className="h-4 w-4" /> Get Directions
                    </a>
                    <a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 glass border border-primary/30 text-foreground hover:text-primary py-3 rounded-xl text-cta transition-all w-full">
                      Book Doorstep Pickup
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-4">{location.distanceFromBranch} from {location.name}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ServiceCTABanner />
      </>
    );
  }

  notFound();
}
