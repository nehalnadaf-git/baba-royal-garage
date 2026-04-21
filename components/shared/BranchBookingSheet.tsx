"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, MessageCircle, Phone } from "lucide-react";
import { business } from "@/lib/business";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface BranchBookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  timeEstimate?: string;
}

const BRANCHES = [
  {
    id: "keshwapur",
    label: "Main",
    shortName: "Keshwapur",
    displayName: "Keshwapur (Main Branch)",
    address: business.branches[0].address,
    city: `${business.branches[0].city} — ${business.branches[0].pincode}`,
    phone: business.phone1,
    phoneDisplay: business.phone1Display,
    mapsUrl: business.branches[0].mapsUrl,
  },
  {
    id: "nehru-stadium",
    label: "Branch 2",
    shortName: "Nehru Stadium",
    displayName: "Nehru Stadium Branch",
    address: business.branches[1].address,
    city: `${business.branches[1].city} — ${business.branches[1].pincode}`,
    phone: business.phone2,
    phoneDisplay: business.phone2Display,
    mapsUrl: business.branches[1].mapsUrl,
  },
] as const;

export default function BranchBookingSheet({
  isOpen,
  onClose,
  serviceName,
  timeEstimate,
}: BranchBookingSheetProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    /* Root wrapper: stopPropagation prevents React event bubbling to parent <Link> */
    <div onClick={(e) => e.stopPropagation()}>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ zIndex: 9998, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-hidden="true"
      />

      {/* ─── Panel ─────────────────────────────────────────────────────
       *  Mobile  : compact bottom sheet — 2-col cards side by side
       *  Desktop : centred modal — wider, more spacious
       * ─────────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          /* Mobile: compact bottom sheet */
          "fixed bottom-0 left-0 right-0 w-full rounded-t-[24px]",
          /* Desktop: large centred modal */
          "sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:rounded-2xl sm:w-[90vw] sm:max-w-[860px]",
          /* Transitions */
          "transition-[transform,opacity] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen
            ? "translate-y-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:opacity-100 sm:scale-100"
            : "translate-y-full sm:translate-y-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:opacity-0 sm:scale-95",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          zIndex:     9999,
          background: "linear-gradient(145deg, #F0F2F5 0%, #D8DCE0 100%)",
          border:     "1px solid rgba(255,255,255,0.80)",
          boxShadow:  "0 24px 64px rgba(0,0,0,0.22), inset 0 2px 0 rgba(255,255,255,0.65)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Select branch to book service"
      >
        {/* Red accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[24px] sm:rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, transparent 0%, #E8192A 35%, #E8192A 65%, transparent 100%)" }}
        />

        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-2.5 sm:hidden">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <div>
            <h2
              className="font-display text-[#111116] uppercase tracking-[0.08em] leading-tight"
              style={{ fontSize: "clamp(14px, 2vw, 22px)" }}
            >
              Choose Your Branch
            </h2>
            <p
              className="font-body mt-1 font-semibold"
              style={{ fontSize: "clamp(10px, 1.2vw, 13px)", color: "rgba(0,0,0,0.48)", maxWidth: "420px" }}
            >
              {serviceName}
              {timeEstimate && <span className="opacity-60"> · {timeEstimate}</span>}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 ml-3"
            style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.09)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(232,25,42,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)"; }}
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "rgba(0,0,0,0.55)" }} />
          </button>
        </div>

        {/* ── Branch cards ────────────────────────────────────────────── */}
        <div className="px-3 sm:px-8 pt-3 pb-4 sm:py-7">

          {/* Subline — desktop only */}
          <p
            className="hidden sm:block font-body text-center mb-6 font-semibold"
            style={{ fontSize: "14px", color: "rgba(0,0,0,0.60)" }}
          >
            Select a branch — we will send you a pre-filled WhatsApp booking message
          </p>

          {/* Cards — always 2 columns */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-6">
            {BRANCHES.map((branch) => {
              const waUrl = buildServiceWhatsAppUrl({
                serviceName,
                timeEstimate,
                branchDisplayName: branch.displayName,
                branchPhone: branch.phone,
              });

              return (
                <div
                  key={branch.id}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border:     "1px solid rgba(232,25,42,0.30)",
                    boxShadow:  "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-4"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <div
                      className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(232,25,42,0.09)", border: "1px solid rgba(232,25,42,0.22)" }}
                    >
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <span
                        className="font-label font-bold uppercase tracking-[0.18em] text-primary block leading-none mb-0.5 sm:mb-1"
                        style={{ fontSize: "clamp(7px, 0.9vw, 9px)" }}
                      >
                        {branch.label}
                      </span>
                      <p
                        className="font-heading font-black text-[#111116] uppercase leading-tight truncate"
                        style={{ fontSize: "clamp(10px, 1.5vw, 15px)", letterSpacing: "0.04em" }}
                      >
                        {branch.shortName}
                      </p>
                    </div>
                  </div>

                  {/* Address — desktop only */}
                  <div className="hidden sm:block px-5 py-4">
                    <a
                      href={branch.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-body leading-relaxed hover:text-primary transition-colors"
                      style={{ fontSize: "13.5px", color: "rgba(0,0,0,0.55)" }}
                    >
                      {branch.address}
                      <span
                        className="block mt-1"
                        style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.35)" }}
                      >
                        {branch.city} · View on Maps
                      </span>
                    </a>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-1.5 sm:gap-2.5 p-2.5 sm:p-5 sm:pt-0">
                    {/* WhatsApp */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => { e.stopPropagation(); onClose(); }}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl font-heading font-bold uppercase tracking-[0.10em] text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
                      style={{
                        fontSize:   "clamp(9px, 1.2vw, 13px)",
                        padding:    "10px 8px",
                        background: "linear-gradient(135deg, #E8192A, #C0392B)",
                        boxShadow:  "0 3px 12px rgba(232,25,42,0.28)",
                      }}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="hidden sm:inline">Book on </span>WhatsApp
                    </a>

                    {/* Call */}
                    <a
                      href={`tel:${branch.phone}`}
                      onClick={(e) => { e.stopPropagation(); onClose(); }}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl font-heading font-semibold uppercase tracking-[0.08em] transition-all duration-200"
                      style={{
                        fontSize:   "clamp(8.5px, 1.1vw, 12px)",
                        padding:    "8px 8px",
                        color:      "rgba(0,0,0,0.50)",
                        background: "rgba(0,0,0,0.04)",
                        border:     "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <Phone className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
                      <span className="truncate">{branch.phoneDisplay}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust strip */}
          <div
            className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap mt-3 sm:mt-5 pt-3"
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            {["1000+ Repairs Done", "5.0 Google Rating", "Mon–Sat 10AM–8PM"].map((t) => (
              <span
                key={t}
                className="font-label font-bold tracking-[0.14em] uppercase"
                style={{ fontSize: "7px", color: "rgba(0,0,0,0.40)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
