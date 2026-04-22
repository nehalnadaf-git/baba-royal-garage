"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";

interface UseEngineSoundOptions {
  enabled: boolean;
}

/**
 * useEngineSound — Professional Scroll-Driven Engine SFX
 *
 * Two Royal Enfield engine sounds crossfade based on scroll depth:
 *  SFX 1: Idle/low RPM rumble (top of page)
 *  SFX 2: Higher RPM character (mid/bottom of page)
 *
 * Features:
 *  - Equal-power crossfade (cos/sin) prevents loudness dip in the blend zone
 *  - Smooth 60fps rAF volume updates
 *  - Graceful fade-out after user stops scrolling (IDLE_LIMIT)
 *  - Mobile: touch events + passive listeners
 *  - Defers startup until shutter intro completes
 */
export function useEngineSound({ enabled }: UseEngineSoundOptions): void {
  const pathname = usePathname();

  // ── Configuration ──────────────────────────────────────────────────────────
  const MAX_VOLUME   = 0.38;   // Subtle ambient level — present but not intrusive
  const STOP_FADE_MS = 600;    // Smooth, slow fade-out on inactivity
  const START_FADE_MS = 250;   // Quick fade-in on first interaction
  const IDLE_LIMIT   = 800;    // ms before engine fades when user stops scrolling
  const CROSS_CENTER = 0.42;   // Scroll % where crossfade is centred
  const CROSS_WIDTH  = 0.20;   // Blend zone width (narrower = sharper transition)

  const SFX_1 = "/sfx/engine-sound-1.mp3";
  const SFX_2 = "/sfx/engine-sound-2.mp3";

  // ── Refs ───────────────────────────────────────────────────────────────────
  const howlsRef = useRef<{ sfx1: Howl | null; sfx2: Howl | null }>({ sfx1: null, sfx2: null });
  const isPlayingRef   = useRef(false);
  const lastActivityRef = useRef(0);
  const rafRef         = useRef<number | null>(null);
  const fadeInDoneRef  = useRef(false);

  // ── Audio init ─────────────────────────────────────────────────────────────
  const initAudio = useCallback(() => {
    if (howlsRef.current.sfx1) return;

    howlsRef.current.sfx1 = new Howl({
      src: [SFX_1],
      loop: true,
      volume: 0,
      html5: true,
      preload: true,
    });

    howlsRef.current.sfx2 = new Howl({
      src: [SFX_2],
      loop: true,
      volume: 0,
      html5: true,
      preload: true,
    });
  }, [SFX_1, SFX_2]);

  // ── Per-frame sync: equal-power crossfade based on scroll depth ─────────────
  const syncAudio = useCallback(() => {
    const { sfx1, sfx2 } = howlsRef.current;
    if (!sfx1 || !sfx2) return;

    const y = window.scrollY;
    const h = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(y / h, 0), 1);

    const rangeStart = CROSS_CENTER - CROSS_WIDTH / 2;
    let weight2 = (progress - rangeStart) / CROSS_WIDTH;
    weight2 = Math.min(Math.max(weight2, 0), 1);

    // Equal-power crossfade: maintains constant perceived loudness
    const angle   = weight2 * (Math.PI / 2);
    const volume1 = Math.cos(angle) * MAX_VOLUME;
    const volume2 = Math.sin(angle) * MAX_VOLUME;

    if (isPlayingRef.current) {
      if (volume1 > 0.002 && !sfx1.playing()) sfx1.play();
      if (volume2 > 0.002 && !sfx2.playing()) sfx2.play();

      sfx1.volume(volume1);
      sfx2.volume(volume2);

      if (volume1 <= 0.002 && sfx1.playing()) sfx1.pause();
      if (volume2 <= 0.002 && sfx2.playing()) sfx2.pause();
    }

    rafRef.current = requestAnimationFrame(syncAudio);
  }, [MAX_VOLUME, CROSS_CENTER, CROSS_WIDTH]);

  // ── Wake up on scroll/touch activity ─────────────────────────────────────
  const wakeUp = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (Howler.ctx?.state === "suspended") {
      void Howler.ctx.resume();
    }

    initAudio();

    if (!isPlayingRef.current) {
      isPlayingRef.current = true;
      fadeInDoneRef.current = false;

      // Fade SFX 1 in from 0 to MAX_VOLUME quickly
      const { sfx1 } = howlsRef.current;
      if (sfx1) {
        if (!sfx1.playing()) sfx1.play();
        sfx1.fade(0, MAX_VOLUME, START_FADE_MS);
      }

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(syncAudio);
      }
    }
  }, [initAudio, syncAudio, MAX_VOLUME, START_FADE_MS]);

  // ── Main effect: defer until shutter is done, then attach listeners ────────
  useEffect(() => {
    if (!enabled || pathname !== "/") {
      isPlayingRef.current = false;
      howlsRef.current.sfx1?.stop();
      howlsRef.current.sfx2?.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const isShutterActive = () => document.body.classList.contains("shutter-intro-active");
    const cleanupFns: (() => void)[] = [];

    function attachListeners() {
      if (isShutterActive()) return;

      // Idle monitor: fade engine out when user stops scrolling
      const monitor = setInterval(() => {
        const now = Date.now();
        if (isPlayingRef.current && now - lastActivityRef.current > IDLE_LIMIT) {
          isPlayingRef.current = false;

          const { sfx1, sfx2 } = howlsRef.current;
          const curV1 = (sfx1?.volume() as number) || 0;
          const curV2 = (sfx2?.volume() as number) || 0;

          sfx1?.fade(curV1, 0, STOP_FADE_MS);
          sfx2?.fade(curV2, 0, STOP_FADE_MS);

          setTimeout(() => {
            if (!isPlayingRef.current) {
              sfx1?.pause();
              sfx2?.pause();
              if (rafRef.current) cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
          }, STOP_FADE_MS + 30);
        }
      }, 100);

      const onScroll = () => wakeUp();
      const onWheel  = () => wakeUp();
      const onTouch  = () => wakeUp();

      const SCROLL_KEYS = new Set(["ArrowDown","ArrowUp","PageDown","PageUp"," ","Home","End"]);
      const onKey = (e: KeyboardEvent) => {
        if (SCROLL_KEYS.has(e.key) || SCROLL_KEYS.has(e.code)) wakeUp();
      };

      window.addEventListener("scroll",    onScroll, { passive: true });
      window.addEventListener("wheel",     onWheel,  { passive: true });
      window.addEventListener("touchmove", onTouch,  { passive: true });
      window.addEventListener("keydown",   onKey,    { passive: true });

      cleanupFns.push(() => {
        clearInterval(monitor);
        window.removeEventListener("scroll",    onScroll);
        window.removeEventListener("wheel",     onWheel);
        window.removeEventListener("touchmove", onTouch);
        window.removeEventListener("keydown",   onKey);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        howlsRef.current.sfx1?.stop();
        howlsRef.current.sfx2?.stop();
        howlsRef.current.sfx1?.unload();
        howlsRef.current.sfx2?.unload();
        howlsRef.current.sfx1 = null;
        howlsRef.current.sfx2 = null;
      });
    }

    // Watch for shutter intro class removal via MutationObserver
    const observer = new MutationObserver(() => {
      if (!isShutterActive()) {
        observer.disconnect();
        attachListeners();
      }
    });

    if (isShutterActive()) {
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    } else {
      attachListeners();
    }

    return () => {
      observer.disconnect();
      cleanupFns.forEach((fn) => fn());
    };
  }, [enabled, pathname, wakeUp, STOP_FADE_MS, IDLE_LIMIT]);
}
