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

const steps: [string, string, string][] = [
  ["1", "Call or WhatsApp", "Call or WhatsApp us immediately. Describe your location in Hubli and the problem."],
  ["2", "Assessment", "We assess the issue over the phone. If it can be ridden in, we guide you. If not, we arrange pickup."],
  ["3", "Pickup & Repair", "Our team picks up your Royal Enfield from your location in Hubli and brings it to our nearest workshop."],
  ["4", "Fix & Return", "We repair your bike and return it to you, or you can collect it from our branch."],
];

export default function EmergencyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Emergency Repair", item: "/emergency-royal-enfield-repair-hubli" },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 bg-[hsl(220,14%,5%)] overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-80 pointer-events-none" />
        {/* Pulsing crimson core glow for urgency */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/12 rounded-full blur-[140px] animate-glow-pulse pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent 0%, #E8192A 20%, #C0392B 50%, #E8192A 80%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="relative container mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            {/* Emergency badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 border"
              style={{
                background: "rgba(232,25,42,0.12)",
                borderColor: "rgba(232,25,42,0.35)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}>
              <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.22em] uppercase">
                Emergency Service · Available Mon–Sat
              </span>
            </div>

            {/* H1 */}
            <h1
              className="font-display text-white uppercase mb-4"
              style={{ fontSize: "clamp(36px, 7vw, 88px)", lineHeight: 0.88, letterSpacing: "0.015em" }}
            >
              Royal Enfield{" "}
              <span className="text-primary">Emergency</span>{" "}
              Repair in Hubli
            </h1>
            <div className="w-12 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mb-6" />

            <p className="font-body text-white/55 text-[15px] sm:text-[17px] lg:text-[18px] mb-10 max-w-2xl leading-relaxed">
              Broken down in Hubli? Call Baba Royal Garage immediately. We offer emergency Royal Enfield repair and pickup across Hubli during working hours.
            </p>

            {/* Emergency CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={`tel:${business.phone1}`}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-primary hover:bg-primary-dark text-white px-8 py-4 sm:py-5 rounded-xl font-heading font-bold text-[14px] sm:text-[16px] uppercase tracking-[0.10em] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(232,25,42,0.45)] hover:-translate-y-0.5 animate-glow-pulse"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Phone className="h-5 w-5 shrink-0" />
                Call Now
              </a>
              <a
                href={business.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white px-8 py-4 sm:py-5 rounded-xl font-heading font-bold text-[14px] sm:text-[16px] uppercase tracking-[0.10em] transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                WhatsApp SOS
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2 text-white/35 font-label text-[10px] sm:text-[11px] tracking-[0.16em] uppercase">
              <Clock className="h-3.5 w-3.5 text-primary/60 shrink-0" />
              <span>Emergency service available Monday–Saturday, 10AM–8PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency Issues ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[hsl(210,5%,95%)]">
        <div className="container mx-auto px-5 sm:px-8">

          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">We Handle</span>
          </div>
          <h2
            className="font-display text-foreground uppercase mb-10"
            style={{ fontSize: "clamp(26px, 4vw, 52px)", lineHeight: 0.9, letterSpacing: "0.015em" }}
          >
            Emergency Problems We Handle
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
            {emergencyServices.map((s) => (
              <div
                key={s}
                className="bg-white rounded-xl p-4 text-center border border-[#e8ebf0] border-l-[3px] border-l-primary hover:shadow-[0_4px_16px_rgba(232,25,42,0.08)] transition-all duration-200"
              >
                <p className="font-body text-[13px] sm:text-[14px] text-foreground leading-tight">{s}</p>
              </div>
            ))}
          </div>

          {/* Process */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-7 bg-primary/60" />
              <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">Process</span>
            </div>
            <h2
              className="font-display text-foreground uppercase mb-8"
              style={{ fontSize: "clamp(24px, 3.5vw, 44px)", lineHeight: 0.9, letterSpacing: "0.015em" }}
            >
              What Happens When You Call
            </h2>
            <div className="space-y-4">
              {steps.map(([num, title, desc]) => (
                <div
                  key={num}
                  className="group flex gap-4 sm:gap-5 bg-white rounded-2xl p-5 sm:p-6 border border-[#e8ebf0] hover:border-primary/20 hover:shadow-[0_6px_24px_rgba(232,25,42,0.07)] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary text-white font-display text-[20px] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(232,25,42,0.30)]">
                    {num}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-[13px] sm:text-[14px] uppercase tracking-wide mb-1.5">{title}</h3>
                    <p className="font-body text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch locations */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {business.branches.map((branch) => (
              <a
                key={branch.id}
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 bg-white rounded-xl p-5 sm:p-6 border border-[#e8ebf0] hover:border-primary/25 hover:shadow-[0_6px_24px_rgba(232,25,42,0.08)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-bold text-foreground text-[13px] uppercase tracking-wide group-hover:text-primary transition-colors">{branch.name}</p>
                  <p className="font-body text-[12px] sm:text-[13px] text-muted-foreground mt-1">{branch.address}, {branch.city}</p>
                  <p className="font-label text-[10px] text-primary mt-2 tracking-[0.14em] uppercase">Get Directions →</p>
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
