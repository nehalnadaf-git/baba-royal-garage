"use client";

import Image from "next/image";
import ScrollDownIndicator from "./ScrollDownIndicator";


interface HeroSectionProps {
  onBookingClick: () => void;
}

export default function HeroSection({ onBookingClick }: HeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden h-screen-safe"
      style={{ minHeight: "560px" }}
    >

      {/* ── Web Banner (sm+) */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/images/banners/web-banner-new.webp"
          alt="Baba Royal Garage — Royal Enfield Specialist Hubli"
          fill
          className="object-cover object-center"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>

      {/* ── Mobile Banner */}
      <div className="absolute inset-0 z-0 block sm:hidden bg-[#07070D]">
        <Image
          src="/images/banners/mobile-banner-new-mb.webp"
          alt="Baba Royal Garage — Royal Enfield Specialist Hubli"
          fill
          className="object-contain object-top"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>

      {/* Top gradient — ensures navbar readability when transparent */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

      {/* Deep bottom gradient — creates darkness behind CTAs + room for wave */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none z-10" />

      {/* ── Scroll Indicator — Premium Glassmorphic Design */}
      <ScrollDownIndicator />

      {/* ──────────────────────────────────────────────────────────── 
          Geometric Razor Slant — Premium Automotive Style
          Multi-layer diagonal cuts with crimson signature line.
          Fill matches ServicesSection bg: hsl(210,5%,95%)
      ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none" style={{ height: "120px" }}>
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Layer 1: Subtle Red Glow Shadow */}
          <path
            d="M0,120 L0,30 L1440,0 L1440,120 Z"
            fill="rgba(232,25,42,0.1)"
          />

          {/* Layer 2: Deeper Crimson Accent */}
          <path
            d="M0,120 L0,65 L1440,35 L1440,120 Z"
            fill="rgba(232,25,42,0.2)"
          />

          {/* Layer 3: Main Section Body — Matches next section bg */}
          <path
            d="M0,120 L0,85 L1440,55 L1440,120 Z"
            fill="hsl(210,5%,95%)"
          />

          {/* Premium Sharp Signature Line */}
          <line 
            x1="0" y1="85" x2="1440" y2="55" 
            stroke="#E8192A" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
          
          {/* Subtle Hairline highlight */}
          <line 
            x1="0" y1="86" x2="1440" y2="56" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="0.5" 
          />
        </svg>
      </div>

    </section>
  );
}
