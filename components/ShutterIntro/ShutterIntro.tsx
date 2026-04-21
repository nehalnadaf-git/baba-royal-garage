"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ShutterSlats from "@/components/ShutterIntro/ShutterSlats";
import { useShutterSound } from "@/components/ShutterIntro/useShutterSound";

const SHUTTER_OPEN_DURATION_S = 3.0;
const SHUTTER_OPEN_COMPLETE_BUFFER_MS = 220;
const SHUTTER_OPEN_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const REVEAL_PROGRESS_THRESHOLD = 0.60;

interface ShutterIntroProps {
  onComplete?: () => void;
}

/** Adds/removes a class on BOTH html and body so scroll is fully locked on all browsers.
 *  Also pins the scroll position to 0 to prevent the page from drifting beneath the shutter
 *  and causing a visible smooth-scroll sweep when the lock is released. */
function setScrollLock(active: boolean) {
  if (typeof document === "undefined") return;
  const method = active ? "add" : "remove";
  document.documentElement.classList[method]("shutter-intro-active");
  document.body.classList[method]("shutter-intro-active");

  if (active) {
    // Disable smooth scroll and pin to top so nothing drifts under the shutter
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  }
}

/** Call this BEFORE releasing the scroll lock to ensure we land exactly at top,
 *  bypassing any smooth-scroll animation that would sweep through sections. */
function snapScrollToTop() {
  if (typeof document === "undefined") return;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  // Restore smooth scroll after the browser has committed the position
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = "";
    });
  });
}

function setRevealClass(active: boolean) {
  if (typeof document === "undefined") return;
  const method = active ? "add" : "remove";
  document.documentElement.classList[method]("shutter-intro-reveal");
  document.body.classList[method]("shutter-intro-reveal");
}

export default function ShutterIntro({ onComplete }: ShutterIntroProps) {
  const pathname = usePathname();

  const [dismissed, setDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [backdropOpacity, setBackdropOpacity] = useState(1);

  const [desktopImageSrc, setDesktopImageSrc] = useState("/Shutter/baba_royal_garage_web_banner2.jpg");
  const [mobileImageSrc, setMobileImageSrc] = useState("/Shutter/baba_royal_garage_mobile_banner.png");

  const revealTriggeredRef = useRef(false);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);

  const { play, fadeOutAndStop, stop } = useShutterSound({
    disabled: prefersReducedMotion || pathname !== "/" || dismissed,
  });

  /* ─ Reduced-motion detection ─ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  /* ─ Apply / remove scroll lock ─ */
  useEffect(() => {
    if (pathname !== "/" || dismissed) {
      setScrollLock(false);
      setRevealClass(false);
      return;
    }
    setScrollLock(true);
    return () => {
      setScrollLock(false);
      setRevealClass(false);
    };
  }, [dismissed, pathname]);

  /* ─ Intercept ALL scroll / swipe / keyboard scroll attempts ─ */
  useEffect(() => {
    if (dismissed || pathname !== "/") return;

    /** Prevent wheel scroll */
    const preventWheel = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); };
    /** Prevent touch scroll */
    const preventTouch = (e: TouchEvent) => { e.preventDefault(); e.stopPropagation(); };
    /** Prevent keyboard scroll keys */
    const SCROLL_KEYS = new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "]);
    const preventKey = (e: KeyboardEvent) => {
      // Only block scroll keys when the shutter is active (not when typing in inputs)
      if (SCROLL_KEYS.has(e.key) && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel",     preventWheel, { passive: false });
    window.addEventListener("touchmove", preventTouch, { passive: false });
    window.addEventListener("keydown",   preventKey,   { passive: false });

    return () => {
      window.removeEventListener("wheel",     preventWheel);
      window.removeEventListener("touchmove", preventTouch);
      window.removeEventListener("keydown",   preventKey);
    };
  }, [dismissed, pathname]);

  /* ─ Cleanup on unmount ─ */
  useEffect(() => {
    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
      stop();
    };
  }, [stop]);

  /* ─ Reset when not opening ─ */
  useEffect(() => {
    if (!isOpening) {
      revealTriggeredRef.current = false;
      setBackdropOpacity(1);
    }
  }, [isOpening]);

  /* ─ Finalize: remove locks, fire onComplete ─ */
  const finalizeIntro = useCallback(
    (withAudioFade: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;

      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }

      // Snap to top BEFORE releasing the scroll lock so the browser never
      // sees a non-zero scroll position and triggers a smooth-scroll sweep.
      snapScrollToTop();
      setScrollLock(false);
      setRevealClass(false);

      if (withAudioFade && !prefersReducedMotion) {
        fadeOutAndStop(400);
      } else {
        stop();
      }

      setDismissed(true);
      onComplete?.();
    },
    [fadeOutAndStop, onComplete, prefersReducedMotion, stop]
  );

  /* ─ Button handler — ONLY way to open ─ */
  const handleOpen = async () => {
    if (buttonDisabled || isOpening) return;

    setButtonDisabled(true);
    setIsOpening(true);

    if (prefersReducedMotion) {
      setBackdropOpacity(0);
      setRevealClass(true);
      introTimerRef.current = setTimeout(() => finalizeIntro(false), 300);
      return;
    }

    void play();
    introTimerRef.current = setTimeout(() => {
      finalizeIntro(true);
    }, SHUTTER_OPEN_DURATION_S * 1000 + SHUTTER_OPEN_COMPLETE_BUFFER_MS);
  };

  const handleSkip = () => finalizeIntro(false);

  if (pathname !== "/" || dismissed) return null;

  return (
    <div
      id="shutter-overlay"
      className="fixed inset-0 z-[9999] overflow-hidden"
      /* Absorb any stray pointer events at the overlay level */
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* ── Backdrop: buttons + text layer ── */}
      <div
        className="fixed inset-0 z-[10002]"
        style={{ opacity: backdropOpacity, transition: "opacity 0.3s ease" }}
      >
        <div className="absolute inset-0 bg-black/92" />

        {/* Skip button */}
        <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-md border border-white/20 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Skip Intro
          </button>
        </div>

        {/* ── Open button — the ONLY trigger ── */}
        <div className="absolute inset-x-0 bottom-[20%] z-30 flex justify-center px-5 md:translate-y-24">
          <button
            type="button"
            onClick={() => { void handleOpen(); }}
            disabled={buttonDisabled}
            aria-label="Open the Garage door to enter website"
            className="shutter-intro-pulse min-h-12 rounded-2xl border border-[#FE2414] bg-[rgba(13,15,26,0.75)] px-7 py-3.5 text-[13px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(254,36,20,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE2414] disabled:cursor-not-allowed disabled:opacity-70 md:px-10 md:py-4 md:text-[15px]"
          >
            ⚙ Open the Garage
          </button>
        </div>
      </div>

      {/* ── Shutter panel that rolls up ── */}
      <LazyMotion features={domAnimation}>
        <m.div
          className="pointer-events-none fixed inset-0 z-[10000] h-screen w-screen"
          style={{ transformOrigin: "top center" }}
          initial={false}
          animate={
            isOpening
              ? prefersReducedMotion
                ? { opacity: 0 }
                : { y: "-100vh" }
              : { opacity: 1, y: "0vh" }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.3, ease: "easeOut" }
              : { duration: SHUTTER_OPEN_DURATION_S, ease: SHUTTER_OPEN_EASE }
          }
          onUpdate={(latest) => {
            if (!isOpening || prefersReducedMotion) return;

            const yRaw = typeof latest.y === "number" ? latest.y : parseFloat(String(latest.y));
            if (!Number.isFinite(yRaw)) return;

            const progressBase = typeof latest.y === "number" ? Math.max(window.innerHeight, 1) : 100;
            const progress = Math.min(1, Math.max(0, Math.abs(yRaw) / progressBase));

            if (progress >= REVEAL_PROGRESS_THRESHOLD && !revealTriggeredRef.current) {
              revealTriggeredRef.current = true;
              setRevealClass(true);
            }

            const revealProgress = Math.min(1, progress / REVEAL_PROGRESS_THRESHOLD);
            setBackdropOpacity(1 - revealProgress);
          }}
        >
          {/* Desktop banner */}
          <div className="absolute inset-0 hidden md:block">
            <Image
              src={desktopImageSrc}
              alt="Garage shutter with Baba Royal Garage branding"
              width={1920}
              height={1080}
              priority
              className="h-screen w-screen object-cover object-center"
              onError={() => setDesktopImageSrc("/Banners/web-banner.png")}
            />
          </div>

          {/* Mobile banner */}
          <div className="absolute inset-0 block md:hidden bg-[#07070D]">
            <Image
              src={mobileImageSrc}
              alt="Garage shutter with Baba Royal Garage branding"
              width={1080}
              height={1920}
              priority
              className="h-screen w-screen object-contain object-center"
              onError={() => setMobileImageSrc("/Banners/mobile-banner.png")}
            />
          </div>

          <ShutterSlats isOpening={isOpening} prefersReducedMotion={prefersReducedMotion} />

          {/* Bottom shadow edge */}
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              left: 0,
              right: 0,
              height: "32px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)",
              boxShadow: "0 8px 32px 8px rgba(0,0,0,0.7)",
              zIndex: 10001,
            }}
          />
        </m.div>
      </LazyMotion>
    </div>
  );
}
