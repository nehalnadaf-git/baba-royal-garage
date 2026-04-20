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
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading text-4xl font-bold text-foreground uppercase tracking-wider mb-4">Privacy Policy</h1>
          <div className="red-divider mb-8" />
          <div className="space-y-6 text-body text-muted-foreground text-sm sm:text-base leading-relaxed">
            <p><strong className="text-foreground">Last updated:</strong> April 2024</p>
            <p>Baba Royal Garage (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website at babaroyalgarage.com. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our service.</p>
            <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mt-8">Information We Collect</h2>
            <p>We collect information you directly provide to us when you book a service, such as your name, phone number, and motorcycle details. This information is submitted via WhatsApp (wa.me) and is subject to WhatsApp&apos;s privacy policy.</p>
            <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mt-8">How We Use Your Information</h2>
            <p>We use the information solely to process your service booking and contact you regarding your Royal Enfield service. We do not sell, trade, or otherwise transfer your information to third parties.</p>
            <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mt-8">Contact Us</h2>
            <p>For any privacy-related queries, contact us at <a href="tel:+919742291701" className="text-primary hover:underline">+91 97422 91701</a> or visit us at our Keshwapur, Hubli branch.</p>
          </div>
          <div className="mt-8"><Link href="/" className="text-primary hover:underline text-sm">← Back to Home</Link></div>
        </div>
      </section>
    </>
  );
}
