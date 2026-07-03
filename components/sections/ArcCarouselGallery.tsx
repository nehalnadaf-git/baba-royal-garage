"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type PointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryImages } from "@/lib/gallery";
import type { GalleryImage } from "@/types";

/* ── Data ──────────────────────────────────────────────────────────── */
// Duplicate so we always have enough items for the 7-slot window
const BASE = galleryImages;
const CARDS: GalleryImage[] = [...BASE, ...BASE].slice(0, Math.max(8, BASE.length));
const N = CARDS.length;
const wrap = (i: number) => ((i % N) + N) % N;

/* ── Arc geometry ──────────────────────────────────────────────────── */
// Arc is computed on a circle of radius R.
// Each slot k is placed at angle = k * STEP from the top of the circle.
// x  = R * sin(angle)   →  horizontal offset
// y  = R * (1 - cos(angle))  →  downward drop (0 at top)
// rotate = angle           →  card tilts along the circle tangent

const R    = 1260;          // circle radius (px) – larger = flatter arc
const STEP = 13;            // degrees between slots
const DEG  = Math.PI / 180;

// Precompute for |k| = 0 … 4
type ArcSlot = { xAbs: number; y: number; rotate: number; scale: number; opacity: number; z: number };
const SLOTS: ArcSlot[] = Array.from({ length: 5 }, (_, absK) => {
  const angle = absK * STEP;
  const rad   = angle * DEG;
  return {
    xAbs:    R * Math.sin(rad),            // always positive; sign applied per card
    y:       R * (1 - Math.cos(rad)),      // drop from baseline
    rotate:  angle,                        // tilt
    scale:   Math.max(0.50, 1 - absK * 0.125),
    opacity: absK >= 4 ? 0 : 1 - absK * 0.08,
    z:       50 - absK * 10,
  };
});

function getSlot(k: number): { x: number; y: number; rotate: number; scale: number; opacity: number; z: number } {
  const absK = Math.abs(k);
  const sign = k > 0 ? 1 : k < 0 ? -1 : 0;
  const s    = SLOTS[Math.min(absK, 4)];
  return { ...s, x: s.xAbs * sign, opacity: absK > 3 ? 0 : s.opacity };
}

/* ── Constants ─────────────────────────────────────────────────────── */
const VISIBLE_SLOTS = [-3, -2, -1, 0, 1, 2, 3];
const DRAG_THRESHOLD = 72;   // px needed to advance one card
const CARD_ASPECT = 9 / 14;  // portrait cards

/* ══════════════════════════════════════════════════════════════════════
   ArcCarouselGallery
══════════════════════════════════════════════════════════════════════ */
export default function ArcCarouselGallery() {
  const sectionRef  = useRef<HTMLElement>(null);
  const isInView    = useInView(sectionRef, { once: true, margin: "-12%" });
  const arcRef      = useRef<HTMLDivElement>(null);

  const [active,    setActive]    = useState(0);
  const [lightbox,  setLightbox]  = useState<GalleryImage | null>(null);
  const [dragDelta, setDragDelta] = useState(0);   // live drag feedback (px)
  const [arcScale,  setArcScale]  = useState(1);   // responsive scale

  // ── Responsive arc scale ───────────────────────────────────────────
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      // Cards at k=2 reach xAbs≈584px; clamp so they stay in viewport
      setArcScale(Math.max(0.38, Math.min(1, vw / 1240)));
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, []);

  // ── Keyboard navigation ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) { if (e.key === "Escape") setLightbox(null); return; }
      if (e.key === "ArrowLeft")  advance(-1);
      if (e.key === "ArrowRight") advance(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  // ── Advance helper ─────────────────────────────────────────────────
  const advance = useCallback((dir: -1 | 1) => {
    setActive(prev => wrap(prev + dir));
  }, []);

  // ── Pointer drag ──────────────────────────────────────────────────
  const drag = useRef({ active: false, startX: 0 });

  const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, startX: e.clientX };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    setDragDelta(e.clientX - drag.current.startX);
  }, []);

  const onPointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const delta = e.clientX - drag.current.startX;
    setDragDelta(0);
    if (Math.abs(delta) < 6) return; // tap — let click handler run
    if (delta < -DRAG_THRESHOLD) advance(1);
    else if (delta > DRAG_THRESHOLD) advance(-1);
  }, [advance]);

  // ── Center card click → lightbox ──────────────────────────────────
  const onCenterClick = useCallback(() => {
    if (Math.abs(dragDelta) < 6) setLightbox(CARDS[active]);
  }, [active, dragDelta]);

  /* ── Dot indices (always show 7 dots, highlight active position) ── */
  const DOT_RANGE = 7;
  const dotCenter = Math.floor(DOT_RANGE / 2);

  return (
    <>
      <section
        id="arc-gallery"
        ref={sectionRef}
        className="relative bg-white overflow-hidden py-20 sm:py-28"
        aria-label="Gallery arc carousel"
      >
        {/* Atmospheric bloom */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 78%, rgba(232,25,42,0.04) 0%, transparent 100%)",
          }}
        />

        {/* ── Section Header ──────────────────────────────────────── */}
        <motion.div
          className="relative z-10 text-center px-5 mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 sm:w-12 bg-primary/50" />
            <span className="font-label text-primary text-[9px] sm:text-[11px] tracking-[0.42em] uppercase">
              Inside The Garage
            </span>
            <span className="h-px w-8 sm:w-12 bg-primary/50" />
          </div>

          {/* Main headline */}
          <h2
            className="font-display text-foreground leading-none mx-auto"
            style={{
              fontSize: "clamp(38px, 7.5vw, 96px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            See The{" "}
            <span className="text-primary">Craft</span>
            <br />
            Up Close
          </h2>

          {/* Divider */}
          <motion.div
            className="w-12 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mx-auto mt-5"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.3 }}
          />

          <p className="font-body text-muted-foreground text-sm sm:text-base leading-relaxed mx-auto mt-4 max-w-md">
            Every frame straight from our workshop — real machines, real craftsmanship.
          </p>
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            ARC CAROUSEL
            All cards share a bottom baseline and fan outward on arc.
            The arcScale CSS transform makes it fully responsive.
        ════════════════════════════════════════════════════════ */}
        <div
          className="relative z-10 flex flex-col items-center select-none"
          style={{ touchAction: "none" }}
        >
          {/* Drag/touch surface */}
          <div
            ref={arcRef}
            className="relative w-full"
            style={{
              height: `${(R * (1 - Math.cos(3 * STEP * DEG)) + 320) * arcScale + 32}px`,
              cursor: drag.current.active ? "grabbing" : "grab",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Arc cards — absolutely positioned from bottom-center */}
            <div
              className="absolute bottom-0 left-1/2"
              style={{ transform: `translateX(-50%) scale(${arcScale})`, transformOrigin: "bottom center" }}
            >
              {VISIBLE_SLOTS.map(k => {
                const cardIndex = wrap(active + k);
                const card      = CARDS[cardIndex];
                const slot      = getSlot(k);
                const isCenter  = k === 0;
                const isCentre1 = Math.abs(k) === 1;
                const delay     = Math.abs(k) * 0.055;

                // Card pixel size
                const cardW = isCenter ? 210 : isCentre1 ? 182 : 158;
                const cardH = Math.round(cardW / CARD_ASPECT);

                // Live drag feedback: shift x slightly during drag
                const dragFeedback = drag.current.active
                  ? (dragDelta / 280) * -SLOTS[1].xAbs * (k === 0 ? 0.3 : 0.15)
                  : 0;

                return (
                  <motion.div
                    key={`slot-${k}`}
                    className="absolute"
                    style={{
                      width:  cardW,
                      height: cardH,
                      // Position from bottom-center of the arc container
                      left:   slot.x + dragFeedback - cardW / 2,
                      bottom: slot.y,
                      zIndex: slot.z,
                      transformOrigin: "bottom center",
                    }}
                    animate={{
                      rotate:  slot.rotate,
                      scale:   slot.scale,
                      opacity: slot.opacity,
                    }}
                    initial={false}
                    transition={{
                      duration: 0.52,
                      delay: isInView ? delay : 0,
                      ease: [0.32, 0, 0.08, 1],
                    }}
                    // entry from below
                    {...(!isInView && {
                      initial: { opacity: 0, y: 60 },
                      animate: isInView
                        ? { opacity: slot.opacity, y: 0, rotate: slot.rotate, scale: slot.scale }
                        : {},
                    })}
                    whileHover={
                      !isCenter
                        ? { scale: slot.scale * 1.04, y: -8, transition: { duration: 0.28 } }
                        : undefined
                    }
                    onClick={isCenter ? onCenterClick : () => setActive(cardIndex)}
                  >
                    <CardFace
                      card={card}
                      isCenter={isCenter}
                      scale={slot.scale}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom arc blur vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent z-20"
          />
        </div>

        {/* ── Navigation dots + label ──────────────────────────── */}
        <motion.div
          className="relative z-30 flex flex-col items-center gap-3 mt-6 px-5"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Gallery navigation">
            {Array.from({ length: DOT_RANGE }, (_, di) => {
              const isActive = di === dotCenter;
              return (
                <button
                  key={di}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => advance((di - dotCenter) as -1 | 1)}
                  className="relative flex items-center justify-center transition-all duration-300 focus:outline-none"
                  style={{ width: isActive ? 24 : 8, height: 8 }}
                  aria-label={`Go to item ${di + 1}`}
                >
                  <span
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:      isActive ? 24 : 6,
                      height:     isActive ? 8  : 6,
                      background: isActive
                        ? "hsl(354 84% 50%)"
                        : "hsl(220 4% 70%)",
                      display: "block",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Active card label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
              className="flex items-center gap-2"
            >
              <span className="h-px w-5 bg-primary/50" />
              <span className="font-label text-[10px] sm:text-[11px] text-foreground/70 tracking-[0.28em] uppercase">
                {CARDS[active].label}
              </span>
              <span className="font-label text-[10px] sm:text-[11px] text-primary/60 tracking-[0.18em]">·</span>
              <span className="font-label text-[10px] sm:text-[11px] text-muted-foreground tracking-[0.2em] uppercase">
                {CARDS[active].category}
              </span>
              <span className="h-px w-5 bg-primary/50" />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next + helper text */}
          <div className="flex items-center gap-5 mt-3">
            <button
              onClick={() => advance(-1)}
              aria-label="Previous image"
              className="group w-10 h-10 rounded-full border border-foreground/12 hover:border-primary/40 flex items-center justify-center transition-all duration-300 hover:bg-primary/5"
            >
              <ChevronLeft className="h-4 w-4 text-foreground/50 group-hover:text-primary transition-colors" />
            </button>

            <p className="font-label text-[9px] sm:text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase">
              Drag or click to explore
            </p>

            <button
              onClick={() => advance(1)}
              aria-label="Next image"
              className="group w-10 h-10 rounded-full border border-foreground/12 hover:border-primary/40 flex items-center justify-center transition-all duration-300 hover:bg-primary/5"
            >
              <ChevronRight className="h-4 w-4 text-foreground/50 group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* View all CTA */}
          <Link
            href="/gallery"
            className="group/cta mt-2 relative inline-flex items-center gap-3 overflow-hidden border border-foreground/12 hover:border-primary/45 px-8 py-3 rounded-sm transition-all duration-400"
          >
            <span className="absolute inset-0 bg-primary/0 group-hover/cta:bg-primary/5 transition-colors duration-400" />
            <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary scale-y-0 group-hover/cta:scale-y-100 transition-transform duration-400 origin-bottom" />
            <span className="relative font-label text-[10px] sm:text-[11px] text-foreground/55 group-hover/cta:text-foreground tracking-[0.3em] uppercase transition-colors duration-300">
              View Full Gallery
            </span>
            <ArrowUpRight className="relative h-3.5 w-3.5 text-primary group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Bottom hairline */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/18 to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════════
          LIGHTBOX
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => setLightbox(null)}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-lg sm:max-w-xl bg-white rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
              initial={{ scale: 0.88, y: 32, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 16, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 640px"
                  priority
                />
                {/* Top gradient for close btn visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Info strip */}
              <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
                <div>
                  {/* Category pill */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/15 mb-3">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    <span className="font-label text-primary text-[9px] tracking-[0.3em] uppercase">
                      {lightbox.category}
                    </span>
                  </span>
                  <h3
                    className="font-display text-foreground leading-tight"
                    style={{ fontSize: "clamp(18px, 3vw, 28px)", letterSpacing: "-0.02em" }}
                  >
                    {lightbox.label}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm mt-1 leading-relaxed">
                    Real craftsmanship from Baba Royal Garage, Hubli.
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href="/gallery"
                  className="shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-heading font-bold text-[12px] uppercase tracking-[0.1em] px-4 py-2.5 rounded-xl transition-colors duration-300"
                >
                  Gallery
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Close button */}
            <button
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Card Face ──────────────────────────────────────────────────────── */
function CardFace({
  card,
  isCenter,
  scale,
}: {
  card: GalleryImage;
  isCenter: boolean;
  scale: number;
}) {
  return (
    <div
      className="group/face relative w-full h-full rounded-[18px] overflow-hidden"
      style={{
        boxShadow: isCenter
          ? "0 0 0 2.5px hsl(354 84% 50%), 0 28px 72px rgba(0,0,0,0.30), 0 8px 24px rgba(232,25,42,0.15)"
          : "0 0 0 1px rgba(0,0,0,0.09), 0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)",
      }}
    >
      {/* Image */}
      <Image
        src={card.src}
        alt={card.alt}
        fill
        loading="lazy"
        sizes="(max-width: 640px) 35vw, 18vw"
        className="object-cover transition-transform duration-[1100ms] ease-out group-hover/face:scale-[1.07]"
      />

      {/* Dark gradient bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/12 to-transparent" />

      {/* Top shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent -translate-x-[160%] group-hover/face:translate-x-[160%] transition-transform duration-[750ms] ease-in-out skew-x-12 mix-blend-overlay pointer-events-none" />

      {/* Category pill — top left */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <span
          className="font-label uppercase tracking-[0.18em] bg-black/45 backdrop-blur-sm text-white/90 rounded-full px-2 py-0.5"
          style={{ fontSize: `clamp(6px, ${0.55 / scale}vw, 8px)` }}
        >
          {card.category}
        </span>
      </div>

      {/* Center card click indicator */}
      {isCenter && (
        <div className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center">
          <ArrowUpRight className="h-3 w-3 text-white/80" />
        </div>
      )}

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pt-8">
        <h3
          className="font-display text-white leading-none"
          style={{ fontSize: `clamp(9px, ${0.9 / scale}vw, 13px)`, letterSpacing: "-0.01em" }}
        >
          {card.label}
        </h3>
        {/* Red rule */}
        <div className="mt-1.5 h-[1.5px] w-0 bg-primary group-hover/face:w-full transition-all duration-[600ms] ease-out" />
      </div>
    </div>
  );
}