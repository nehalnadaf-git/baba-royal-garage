import type { Metadata } from "next";
import { faqs } from "@/lib/faqs";
import { business } from "@/lib/business";
import { buildBreadcrumbSchema, buildFaqSchema, buildPageMetadata } from "@/lib/seo";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
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
      <section className="relative pt-24 sm:pt-32 pb-16 bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
        <div className="relative container mx-auto px-4">
          <h1 className="text-hero text-primary-foreground text-4xl sm:text-5xl mb-4">Frequently Asked Questions</h1>
          <div className="red-divider mb-6" />
          <p className="text-body text-primary-foreground/70 text-lg lg:text-[20px] max-w-2xl lg:max-w-3xl lg:leading-[1.9]">
            Everything you need to know about Royal Enfield servicing at Baba Royal Garage, Hubli.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-primary inline-block" />
                  {categoryLabels[cat] ?? cat}
                </h2>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <details key={faq.id} className="group glass rounded-xl border border-border hover:border-primary/30 transition-colors">
                      <summary className="flex items-center justify-between gap-4 p-5 lg:p-6 cursor-pointer list-none font-heading font-semibold text-foreground text-sm sm:text-base lg:text-[18px] uppercase tracking-wide select-none">
                        {faq.question}
                        <ChevronDown className="h-4 w-4 text-primary shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-5 lg:px-6 pb-5 lg:pb-6">
                        <div className="h-px bg-border mb-4" />
                        <p className="text-body text-muted-foreground text-sm lg:text-[16.5px] leading-relaxed lg:leading-[1.8]">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            {/* Still have questions */}
            <div className="glass rounded-2xl p-8 border border-primary/20 text-center">
              <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mb-3">Still Have a Question?</h2>
              <p className="text-body text-muted-foreground text-sm lg:text-[16px] lg:leading-[1.8] mb-5">Our team responds promptly to all WhatsApp and phone queries during working hours.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 rounded-xl text-cta transition-all">
                  Ask on WhatsApp
                </a>
                <a href={`tel:${business.phone1}`}
                  className="flex items-center justify-center gap-2 glass border border-primary/30 text-foreground hover:text-primary px-6 py-3 rounded-xl text-cta transition-all">
                  {business.phone1Display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCTABanner />
    </>
  );
}
