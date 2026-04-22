"use client";

import { Howl, Howler } from "howler";
import { useCallback, useEffect, useRef } from "react";

interface UseShutterSoundOptions {
  disabled?: boolean;
}

interface UseShutterSoundReturn {
  play: () => void;
  fadeOutAndStop: (durationMs?: number) => void;
  stop: () => void;
}

/**
 * useShutterSound
 *
 * Plays the shutter-open SFX using the same proven pattern as useEngineSound:
 *  - html5: true  (most reliable across iOS/Android/Desktop)
 *  - Synchronous play() call — never awaited, preserves gesture chain on mobile
 *  - Cinematic volume ramp-up over 2s matching the shutter lift
 */
export function useShutterSound(options: UseShutterSoundOptions = {}): UseShutterSoundReturn {
  const { disabled = false } = options;

  const soundRef      = useRef<Howl | null>(null);
  const soundIdRef    = useRef<number | null>(null);
  const stopTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rampRafRef    = useRef<number | null>(null);

  // ── Constants ────────────────────────────────────────────────────────────
  const TARGET_VOLUME = 0.80;
  const RAMP_DURATION = 2000; // ms to reach full volume

  // ── Helpers ───────────────────────────────────────────────────────────────
  const cancelRamp = useCallback(() => {
    if (rampRafRef.current !== null) {
      cancelAnimationFrame(rampRafRef.current);
      rampRafRef.current = null;
    }
  }, []);

  const clearStopTimer = useCallback(() => {
    if (stopTimerRef.current !== null) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  // ── Ensure Howl instance (same as engine: html5:true) ─────────────────────
  const ensureSound = useCallback((): Howl => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: ["/sfx/shutter-open.mp3"],
        preload: true,
        loop: false,
        volume: 0,
        html5: true,   // ← Matches useEngineSound — proven to work on all devices
      });
    }
    return soundRef.current;
  }, []);

  // ── Eagerly preload on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (disabled) return;
    ensureSound();
  }, [disabled, ensureSound]);

  // ── stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    clearStopTimer();
    cancelRamp();
    const sound = soundRef.current;
    if (!sound) return;
    if (soundIdRef.current !== null) {
      sound.stop(soundIdRef.current);
    } else {
      sound.stop();
    }
    soundIdRef.current = null;
  }, [clearStopTimer, cancelRamp]);

  // ── play ──────────────────────────────────────────────────────────────────
  // Synchronous — never awaits anything before sound.play().
  // This preserves the iOS/Android user-gesture chain exactly like useEngineSound.
  const play = useCallback(() => {
    if (disabled) return;

    const sound = ensureSound();
    clearStopTimer();
    cancelRamp();
    sound.stop();
    soundIdRef.current = null;

    // Resume AudioContext if suspended — non-blocking, fire-and-forget
    if (Howler.ctx?.state === "suspended") {
      void Howler.ctx.resume();
    }

    // ── Play immediately at volume 0 (synchronous) ───────────────────────
    sound.volume(0);
    const id = sound.play();
    soundIdRef.current = typeof id === "number" ? id : null;

    // ── Cinematic volume ramp-up over RAMP_DURATION ──────────────────────
    const rampStart = performance.now();
    const rampTick = (now: number) => {
      const t   = Math.min((now - rampStart) / RAMP_DURATION, 1);
      const vol = t * t * TARGET_VOLUME; // ease-in: slow start

      const s = soundRef.current;
      if (s) {
        if (soundIdRef.current !== null) {
          s.volume(vol, soundIdRef.current);
        } else {
          s.volume(vol);
        }
      }

      if (t < 1) {
        rampRafRef.current = requestAnimationFrame(rampTick);
      } else {
        rampRafRef.current = null;
      }
    };
    rampRafRef.current = requestAnimationFrame(rampTick);
  }, [disabled, ensureSound, clearStopTimer, cancelRamp, TARGET_VOLUME, RAMP_DURATION]);

  // ── fadeOutAndStop ────────────────────────────────────────────────────────
  const fadeOutAndStop = useCallback((durationMs = 600) => {
    const sound = soundRef.current;
    if (!sound) return;

    clearStopTimer();
    cancelRamp();

    if (!sound.playing()) {
      stop();
      return;
    }

    const currentVol = soundIdRef.current !== null
      ? (sound.volume(soundIdRef.current) as number)
      : (sound.volume() as number);

    const targetId = soundIdRef.current ?? undefined;
    sound.fade(
      typeof currentVol === "number" ? currentVol : TARGET_VOLUME,
      0,
      durationMs,
      targetId
    );

    stopTimerRef.current = setTimeout(() => stop(), durationMs + 50);
  }, [clearStopTimer, cancelRamp, stop, TARGET_VOLUME]);

  // ── Stop when disabled ────────────────────────────────────────────────────
  useEffect(() => {
    if (disabled) stop();
  }, [disabled, stop]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearStopTimer();
      cancelRamp();
      const sound = soundRef.current;
      if (!sound) return;
      stop();
      sound.unload();
      soundRef.current = null;
    };
  }, [clearStopTimer, cancelRamp, stop]);

  return { play, fadeOutAndStop, stop };
}
