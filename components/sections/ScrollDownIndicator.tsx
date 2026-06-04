"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollDownIndicator
 * -------------------
 * Premium, glassmorphic "Scroll Down" indicator for the hero section.
 *
 * Design tokens (from globals.css / tailwind.config.ts):
 *   Primary / Accent: #E8192A — hsl(var(--primary))
 *   Gold:             #C9A84C — hsl(var(--gold))
 *   Font-tech:        var(--font-tech) → Space Mono
 *   Glass dark:       rgba(8,8,10,.50) + backdrop-filter: blur(24px)
 */
export default function ScrollDownIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Scroll-based fade-out ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const THRESHOLD = 60; // px — start fading past this point

    function onScroll() {
      if (!el) return;
      const y = window.scrollY;
      if (y > THRESHOLD) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      } else {
        el.style.opacity = String(1 - y / THRESHOLD);
        el.style.pointerEvents = "auto";
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Keyframe definitions (inline <style> — scoped to hero) ── */}
      <style>{`
        /* ── Pill breathing ── */
        @keyframes scroll-breathe-label {
          0%, 100% { transform: scale(1);    opacity: 0.72; }
          50%       { transform: scale(1.04); opacity: 1;    }
        }

        /* ── Accent dot inner glow pulse ── */
        @keyframes scroll-dot-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,25,42,0.7); opacity: 0.85; }
          50%       { box-shadow: 0 0 0 4px rgba(232,25,42,0);  opacity: 1;   }
        }

        /* ── Chevron circle scale + glow breathe ── */
        @keyframes scroll-breathe-svg {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 0   2px rgba(232,25,42,0.30),
              0 0 18px 4px rgba(232,25,42,0.14);
          }
          50% {
            transform: scale(1.07);
            box-shadow:
              0 0 0   2px rgba(232,25,42,0.55),
              0 0 32px 8px rgba(232,25,42,0.28);
          }
        }

        /* ── Ripple ring expands outward ── */
        @keyframes scroll-ripple {
          0%   { transform: scale(1);    opacity: 0.65; }
          100% { transform: scale(1.90); opacity: 0;    }
        }

        /* ── Staggered falling dots ── */
        @keyframes scroll-dot-fall {
          0%   { transform: translateY(-4px); opacity: 0;    }
          20%  { opacity: 1;                                  }
          80%  { opacity: 0.5;                                }
          100% { transform: translateY(6px);  opacity: 0;    }
        }

        /* ── Reduced-motion: disable everything above ── */
        @media (prefers-reduced-motion: reduce) {
          @keyframes scroll-breathe-label  { 0%,100% { transform: none; opacity: 0.8; } }
          @keyframes scroll-dot-glow       { 0%,100% { box-shadow: none; opacity: 1;  } }
          @keyframes scroll-breathe-svg    { 0%,100% { transform: none; box-shadow: 0 0 0 2px rgba(232,25,42,0.30); } }
          @keyframes scroll-ripple         { 0%,100% { transform: none; opacity: 0;   } }
          @keyframes scroll-dot-fall       { 0%,100% { transform: none; opacity: 0.6; } }
        }
      `}</style>

      {/* ── Outer container ── */}
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(52px, 8vw, 108px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(5px, 1vw, 8px)",
          zIndex: 20,
          pointerEvents: "auto",
          transition: "opacity 0.35s ease",
          userSelect: "none",
        }}
      >

        {/* ────────────────────────────────────────────────────────
            1. GLASSMORPHIC LABEL PILL
        ──────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "clamp(5px, 0.8vw, 8px)",
            padding: "clamp(4px, 0.5vw, 6px) clamp(10px, 1.4vw, 16px)",
            borderRadius: "999px",
            /* Glassmorphism — dark glass variant */
            background: "rgba(8, 8, 10, 0.48)",
            backdropFilter: "blur(20px) saturate(1.5)",
            WebkitBackdropFilter: "blur(20px) saturate(1.5)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 2px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.38), 0 0 0 0.5px rgba(232,25,42,0.15)",
            animation: "scroll-breathe-label 3.2s ease-in-out infinite",
          }}
        >
          {/* Accent glow dot */}
          <span
            style={{
              width: "clamp(5px, 0.7vw, 7px)",
              height: "clamp(5px, 0.7vw, 7px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #FF4555 0%, #E8192A 60%, #B51220 100%)",
              flexShrink: 0,
              animation: "scroll-dot-glow 2.2s ease-in-out infinite",
            }}
          />

          {/* Label text */}
          <span
            style={{
              fontFamily: "var(--font-tech), 'Space Mono', monospace",
              fontSize: "clamp(7px, 0.75vw, 9px)",
              letterSpacing: "0.30em",
              color: "rgba(255,255,255,0.82)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Scroll Down
          </span>
        </div>

        {/* ────────────────────────────────────────────────────────
            2. PULSATING CHEVRON CIRCLE (with ripple ring)
        ──────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "clamp(36px, 4.5vw, 52px)",
            height: "clamp(36px, 4.5vw, 52px)",
          }}
        >
          {/* Ripple ring — expands + fades */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1.5px solid rgba(232,25,42,0.55)",
              animation: "scroll-ripple 2.0s cubic-bezier(0.4,0,0.6,1) infinite",
              transformOrigin: "center",
            }}
          />

          {/* A second, staggered ripple for depth */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid rgba(232,25,42,0.30)",
              animation: "scroll-ripple 2.0s cubic-bezier(0.4,0,0.6,1) 0.65s infinite",
              transformOrigin: "center",
            }}
          />

          {/* Chevron circle — glass-dark pill */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "clamp(34px, 4.2vw, 48px)",
              height: "clamp(34px, 4.2vw, 48px)",
              borderRadius: "50%",
              background: "rgba(8, 8, 10, 0.52)",
              backdropFilter: "blur(16px) saturate(1.4)",
              WebkitBackdropFilter: "blur(16px) saturate(1.4)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "scroll-breathe-svg 2.6s ease-in-out infinite",
            }}
          >
            {/* Chevron down SVG — uses brand crimson */}
            <svg
              width="clamp(14px, 1.8vw, 20px)"
              height="clamp(14px, 1.8vw, 20px)"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8192A"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: "drop-shadow(0 0 5px rgba(232,25,42,0.60))",
                marginTop: "1px", /* optical centering */
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────
            3. STAGGERED FALLING DOTS (3 tapering dots)
        ──────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(4px, 0.6vw, 6px)",
            marginTop: "clamp(0px, 0.3vw, 2px)",
          }}
        >
          {/* Dot 1 — largest, brightest, first to fall */}
          <span
            style={{
              width: "clamp(4px, 0.5vw, 6px)",
              height: "clamp(4px, 0.5vw, 6px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,25,42,0.90) 0%, rgba(232,25,42,0.50) 100%)",
              boxShadow: "0 0 8px 2px rgba(232,25,42,0.40)",
              animation: "scroll-dot-fall 1.7s ease-in-out infinite",
              animationDelay: "0s",
            }}
          />

          {/* Dot 2 — medium */}
          <span
            style={{
              width: "clamp(3px, 0.38vw, 4.5px)",
              height: "clamp(3px, 0.38vw, 4.5px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,25,42,0.65) 0%, rgba(232,25,42,0.30) 100%)",
              boxShadow: "0 0 5px 1px rgba(232,25,42,0.25)",
              animation: "scroll-dot-fall 1.7s ease-in-out infinite",
              animationDelay: "0.28s",
            }}
          />

          {/* Dot 3 — smallest, faintest, last to fall */}
          <span
            style={{
              width: "clamp(2px, 0.28vw, 3px)",
              height: "clamp(2px, 0.28vw, 3px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,25,42,0.40) 0%, rgba(232,25,42,0.15) 100%)",
              boxShadow: "0 0 3px 1px rgba(232,25,42,0.12)",
              animation: "scroll-dot-fall 1.7s ease-in-out infinite",
              animationDelay: "0.56s",
            }}
          />
        </div>

      </div>
    </>
  );
}
