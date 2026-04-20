import type { Metadata } from "next";
import { reviews } from "@/lib/reviews";
import { business } from "@/lib/business";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { Star, ExternalLink, Quote } from "lucide-react";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import PageHero from "@/components/shared/PageHero";
import SchemaMarkup from "@/components/shared/SchemaMarkup";

export const metadata: Metadata = buildPageMetadata({
  title: "Customer Reviews | Baba Royal Garage Hubli | Royal Enfield Service",
  description:
    "Read verified customer reviews for Baba Royal Garage, Hubli's trusted Royal Enfield specialist with 5-star feedback from riders.",
  path: "/reviews",
  keywords: ["Baba Royal Garage reviews", "Royal Enfield service reviews Hubli", "RE workshop rating Hubli"],
});

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-[#F5A623] text-[#F5A623]" : "text-black/10"}`}
      />
    ))}
  </div>
);

export default function ReviewsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Reviews", item: "/reviews" },
  ]);

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: business.name,
    url: business.url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "1000",
    },
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={reviewSchema} />

      {/* Hero */}
      <PageHero
        overline="Verified Reviews"
        title="Customer Reviews"
        subtitle="Trusted by 1000+ Royal Enfield riders across Hubli. Read what they say about Baba Royal Garage."
      >
        <div className="flex items-center gap-3 mt-6">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#F5A623] text-[#F5A623]" />
            ))}
          </div>
          <span className="font-body text-white/60 text-sm">5.0 · 1000+ reviews</span>
        </div>
      </PageHero>

      {/* ── Reviews Grid ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[hsl(210,5%,96%)] relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(232,25,42,0.04) 0%, transparent 50%)" }} />

        <div className="relative container mx-auto px-5 sm:px-8">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">
              What Riders Say
            </span>
          </div>
          <h2
            className="font-display uppercase text-foreground mb-12"
            style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 0.95, letterSpacing: "0.02em" }}
          >
            All Reviews
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-16">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-[#E8EBF0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-350 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(232,25,42,0.10)] hover:border-primary/20 cursor-default"
              >
                {/* Red top accent bar — grows on hover */}
                <div className="h-[3px] bg-gradient-to-r from-primary to-primary-light w-0 group-hover:w-full transition-all duration-500 rounded-t-full" />

                <div className="flex flex-col flex-1 p-6 sm:p-7">
                  {/* Quote icon + stars row */}
                  <div className="flex items-start justify-between mb-4">
                    <StarRating rating={review.rating} />
                    <Quote
                      className="h-8 w-8 text-primary/12 shrink-0 -mt-1"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Review text */}
                  <p className="font-body text-[14px] sm:text-[15px] leading-[1.80] text-muted-foreground flex-1 mb-5 line-clamp-5">
                    &ldquo;{review.review}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-[#ECEEF2] mb-4" />

                  {/* Reviewer identity */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-heading font-bold text-foreground text-[14px] uppercase tracking-wider">
                        {review.name}
                      </p>
                      <p className="font-label text-[10px] text-muted-foreground/60 tracking-[0.14em] uppercase mt-0.5">
                        {review.date}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {review.model && (
                        <span
                          className="font-label text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(232,25,42,0.07)",
                            border: "1px solid rgba(232,25,42,0.18)",
                            color: "#E8192A",
                          }}
                        >
                          {review.model}
                        </span>
                      )}
                      {review.service && (
                        <span className="font-label text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-[#F0F2F5] text-muted-foreground border border-[#E4E7ED]">
                          {review.service}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── Google Reviews CTA ──────────────────────────────────────── */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E8EBF0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 sm:p-12 lg:p-16 text-center">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,25,42,0.04), transparent 70%)" }} />

            <div className="relative">
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 sm:h-7 sm:w-7 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-primary/40" />
                <span className="font-label text-primary text-[10px] tracking-[0.28em] uppercase">
                  Google Maps
                </span>
                <div className="h-[1px] w-8 bg-primary/40" />
              </div>

              <h2
                className="font-display uppercase text-foreground mb-4"
                style={{ fontSize: "clamp(26px,4vw,56px)", lineHeight: 0.95, letterSpacing: "0.02em" }}
              >
                See All Reviews <br className="hidden sm:block" /> on Google
              </h2>

              <p className="font-body text-muted-foreground text-[14px] sm:text-[16px] leading-relaxed max-w-xl mx-auto mb-10">
                Hundreds more verified reviews on Google Maps for both our Keshwapur and Nehru Stadium branches.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {business.branches.map((branch) => (
                  <a
                    key={branch.id}
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-7 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.10em] transition-all duration-300 hover:shadow-[0_8px_28px_rgba(232,25,42,0.35)] hover:-translate-y-0.5 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    {branch.name} Reviews
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCTABanner />
    </>
  );
}
