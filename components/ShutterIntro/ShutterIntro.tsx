"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ShutterSlats from "@/components/ShutterIntro/ShutterSlats";
import { useShutterSound } from "@/components/ShutterIntro/useShutterSound";

// ── Timing constants ────────────────────────────────────────────────────────
// Total shutter lift duration: 5.2 seconds — very slow, realistic feel
const SHUTTER_OPEN_DURATION_S = 5.2;
const SHUTTER_OPEN_COMPLETE_BUFFER_MS = 300;

// Framer-Motion easing: starts VERY slow (near zero velocity), then picks up
// This custom cubic bezier creates the cinematic slow-creep opening feel
const SHUTTER_OPEN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// The point (0–1) at which Page content starts being revealed
const REVEAL_PROGRESS_THRESHOLD = 0.55;

interface ShutterIntroProps {
  onComplete?: () => void;
}

/** Adds/removes a class on BOTH html and body so scroll is fully locked on all browsers. */
function setScrollLock(active: boolean) {
  if (typeof document === "undefined") return;
  const method = active ? "add" : "remove";
  document.documentElement.classList[method]("shutter-intro-active");
  document.body.classList[method]("shutter-intro-active");

  if (active) {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  }
}

/** Call BEFORE releasing scroll lock to land exactly at top, bypassing smooth-scroll. */
function snapScrollToTop() {
  if (typeof document === "undefined") return;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
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

  // Backdrop (the black overlay with the button) fades out as shutter lifts
  const [backdropOpacity, setBackdropOpacity] = useState(1);

  // Progress tracker for syncing backdrop fade with shutter lift (via rAF)
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const openStartTimeRef = useRef<number | null>(null);

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

    const preventWheel = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); };
    const preventTouch = (e: TouchEvent) => { e.preventDefault(); e.stopPropagation(); };
    const SCROLL_KEYS = new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "]);
    const preventKey = (e: KeyboardEvent) => {
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

  /* ─ Backdrop fade driven by rAF, synced with shutter timing ─ */
  useEffect(() => {
    if (!isOpening || prefersReducedMotion) return;

    const DURATION = SHUTTER_OPEN_DURATION_S * 1000;

    const tick = (timestamp: number) => {
      if (openStartTimeRef.current === null) {
        openStartTimeRef.current = timestamp;
      }

      const elapsed = timestamp - openStartTimeRef.current;
      // Same slow-start cubic ease as ShutterSlats
      const t = Math.min(elapsed / DURATION, 1);
      const eased = t < 0.5 ? 2 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      progressRef.current = eased;

      // Fade backdrop out progressively, but only after shutter is ~20% open
      const fadeStart = 0.20;
      if (eased > fadeStart) {
        const fadeProgress = Math.min(1, (eased - fadeStart) / (REVEAL_PROGRESS_THRESHOLD - fadeStart));
        setBackdropOpacity(1 - fadeProgress);
      }

      // Trigger reveal class at threshold
      if (eased >= REVEAL_PROGRESS_THRESHOLD && !revealTriggeredRef.current) {
        revealTriggeredRef.current = true;
        setRevealClass(true);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    openStartTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpening, prefersReducedMotion]);

  /* ─ Cleanup on unmount ─ */
  useEffect(() => {
    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stop();
    };
  }, [stop]);

  /* ─ Reset when not opening ─ */
  useEffect(() => {
    if (!isOpening) {
      revealTriggeredRef.current = false;
      openStartTimeRef.current = null;
      progressRef.current = 0;
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      snapScrollToTop();
      setScrollLock(false);
      setRevealClass(false);

      if (withAudioFade && !prefersReducedMotion) {
        fadeOutAndStop(600);
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
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* ── The Shutter panel (slat canvas lives here) ── */}
      <div
        className="pointer-events-none fixed inset-0 z-[10000] h-screen w-screen"
        style={{
          // CSS-driven vertical translate for the whole panel
          transform: isOpening && !prefersReducedMotion ? undefined : "translateY(0)",
          // We handle the actual movement in ShutterSlats canvas internally
        }}
      >
        {/* Desktop banner behind the slats */}
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

        {/* Mobile banner behind the slats */}
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

        {/* Canvas-drawn realistic slats */}
        <ShutterSlats isOpening={isOpening} prefersReducedMotion={prefersReducedMotion} />

        {/* Bottom drop-shadow at the shutter's lower edge */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: 0,
            right: 0,
            height: "32px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.90), transparent)",
            boxShadow: "0 8px 32px 10px rgba(0,0,0,0.75)",
            zIndex: 10001,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Backdrop: button + branding layer (fades out as shutter lifts) ── */}
      <div
        className="fixed inset-0 z-[10002] pointer-events-none"
        style={{
          opacity: backdropOpacity,
          transition: isOpening ? "none" : "opacity 0.3s ease",
          // Re-enable pointer events only while backdrop is visible enough
          pointerEvents: backdropOpacity > 0.05 ? "auto" : "none",
        }}
      >
        <div className="absolute inset-0 bg-black/90" />

        {/* Skip button — top right */}
        <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-md border border-white/20 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Skip Intro
          </button>
        </div>

        {/* ── Open button ── */}
        <div className="absolute inset-x-0 bottom-[20%] z-30 flex justify-center px-5 md:bottom-[15%]">
          <button
            type="button"
            onClick={() => { void handleOpen(); }}
            disabled={buttonDisabled}
            aria-label="Open the Garage door to enter website"
            className="shutter-intro-pulse group relative min-h-12 overflow-hidden rounded-2xl border border-[#FE2414] bg-[rgba(13,15,26,0.80)] px-7 py-3.5 text-[13px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_32px_rgba(254,36,20,0.55)] disabled:cursor-not-allowed disabled:opacity-70 md:px-10 md:py-4 md:text-[15px]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            ⚙ Open the Garage
          </button>
        </div>
      </div>

    </div>
  );
}
