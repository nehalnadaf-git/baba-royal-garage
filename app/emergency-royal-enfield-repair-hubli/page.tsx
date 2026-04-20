import type { Metadata } from "next";
import { business } from "@/lib/business";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import { Zap, Phone, MessageCircle, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Emergency Royal Enfield Repair Hubli | Baba Royal Garage",
  description:
    "Emergency Royal Enfield breakdown support in Hubli. Call Baba Royal Garage for urgent pickup, diagnostics, and repairs during service hours.",
  path: "/emergency-royal-enfield-repair-hubli",
  keywords: ["Emergency Royal Enfield repair Hubli", "RE breakdown Hubli", "Royal Enfield roadside help Hubli"],
});

const emergencyServices = [
  "Engine won't start", "Flat tyre & puncture", "Brake failure", "Battery dead",
  "Chain snapped", "Electrical fault", "Oil leak", "Overheating engine",
  "Gear stuck", "Accident damage assessment",
];

export default function EmergencyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Emergency Repair", item: "/emergency-royal-enfield-repair-hubli" },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      {/* Emergency Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-6 animate-pulse">
              <Zap className="h-3.5 w-3.5 text-red-400" />
              <span className="text-label text-red-400 text-[10px]">Emergency Service · Available Mon–Sat</span>
            </div>
            <h1 className="text-hero text-primary-foreground mb-4 text-4xl sm:text-5xl">
              Royal Enfield Emergency Repair in Hubli
            </h1>
            <div className="red-divider mb-6" />
            <p className="text-body text-primary-foreground/70 text-lg mb-8 max-w-2xl">
              Broken down in Hubli? Call Baba Royal Garage immediately. We offer emergency Royal Enfield repair and pickup across Hubli during working hours.
            </p>

            {/* Emergency CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${business.phone1}`}
                className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-xl text-cta text-lg transition-all hover:shadow-hover animate-pulse-wa">
                <Phone className="h-5 w-5" /> Call Now: {business.phone1Display}
              </a>
              <a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 glass-dark text-primary-foreground border border-white/20 hover:border-primary/50 px-8 py-5 rounded-xl text-cta text-lg transition-all">
                <MessageCircle className="h-5 w-5" /> WhatsApp SOS
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2 text-primary-foreground/50 text-sm">
              <Clock className="h-4 w-4" />
              <span>Emergency service available Monday–Saturday, 10AM–8PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Issues */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground uppercase tracking-wider mb-6 text-center">
            Emergency Problems We Handle
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {emergencyServices.map((s) => (
              <div key={s} className="glass rounded-xl p-4 text-center border-l-2 border-l-primary">
                <p className="text-sm font-body text-foreground leading-tight">{s}</p>
              </div>
            ))}
          </div>

          {/* Process */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-foreground uppercase tracking-wider mb-6 text-center">
              What Happens When You Call
            </h2>
            <div className="space-y-4">
              {[
                ["1", "Call or WhatsApp", `Call ${business.phone1Display} or WhatsApp us immediately. Describe your location in Hubli and the problem.`],
                ["2", "Assessment", "We assess the issue over the phone. If it can be ridden in, we guide you. If not, we arrange pickup."],
                ["3", "Pickup & Repair", "Our team picks up your Royal Enfield from your location in Hubli and brings it to our nearest workshop."],
                ["4", "Fix & Return", "We repair your bike and return it to you, or you can collect it from our branch."],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex gap-4 glass rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center shrink-0">{num}</div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground uppercase tracking-wide mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch locations */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {business.branches.map((branch) => (
              <a key={branch.id} href={branch.mapsUrl} target="_blank" rel="noopener noreferrer"
                className="glass rounded-xl p-5 hover:border-primary/30 border border-border transition-all">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm uppercase tracking-wider">{branch.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{branch.address}, {branch.city}</p>
                    <p className="text-xs text-primary mt-1.5">Get Directions →</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ServiceCTABanner heading="Book Emergency Royal Enfield Repair" subtitle="Call or WhatsApp us now — doorstep pickup anywhere in Hubli." />
    </>
  );
}
