"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { MapPin, Phone, Navigation, Clock, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface BranchData {
  key: string;
  branchName: string;
  badge: string;
  badgeAccent: boolean;
  branchImage: string;
  address: string;
  phone: string;
  phoneLabel?: string;
  directions: string;
  hours: string;
  number?: string;
}

interface BranchSliderProps {
  branches: BranchData[];
}

export default function BranchSlider({ branches }: BranchSliderProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    setActiveIdx(Math.max(0, Math.min(idx, branches.length - 1)));
  }, [branches.length]);

  const goPrev = () => goTo(activeIdx - 1);
  const goNext = () => goTo(activeIdx + 1);

  /* ── Touch / swipe handlers ── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Only hijack if horizontal swipe dominates
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      isDragging.current = true;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) goNext();
    else if (dx > 40) goPrev();
    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;
  };

  return (
    <div className="w-full">
      {/* ── MOBILE SLIDER (hidden on lg+) ── */}
      <div className="lg:hidden">
        <div
          ref={trackRef}
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Slides track */}
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            {branches.map((branch) => (
              <div key={branch.key} className="w-full shrink-0">
                <MobileBranchCard branch={branch} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Dots + Arrow nav ── */}
        <div className="flex items-center justify-center gap-4 mt-5">
          {/* Prev arrow */}
          <button
            onClick={goPrev}
            disabled={activeIdx === 0}
            aria-label="Previous branch"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {branches.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to branch ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === activeIdx ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "99px",
                  background: i === activeIdx ? "#E8192A" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={goNext}
            disabled={activeIdx === branches.length - 1}
            aria-label="Next branch"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Branch counter label */}
        <p className="text-center mt-2 font-label text-white/30 tracking-[0.2em] uppercase" style={{ fontSize: "9px" }}>
          {activeIdx + 1} of {branches.length} Branches
        </p>
      </div>

      {/* ── DESKTOP GRID (hidden on mobile) ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6 xl:gap-8 max-w-7xl mx-auto">
        {branches.map((branch) => (
          <DesktopBranchCard key={branch.key} branch={branch} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MOBILE CARD — compact, premium, swipe-friendly
══════════════════════════════════════════════════════════════════ */
function MobileBranchCard({ branch }: { branch: BranchData }) {
  return (
    <article
      className="mx-auto w-full max-w-sm rounded-[24px] overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #F0F2F5 0%, #D1D5D8 100%)",
        border: "1px solid rgba(255,255,255,0.80)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.22), inset 0 2px 0 rgba(255,255,255,0.55)",
      }}
    >
      {/* Image — compact height on mobile */}
      <div className="relative w-full overflow-hidden" style={{ height: "180px" }}>
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(209,213,216,0.95) 100%)" }}
        />
        <Image
          src={branch.branchImage}
          alt={branch.branchName}
          fill
          className="object-cover brightness-90"
          sizes="100vw"
        />

        {/* Branch number watermark */}
        {branch.number && (
          <div className="absolute top-3 left-4 z-20">
            <span
              className="font-display text-primary/10 select-none leading-none"
              style={{ fontSize: "56px" }}
            >
              {branch.number}
            </span>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-md"
            style={branch.badgeAccent
              ? { background: "rgba(232,25,42,0.95)", borderColor: "rgba(255,255,255,0.3)", color: "white" }
              : { background: "rgba(255,255,255,0.85)", borderColor: "rgba(0,0,0,0.06)", color: "#111116" }
            }
          >
            <div className={`w-1.5 h-1.5 rounded-full ${branch.badgeAccent ? "bg-white animate-pulse" : "bg-primary"}`} />
            <span className="font-label font-black tracking-[0.18em] uppercase" style={{ fontSize: "9px" }}>
              {branch.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-5">
        {/* Branch name + Maps link */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <span className="font-label text-primary font-black tracking-[0.30em] uppercase block mb-1" style={{ fontSize: "8.5px" }}>
              Baba Royal Garage
            </span>
            <h3
              className="font-display text-[#111116] uppercase leading-none"
              style={{ fontSize: "clamp(20px, 5.5vw, 26px)", letterSpacing: "0.02em" }}
            >
              {branch.branchName}
            </h3>
          </div>
          <a
            href={branch.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 text-[#111116]/38 hover:text-primary transition-colors mt-1"
          >
            <span className="font-label font-black uppercase tracking-widest" style={{ fontSize: "8px" }}>Maps</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* Quick info row */}
        <div className="space-y-2.5 mb-4">
          {/* Address */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="font-label text-black/30 font-black tracking-widest uppercase mb-0.5" style={{ fontSize: "8px" }}>Location</p>
              <p className="font-body text-[#111116] leading-snug font-bold" style={{ fontSize: "12px" }}>{branch.address}</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="font-label text-black/30 font-black tracking-widest uppercase mb-0.5" style={{ fontSize: "8px" }}>Hours</p>
                <p className="font-body text-[#111116] font-bold" style={{ fontSize: "12px" }}>{branch.hours}</p>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-label text-black/35 tracking-widest uppercase" style={{ fontSize: "7.5px" }}>Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={branch.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-[#111116] bg-[#111116] text-white font-heading font-black uppercase transition-all duration-300 hover:bg-transparent hover:text-[#111116]"
            style={{ fontSize: "10px", letterSpacing: "0.15em" }}
          >
            <Navigation className="h-3.5 w-3.5 shrink-0" />
            Directions
          </a>
          <a
            href={`tel:${branch.phone}`}
            className="relative flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-white font-heading font-black uppercase overflow-hidden"
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              boxShadow: "0 6px 20px rgba(232,25,42,0.28)",
            }}
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            Call Now
          </a>
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DESKTOP CARD — full premium card (original design preserved)
══════════════════════════════════════════════════════════════════ */
function DesktopBranchCard({ branch }: { branch: BranchData }) {
  return (
    <article
      className="group relative rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
      style={{
        background: "linear-gradient(145deg, #F0F2F5 0%, #D1D5D8 100%)",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.5)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(220px, 22vw, 300px)" }}>
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 55%, rgba(209,213,216,0.95) 100%)" }}
        />
        <Image
          src={branch.branchImage}
          alt={branch.branchName}
          fill
          className="object-cover grayscale brightness-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-100 scale-[1.05]"
          sizes="(max-width: 1200px) 50vw, 600px"
        />

        {branch.number && (
          <div className="absolute top-4 left-5 z-20">
            <span className="font-display text-primary/10 select-none leading-none" style={{ fontSize: "clamp(48px, 7vw, 80px)" }}>
              {branch.number}
            </span>
          </div>
        )}

        <div className="absolute top-5 right-5 z-20">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border shadow-lg"
            style={branch.badgeAccent
              ? { background: "rgba(232,25,42,0.95)", borderColor: "rgba(255,255,255,0.3)", color: "white" }
              : { background: "rgba(255,255,255,0.85)", borderColor: "rgba(0,0,0,0.06)", color: "#111116" }
            }
          >
            <div className={`w-1.5 h-1.5 rounded-full ${branch.badgeAccent ? "bg-white animate-pulse" : "bg-primary"}`} />
            <span className="font-label text-[10px] tracking-[0.2em] uppercase font-black">{branch.badge}</span>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-8 xl:p-10 relative">
        <div className="flex items-end justify-between gap-3 mb-7">
          <div>
            <span className="font-label text-primary text-[10px] tracking-[0.35em] uppercase font-black mb-2 block">
              Baba Royal Garage
            </span>
            <h3
              className="font-display text-[#111116] uppercase leading-none"
              style={{ fontSize: "clamp(22px, 2.8vw, 38px)", letterSpacing: "0.02em" }}
            >
              {branch.branchName}
            </h3>
          </div>
          <a
            href={branch.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#111116]/40 hover:text-primary transition-colors group/link shrink-0"
          >
            <span className="font-label text-[10px] uppercase tracking-widest font-black">Open in Maps</span>
            <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-6 xl:gap-8 mb-7">
          <div className="space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-label text-black/30 text-[10px] uppercase tracking-widest mb-1 font-black">Location</p>
                <p className="font-body text-[#111116] text-[14px] leading-relaxed font-bold">{branch.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-label text-black/30 text-[10px] uppercase tracking-widest mb-1 font-black">Hotline</p>
                <a
                  href={`tel:${branch.phone}`}
                  className="font-body text-[15px] text-[#111116] hover:text-primary transition-colors font-black underline decoration-black/10 underline-offset-4"
                >
                  {branch.phoneLabel ?? "Call Now"}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-black/5 rounded-2xl p-5 xl:p-6 border border-black/5 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-label text-[#111116] text-[11px] uppercase tracking-widest font-black">Service Hours</span>
            </div>
            <p className="font-body text-[#111116] text-[15px] xl:text-[16px] font-bold leading-snug">{branch.hours}</p>
            <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-label text-black/40 text-[10px] uppercase tracking-widest">Open Mon–Sat</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={branch.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 group/btn relative flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 border-[#111116] bg-[#111116] text-white font-heading font-black text-[12px] uppercase tracking-[0.18em] transition-all duration-300 hover:bg-transparent hover:text-[#111116]"
          >
            <Navigation className="h-4 w-4 shrink-0 transition-transform group-hover/btn:rotate-12" />
            Get Directions
          </a>
          <a
            href={`tel:${branch.phone}`}
            className="flex-1 group/call relative flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-primary text-white font-heading font-black text-[12px] uppercase tracking-[0.18em] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(232,25,42,0.40)] hover:-translate-y-0.5 overflow-hidden"
            style={{ boxShadow: "0 4px 18px rgba(232,25,42,0.22)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/call:translate-x-full transition-transform duration-700" />
            <Phone className="h-4 w-4 shrink-0" />
            Call Specialist
          </a>
        </div>
      </div>
    </article>
  );
}
