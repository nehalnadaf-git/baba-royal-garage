"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { galleryImages } from "@/lib/gallery";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";

const GALLERY_ITEMS: GalleryItem[] = galleryImages.map((img) => ({
  image:       img.src,
  text:        img.label,
  /* width ÷ height drives the OGL card shape:
   *  > 1  →  landscape card  (e.g. 1200×900  = 1.333)
   *  < 1  →  portrait  card  (e.g. 1200×1600 = 0.75 ) */
  aspectRatio: img.width / img.height,
}));

/* ── Layout constants ─────────────────────────────────────────────────────
 * Tank PNG natural aspect ratio: 1696 × 2528  (H/W = 1.49).
 * TANK_W / TANK_H mirror the CSS --tank-width formula exactly.        */
const TANK_W = "var(--tank-width)";
const TANK_H = "calc(var(--tank-width) * 1.49)";

/**
 * getTankPx
 * Computes the actual rendered tank pixel-width using the same three-way
 * min() formula as the CSS custom property --tank-width.
 *
 *   CSS:  min(420px, 85vw | 75vw, calc(70vh / 1.49))
 *
 * This replaces the old fixed-coefficient approach which drifted whenever
 * the vh leg dominated (e.g. landscape mobile).
 */
function getTankPx(): number {
  const vw    = window.innerWidth;
  const vh    = window.innerHeight;
  const vwLeg = vw < 560 ? vw * 0.85 : vw * 0.75;
  const vhLeg = (vh * 0.70) / 1.49;
  return Math.min(420, vwLeg, vhLeg);
}

/**
 * easeP  —  physical smooth-step (3t² − 2t³)
 *
 * Maps linear scroll progress [0,1] to an S-curve that:
 *  - starts slowly   (tank has mass, must overcome static friction)
 *  - accelerates mid (momentum builds)
 *  - decelerates smoothly to rest (no hard stop)
 *
 * Critically: this SAME function is applied to both the tank X transforms
 * and the gallery clip-path, guaranteeing they are always pixel-perfect
 * in sync regardless of frame timing.
 */
function easeP(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export default function PetrolTankGallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* ── Device detection ─────────────────────────────────────────────────
   * useState(false)  →  SSR-safe (no window on server)
   * useRef           →  mutable, always current inside motion transforms
   *                     and useEffect closures without needing re-renders */
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isTouchRef    = useRef(false);
  const maxTravelRef  = useRef(115); // updated after hydration

  /* ── Lightbox state ─────────────────────────────────────────────────── */
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const showPrev = useCallback(() => {
    setLightboxIndex((i) => (i <= 0 ? GALLERY_ITEMS.length - 1 : i - 1));
  }, []);
  const showNext = useCallback(() => {
    setLightboxIndex((i) => (i >= GALLERY_ITEMS.length - 1 ? 0 : i + 1));
  }, []);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touch);
    isTouchRef.current   = touch;
    maxTravelRef.current = touch ? 48 : 115;
  }, []);

  /* ── Scroll progress ──────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ── Spring smoothing ─────────────────────────────────────────────────
   *
   * Goal: remove per-frame jitter while keeping the animation feeling
   * tightly coupled to scroll (no "floating" lag).
   *
   * Desktop (pointer: fine)
   *   stiffness 180 / damping 38  →  overdamped, settles in ~140 ms.
   *   Snappy tracking; easeP() provides all the motion personality.
   *
   * Touch (pointer: coarse) — iOS / Android
   *   stiffness  95 / damping 22  →  just at critical damping.
   *   Tames momentum-scroll velocity spikes without mushy feel.
   *   Lower stiffness than desktop so iOS rubber-band scroll doesn't jerk.
   *
   * restDelta 0.0005 → spring declares "settled" sooner, preventing a long
   * micro-drift tail that can hold the gallery clip fractionally open. */
  const rawProgress = useSpring(scrollYProgress, {
    stiffness: isTouchDevice ?  95 : 180,
    damping:   isTouchDevice ?  22 :  38,
    restDelta: 0.0005,
  });

  /* ── Tank halves: physically eased X translation ──────────────────────
   *
   * We read maxTravelRef.current inside the transform function so we
   * always use the post-hydration value without recreating the transform. */
  const leftX = useTransform(rawProgress, (p) =>
    `${-easeP(p) * maxTravelRef.current}%`
  );
  const rightX = useTransform(rawProgress, (p) =>
    `${easeP(p) * maxTravelRef.current}%`
  );

  /* ── Gallery clip — absolute pixel insets ─────────────────────────────
   *
   * Derived from the same getTankPx() + easeP() as the tank transforms,
   * so clip edges track tank inner edges exactly on every device / resize.
   *
   *   inset = max(0,  vw/2  −  tankPx × (travel/100) × easeP(p) )
   *
   * At p = 0: inset = vw/2  → gallery completely hidden
   * At p = 1: inset ≈ 0 px  → gallery fully revealed              */
  const galleryClip = useMotionValue("inset(0 50% 0 50%)");

  useEffect(() => {
    const compute = (p: number) => {
      const ep          = easeP(p);
      const travelCoeff = maxTravelRef.current / 100;
      const vw          = window.innerWidth;
      const tankPx      = getTankPx();
      const inset       = Math.max(0, vw / 2 - tankPx * travelCoeff * ep);
      galleryClip.set(`inset(0 ${inset}px 0 ${inset}px)`);
    };

    compute(rawProgress.get());
    const unsub    = rawProgress.on("change", compute);
    const onResize = () => compute(rawProgress.get());
    window.addEventListener("resize", onResize);
    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, [rawProgress, galleryClip]);

  /* ── Header: fade + lift as scroll begins ────────────────────────────  */
  const headerOpacity = useTransform(rawProgress, [0, 0.13], [1, 0]);
  const headerY       = useTransform(rawProgress, [0, 0.13], [0, -30]);

  /* ── CTA: fade in near the end ───────────────────────────────────────  */
  const ctaOpacity = useTransform(rawProgress, [0.74, 1], [0, 1]);
  const ctaY       = useTransform(rawProgress, [0.74, 1], [22, 0]);

  /* ── Section scroll-track height ─────────────────────────────────────
   * Mobile gets a taller track so the animation occupies enough physical
   * scroll distance on a short viewport to feel comfortable. */
  const sectionHeight = isTouchDevice ? "330vh" : "280vh";

  return (
    <>
      <div ref={sectionRef} style={{ height: sectionHeight }} className="relative bg-[hsl(var(--ink-900))]">

      {/* ── Sticky viewport ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 w-full overflow-hidden bg-[hsl(var(--ink-900))] h-screen-safe"
      >

        {/* Atmospheric red glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(232,25,42,0.12) 0%, transparent 100%)",
          }}
        />

        {/* ── Section header ──────────────────────────────────────── */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-30 text-center px-4 pointer-events-none"
          style={{
            /* env(safe-area-inset-top) handles iPhone notch / Dynamic Island */
            paddingTop: "max(env(safe-area-inset-top, 0px) + 1.75rem, 2rem)",
            opacity: headerOpacity,
            y: headerY,
          }}
        >
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <span className="h-px w-6 sm:w-10 bg-primary/50" />
            <span className="font-label text-primary text-[9px] sm:text-[11px] tracking-[0.40em] uppercase">
              Inside The Garage
            </span>
            <span className="h-px w-6 sm:w-10 bg-primary/50" />
          </div>

          <h2
            className="font-display text-white leading-none"
            style={{
              fontSize:      "clamp(30px, 6.5vw, 82px)",
              lineHeight:    0.9,
              letterSpacing: "0.03em",
            }}
          >
            Our <span className="text-primary">Gallery</span>
          </h2>

          <div className="w-8 h-[2px] bg-gradient-to-r from-primary to-primary-light rounded-full mx-auto mt-3 mb-2.5" />

          <p className="font-body text-white/40 text-xs sm:text-sm">
            Scroll to open the tank
          </p>

          <div className="flex flex-col items-center mt-2">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="14" height="18" viewBox="0 0 16 20" fill="none" aria-hidden>
                <path
                  d="M8 2v16M2 12l6 6 6-6"
                  stroke="hsl(354 84% 50%)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
         * SCENE — two independent layers, both centred in the sticky
         * viewport.
         *
         * Layer 1 (z:1) — Full-width OGL gallery
         *   · spans 100vw so OGL has room for the full arc
         *   · clip-path tracks tank inner edges in absolute px
         *   · touchAction: pan-y lets iOS forward vertical scroll
         *     to the document; OGL handles horizontal drag itself
         *
         * Layer 2 (z:20) — Tank halves
         *   · pointer-events: none — never eat touch events
         *   · inner-edge shadow divs simulate depth / AO as parts
         * ════════════════════════════════════════════════════════════ */}

        {/* ── Layer 1 : Gallery ──────────────────────────────────── */}
        <motion.div
          className="absolute left-0 right-0"
          style={{
            top:         "50%",
            y:           "-50%",
            height:      TANK_H,
            clipPath:    galleryClip,
            zIndex:      1,
            touchAction: "pan-y",
          }}
        >
          <CircularGallery
            items={GALLERY_ITEMS}
            bend={2}
            borderRadius={0.06}
            scrollSpeed={2}
            scrollEase={0.06}
            onImageClick={(clickedItem) => {
              const idx = GALLERY_ITEMS.findIndex((gi) => gi.image === clickedItem.image);
              setLightboxIndex(idx >= 0 ? idx : 0);
            }}
            className="w-full h-full"
          />
        </motion.div>

        {/* ── Layer 2 : Tank halves ───────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">

          {/* LEFT half ─────────────────────────────────────────────── */}
          <motion.div
            className="absolute"
            style={{
              width:    TANK_W,
              height:   TANK_H,
              /* inset(top right bottom left)
               * right:50% — inner split at centre
               * left: 7%  — trims the transparent outer PNG margin
               *             that was showing as a white bar */
              clipPath: "inset(0 50% 0 7%)",
              x:        leftX,
              zIndex:   20,
            }}
          >
            <Image
              src="/images/petrol-tank-gallery.png"
              alt="Royal Enfield Heritage Petrol Tank — left half"
              fill
              className="object-contain"
              sizes="(max-width: 559px) 85vw, (max-width: 768px) 75vw, 420px"
              priority
            />

          </motion.div>

          {/* RIGHT half ─────────────────────────────────────────────── */}
          <motion.div
            className="absolute"
            style={{
              width:    TANK_W,
              height:   TANK_H,
              /* right:7% — trims transparent outer PNG margin on the right */
              clipPath: "inset(0 7% 0 50%)",
              x:        rightX,
              zIndex:   20,
            }}
          >
            <Image
              src="/images/petrol-tank-gallery.png"
              alt="Royal Enfield Heritage Petrol Tank — right half"
              fill
              className="object-contain"
              sizes="(max-width: 559px) 85vw, (max-width: 768px) 75vw, 420px"
              priority
            />

          </motion.div>

        </div>

        {/* ── Premium Upgraded CTA ────────────────────────────────────── */}
        <motion.div
          className="absolute left-0 right-0 flex flex-col items-center gap-3 sm:gap-4 z-30 px-4"
          style={{
            /* env(safe-area-inset-bottom) handles iPhone home-bar */
            bottom: "max(env(safe-area-inset-bottom, 0px) + 1rem, 1.5rem)",
            opacity: ctaOpacity,
            y: ctaY,
          }}
        >
          {/* Refined Glassmorphic Gold-Pinstriped Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[hsl(var(--gold)/0.25)] bg-[rgba(14,14,22,0.6)] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.03)] max-w-full">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--gold))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[hsl(var(--gold))]"></span>
            </span>
            <span className="font-label text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.32em] uppercase bg-gradient-to-r from-[hsl(var(--gold-light))] via-[#fff2cf] to-[hsl(var(--gold))] bg-clip-text text-transparent font-medium truncate">
              Heritage Craftsmanship · Drag to Explore
            </span>
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--gold))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[hsl(var(--gold))]"></span>
            </span>
          </div>

          {/* Premium Metallic Pinstripe Action Button */}
          <Link
            href="/gallery"
            className="group/cta relative inline-flex items-center justify-center gap-3 overflow-hidden px-6 py-2.5 sm:px-8 sm:py-3 w-full max-w-[260px] sm:max-w-[290px] min-h-[44px] sm:min-h-[48px] rounded-sm transition-all duration-500 border border-[hsl(var(--gold)/0.25)] hover:border-primary/80 bg-gradient-to-b from-[#161622] to-[#0a0a0f] shadow-[0_4px_25px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(232,25,42,0.22),0_0_15px_rgba(232,25,42,0.1)]"
            style={{ touchAction: "manipulation" }}
          >
            {/* Ambient gold glow that transitions to crimson on hover */}
            <span className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 bg-[radial-gradient(circle_at_center,rgba(232,25,42,0.12)_0%,transparent_100%)] transition-opacity duration-500" />
            
            {/* Tilted metallic sheen glare sweep */}
            <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -skew-x-12 translate-x-[-120%] group-hover/cta:translate-x-[120%] transition-transform duration-[1200ms] ease-out pointer-events-none" />

            <span className="relative font-label text-[9px] sm:text-[11px] text-white/70 group-hover/cta:text-white tracking-[0.25em] sm:tracking-[0.28em] uppercase transition-colors duration-300">
              View Full Gallery
            </span>
            
            <div className="relative flex items-center justify-center w-4 sm:w-4.5 h-4 sm:h-4.5 rounded-full bg-white/5 border border-white/10 group-hover/cta:bg-primary/20 group-hover/cta:border-primary/30 transition-all duration-300 shrink-0">
              <ArrowUpRight className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[hsl(var(--gold-light))] group-hover/cta:text-primary-light group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-all duration-300" />
            </div>
          </Link>
        </motion.div>

        {/* Bottom hairline */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-30"
        />

      </div>
    </div>

    {/* ── Lightbox portal ── rendered outside the section so it can be
        fixed-positioned above everything including the sticky container */}
    <GalleryLightbox
      items={GALLERY_ITEMS}
      currentIndex={lightboxIndex}
      onClose={() => setLightboxIndex(-1)}
      onPrev={showPrev}
      onNext={showNext}
    />
    </>
  );
}
