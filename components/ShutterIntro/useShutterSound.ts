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

export function useShutterSound(options: UseShutterSoundOptions = {}): UseShutterSoundReturn {
  const { disabled = false } = options;
  const soundRef = useRef<Howl | null>(null);
  const soundIdRef = useRef<number | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearStopTimer = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearStopTimer();

    const sound = soundRef.current;
    if (!sound) {
      return;
    }

    if (soundIdRef.current !== null) {
      sound.stop(soundIdRef.current);
    } else {
      sound.stop();
    }

    soundIdRef.current = null;
  }, [clearStopTimer]);

  const ensureSound = useCallback((): Howl => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: ["/sfx/shutter-open.mp3"],
        preload: true,
        loop: false,
        volume: 0.85,
        html5: true,
      });
    }

    return soundRef.current;
  }, []);

  const play = useCallback(async () => {
    if (disabled) {
      return;
    }

    const sound = ensureSound();

    clearStopTimer();
    sound.stop();
    soundIdRef.current = null;

    if (Howler.ctx?.state === "suspended") {
      try {
        await Howler.ctx.resume();
      } catch (error) {
        console.warn("AudioContext resume failed:", error);
      }
    }

    const id = sound.play();
    soundIdRef.current = typeof id === "number" ? id : null;

    if (soundIdRef.current !== null) {
      sound.volume(0.85, soundIdRef.current);
    } else {
      sound.volume(0.85);
    }

    sound.once("playerror", (_id, error) => {
      console.warn("Howler playerror, retrying on unlock:", error);
      sound.once("unlock", () => {
        const retryId = sound.play();
        soundIdRef.current = typeof retryId === "number" ? retryId : null;
      });
    });
  }, [clearStopTimer, disabled, ensureSound]);

  const fadeOutAndStop = useCallback(
    (durationMs = 400) => {
      const sound = soundRef.current;
      if (!sound) {
        return;
      }

      clearStopTimer();

      if (!sound.playing()) {
        stop();
        return;
      }

      const targetId = soundIdRef.current ?? undefined;
      sound.fade(0.85, 0, durationMs, targetId);

      stopTimerRef.current = setTimeout(() => {
        stop();
      }, durationMs);
    },
    [clearStopTimer, stop]
  );

  useEffect(() => {
    if (disabled) {
      stop();
    }
  }, [disabled, stop]);

  useEffect(() => {
    return () => {
      clearStopTimer();

      const sound = soundRef.current;
      if (!sound) {
        return;
      }

      stop();
      sound.unload();
      soundRef.current = null;
    };
  }, [clearStopTimer, stop]);

  return {
    play,
    fadeOutAndStop,
    stop,
  };
}
