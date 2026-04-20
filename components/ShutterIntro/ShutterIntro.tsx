"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ShutterSlats from "@/components/ShutterIntro/ShutterSlats";
import { useShutterSound } from "@/components/ShutterIntro/useShutterSound";

const SHUTTER_OPEN_DURATION_S = 2.4;
const SHUTTER_OPEN_COMPLETE_BUFFER_MS = 180;
const SHUTTER_OPEN_EASE: [number, number, number, number] = [0.55, 0.055, 0.675, 0.19];
const REVEAL_PROGRESS_THRESHOLD = 0.65;

interface ShutterIntroProps {
  onComplete?: () => void;
}

export default function ShutterIntro({ onComplete }: ShutterIntroProps) {
  const pathname = usePathname();

  const [dismissed, setDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [desktopImageSrc, setDesktopImageSrc] = useState("/Shutter/baba_royal_garage_web_banner2.jpg");
  const [mobileImageSrc, setMobileImageSrc] = useState("/Shutter/baba_royal_garage_mobile_banner.png");

  const [backdropOpacity, setBackdropOpacity] = useState(1);

  const revealTriggeredRef = useRef(false);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);

  const { play, fadeOutAndStop, stop } = useShutterSound({
    disabled: prefersReducedMotion || pathname !== "/" || dismissed,
  });

  const finalizeIntro = useCallback(
    (withAudioFade: boolean) => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;

      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }

      document.body.classList.remove("shutter-intro-active", "shutter-intro-reveal");

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onChange = () => {
      setPrefersReducedMotion(media.matches);
    };

    onChange();
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/" || dismissed) {
      document.body.classList.remove("shutter-intro-active", "shutter-intro-reveal");
      return;
    }

    document.body.classList.add("shutter-intro-active");

    return () => {
      document.body.classList.remove("shutter-intro-active", "shutter-intro-reveal");
    };
  }, [dismissed, pathname]);

  useEffect(() => {
    return () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }

      stop();
    };
  }, [stop]);

  useEffect(() => {
    if (!isOpening) {
      revealTriggeredRef.current = false;
      setBackdropOpacity(1);
    }
  }, [isOpening]);

  const handleOpen = async () => {
    if (buttonDisabled || isOpening) {
      return;
    }

    setButtonDisabled(true);
    setIsOpening(true);

    if (!prefersReducedMotion) {
      void play();
      introTimerRef.current = setTimeout(() => {
        finalizeIntro(true);
      }, (SHUTTER_OPEN_DURATION_S * 1000) + SHUTTER_OPEN_COMPLETE_BUFFER_MS);
      return;
    }

    setBackdropOpacity(0);
    document.body.classList.add("shutter-intro-reveal");
    introTimerRef.current = setTimeout(() => {
      finalizeIntro(false);
    }, 300);
  };

  const handleSkip = () => {
    finalizeIntro(false);
  };

  if (pathname !== "/" || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="fixed inset-0 z-[10002]" style={{ opacity: backdropOpacity }}>
        <div className="absolute inset-0 bg-black/92" />

        <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-md border border-white/20 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Skip Intro
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-[20%] z-30 flex justify-center px-5 md:translate-y-24">
          <button
            type="button"
            onClick={() => {
              void handleOpen();
            }}
            disabled={buttonDisabled}
            aria-label="Open the Garage door to enter website"
            className="shutter-intro-pulse min-h-12 rounded-2xl border border-[#FE2414] bg-[rgba(13,15,26,0.75)] px-7 py-3.5 text-[13px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(254,36,20,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE2414] disabled:cursor-not-allowed disabled:opacity-70 md:px-10 md:py-4 md:text-[15px]"
          >
            ⚙ Open the Garage
          </button>
        </div>
      </div>

      <LazyMotion features={domAnimation}>
        <m.div
          className="pointer-events-none fixed inset-0 z-[10000] h-screen w-screen"
          style={{ transformOrigin: "top center" }}
          initial={false}
          animate={isOpening ? (prefersReducedMotion ? { opacity: 0 } : { y: "-100vh" }) : { opacity: 1, y: "0vh" }}
          transition={
            prefersReducedMotion
              ? { duration: 0.3, ease: "easeOut" }
              : { duration: SHUTTER_OPEN_DURATION_S, ease: SHUTTER_OPEN_EASE }
          }
          onUpdate={(latest) => {
            if (!isOpening || prefersReducedMotion) {
              return;
            }

            const yRaw = typeof latest.y === "number" ? latest.y : parseFloat(String(latest.y));
            if (!Number.isFinite(yRaw)) {
              return;
            }

            const progressBase =
              typeof latest.y === "number" ? Math.max(window.innerHeight, 1) : 100;
            const progress = Math.min(1, Math.max(0, Math.abs(yRaw) / progressBase));

            if (progress >= REVEAL_PROGRESS_THRESHOLD && !revealTriggeredRef.current) {
              revealTriggeredRef.current = true;
              document.body.classList.add("shutter-intro-reveal");
            }

            const revealProgress = Math.min(1, progress / REVEAL_PROGRESS_THRESHOLD);
            setBackdropOpacity(1 - revealProgress);
          }}
        >
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

          <div className="absolute inset-0 block md:hidden">
            <Image
              src={mobileImageSrc}
              alt="Garage shutter with Baba Royal Garage branding"
              width={1080}
              height={1920}
              priority
              className="h-screen w-screen object-cover object-center"
              onError={() => setMobileImageSrc("/Banners/mobile-banner.png")}
            />
          </div>

          <ShutterSlats isOpening={isOpening} prefersReducedMotion={prefersReducedMotion} />

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
