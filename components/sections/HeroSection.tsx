"use client";

import Image from "next/image";
import { Wrench, Phone } from "lucide-react";

interface HeroSectionProps {
  onBookingClick: () => void;
}

export default function HeroSection({ onBookingClick }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: "560px" }}>

      {/* ── Web Banner (sm+) */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/Banners/web-banner.png"
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
          src="/Banners/mobile-banner.png"
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

      {/* ── Bottom-centered CTAs — pushed up to sit above the wave */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-40 sm:pb-32 flex justify-center px-4">
        <div className="flex flex-row gap-2 items-center justify-center">
          {/* Primary — Book */}
          <button
            onClick={onBookingClick}
            className="group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-primary px-4 py-2.5 sm:px-11 sm:py-4.5 font-heading font-bold text-[10px] sm:text-[16px] uppercase tracking-[0.08em] text-white shadow-[0_0_20px_rgba(254,36,20,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(254,36,20,0.45)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Wrench className="h-3 w-3 sm:h-5.5 sm:w-5.5 transition-transform group-hover:rotate-12 shrink-0" />
            <span className="relative z-10">Book Now</span>
          </button>

          {/* Secondary — Call */}
          <a href="tel:+919742291701"
            className="group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2.5 sm:px-11 sm:py-4.5 font-heading font-bold text-[10px] sm:text-[16px] uppercase tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black/60 hover:border-white/40"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Phone className="h-3 w-3 sm:h-5.5 sm:w-5.5 transition-transform group-hover:scale-110 shrink-0" />
            <span className="relative z-10">Call Now</span>
          </a>
        </div>
      </div>

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
