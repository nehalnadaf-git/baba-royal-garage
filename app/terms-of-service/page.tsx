import type { Metadata } from "next";
import Link from "next/link";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service | Baba Royal Garage Hubli",
  description: "Terms of service for Baba Royal Garage and workshop booking terms.",
  path: "/terms-of-service",
  noIndex: true,
});

export default function TermsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Terms of Service", item: "/terms-of-service" },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading text-4xl font-bold text-foreground uppercase tracking-wider mb-4">Terms of Service</h1>
          <div className="red-divider mb-8" />
          <div className="space-y-6 text-body text-muted-foreground text-sm sm:text-base leading-relaxed">
            <p><strong className="text-foreground">Last updated:</strong> April 2024</p>
            <p>By accessing the Baba Royal Garage website and using our booking facilities, you agree to be bound by these terms of service.</p>
            <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mt-8">Service Bookings</h2>
            <p>Booking requests submitted via our website are not confirmed until acknowledged by our team via WhatsApp or phone call. Appointment times are subject to availability at our Keshwapur or Nehru Stadium, Hubli branches.</p>
            <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mt-8">Pricing</h2>
            <p>Prices for all Royal Enfield services are provided as estimates and may vary based on the specific condition of your motorcycle. All pricing is discussed and confirmed before work commences.</p>
            <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mt-8">Genuine Parts</h2>
            <p>Baba Royal Garage uses genuine Royal Enfield spare parts for all repairs. In cases where specific genuine parts are unavailable, you will be informed and alternative options discussed.</p>
            <h2 className="font-heading text-xl font-bold text-foreground uppercase tracking-wider mt-8">Contact</h2>
            <p>For any queries, contact us at <a href="tel:+919742291701" className="text-primary hover:underline">+91 97422 91701</a>.</p>
          </div>
          <div className="mt-8"><Link href="/" className="text-primary hover:underline text-sm">← Back to Home</Link></div>
        </div>
      </section>
    </>
  );
}
