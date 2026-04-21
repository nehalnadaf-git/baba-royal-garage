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
        html5: true,
      });
    }
    return soundRef.current;
  }, []);

  const play = useCallback(async () => {
    if (disabled) return;

    const sound = ensureSound();
    clearStopTimer();
    cancelRamp();
    sound.stop();
    soundIdRef.current = null;

    // Resume suspended AudioContext (mobile requirement)
    if (Howler.ctx?.state === "suspended") {
      try {
        await Howler.ctx.resume();
      } catch (error) {
        console.warn("AudioContext resume failed:", error);
      }
    }

    // Play starting at volume 0
    const id = sound.play();
    soundIdRef.current = typeof id === "number" ? id : null;

    // ── Cinematic volume ramp-up ──
    // Volume starts near 0 and rises slowly over ~2 seconds,
    // matching the very slow initial shutter movement.
    const TARGET_VOLUME = 0.80;
    const RAMP_DURATION = 2000; // ms to reach full volume
    const rampStart = performance.now();

    const rampTick = (now: number) => {
      const elapsed = now - rampStart;
      const t = Math.min(elapsed / RAMP_DURATION, 1);

      // Ease-in curve: starts very slowly
      const eased = t * t;
      const vol = eased * TARGET_VOLUME;

      const s = soundRef.current;
      if (!s || !s.playing()) {
        rampRafRef.current = null;
        return;
      }

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

    sound.once("playerror", (_id, error) => {
      console.warn("Howler playerror, retrying on unlock:", error);
      sound.once("unlock", () => {
        const retryId = sound.play();
        soundIdRef.current = typeof retryId === "number" ? retryId : null;
      });
    });
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
