"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "@/lib/reviews";
import { business } from "@/lib/business";
import type { Review } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-gold text-gold" : "text-foreground/15"}`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [reviewItems, setReviewItems] = useState<Review[]>(reviews.slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch("/api/reviews", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { reviews?: Review[] };
        if (Array.isArray(data.reviews) && data.reviews.length) {
          setReviewItems(data.reviews);
        }
      } catch {
        // Keep static fallback reviews.
      }
    };

    void loadReviews();
  }, []);

  const goTo = (idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((idx + reviewItems.length) % reviewItems.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  useEffect(() => {
    if (!reviewItems.length) return;
    intervalRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, reviewItems.length]);

  const review = reviewItems[current] ?? reviewItems[0] ?? reviews[0];

  return (
    <section className="relative py-14 sm:py-28 bg-[hsl(210,5%,95%)] overflow-hidden">
      {/* Atmospheric mesh */}
      <div className="absolute inset-0 bg-mesh-light opacity-90 pointer-events-none" />
      {/* Ambient red glow top */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      {/* Top/bottom hairlines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative container mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-20 reveal">
          {/* Overline */}
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-[1px] w-8 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">Verified Reviews</span>
            <div className="h-[1px] w-8 bg-primary/60" />
          </div>
          <h2 className="font-display uppercase text-foreground mb-4"
            style={{ fontSize: "clamp(40px,6.5vw,88px)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            What Riders Say
          </h2>
          <p className="font-body text-muted-foreground text-sm lg:text-[16.5px] mt-4 lg:mt-6 max-w-xl lg:max-w-2xl mx-auto">1000+ Royal Enfield repairs completed at Baba Royal Garage, Hubli</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-7">

          {/* Featured Review */}
          <div className="lg:col-span-2 md:col-span-1 reveal-left">
            <div
              className="relative rounded-3xl p-7 sm:p-9 h-full overflow-hidden bg-white"
              style={{ border: "1px solid #ebebeb", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
            >
              {/* Giant quote mark */}
              <div
                className="absolute top-4 right-5 font-display text-[120px] leading-none text-primary/8 select-none pointer-events-none"
                style={{ lineHeight: 1 }}
              >
                &ldquo;
              </div>
              {/* Top crimson accent */}
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Review text */}
              <blockquote
                key={current}
                className={`font-body text-foreground/80 text-base sm:text-lg lg:text-[22px] leading-[1.8] lg:leading-[1.9] mb-7 lg:mb-10 italic transition-all duration-400 ${
                  isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
              >
                &ldquo;{review.review}&rdquo;
              </blockquote>

              {/* Reviewer */}
              <div className={`transition-all duration-400 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
                <div className="flex items-center gap-3">
                  {review.profilePhoto ? (
                    <Image
                      src={review.profilePhoto}
                      alt={`${review.name} Google review profile photo`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-border object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-primary/8 text-label text-primary">RE</div>
                  )}
                  <p className="font-subheading font-bold text-foreground text-base uppercase tracking-wider">{review.name}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {review.model && (
                    <span className="font-label text-[10px] bg-primary/8 text-primary border border-primary/18 px-2.5 py-1 rounded-full">
                      {review.model}
                    </span>
                  )}
                  {review.service && (
                    <span className="font-label text-[10px] text-muted-foreground border border-border/80 px-2.5 py-1 rounded-full">
                      {review.service}
                    </span>
                  )}
                  <span className="font-label text-[9px] text-muted-foreground/60 py-1">{review.relativeDate ?? review.date}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-7 pt-5 border-t border-border/60">
                <div className="flex gap-1.5">
                  {reviewItems.slice(0, 6).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        i === current
                          ? "w-6 h-2 bg-primary"
                          : "w-2 h-2 bg-foreground/15 hover:bg-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => goTo(current - 1)}
                    className="p-2 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-pointer">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => goTo(current + 1)}
                    className="p-2 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-pointer">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews grid */}
          <div className="lg:col-span-3 md:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {reviewItems.slice(0, 4).map((r, index) => (
              <div key={r.id}
                className={`group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 cursor-default hover:-translate-y-0.5 bg-white ${index >= 2 ? "hidden sm:block" : ""}`}
                style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                {/* Hover: crimson top hairline */}
                <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Hover bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-primary-light scale-x-0 group-hover:scale-x-100 transition-transform duration-400 rounded-b-2xl" />
                {/* Giant quote */}
                <div className="absolute top-2 right-3 font-display text-[64px] leading-none text-primary/6 select-none pointer-events-none">
                  &ldquo;
                </div>
                <StarRating rating={r.rating} />
                <p className="font-body text-muted-foreground text-sm lg:text-[15.5px] leading-[1.7] lg:leading-[1.85] mt-3 lg:mt-4 mb-4 lg:mb-5 italic line-clamp-3">
                  &ldquo;{r.review}&rdquo;
                </p>
                <p className="font-heading font-bold text-foreground text-sm uppercase tracking-wider">— {r.name}</p>
                {r.model && (
                  <span className="font-label text-[9px] bg-primary/8 text-primary border border-primary/16 px-2 py-0.5 rounded-full mt-2 inline-block">
                    {r.model}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Google CTA */}
        <div className="text-center mt-12 reveal">
          <a href={business.branches[0].mapsUrl ?? "#"} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground px-7 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-white"
          >
            Read All Reviews on Google
            <Star className="h-4 w-4 fill-gold text-gold" />
          </a>
        </div>
      </div>
    </section>
  );
}
