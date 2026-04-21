"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryImages } from "@/lib/gallery";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const PREVIEW_COUNT = 7;

// Fan rotations — mirrors the "In Action" reference layout
// centre card (index 3) is flat, edges tilt outward
const FAN_ROTATIONS  = [-14, -8, -3.5, 0, 3.5, 8, 14];
// Centre card taller; edges slightly shorter
const HEIGHT_SCALE   = [0.82, 0.88, 0.94, 1, 0.94, 0.88, 0.82];

export default function GalleryPreviewSection() {
  const preview     = galleryImages.slice(0, PREVIEW_COUNT);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const isInView    = useInView(sectionRef, { once: true, margin: "-8%" });

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const centreCardRef = useRef<HTMLDivElement>(null);

  // Initial scroll to centre on mobile — uses direct scrollLeft calculation
  // so ONLY the carousel container scrolls horizontally.
  // We intentionally avoid scrollIntoView({ block: "nearest" }) because that
  // also scrolls the page VERTICALLY to the section, which causes the shutter
  // intro to reveal the wrong scroll position (jumping to this section).
  useEffect(() => {
    const timer = setTimeout(() => {
      if (centreCardRef.current && scrollRef.current) {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
          const container = scrollRef.current;
          const card      = centreCardRef.current;
          // Center the card inside the scroll container (horizontal only)
          const cardLeft   = card.offsetLeft;
          const cardWidth  = card.offsetWidth;
          const containerW = container.clientWidth;
          container.scrollLeft = cardLeft - (containerW - cardWidth) / 2;
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
    const max = scrollWidth - clientWidth;
    setScrollProgress(max > 0 ? scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -440 : 440,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 md:py-36 bg-[#030303] overflow-hidden border-t border-white/5"
    >
      {/* ── Atmospheric BG ───────────────────────────────────────── */}
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />
      {/* Glow orbs */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[40vh] bg-primary/6 blur-[180px] rounded-full pointer-events-none z-0" />
      <div aria-hidden className="absolute bottom-0 left-1/4 w-[40vw] h-[30vh] bg-primary/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Ghost watermark — background typography */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none overflow-hidden z-0"
      >
        <span
          className="font-display uppercase whitespace-nowrap leading-none text-transparent"
          style={{
            fontSize: "clamp(100px, 20vw, 260px)",
            WebkitTextStroke: "1px rgba(255,255,255,0.04)",
            letterSpacing: "0.06em",
          }}
        >
          GARAGE
        </span>
      </div>

      {/* Top hairline */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION HEADER  —  matches reference image 1 exactly
          • Centred layout
          • Small eyebrow with flanking dash lines
          • Massive bold Bebas heading, one key word in crimson
          • Light body copy below
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 text-center px-5 mb-14 sm:mb-16 md:mb-20">

        {/* Eyebrow — "— INSIDE THE GARAGE —" */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center justify-center gap-3 mb-5 sm:mb-6"
        >
          <span className="h-px w-6 sm:w-10 bg-primary/60" />
          <span className="font-label text-primary text-[9px] sm:text-[11px] tracking-[0.4em] uppercase">
            Inside The Garage
          </span>
          <span className="h-px w-6 sm:w-10 bg-primary/60" />
        </motion.div>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-white uppercase leading-none mx-auto"
          style={{
            fontSize: "clamp(40px, 8vw, 100px)",
            lineHeight: 0.88,
            letterSpacing: "0.03em",
            maxWidth: "18ch",
          }}
        >
          See The{" "}
          <span className="text-primary">Craft</span>
          <br />
          Up Close
        </motion.h2>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="font-body text-white/45 text-sm sm:text-base leading-relaxed mt-5 sm:mt-7 mx-auto max-w-md sm:max-w-lg"
        >
          Every frame straight from our workshop — real machines,
          real craftsmanship, zero shortcuts.
        </motion.p>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FAN CARD CAROUSEL  —  matches reference image 2 layout
          Cards rotate outward from centre like a spread hand of cards.
          Centre card (index 3) tallest + unrotated.
      ══════════════════════════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        className="relative z-10 w-full overflow-x-auto snap-x snap-mandatory lg:snap-none
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ cursor: "grab" }}
      >
        {/* Cards wrapper — centred on desktop, left-scrollable on mobile */}
        <div
          className="flex items-end justify-start lg:justify-center gap-3 sm:gap-4 min-w-max px-6 sm:px-10 lg:px-0"
          style={{ paddingTop: "40px", paddingBottom: "56px" }}
        >
          {preview.map((image, index) => {
            const rotation = FAN_ROTATIONS[index]  ?? 0;
            const hScale   = HEIGHT_SCALE[index]   ?? 1;
            const isCentre = index === Math.floor(PREVIEW_COUNT / 2);
            const delay    = Math.abs(index - Math.floor(PREVIEW_COUNT / 2)) * 0.07 + 0.25;

            // 9:16 portrait ratio — width drives height
            // Centre: 220px mobile → 260px desktop; sides scale from that
            const baseW = isCentre
              ? "clamp(200px, 16vw, 260px)"
              : "clamp(155px, 12vw, 210px)";
            // height = width × (16/9) using aspect-ratio CSS
            // We set explicit width and let aspect-ratio handle height

            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 60, rotate: 0 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, rotate: rotation }
                    : { opacity: 0, y: 60, rotate: 0 }
                }
                transition={{
                  duration: 0.85,
                  delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  rotate: rotation * 0.25,
                  y: -14,
                  zIndex: 40,
                  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                }}
                className="relative shrink-0 group/card snap-center"
                ref={isCentre ? centreCardRef : null}
                style={{
                  width: baseW,
                  aspectRatio: `9 / ${16 * hScale}`,
                  zIndex: isCentre ? 20 : 10,
                  transformOrigin: "bottom center",
                }}
              >
                <Link href="/gallery" className="block w-full h-full">
                  {/* ── Card frame ── */}
                  {/* Outer border — subtle warm tint, like ref image 2 golden borders */}
                  <div
                    className="absolute inset-0 rounded-[3px] z-0 transition-opacity duration-500"
                    style={{
                      boxShadow: isCentre
                        ? "0 0 0 1.5px rgba(232,25,42,0.55), 0 28px 64px rgba(0,0,0,0.80)"
                        : "0 0 0 1px rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.60)",
                    }}
                  />

                  {/* Image container */}
                  <div className="absolute inset-0 rounded-[3px] overflow-hidden z-10">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 18vw"
                      className="object-cover transition-transform duration-[1100ms] ease-out group-hover/card:scale-[1.08]"
                    />

                    {/* Gradient overlay — heavier at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 transition-opacity duration-500 group-hover/card:opacity-75" />

                    {/* Hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/6 to-transparent -translate-x-[160%] group-hover/card:translate-x-[160%] transition-transform duration-[850ms] ease-in-out skew-x-12 mix-blend-overlay pointer-events-none" />
                  </div>

                  {/* Content — bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 translate-y-1 group-hover/card:translate-y-0 transition-transform duration-400 ease-out">
                    {/* Category */}
                    <div className="overflow-hidden mb-1">
                      <p className="font-label text-[8px] sm:text-[9.5px] text-primary tracking-[0.28em] uppercase translate-y-full group-hover/card:translate-y-0 transition-transform duration-400 delay-50">
                        {image.category}
                      </p>
                    </div>
                    {/* Label */}
                    <h3
                      className="font-display text-white uppercase leading-none"
                      style={{ fontSize: "clamp(13px, 1.8vw, 20px)", letterSpacing: "0.06em" }}
                    >
                      {image.label}
                    </h3>
                    {/* Red rule */}
                    <div className="mt-2 h-px w-0 bg-primary group-hover/card:w-8 transition-all duration-600 ease-out" />
                  </div>

                  {/* Centre card badge */}
                  {isCentre && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-2.5 py-1 bg-primary/90 rounded-sm">
                      <span className="font-label text-white text-[8px] tracking-[0.2em] uppercase whitespace-nowrap">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Arrow — top right on hover */}
                  <div className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-black/50 border border-white/10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 scale-75 group-hover/card:scale-100 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/80" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM BAR — Controls + progress + CTA
      ══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 px-6 sm:px-10 md:px-16 mt-6"
      >
        {/* Scroll nav + animated progress */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="group/nav relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-primary/40 disabled:opacity-20 disabled:cursor-default transition-all duration-300"
          >
            <ChevronLeft size={17} className="transition-transform group-hover/nav:-translate-x-0.5" />
            <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Progress track */}
          <div className="relative w-28 sm:w-40 h-[2px] bg-white/8 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
            {/* Glow dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-primary shadow-[0_0_8px_rgba(232,25,42,1)] transition-all duration-300"
              style={{ left: `calc(${scrollProgress * 100}% - 2.5px)` }}
            />
          </div>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="group/nav relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-primary/40 disabled:opacity-20 disabled:cursor-default transition-all duration-300"
          >
            <ChevronRight size={17} className="transition-transform group-hover/nav:translate-x-0.5" />
            <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* CTA */}
        <Link
          href="/gallery"
          className="group/cta relative inline-flex items-center gap-3 overflow-hidden border border-white/10 hover:border-primary/50 px-7 py-3.5 transition-all duration-500"
        >
          <span className="absolute inset-0 bg-primary/0 group-hover/cta:bg-primary/8 transition-colors duration-500" />
          <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary scale-y-0 group-hover/cta:scale-y-100 transition-transform duration-500 origin-bottom" />
          <span className="relative font-label text-[10px] sm:text-[11px] text-white/55 group-hover/cta:text-white tracking-[0.28em] uppercase transition-colors duration-300">
            View Full Archives
          </span>
          <ArrowUpRight className="relative h-3.5 w-3.5 text-primary group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </motion.div>

      {/* Bottom hairline */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
