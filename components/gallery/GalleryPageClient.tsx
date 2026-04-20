"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Grid3X3, Images } from "lucide-react";
import { galleryFilters, galleryImages } from "@/lib/gallery";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";

export default function GalleryPageClient() {
  const [activeFilter, setActiveFilter] = useState<(typeof galleryFilters)[number]>("All");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const filteredImages = useMemo(() => {
    if (activeFilter === "All") return galleryImages;
    return galleryImages.filter((image) => image.category === activeFilter);
  }, [activeFilter]);

  const activeIndex = filteredImages.findIndex((image) => image.id === activeId);
  const activeImage = activeIndex >= 0 ? filteredImages[activeIndex] : null;

  const closeLightbox = useCallback(() => setActiveId(null), []);

  const showNext = useCallback(() => {
    if (!filteredImages.length || activeIndex < 0) return;
    setActiveId(filteredImages[(activeIndex + 1) % filteredImages.length].id);
  }, [filteredImages, activeIndex]);

  const showPrev = useCallback(() => {
    if (!filteredImages.length || activeIndex < 0) return;
    setActiveId(filteredImages[(activeIndex - 1 + filteredImages.length) % filteredImages.length].id);
  }, [filteredImages, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeImage) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImage, closeLightbox, showNext, showPrev]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (activeId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeId]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-36 pb-14 sm:pb-20 bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-75 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute -top-32 left-1/3 w-[600px] h-[350px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative container mx-auto px-5 sm:px-8 flex flex-col items-center text-center">
          {/* Overline */}
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="h-[1px] w-8 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.35em] uppercase font-black">
              Inside Baba Royal Garage
            </span>
            <div className="h-[1px] w-8 bg-primary/60" />
          </div>

          {/* Headline */}
          <h1
            className="font-display text-white uppercase mb-5"
            style={{ fontSize: "clamp(44px, 8vw, 104px)", lineHeight: 0.88, letterSpacing: "0.015em" }}
          >
            Our Work Speaks
          </h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mb-6 mx-auto" />
          <p className="font-body text-white/50 text-[15px] sm:text-[17px] lg:text-[18px] leading-relaxed max-w-xl lg:max-w-2xl mx-auto">
            A window into our workshop — specialist Royal Enfield repairs, engine rebuilds, detailing and the team behind every job.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
            <div className="flex items-center gap-2.5">
              <Images className="h-4 w-4 text-primary" />
              <span className="font-label text-white/55 text-[11px] tracking-[0.18em] uppercase">
                {galleryImages.length} Photos
              </span>
            </div>
            <div className="w-[1px] h-4 bg-white/15" />
            <div className="flex items-center gap-2.5">
              <Grid3X3 className="h-4 w-4 text-primary" />
              <span className="font-label text-white/55 text-[11px] tracking-[0.18em] uppercase">
                {galleryFilters.length - 1} Categories
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter + Grid ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[hsl(210,5%,96%)]">
        <div className="container mx-auto px-5 sm:px-8">

          {/* Filter bar */}
          <div className="mb-8 sm:mb-10 lg:mb-12 overflow-x-auto scrollbar-hide -mx-5 sm:mx-0 px-5 sm:px-0">
            <div className="inline-flex min-w-max items-center gap-1.5 sm:gap-2 rounded-2xl border border-[#E4E7ED] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-1.5 sm:p-2">
              {galleryFilters.map((filter) => {
                const count = filter === "All"
                  ? galleryImages.length
                  : galleryImages.filter((img) => img.category === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`relative min-h-[40px] sm:min-h-[44px] rounded-xl px-3.5 sm:px-5 py-2 font-heading font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.10em] transition-all duration-250 ${
                      activeFilter === filter
                        ? "bg-primary text-white shadow-[0_4px_16px_rgba(232,25,42,0.30)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-[#F5F5F5]"
                    }`}
                  >
                    {filter}
                    <span className={`ml-1.5 text-[9px] font-black tabular-nums ${activeFilter === filter ? "text-white/70" : "text-muted-foreground/50"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Masonry-style grid — using CSS grid with varied aspect ratios */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {filteredImages.map((image, i) => {
              // Alternate tall/wide aspects for visual rhythm
              const isTall = i % 5 === 0 || i % 5 === 3;
              return (
                <button
                  key={image.id}
                  onClick={() => setActiveId(image.id)}
                  className={`group relative w-full overflow-hidden rounded-2xl text-left cursor-pointer ${isTall ? "row-span-2" : ""}`}
                  style={{ aspectRatio: isTall ? "3/4" : "4/3" }}
                  aria-label={`View ${image.label}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category badge — glassmorphism */}
                  <span
                    className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 font-label text-white text-[8px] sm:text-[9.5px] tracking-[0.18em] uppercase"
                    style={{
                      background: "rgba(15,17,23,0.45)",
                      backdropFilter: "blur(18px) saturate(1.8)",
                      WebkitBackdropFilter: "blur(18px) saturate(1.8)",
                      border: "1px solid rgba(255,255,255,0.22)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.30)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.50)",
                    }}
                  >
                    <span
                      className="w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full shrink-0 animate-pulse"
                      style={{ background: "#E8192A", boxShadow: "0 0 6px rgba(232,25,42,0.80)" }}
                    />
                    {image.category}
                  </span>

                  {/* Label at bottom — visible on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <p className="font-label text-white text-[9px] sm:text-[10px] tracking-[0.18em] uppercase">
                      {image.label}
                    </p>
                  </div>

                  {/* Hover border glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none"
                    style={{ boxShadow: "inset 0 0 0 1.5px rgba(232,25,42,0.35)" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredImages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-foreground/20 text-[40px] sm:text-[60px] uppercase tracking-wider mb-3">No Photos</p>
              <p className="font-body text-muted-foreground text-[14px]">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/93 backdrop-blur-md"
          onClick={closeLightbox}
          onTouchStart={(e) => setTouchStartX(e.changedTouches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (delta > 50) showPrev();
            if (delta < -50) showNext();
            setTouchStartX(null);
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:border-primary hover:bg-primary/20 transition-all duration-200"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5 sm:h-5 sm:w-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:top-6 z-10">
            <span
              className="font-label text-white/70 text-[10px] sm:text-[11px] tracking-[0.20em] uppercase px-3.5 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              {activeIndex + 1} / {filteredImages.length}
            </span>
          </div>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-3 sm:left-6 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:border-primary hover:bg-primary/20 transition-all duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Image */}
          <div
            className="relative mx-4 sm:mx-20 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[80vh] max-w-[90vw] sm:max-w-[80vw] overflow-hidden rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                width={activeImage.width}
                height={activeImage.height}
                priority
                className="max-h-[80vh] w-auto object-contain rounded-2xl"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 flex flex-col items-center gap-1.5">
              <p className="font-label text-white/80 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
                {activeImage.label}
              </p>
              <span
                className="font-label text-white/40 text-[9px] sm:text-[10px] tracking-[0.16em] uppercase px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {activeImage.category}
              </span>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-3 sm:right-6 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:border-primary hover:bg-primary/20 transition-all duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      )}

      <ServiceCTABanner />
    </>
  );
}
