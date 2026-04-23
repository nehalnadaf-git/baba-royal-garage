import type { Metadata } from "next";
import { faqs } from "@/lib/faqs";
import { business } from "@/lib/business";
import { buildBreadcrumbSchema, buildFaqSchema, buildPageMetadata } from "@/lib/seo";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import { Phone } from "lucide-react";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import PageHero from "@/components/shared/PageHero";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ | Baba Royal Garage Hubli | Royal Enfield Service Questions",
  description:
    "Frequently asked questions about Royal Enfield servicing at Baba Royal Garage, Hubli, including booking, pricing, pickup, and genuine parts.",
  path: "/faq",
  keywords: ["Royal Enfield FAQ Hubli", "Baba Royal Garage questions", "RE service pricing Hubli"],
});

const categoryLabels: Record<string, string> = {
  general: "General",
  booking: "Booking",
  services: "Services",
  pricing: "Pricing",
  parts: "Spare Parts",
  doorstep: "Doorstep Service",
  models: "RE Models",
  location: "Location",
};

export default function FAQPage() {
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const schema = buildFaqSchema(faqs);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "FAQ", item: "/faq" },
  ]);

  return (
    <>
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      {/* Hero */}
      <PageHero
        overline="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Royal Enfield servicing at Baba Royal Garage, Hubli."
      />

      {/* FAQ Content */}
      <section className="py-16 sm:py-24 bg-[hsl(210,5%,95%)]">
        <div className="container mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mx-auto space-y-12">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-7 bg-primary/60" />
                  <h2 className="font-label text-primary text-[10px] sm:text-[11px] lg:text-[13px] tracking-[0.3em] uppercase">
                    {categoryLabels[cat] ?? cat}
                  </h2>
                </div>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <details
                      key={faq.id}
                      className="group bg-white rounded-2xl border border-[#e8ebf0] hover:border-primary/25 hover:shadow-[0_6px_24px_rgba(232,25,42,0.07)] transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none select-none min-h-[56px]">
                        <span className="font-heading font-bold text-foreground text-[14px] sm:text-[15px] lg:text-[17px] uppercase tracking-wide leading-snug">
                          {faq.question}
                        </span>
                        <ChevronDown className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                        <div className="h-px bg-[#eceef2] mb-4" />
                        <p className="font-body text-muted-foreground text-[14px] sm:text-[15px] lg:text-[16.5px] leading-relaxed lg:leading-[1.8]">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            {/* Still have questions */}
            <div className="relative bg-white rounded-3xl p-8 sm:p-10 border border-[#e8ebf0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-center overflow-hidden">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,25,42,0.04), transparent 70%)" }} />
              <div className="relative">
                <h2 className="font-display text-foreground uppercase mb-3" style={{ fontSize: "clamp(22px,3vw,36px)", lineHeight: 1.0, letterSpacing: "0.02em" }}>Still Have a Question?</h2>
                <p className="font-body text-muted-foreground text-[14px] sm:text-[15px] lg:text-[16px] lg:leading-[1.8] mb-6 max-w-md mx-auto">Our team responds promptly to all WhatsApp and phone queries during working hours.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={business.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center gap-2 overflow-hidden bg-primary hover:bg-primary-dark text-white px-7 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.10em] transition-all duration-300 hover:shadow-[0_8px_28px_rgba(232,25,42,0.35)] hover:-translate-y-0.5"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    Ask on WhatsApp
                  </a>
                  <a
                    href={`tel:${business.phone1}`}
                    className="inline-flex items-center justify-center gap-2 bg-[hsl(210,5%,95%)] border border-[#e8ebf0] hover:border-primary/30 text-foreground hover:text-primary px-7 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.10em] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCTABanner />
    </>
  );
}
