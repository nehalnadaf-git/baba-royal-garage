"use client";

import { useEffect, useRef } from "react";

interface ShutterSlatsProps {
  isOpening: boolean;
  prefersReducedMotion: boolean;
}

const SLAT_COUNT = 24; // Number of horizontal steel slats

export default function ShutterSlats({ isOpening, prefersReducedMotion }: ShutterSlatsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Total animation time matches ShutterIntro's SHUTTER_OPEN_DURATION_S (5.2s)
  const DURATION = 5200;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const drawFrame = (progress: number) => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const slatH = H / SLAT_COUNT;

      for (let i = 0; i < SLAT_COUNT; i++) {
        const y = i * slatH;

        // Each slat lifts with a slight stagger (upper slats lead by a small amount)
        const stagger = prefersReducedMotion ? 0 : (i / SLAT_COUNT) * 0.03;
        const slatProgress = Math.min(1, Math.max(0, progress - stagger));

        const liftY = slatProgress * H * -1;

        ctx.save();
        ctx.translate(0, liftY);

        // ── Base slat body ──
        const gradient = ctx.createLinearGradient(0, y, 0, y + slatH);
        gradient.addColorStop(0, "rgba(38, 38, 42, 0.98)");
        gradient.addColorStop(0.18, "rgba(58, 58, 64, 0.96)");
        gradient.addColorStop(0.45, "rgba(72, 72, 80, 0.94)");
        gradient.addColorStop(0.72, "rgba(50, 50, 56, 0.96)");
        gradient.addColorStop(1, "rgba(28, 28, 32, 0.98)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, W, slatH - 1);

        // ── Top highlight (metal sheen) ──
        const shine = ctx.createLinearGradient(0, y, 0, y + slatH * 0.3);
        shine.addColorStop(0, "rgba(255, 255, 255, 0.10)");
        shine.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = shine;
        ctx.fillRect(0, y, W, slatH * 0.3);

        // ── Bottom crease shadow ──
        const crease = ctx.createLinearGradient(0, y + slatH - 4, 0, y + slatH);
        crease.addColorStop(0, "rgba(0,0,0,0)");
        crease.addColorStop(1, "rgba(0,0,0,0.55)");
        ctx.fillStyle = crease;
        ctx.fillRect(0, y + slatH - 4, W, 4);

        // ── Embossed horizontal line between slats ──
        ctx.strokeStyle = "rgba(90,90,100,0.6)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y + slatH - 1);
        ctx.lineTo(W, y + slatH - 1);
        ctx.stroke();

        // ── Dark gap between slats ──
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, y + slatH - 1, W, 1);

        ctx.restore();
      }

      // ── Moving bottom shadow as shutter lifts ──
      const shadowAlpha = Math.max(0, 1 - progress * 1.8);
      if (shadowAlpha > 0) {
        const shadowGrad = ctx.createLinearGradient(0, H * progress * 0.9, 0, H);
        shadowGrad.addColorStop(0, `rgba(0,0,0,0)`);
        shadowGrad.addColorStop(1, `rgba(0,0,0,${shadowAlpha * 0.7})`);
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(0, H * progress * 0.9, W, H);
      }

      // ── Subtle Red accent line on the bottom edge of the shutter ──
      const edgeProgress = Math.min(1, progress / 0.05); // flashes in at start
      if (edgeProgress > 0 && progress < 0.98) {
        const liftedY = (1 - progress) * H; // current bottom edge Y of shutter
        const redAlpha = edgeProgress * (1 - progress) * 0.85;
        ctx.fillStyle = `rgba(232, 25, 42, ${redAlpha})`;
        ctx.fillRect(0, liftedY - 3, W, 3);
      }
    };

    const animate = (timestamp: number) => {
      if (!isOpening || prefersReducedMotion) return;

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      // Custom slow-start ease: starts very slow, accelerates naturally
      const t = Math.min(elapsed / DURATION, 1);

      // Bezier-approximated slow-start curve: ease starts extremely slowly
      // Cubic ease-in-out but weighted heavily toward the start being slow
      const eased = t < 0.5
        ? 2 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      drawFrame(eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    if (!isOpening) {
      startTimeRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Draw static closed shutter
      drawFrame(0);
    } else {
      if (prefersReducedMotion) {
        drawFrame(1);
      } else {
        startTimeRef.current = null;
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isOpening, prefersReducedMotion, DURATION]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}
