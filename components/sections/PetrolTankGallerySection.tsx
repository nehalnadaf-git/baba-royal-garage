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
  AnimatePresence,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";

/* ── Gallery data with original aspect ratio ── */
const GALLERY_ITEMS = galleryImages.map((img) => ({
  image:       img.src,
  text:        img.label,
  aspectRatio: img.width / img.height, // Original aspect ratio
}));

// We render multiple copies of the gallery to create a seamless infinite track (mobile only)
const EXTENDED_ITEMS = [
  ...GALLERY_ITEMS,
  ...GALLERY_ITEMS,
  ...GALLERY_ITEMS,
  ...GALLERY_ITEMS,
  ...GALLERY_ITEMS,
];

const TANK_W = "var(--tank-width)";
const TANK_H = "calc(var(--tank-width) * 1.49)";

function getTankPx(): number {
  const vw    = window.innerWidth;
  const vh    = window.innerHeight;
  const vwLeg = vw < 560 ? vw * 0.85 : vw * 0.75;
  const vhLeg = (vh * 0.70) / 1.49;
  return Math.min(420, vwLeg, vhLeg);
}

function easeP(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/* ════════════════════════════════════════════════════════════════════════
 * Premium Focus Snap Carousel (Visual / Content / Selected Design)
 * ════════════════════════════════════════════════════════════════════════ */
const AUTOPLAY_MS = 3800;

interface FocusCarouselProps {
  onImageClick: (idx: number) => void;
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
  viewportWidth: number;
}

function FocusCarousel({
  onImageClick,
  activeIndex,
  setActiveIndex,
  viewportWidth,
}: FocusCarouselProps) {
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // virtualIndex points to the centered item in the EXTENDED_ITEMS array
  const [virtualIndex, setVirtualIndex] = useState(GALLERY_ITEMS.length * 2);
  const [springConfig, setSpringConfig] = useState<any>({
    type: "spring",
    stiffness: 260,
    damping: 28,
  });

  // Update outer state when virtualIndex maps to a new gallery index
  useEffect(() => {
    const realIndex = virtualIndex % GALLERY_ITEMS.length;
    if (realIndex !== activeIndex) {
      setActiveIndex(realIndex);
    }
  }, [virtualIndex, activeIndex, setActiveIndex]);

  // Seamless silent wrap at boundaries
  useEffect(() => {
    const len = GALLERY_ITEMS.length;
    if (virtualIndex >= len * 4 || virtualIndex < len) {
      const targetIndex = (virtualIndex % len) + len * 2;
      
      // Instantly translate to target without transition animation
      setSpringConfig({ duration: 0 });
      setVirtualIndex(targetIndex);
      
      const raf = requestAnimationFrame(() => {
        setSpringConfig({ type: "spring", stiffness: 260, damping: 28 });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [virtualIndex]);

  const goNext = useCallback(() => {
    setVirtualIndex((prev) => prev + 1);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(goNext, AUTOPLAY_MS);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [paused, goNext]);

  const resetAutoplay = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
  }, []);

  // Slide height & horizontal gap
  const slideHeight = viewportWidth < 640 ? 210 : 300;
  const gap = viewportWidth < 640 ? 16 : 24;

  // Calculate dynamic width of each card based on its original aspect ratio
  const cardWidths = useMemo(() => {
    return EXTENDED_ITEMS.map((item) => {
      const ratio = item.aspectRatio || 1.33;
      return slideHeight * ratio;
    });
  }, [slideHeight]);

  // Calculate center coordinates of each card along the track
  const cardCenters = useMemo(() => {
    const centers: number[] = [];
    let accumulatedWidth = 0;
    for (let i = 0; i < EXTENDED_ITEMS.length; i++) {
      const w = cardWidths[i];
      centers.push(accumulatedWidth + i * gap + w / 2);
      accumulatedWidth += w;
    }
    return centers;
  }, [cardWidths, gap]);

  // Center point of the viewport
  const viewportCenter = viewportWidth / 2;

  // Shift offset to center the active virtual card
  const offsetX = viewportCenter - cardCenters[virtualIndex];

  const handleCardClick = (idx: number) => {
    resetAutoplay();
    if (idx === virtualIndex) {
      onImageClick(idx % GALLERY_ITEMS.length);
    } else {
      setVirtualIndex(idx);
    }
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="w-full h-full bg-transparent flex flex-col justify-between py-5 sm:py-6 relative overflow-hidden select-none"
    >
      {/* ── Top Header Labels ── */}
      <div className="flex justify-between px-6 sm:px-10 text-[9px] sm:text-[10px] tracking-[0.3em] font-label text-white/35 uppercase select-none pointer-events-none">
        <span>Visual</span>
        <span>Content</span>
        <span>Selected</span>
      </div>

      {/* ── Middle Horizontal Slide Area ── */}
      <div className="relative w-full flex-1 flex items-center overflow-visible py-2">
        <motion.div
          drag="x"
          dragElastic={0.35}
          dragConstraints={{
            left: viewportCenter - cardCenters[EXTENDED_ITEMS.length - 1],
            right: viewportCenter - cardCenters[0],
          }}
          onDragEnd={(e, info) => {
            resetAutoplay();
            const offset = info.offset.x;
            const velocity = info.velocity.x;
            const currentX = offsetX + offset;
            
            // Find target center point in track coordinate space
            const targetTrackCenter = viewportCenter - currentX;
            
            // Find closest index
            let finalIndex = virtualIndex;
            let minDistance = Infinity;
            for (let i = 0; i < cardCenters.length; i++) {
              const dist = Math.abs(cardCenters[i] - targetTrackCenter);
              if (dist < minDistance) {
                minDistance = dist;
                finalIndex = i;
              }
            }

            // Adjust for fast swipes
            if (Math.abs(offset) > 30 || Math.abs(velocity) > 400) {
              if (velocity < -200 && virtualIndex < EXTENDED_ITEMS.length - 1) {
                finalIndex = virtualIndex + 1;
              } else if (velocity > 200 && virtualIndex > 0) {
                finalIndex = virtualIndex - 1;
              }
            }

            const clampedIndex = Math.max(0, Math.min(EXTENDED_ITEMS.length - 1, finalIndex));
            setVirtualIndex(clampedIndex);
          }}
          animate={{ x: offsetX }}
          transition={springConfig}
          style={{ gap: `${gap}px` }}
          className="flex items-center cursor-grab active:cursor-grabbing"
        >
          {EXTENDED_ITEMS.map((item, idx) => {
            const isActive = idx === virtualIndex;
            const width = cardWidths[idx];
            return (
              <motion.div
                key={`${item.image}-${idx}`}
                onClick={() => handleCardClick(idx)}
                animate={{
                  scale: isActive ? 1.08 : 0.88,
                  opacity: isActive ? 1 : 0.42,
                  filter: isActive ? "brightness(1) saturate(1.1)" : "brightness(0.35) saturate(0.8)",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="relative rounded-2xl overflow-hidden shrink-0 origin-center cursor-pointer transition-shadow duration-300"
                style={{
                  width: `${width}px`,
                  height: `${slideHeight}px`,
                  boxShadow: isActive 
                    ? "0 22px 45px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(232, 25, 42, 0.12)" 
                    : "0 10px 20px -8px rgba(0, 0, 0, 0.5)",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.text}
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 640px) 250px, 450px"
                  priority={idx >= GALLERY_ITEMS.length * 2 && idx < GALLERY_ITEMS.length * 3}
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Active Slide Title ── */}
      <div className="flex flex-col items-center justify-center min-h-[56px] px-4 my-2 select-none pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="text-center font-display text-white"
          >
            <h3 className="text-xl sm:text-2xl font-semibold tracking-wide uppercase text-white">
              {GALLERY_ITEMS[activeIndex].text}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Footer Labels ── */}
      <div className="flex justify-between px-6 sm:px-10 text-[9px] sm:text-[10px] tracking-[0.3em] font-label text-white/35 uppercase select-none pointer-events-none">
        <span>To</span>
        <span>Inspire</span>
        <span>You</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Main Section Wrap
 * ════════════════════════════════════════════════════════════════════════ */
export default function PetrolTankGallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isTouchRef    = useRef(false);
  const maxTravelRef  = useRef(115);

  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [viewportWidth, setViewportWidth] = useState(1200); // SSR-safe

  const showPrev = useCallback(() => {
    const prevIdx = lightboxIndex <= 0 ? GALLERY_ITEMS.length - 1 : lightboxIndex - 1;
    setLightboxIndex(prevIdx);
    setActiveIndex(prevIdx);
  }, [lightboxIndex]);

  const showNext = useCallback(() => {
    const nextIdx = lightboxIndex >= GALLERY_ITEMS.length - 1 ? 0 : lightboxIndex + 1;
    setLightboxIndex(nextIdx);
    setActiveIndex(nextIdx);
  }, [lightboxIndex]);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = touch || window.innerWidth < 768;
    setIsTouchDevice(touch);
    isTouchRef.current   = touch;
    maxTravelRef.current = isMobile ? 48 : 115;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  /* ── Scroll ─────────────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const rawProgress = useSpring(scrollYProgress, {
    stiffness: isTouchDevice ?  60 : 180,
    damping:   isTouchDevice ?  18 :  38,
    restDelta: 0.0005,
  });

  /* ── Tank halves ────────────────────────────────────────────────────── */
  const leftX = useTransform(rawProgress, (p) =>
    `${-easeP(p) * maxTravelRef.current}%`
  );
  const rightX = useTransform(rawProgress, (p) =>
    `${easeP(p) * maxTravelRef.current}%`
  );

  /* ── Gallery clip ───────────────────────────────────────────────────── */
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
    return () => { unsub(); window.removeEventListener("resize", onResize); };
  }, [rawProgress, galleryClip]);

  /* ── Header / CTA ── */
  const headerOpacity = useTransform(rawProgress, [0, 0.13], [1, 0]);
  const headerY       = useTransform(rawProgress, [0, 0.13], [0, -30]);
  const ctaOpacity    = useTransform(rawProgress, [0.74, 1], [0, 1]);
  const ctaY          = useTransform(rawProgress, [0.74, 1], [22, 0]);

  return (
    <>
      <div ref={sectionRef} style={{ height: "280vh" }} className="relative bg-[hsl(var(--ink-900))]">

        {/* ── Sticky Viewport ── */}
        <div className="sticky top-0 w-full overflow-hidden bg-[hsl(var(--ink-900))] h-screen-safe">

          {/* Ambient glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(232,25,42,0.08) 0%, transparent 100%)",
            }}
          />

          {/* ── Section header ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-30 text-center px-4 pointer-events-none"
            style={{
              paddingTop: "max(env(safe-area-inset-top, 0px) + 1.75rem, 2rem)",
              opacity: headerOpacity,
              y: headerY,
            }}
          >
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-6 sm:w-10 bg-primary/50" />
              <span className="font-label text-primary text-[9px] sm:text-[11px] tracking-[0.40em] uppercase">
                Inside The Garage
              </span>
              <span className="h-px w-6 sm:w-10 bg-primary/50" />
            </div>

            <h2
              className="font-display text-white leading-none"
              style={{ fontSize: "clamp(30px, 6.5vw, 82px)", lineHeight: 0.9, letterSpacing: "0.03em" }}
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

          {/* ── Layer 1: Gallery content (Snap Focus Slider unconditionally) ── */}
          <motion.div
            className="absolute left-0 right-0"
            style={{
              top:      "50%",
              y:        "-50%",
              height:   TANK_H,
              clipPath: galleryClip,
              zIndex:   1,
              touchAction: "pan-y",
            }}
          >
            <FocusCarousel 
              onImageClick={(idx) => setLightboxIndex(idx)} 
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              viewportWidth={viewportWidth}
            />
          </motion.div>

          {/* ── Layer 2: Tank halves ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">

            {/* LEFT half */}
            <motion.div
              className="absolute"
              style={{
                width:    TANK_W,
                height:   TANK_H,
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

            {/* RIGHT half */}
            <motion.div
              className="absolute"
              style={{
                width:    TANK_W,
                height:   TANK_H,
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

          {/* ── CTA ── */}
          <motion.div
            className="absolute left-0 right-0 flex justify-center z-30 px-4"
            style={{
              bottom:  "max(env(safe-area-inset-bottom, 0px) + 1rem, 1.5rem)",
              opacity: ctaOpacity,
              y:       ctaY,
            }}
          >
            <Link
              href="/gallery"
              className="group/cta relative inline-flex items-center justify-center gap-2.5 overflow-hidden px-7 py-3 min-h-[44px] border border-white/12 hover:border-primary/50 bg-transparent hover:bg-primary/5 transition-all duration-300"
              style={{ touchAction: "manipulation" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 pointer-events-none" />
              <span className="relative font-label text-[10px] sm:text-[11px] text-white/50 group-hover/cta:text-white tracking-[0.30em] uppercase transition-colors duration-300">
                View Full Gallery
              </span>
              <ArrowUpRight className="relative h-3 w-3 text-white/30 group-hover/cta:text-primary transition-colors duration-300 shrink-0" />
            </Link>
          </motion.div>

          {/* Bottom hairline */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent z-30"
          />

        </div>
      </div>

      {/* Lightbox */}
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
