"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";

interface UseEngineSoundOptions {
  enabled: boolean;
}

/**
 * Professional-Grade Engine Sound Controller
 * 
 * Refinements for "Best Loop & Fade":
 * - Equal Power Crossfade: Uses trigonometric curves (cos/sin) to prevent volume dips during track transitions.
 * - 60FPS Surface Smoothing: Uses requestAnimationFrame for volume updates to avoid "stepping" artifacts.
 * - Gapless Continuity: Leverages Howler's native looping with HTML5 audio optimization.
 * - Dynamic Inertia: Smoothly ramps volumes up and down for a high-end feel.
 */
export function useEngineSound({ enabled }: UseEngineSoundOptions): void {
  const pathname = usePathname();
  
  // Professional Configuration
  const MAX_VOLUME = 0.40;       // Subtle but immersive
  const STOP_FADE_MS = 450;      // Longer, smoother fade out
  const START_FADE_MS = 200;     // Quick but textured ramp up
  const IDLE_LIMIT = 500;        // Inactivity threshold
  const CROSS_CENTER = 0.45;     // 45% depth as the pivot point
  const CROSS_WIDTH = 0.18;      // 18% range for the blend zone

  const SFX_1 = "/sfx/Royal%20Enfield%20Sound%20Effect%201.mp3";
  const SFX_2 = "/sfx/Royal%20Enfield%20Sound%20Effect%202.mp3";

  // State Refs
  const howlsRef = useRef<{ sfx1: Howl | null; sfx2: Howl | null }>({ sfx1: null, sfx2: null });
  const isPlayingRef = useRef(false);
  const lastActivityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  
  // Track targeted volume levels for smoothing
  const targetVolumesRef = useRef({ v1: 0, v2: 0 });

  /**
   * Initialize audio with professional buffer settings.
   */
  const initAudio = useCallback(() => {
    if (howlsRef.current.sfx1) return;

    howlsRef.current.sfx1 = new Howl({
      src: [decodeURIComponent(SFX_1)],
      loop: true,
      volume: 0,
      html5: true,
      preload: true,
    });

    howlsRef.current.sfx2 = new Howl({
      src: [decodeURIComponent(SFX_2)],
      loop: true,
      volume: 0,
      html5: true,
      preload: true,
    });
  }, [SFX_1, SFX_2]);

  /**
   * High-Resolution Sound Synchronization
   * Implements Equal Power Crossfading for seamless transitions without volume dips.
   */
  const syncAudio = useCallback(() => {
    const { sfx1, sfx2 } = howlsRef.current;
    if (!sfx1 || !sfx2) return;

    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(y / Math.max(h, 1), 0), 1);

    // Calculate transition weight (0 to 1)
    const rangeStart = CROSS_CENTER - CROSS_WIDTH / 2;
    let weight2 = (progress - rangeStart) / CROSS_WIDTH;
    weight2 = Math.min(Math.max(weight2, 0), 1);

    // PROFESSIONAL: Equal Power Crossfade Curve
    // Linear crossfading (w1, w2) causes a 3dB dip in the middle.
    // Constant power (cos/sin) maintains perceived loudness through the loop blend.
    const angle = weight2 * (Math.PI / 2);
    const volume1 = Math.cos(angle) * MAX_VOLUME;
    const volume2 = Math.sin(angle) * MAX_VOLUME;

    if (isPlayingRef.current) {
      // Manage playback states based on audibility
      if (volume1 > 0.001 && !sfx1.playing()) sfx1.play();
      if (volume2 > 0.001 && !sfx2.playing()) sfx2.play();

      // Set volumes directly for 60fps response
      sfx1.volume(volume1);
      sfx2.volume(volume2);

      // Stop track completely if totally out of range for performance
      if (volume1 <= 0.001 && sfx1.playing()) sfx1.pause();
      if (volume2 <= 0.001 && sfx2.playing()) sfx2.pause();
    }

    // Continue the smooth update loop
    rafRef.current = requestAnimationFrame(syncAudio);
  }, [MAX_VOLUME, CROSS_CENTER, CROSS_WIDTH]);

  /**
   * Wakes the engine up on user activity.
   */
  const wakeUp = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (Howler.ctx?.state === 'suspended') {
      void Howler.ctx.resume();
    }

    initAudio();

    if (!isPlayingRef.current) {
      isPlayingRef.current = true;
      // Start the update loop if not running
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(syncAudio);
      }
    }
  }, [initAudio, syncAudio]);

  useEffect(() => {
    if (!enabled || pathname !== "/") {
      isPlayingRef.current = false;
      howlsRef.current.sfx1?.stop();
      howlsRef.current.sfx2?.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    // ── Wait for the shutter intro to finish before attaching scroll listeners ──
    // If the shutter overlay is still active, defer setup until it completes.
    const isShutterActive = () =>
      document.body.classList.contains("shutter-intro-active");

    let cleanupFns: (() => void)[] = [];

    function attachListeners() {
      if (isShutterActive()) return; // shutter still open — bail

      // Active Monitoring
      const monitor = setInterval(() => {
        const now = Date.now();
        if (isPlayingRef.current && now - lastActivityRef.current > IDLE_LIMIT) {
          isPlayingRef.current = false;

          const { sfx1, sfx2 } = howlsRef.current;
          const curV1 = sfx1?.volume() || 0;
          const curV2 = sfx2?.volume() || 0;

          sfx1?.fade(curV1, 0, STOP_FADE_MS);
          sfx2?.fade(curV2, 0, STOP_FADE_MS);

          setTimeout(() => {
            if (!isPlayingRef.current) {
              sfx1?.pause();
              sfx2?.pause();
              if (rafRef.current) cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
          }, STOP_FADE_MS + 20);
        }
      }, 100);

      const onScroll = () => wakeUp();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("wheel", wakeUp, { passive: true });
      window.addEventListener("touchmove", wakeUp, { passive: true });

      const KEYS = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", "Home", "End"];
      const onKey = (e: KeyboardEvent) => {
        if (KEYS.includes(e.key) || KEYS.includes(e.code)) wakeUp();
      };
      window.addEventListener("keydown", onKey, { passive: true });

      cleanupFns.push(() => {
        clearInterval(monitor);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("wheel", wakeUp);
        window.removeEventListener("touchmove", wakeUp);
        window.removeEventListener("keydown", onKey);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        howlsRef.current.sfx1?.unload();
        howlsRef.current.sfx2?.unload();
        howlsRef.current.sfx1 = null;
        howlsRef.current.sfx2 = null;
      });
    }

    // Watch for the shutter-intro-active class being removed via MutationObserver
    const observer = new MutationObserver(() => {
      if (!isShutterActive()) {
        observer.disconnect();
        attachListeners();
      }
    });

    if (isShutterActive()) {
      // Shutter is currently active — observe until it's removed
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    } else {
      // Shutter already gone — attach immediately
      attachListeners();
    }

    return () => {
      observer.disconnect();
      cleanupFns.forEach((fn) => fn());
    };
  }, [enabled, pathname, wakeUp, STOP_FADE_MS, IDLE_LIMIT]);

}
