"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Howl, Howler } from "howler";

// â”€â”€ Module-level constants â€” never recreate callbacks on re-render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SFX_1_SRC    = "/sfx/engine-sound-1.mp3";
const SFX_2_SRC    = "/sfx/engine-sound-2.mp3";
const MAX_VOLUME   = 0.32;  // Overall ceiling volume (keep low for mobile speakers)
const IDLE_LIMIT   = 280;   // ms of silence before engine fades out
const CROSS_CENTER = 0.42;  // Scroll % where sfx1â†’sfx2 crossfade is centred
const CROSS_WIDTH  = 0.20;  // Blend zone width (smaller = sharper cut)
const LERP_SPEED   = 0.12;  // Volume lerp factor per frame (0â€“1, higher = snappier)

// â”€â”€ iOS / iPadOS detection â€” computed once at module load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports "MacIntel" with touch support
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

// â”€â”€ Lerp helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface UseEngineSoundOptions {
  enabled: boolean;
}

/**
 * useEngineSound â€” Professional Scroll-Driven Engine SFX
 *
 * Two Royal Enfield engine sounds crossfade based on scroll depth:
 *  SFX 1: Idle/low RPM rumble (top of page)
 *  SFX 2: Higher RPM character (mid/bottom of page)
 *
 * Architecture:
 *  - Web Audio API (html5:false) on desktop â€” zero latency, no gesture unlock needed.
 *  - html5:true only on iOS/iPadOS where Web Audio autoplay is blocked.
 *  - Eager init: audio is pre-decoded immediately after shutter closes,
 *    NOT lazily on first scroll â€” eliminates "first scroll delay".
 *  - Single volume writer: a lerp in the rAF loop drives ALL volume changes.
 *    No competing .fade() + .volume() calls that cause pops or jumps.
 *  - Idle detection via clearTimeout/setTimeout â€” O(1) per scroll, no polling.
 *  - Cached iOS flag (computed once on mount) â€” no UA parsing in hot path.
 *  - visibilitychange handler â€” resumes AudioContext when returning to the tab.
 *  - Howl error callbacks â€” silent graceful failure on slow connections.
 *
 * iOS autoplay strategy:
 *  On iOS, html5:true is required. The <audio> element must be .play()'d inside
 *  a synchronous user-gesture handler before scroll events can trigger playback.
 *  We do a silent play+pause on the first touchstart/click (primeForIOS),
 *  then wakeUp() from scroll events succeeds normally.
 */
export function useEngineSound({ enabled }: UseEngineSoundOptions): void {
  const pathname = usePathname();

  // â”€â”€ All mutable state in refs (never triggers re-render) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sfx1Ref        = useRef<Howl | null>(null);
  const sfx2Ref        = useRef<Howl | null>(null);

  // Target volumes the rAF loop lerps toward (0 = silent, MAX_VOLUME = full)
  const targetV1Ref    = useRef(0);
  const targetV2Ref    = useRef(0);

  // Current rendered volumes (lerp continuity â€” avoids pops on direction change)
  const currentV1Ref   = useRef(0);
  const currentV2Ref   = useRef(0);

  const isPlayingRef   = useRef(false);
  const rafRef         = useRef<number | null>(null);
  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cached once on mount â€” never re-computed in the scroll hot path
  const isIOSRef       = useRef(false);
  // Whether iOS <audio> elements have been unlocked via a user gesture
  const isUnlockedRef  = useRef(false);
  // Whether we have encountered a load error (suppresses repeated retries)
  const loadErrorRef   = useRef(false);

  // â”€â”€ Shared Howl factory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function makeHowl(src: string, useHTML5: boolean): Howl {
    return new Howl({
      src: [src],
      loop: true,
      volume: 0,
      html5: useHTML5,
      preload: true,
      // pool:1 caps concurrent <audio> elements to prevent pool exhaustion
      // in React Strict Mode (double invocation) and mobile memory limits.
      pool: 1,
      onloaderror: (_id, err) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[useEngineSound] Load error:", src, err);
        }
        loadErrorRef.current = true;
      },
      onplayerror: (_id, err) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[useEngineSound] Play error:", src, err);
        }
        // Recover cleanly â€” stop both tracks rather than letting Howler retry silently
        sfx1Ref.current?.stop();
        sfx2Ref.current?.stop();
        isPlayingRef.current = false;
      },
    });
  }

  // â”€â”€ Eager audio init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Called as soon as the shutter closes â€” pre-decodes MP3 buffers so the
  // very first scroll event plays with zero latency.
  function initAudio() {
    if (sfx1Ref.current || loadErrorRef.current) return;
    // Use Web Audio on desktop (lowest latency), HTML5 Audio only on iOS/iPadOS
    const useHTML5 = isIOSRef.current;
    sfx1Ref.current = makeHowl(SFX_1_SRC, useHTML5);
    sfx2Ref.current = makeHowl(SFX_2_SRC, useHTML5);
  }

  // â”€â”€ Prime HTML5 audio for iOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // MUST be called synchronously inside a user-gesture handler (touchstart/click).
  function primeForIOS() {
    if (!isIOSRef.current || isUnlockedRef.current || loadErrorRef.current) return;
    initAudio();
    [sfx1Ref.current, sfx2Ref.current].forEach((sfx) => {
      if (!sfx) return;
      sfx.volume(0);
      const id = sfx.play();
      // Pause on next rAF â€” satisfies iOS policy without an audible pop
      requestAnimationFrame(() => {
        if (typeof id === "number") sfx.pause(id);
        else sfx.pause();
      });
    });
    isUnlockedRef.current = true;
  }

  // â”€â”€ Resume AudioContext â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function resumeCtx() {
    const ctx = Howler.ctx;
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }

  // â”€â”€ rAF loop: single volume writer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // All volume changes flow through here. The lerp provides:
  //  - Smooth ramp-up on first scroll (no pop)
  //  - Smooth crossfade between sfx1/sfx2 as the user scrolls
  //  - Smooth ramp-down on idle (no click/pop at silence)
  function syncAudio() {
    const sfx1 = sfx1Ref.current;
    const sfx2 = sfx2Ref.current;
    if (!sfx1 || !sfx2) { rafRef.current = null; return; }

    // â”€â”€ Compute scroll-position-based crossfade targets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const y        = window.scrollY;
    const h        = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(y / h, 0), 1);

    const rangeStart = CROSS_CENTER - CROSS_WIDTH / 2;
    let weight2      = (progress - rangeStart) / CROSS_WIDTH;
    weight2          = Math.min(Math.max(weight2, 0), 1);

    // Equal-power crossfade keeps perceived loudness constant
    const angle  = weight2 * (Math.PI / 2);
    const wantV1 = Math.cos(angle) * MAX_VOLUME;
    const wantV2 = Math.sin(angle) * MAX_VOLUME;

    // When fading out (isPlaying=false or targetV=0), lerp toward 0
    const t1 = (isPlayingRef.current && targetV1Ref.current > 0) ? wantV1 : 0;
    const t2 = (isPlayingRef.current && targetV2Ref.current > 0) ? wantV2 : 0;

    // â”€â”€ Lerp current â†’ target â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const v1 = lerp(currentV1Ref.current, t1, LERP_SPEED);
    const v2 = lerp(currentV2Ref.current, t2, LERP_SPEED);
    currentV1Ref.current = v1;
    currentV2Ref.current = v2;

    // â”€â”€ Write volumes + manage play/pause â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (v1 > 0.003) {
      if (!sfx1.playing()) sfx1.play();
      sfx1.volume(v1);
    } else if (sfx1.playing()) {
      sfx1.volume(0);
      sfx1.pause();
    }

    if (v2 > 0.003) {
      if (!sfx2.playing()) sfx2.play();
      sfx2.volume(v2);
    } else if (sfx2.playing()) {
      sfx2.volume(0);
      sfx2.pause();
    }

    // â”€â”€ Continue or stop the loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Keep ticking while any sound is audible so the fade-out completes cleanly.
    if (v1 > 0.001 || v2 > 0.001) {
      rafRef.current = requestAnimationFrame(syncAudio);
    } else {
      rafRef.current     = null;
      targetV1Ref.current = 0;
      targetV2Ref.current = 0;
    }
  }

  function startRaf() {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(syncAudio);
    }
  }

  // â”€â”€ Idle detection: setTimeout reset pattern (O(1) per scroll) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function resetIdleTimer() {
    if (idleTimerRef.current !== null) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      // Signal rAF loop to fade to silence
      targetV1Ref.current  = 0;
      targetV2Ref.current  = 0;
      isPlayingRef.current = false;
      startRaf(); // ensure loop runs to complete the fade-out
    }, IDLE_LIMIT);
  }

  // â”€â”€ wakeUp: called by every scroll event â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function wakeUp() {
    if (loadErrorRef.current) return;
    // iOS gate â€” require prior gesture unlock
    if (isIOSRef.current && !isUnlockedRef.current) return;

    resumeCtx();
    initAudio(); // no-op after first call

    resetIdleTimer();

    if (!isPlayingRef.current) {
      isPlayingRef.current = true;
      targetV1Ref.current  = MAX_VOLUME;
      targetV2Ref.current  = MAX_VOLUME;
      startRaf();
    }
  }

  // â”€â”€ Hard stop: silence everything immediately â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function hardStop() {
    if (idleTimerRef.current !== null) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
    if (rafRef.current !== null)       { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    isPlayingRef.current = false;
    targetV1Ref.current  = 0;
    targetV2Ref.current  = 0;
    currentV1Ref.current = 0;
    currentV2Ref.current = 0;
    sfx1Ref.current?.stop();
    sfx2Ref.current?.stop();
  }

  // â”€â”€ Full unload: hard stop + release memory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function unloadAudio() {
    hardStop();
    sfx1Ref.current?.unload();
    sfx2Ref.current?.unload();
    sfx1Ref.current      = null;
    sfx2Ref.current      = null;
    isUnlockedRef.current = false;
  }

  // â”€â”€ Main effect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    // Cache iOS detection once per mount â€” never runs in the scroll hot path
    isIOSRef.current = detectIOS();

    if (!enabled || pathname !== "/") {
      hardStop();
      return;
    }

    const isShutterActive = () =>
      document.body.classList.contains("shutter-intro-active");

    let listenerCleanup: (() => void) | undefined;
    let attached = false;

    function attachListeners() {
      if (attached || isShutterActive()) return;
      attached = true;

      // Eager init â€” pre-decode buffers NOW (not on first scroll)
      initAudio();

      const onScroll = () => wakeUp();

      // iOS gesture unlock (both touchstart and click for full coverage)
      const onGesture = () => { primeForIOS(); resumeCtx(); };

      // Resume AudioContext when user returns to the tab
      const onVisibility = () => {
        if (document.visibilityState === "visible") resumeCtx();
      };

      window.addEventListener("scroll",     onScroll,     { passive: true });
      window.addEventListener("touchstart", onGesture,    { passive: true });
      window.addEventListener("click",      onGesture,    { passive: true });
      document.addEventListener("visibilitychange", onVisibility);

      listenerCleanup = () => {
        window.removeEventListener("scroll",     onScroll);
        window.removeEventListener("touchstart", onGesture);
        window.removeEventListener("click",      onGesture);
        document.removeEventListener("visibilitychange", onVisibility);
        unloadAudio();
      };
    }

    // Defer listener attachment until the shutter intro has closed
    const observer = new MutationObserver(() => {
      if (!isShutterActive()) {
        observer.disconnect();
        attachListeners();
      }
    });

    if (isShutterActive()) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    } else {
      attachListeners();
    }

    return () => {
      observer.disconnect();
      if (listenerCleanup) {
        listenerCleanup();
      } else {
        // Shutter was still active when React cleaned up â€” hard stop is enough
        hardStop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, pathname]);
}
