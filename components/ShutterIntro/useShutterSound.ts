"use client";

import { Howl, Howler } from "howler";
import { useCallback, useEffect, useRef } from "react";

interface UseShutterSoundOptions {
  disabled?: boolean;
}

interface UseShutterSoundReturn {
  play: () => Promise<void>;
  fadeOutAndStop: (durationMs?: number) => void;
  stop: () => void;
}

/**
 * useShutterSound
 *
 * Plays the shutter-open SFX with a cinematic profile:
 *  - Starts at near-zero volume and ramps up slowly over the first 1.5s
 *    (matches the very slow start of the shutter lift)
 *  - Maintains presence through the full 5.2s lift
 *  - Fades out naturally when finalizeIntro is called
 */
export function useShutterSound(options: UseShutterSoundOptions = {}): UseShutterSoundReturn {
  const { disabled = false } = options;
  const soundRef = useRef<Howl | null>(null);
  const soundIdRef = useRef<number | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rampRafRef = useRef<number | null>(null);

  const clearStopTimer = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  const cancelRamp = useCallback(() => {
    if (rampRafRef.current) {
      cancelAnimationFrame(rampRafRef.current);
      rampRafRef.current = null;
    }
  }, []);

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

  const ensureSound = useCallback((): Howl => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: ["/sfx/shutter-open.mp3"],
        preload: true,
        loop: false,
        // Start silent — we ramp up manually
        volume: 0,
        // Do NOT force html5:true — Web Audio API is more reliable on iOS/Android
        // Howler handles the AudioContext unlock on first gesture automatically
        onload: () => {
          // AudioContext may be suspended on iOS; attempt an early resume
          if (Howler.ctx?.state === "suspended") {
            void Howler.ctx.resume().catch(() => {});
          }
        },
      });
    }
    return soundRef.current;
  }, []);

  // ── Eagerly preload on mount so audio is buffered before button tap ──
  // On mobile this eliminates the delay between tap and sound playing.
  useEffect(() => {
    if (disabled) return;
    ensureSound(); // triggers Howl creation + preload immediately
  }, [disabled, ensureSound]);

  const play = useCallback((): Promise<void> => {
    if (disabled) return Promise.resolve();

    const sound = ensureSound();
    clearStopTimer();
    cancelRamp();
    sound.stop();
    soundIdRef.current = null;

    const TARGET_VOLUME = 0.80;
    const RAMP_DURATION = 2000;

    // ── CRITICAL for iOS/Android ─────────────────────────────────────────
    // sound.play() MUST be called synchronously inside the tap-handler.
    // Any await before this line breaks the iOS gesture chain and silences audio.
    // We call it immediately at volume 0, then resume the AudioContext in parallel.
    const id = sound.play();
    soundIdRef.current = typeof id === "number" ? id : null;

    // Resume suspended AudioContext in the background (non-blocking)
    // On iOS this is a no-op when already running; on Android it unblocks output.
    if (Howler.ctx?.state === "suspended") {
      void Howler.ctx.resume().catch(() => {});
    }

    // ── Cinematic volume ramp-up ────────────────────────────────────────
    const rampStart = performance.now();
    const rampTick = (now: number) => {
      const elapsed = now - rampStart;
      const t = Math.min(elapsed / RAMP_DURATION, 1);
      const vol = (t * t) * TARGET_VOLUME; // ease-in: starts very slowly

      const s = soundRef.current;
      if (!s || !s.playing()) { rampRafRef.current = null; return; }

      if (soundIdRef.current !== null) {
        s.volume(vol, soundIdRef.current);
      } else {
        s.volume(vol);
      }

      if (t < 1) {
        rampRafRef.current = requestAnimationFrame(rampTick);
      } else {
        rampRafRef.current = null;
      }
    };
    rampRafRef.current = requestAnimationFrame(rampTick);

    // ── playerror fallback (locked AudioContext on first visit) ─────────
    sound.once("playerror", (_id, error) => {
      console.warn("Howler playerror, retrying on unlock:", error);
      sound.once("unlock", () => {
        sound.volume(0);
        const retryId = sound.play();
        soundIdRef.current = typeof retryId === "number" ? retryId : null;
        cancelRamp();
        const retryStart = performance.now();
        const retryTick = (now: number) => {
          const t = Math.min((now - retryStart) / RAMP_DURATION, 1);
          const vol = (t * t) * TARGET_VOLUME;
          soundRef.current?.volume(vol, soundIdRef.current ?? undefined);
          if (t < 1) rampRafRef.current = requestAnimationFrame(retryTick);
          else rampRafRef.current = null;
        };
        rampRafRef.current = requestAnimationFrame(retryTick);
      });
    });

    return Promise.resolve();
  }, [cancelRamp, clearStopTimer, disabled, ensureSound]);

  const fadeOutAndStop = useCallback(
    (durationMs = 600) => {
      const sound = soundRef.current;
      if (!sound) return;

      clearStopTimer();
      cancelRamp();

      if (!sound.playing()) {
        stop();
        return;
      }

      const currentVol = soundIdRef.current !== null
        ? sound.volume(soundIdRef.current) as number
        : sound.volume() as number;

      const targetId = soundIdRef.current ?? undefined;
      sound.fade(typeof currentVol === "number" ? currentVol : 0.8, 0, durationMs, targetId);

      stopTimerRef.current = setTimeout(() => {
        stop();
      }, durationMs + 50);
    },
    [cancelRamp, clearStopTimer, stop]
  );

  useEffect(() => {
    if (disabled) stop();
  }, [disabled, stop]);

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
