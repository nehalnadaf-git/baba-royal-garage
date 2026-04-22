"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShutterSound } from "@/components/ShutterIntro/useShutterSound";

// ── Timing ─────────────────────────────────────────────────────────────────
// 3.2s total — cinematic slow start, continuously accelerates, exits at full speed
const DURATION_S = 3.2;
const DURATION_MS = DURATION_S * 1000;

// Pure ease-in: the shutter starts near-still (motor resistance) and
// continuously accelerates — P2=(1,1) means ZERO deceleration at the end.
// The shutter does not slow down at all — it exits at full velocity.
const EASE = `cubic-bezier(0.75, 0, 1, 1)`;

// ── Scroll lock helpers ────────────────────────────────────────────────────
function setScrollLock(active: boolean) {
  if (typeof document === "undefined") return;
  const m = active ? "add" : "remove";
  document.documentElement.classList[m]("shutter-intro-active");
  document.body.classList[m]("shutter-intro-active");
  if (active) {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  }
}

function snapScrollToTop() {
  if (typeof document === "undefined") return;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = "";
    })
  );
}

function setRevealClass(active: boolean) {
  if (typeof document === "undefined") return;
  const m = active ? "add" : "remove";
  document.documentElement.classList[m]("shutter-intro-reveal");
  document.body.classList[m]("shutter-intro-reveal");
}

// ─────────────────────────────────────────────────────────────────────────────

interface ShutterIntroProps {
  onComplete?: () => void;
}

export default function ShutterIntro({ onComplete }: ShutterIntroProps) {
  const pathname = usePathname();

  const [dismissed, setDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // Opacity of the button/skip layer — fades out as shutter lifts
  const [ctaOpacity, setCtaOpacity] = useState(1);

  const completedRef = useRef(false);
  const revealTriggeredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeSfxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const openStartRef = useRef<number | null>(null);

  const { play, fadeOutAndStop, stop } = useShutterSound({
    disabled: prefersReducedMotion || pathname !== "/" || dismissed,
  });

  /* ── Reduced-motion ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  /* ── Scroll lock ────────────────────────────────────────────────────────── */
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

  /* ── Block all scroll input while shutter is active ─────────────────────── */
  useEffect(() => {
    if (dismissed || pathname !== "/") return;
    const noWheel = (e: WheelEvent) => { e.preventDefault(); };
    const noTouch = (e: TouchEvent) => { e.preventDefault(); };
    const SCROLL_KEYS = new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "]);
    const noKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key) &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel",     noWheel, { passive: false });
    window.addEventListener("touchmove", noTouch, { passive: false });
    window.addEventListener("keydown",   noKey,   { passive: false });
    return () => {
      window.removeEventListener("wheel",     noWheel);
      window.removeEventListener("touchmove", noTouch);
      window.removeEventListener("keydown",   noKey);
    };
  }, [dismissed, pathname]);

  /* ── Drive CTA opacity in sync with shutter lift ───────────────────────── */
  useEffect(() => {
    if (!isOpening || prefersReducedMotion) return;

    const tick = (now: number) => {
      if (openStartRef.current === null) openStartRef.current = now;
      const t = Math.min((now - openStartRef.current) / DURATION_MS, 1);

      // Same slow-start ease (approximated)
      const eased = t < 0.5 ? 2 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Start fading out CTA buttons once shutter is 15% open
      const fadeStart = 0.15;
      if (eased > fadeStart) {
        const fp = Math.min(1, (eased - fadeStart) / 0.30);
        setCtaOpacity(1 - fp);
      }

      // Trigger page reveal at 50% open
      if (eased >= 0.50 && !revealTriggeredRef.current) {
        revealTriggeredRef.current = true;
        setRevealClass(true);
      }

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    openStartRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isOpening, prefersReducedMotion]);

  /* ── Reset when not opening ────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpening) {
      revealTriggeredRef.current = false;
      openStartRef.current = null;
      setCtaOpacity(1);
    }
  }, [isOpening]);

  /* ── Cleanup ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeSfxTimerRef.current) clearTimeout(fadeSfxTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stop();
    };
  }, [stop]);

  /* ── Finalize ───────────────────────────────────────────────────────────── */
  const finalizeIntro = useCallback(
    () => {
      if (completedRef.current) return;
      completedRef.current = true;

      if (timerRef.current)    { clearTimeout(timerRef.current); timerRef.current = null; }
      if (fadeSfxTimerRef.current) { clearTimeout(fadeSfxTimerRef.current); fadeSfxTimerRef.current = null; }
      if (rafRef.current)      { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

      snapScrollToTop();
      setScrollLock(false);
      setRevealClass(false);

      // Audio fade was already started before this fires — just hard-stop any residual
      stop();

      setDismissed(true);
      onComplete?.();
    },
    [onComplete, stop]
  );

  /* ── Open handler ───────────────────────────────────────────────────────── */
  const handleOpen = () => {
    if (buttonDisabled || isOpening) return;
    setButtonDisabled(true);
    setIsOpening(true);

    if (prefersReducedMotion) {
      setCtaOpacity(0);
      setRevealClass(true);
      timerRef.current = setTimeout(() => finalizeIntro(), 300);
      return;
    }

    play();

    // ── Fade audio out BEFORE animation ends so sound stops with the shutter ──
    // Fade starts 1200ms before the end → audio reaches 0 exactly at DURATION_MS
    const FADE_DURATION = 1200;
    fadeSfxTimerRef.current = setTimeout(() => {
      fadeOutAndStop(FADE_DURATION);
    }, DURATION_MS - FADE_DURATION);

    // Finalize fires right as animation finishes (80ms buffer for CSS commit)
    timerRef.current = setTimeout(() => finalizeIntro(), DURATION_MS + 80);
  };

  const handleSkip = () => finalizeIntro();

  if (pathname !== "/" || dismissed) return null;

  // ── Shutter lift transform ──────────────────────────────────────────────
  const shutterStyle: React.CSSProperties = prefersReducedMotion
    ? { opacity: isOpening ? 0 : 1, transition: "opacity 0.3s ease" }
    : {
        transform: isOpening ? "translateY(-100vh)" : "translateY(0)",
        transition: isOpening ? `transform ${DURATION_S}s ${EASE}` : "none",
        // GPU-composited — no layout thrash
        willChange: "transform",
      };

  return (
    <div
      id="shutter-overlay"
      className="fixed inset-0 z-[9999] overflow-hidden"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* ══ The shutter door — real photo that lifts straight up ══════════ */}
      <div
        className="fixed inset-0 z-[10000] h-screen w-screen"
        style={shutterStyle}
      >
        {/* Web shutter image — object-cover fills the screen cleanly */}
        <div className="absolute inset-0 hidden md:block bg-[#0a0a0a]">
          <Image
            src="/images/banners/shutter-desktop.jpg"
            alt="Baba Royal Garage shutter"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
          />
        </div>

        {/* Mobile shutter image — object-contain shows full image without crop */}
        <div className="absolute inset-0 block md:hidden bg-[#0a0a0a]">
          <Image
            src="/images/banners/shutter-mobile.png"
            alt="Baba Royal Garage shutter"
            fill
            priority
            className="object-contain object-center"
            sizes="100vw"
            quality={95}
          />
        </div>

        {/* Subtle drop-shadow on the bottom edge — adds depth as shutter lifts */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -12,
            left: 0,
            right: 0,
            height: 40,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
            boxShadow: "0 10px 40px 12px rgba(0,0,0,0.75)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </div>

      {/* ══ CTA layer — Skip & Open button, overlaid on the shutter photo ══ */}
      <div
        className="fixed inset-0 z-[10002]"
        style={{
          opacity: ctaOpacity,
          transition: isOpening ? "none" : "opacity 0.3s ease",
          pointerEvents: ctaOpacity > 0.05 ? "auto" : "none",
        }}
      >
        {/* Skip button — top right */}
        <div className="absolute right-4 top-4 md:right-6 md:top-6">
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-md border border-white/25 bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Skip Intro
          </button>
        </div>

        {/* Subtle gradient at the bottom so button is legible over the image */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)" }}
        />

        {/* Open button — smaller, lower on desktop */}
        <div className="absolute inset-x-0 bottom-[18%] flex justify-center px-5 md:bottom-[6%]">
          <button
            type="button"
            onClick={() => { void handleOpen(); }}
            disabled={buttonDisabled}
            aria-label="Open the Garage door to enter website"
            className="shutter-intro-pulse group relative overflow-hidden rounded-xl border border-[#FE2414] bg-black/50 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl transition-all duration-300 hover:bg-black/70 hover:shadow-[0_0_24px_rgba(254,36,20,0.50)] disabled:cursor-not-allowed disabled:opacity-70 md:px-7 md:py-3 md:text-[12px]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            ⚙ Open the Garage
          </button>
        </div>
      </div>
    </div>
  );
}
