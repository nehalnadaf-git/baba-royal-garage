"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "./circular-gallery";

interface GalleryLightboxProps {
  /** All items in the gallery — used for prev/next navigation. */
  items: GalleryItem[];
  /** Index of the currently-open item. Pass -1 to close. */
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const item   = currentIndex >= 0 && currentIndex < items.length ? items[currentIndex] : null;
  const isOpen = item !== null;

  /* ── Keyboard navigation ────────────────────────────────────────── */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft")  onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* ── Scroll lock — iOS-safe ──────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    /* Simple overflow:hidden does NOT prevent scroll on iOS Safari.
     * The only reliable cross-browser fix is position:fixed on body
     * with top = -scrollY, then restore scrollY on unlock. */
    const scrollY = window.scrollY;
    const body    = document.body;
    body.style.position = "fixed";
    body.style.top      = `-${scrollY}px`;
    body.style.left     = "0";
    body.style.right    = "0";
    body.style.width    = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = "";
      body.style.top      = "";
      body.style.left     = "";
      body.style.right    = "";
      body.style.width    = "";
      body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  /* ── Touch / swipe ───────────────────────────────────────────────── */
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta >  50) onPrev();
    if (delta < -50) onNext();
    touchStartX.current = null;
  };

  const hasMany = items.length > 1;
  const total   = items.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lightbox-root"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[hsl(240_28%_4%/0.96)] backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Corner glow */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: "radial-gradient(circle at top right, rgba(232,25,42,0.08) 0%, transparent 70%)" }}
          />

          {/* ── Close button ─────────────────────────────────────────── */}
          <motion.button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ delay: 0.08 }}
            aria-label="Close lightbox"
            style={{ touchAction: "manipulation" }}
          >
            <X className="h-4 w-4 text-white/70" />
          </motion.button>

          {/* ── Counter pill ─────────────────────────────────────────── */}
          {hasMany && (
            <motion.div
              className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className="font-label text-white/60 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase px-3.5 py-1.5 rounded-full whitespace-nowrap"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.11)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                {currentIndex + 1} / {total}
              </span>
            </motion.div>
          )}

          {/* ── Prev button ──────────────────────────────────────────── */}
          {hasMany && (
            <motion.button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-2 sm:left-5 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/[0.12] bg-white/5 backdrop-blur-md hover:bg-primary/18 hover:border-primary/40 active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.40)]"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              aria-label="Previous image"
              style={{ touchAction: "manipulation" }}
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white/75" />
            </motion.button>
          )}

          {/* ── Next button ──────────────────────────────────────────── */}
          {hasMany && (
            <motion.button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-2 sm:right-5 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/[0.12] bg-white/5 backdrop-blur-md hover:bg-primary/18 hover:border-primary/40 active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.40)]"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              aria-label="Next image"
              style={{ touchAction: "manipulation" }}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white/75" />
            </motion.button>
          )}

          {/* ── Image card ───────────────────────────────────────────── */}
          <div
            className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 w-full px-14 sm:px-20"
            style={{ maxWidth: "min(820px, 100vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={currentIndex}
                className="w-full flex flex-col items-center gap-4 sm:gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: "linear" }}
              >
                {/* Image wrapper */}
                <div
                  style={{
                    aspectRatio: item!.aspectRatio && item!.aspectRatio > 0 ? item!.aspectRatio : 4 / 3,
                    /* dvh = dynamic viewport height (iOS 16+).
                     * Fallback: use 68vh for iOS 15 and older browsers that
                     * don't support dvh — applied via the cascade (dvh overrides). */
                    maxHeight: "68vh",
                  }}
                  className="relative w-full overflow-hidden rounded-md border border-white/[0.07] shadow-[0_40px_100px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.03)] [max-height:68dvh]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.55)] to-transparent z-10" />
                  <Image
                    src={item!.image}
                    alt={item!.text ?? "Gallery image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 820px"
                    priority
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.28)] pointer-events-none" />
                </div>

                {/* Caption + CTA */}
                <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
                  {item!.text && (
                    <div className="flex items-center gap-2.5">
                      <span className="h-px w-4 sm:w-6 bg-gradient-to-r from-transparent to-[hsl(var(--gold)/0.5)]" />
                      <p className="font-label text-[9px] sm:text-[10px] tracking-[0.30em] uppercase text-white/45">
                        {item!.text}
                      </p>
                      <span className="h-px w-4 sm:w-6 bg-gradient-to-l from-transparent to-[hsl(var(--gold)/0.5)]" />
                    </div>
                  )}

                  <Link
                    href="/gallery"
                    onClick={onClose}
                    className="group/lb relative inline-flex items-center justify-center gap-3 overflow-hidden px-6 py-2.5 sm:px-8 sm:py-3 w-full max-w-[260px] sm:max-w-[290px] min-h-[44px] sm:min-h-[48px] rounded-sm border border-[hsl(var(--gold)/0.28)] hover:border-primary/70 bg-gradient-to-b from-[#161622] to-[#0a0a0f] shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(232,25,42,0.22)] transition-all duration-500"
                    style={{ touchAction: "manipulation" }}
                  >
                    <span className="absolute inset-0 opacity-0 group-hover/lb:opacity-100 bg-[radial-gradient(circle_at_center,rgba(232,25,42,0.13)_0%,transparent_100%)] transition-opacity duration-500" />
                    <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12 translate-x-[-120%] group-hover/lb:translate-x-[120%] transition-transform duration-[1200ms] ease-out pointer-events-none" />
                    <span className="relative font-label text-[9px] sm:text-[11px] text-white/65 group-hover/lb:text-white tracking-[0.25em] sm:tracking-[0.28em] uppercase transition-colors duration-300">
                      View Full Gallery
                    </span>
                    <div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/5 border border-white/10 group-hover/lb:bg-primary/20 group-hover/lb:border-primary/30 transition-all duration-300 shrink-0">
                      <ArrowUpRight className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[hsl(var(--gold-light))] group-hover/lb:text-primary-light group-hover/lb:translate-x-0.5 group-hover/lb:-translate-y-0.5 transition-all duration-300" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── Dot indicators (shown when ≤ 12 items) ───────────── */}
            {hasMany && total <= 12 && (
              <motion.div
                className="flex items-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
              >
                {items.map((_, i) => (
                  /* Wrap the tiny visual dot in a large invisible hit area
                   * (44×44px) so it meets Apple HIG / WCAG touch target rules. */
                  <button
                    key={i}
                    aria-label={`Go to image ${i + 1}`}
                    style={{ touchAction: "manipulation" }}
                    className="flex items-center justify-center w-[44px] h-[44px] -m-[14px]"
                    onClick={() => {
                      if (i === currentIndex) return;
                      const diff = i - currentIndex;
                      if (diff > 0) { for (let j = 0; j < diff; j++) onNext(); }
                      else          { for (let j = 0; j < -diff; j++) onPrev(); }
                    }}
                  >
                    <span
                      className={`rounded-full transition-all duration-150 ${
                        i === currentIndex
                          ? "w-4 sm:w-5 h-1.5 bg-primary"
                          : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
