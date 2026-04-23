import type { Metadata } from "next";
import Link from "next/link";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Baba Royal Garage Hubli",
  description: "Privacy policy for Baba Royal Garage website and service booking data handling.",
  path: "/privacy-policy",
  noIndex: true,
});

export default function PrivacyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy-policy" },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      {/* Dark hero — navbar-aware, themed */}
      <section className="relative pt-24 sm:pt-36 pb-12 sm:pb-20 bg-[hsl(220,14%,5%)] overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-70 pointer-events-none" />
        <div className="absolute -top-24 left-1/3 w-[500px] h-[280px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="relative container mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">Legal</span>
          </div>
          <h1
            className="font-display text-white uppercase mb-4"
            style={{ fontSize: "clamp(36px,6vw,80px)", lineHeight: 0.9, letterSpacing: "0.02em" }}
          >
            Privacy Policy
          </h1>
          <div className="w-10 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full" />
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-[hsl(210,5%,95%)]">
        <div className="container mx-auto px-5 sm:px-8 max-w-3xl">
          <div className="bg-white rounded-3xl border border-[#e8ebf0] shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-8 sm:p-12">
            <div className="space-y-6 font-body text-muted-foreground text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.8]">
              <p><strong className="text-foreground">Last updated:</strong> April 2024</p>
              <p>Baba Royal Garage (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website at babaroyalgarage.com. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our service.</p>
              <div>
                <h2 className="font-heading font-bold text-foreground text-[15px] sm:text-[16px] uppercase tracking-wide mb-2">Information We Collect</h2>
                <p>We collect information you directly provide to us when you book a service, such as your name, phone number, and motorcycle details. This information is submitted via WhatsApp (wa.me) and is subject to WhatsApp&apos;s privacy policy.</p>
              </div>
              <div>
                <h2 className="font-heading font-bold text-foreground text-[15px] sm:text-[16px] uppercase tracking-wide mb-2">How We Use Your Information</h2>
                <p>We use the information solely to process your service booking and contact you regarding your Royal Enfield service. We do not sell, trade, or otherwise transfer your information to third parties.</p>
              </div>
              <div>
                <h2 className="font-heading font-bold text-foreground text-[15px] sm:text-[16px] uppercase tracking-wide mb-2">Contact Us</h2>
                <p>For any privacy-related queries, contact us at <a href="tel:+919742291701" className="text-primary hover:text-primary-dark transition-colors">+91 97422 91701</a> or visit us at our Keshwapur, Hubli branch.</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#eceef2]">
              <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-[12px] uppercase tracking-[0.12em] text-primary hover:text-primary-dark transition-colors">← Back to Home</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
