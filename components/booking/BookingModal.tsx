"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, ClipboardList } from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";
import { business } from "@/lib/business";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Silver metallic glass modal card ────────────────────────── */
const modalCard: React.CSSProperties = {
  background: "linear-gradient(145deg, #F0F2F5 0%, #D1D5D8 100%)",
  position: "relative",
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.6)",
};

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [choice, setChoice] = useState<"none" | "form">("none");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setMounted(true));
    else {
      setMounted(false);
      setTimeout(() => setChoice("none"), 350);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Book a Service"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-350"
        style={{
          background: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          opacity: mounted ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Modal — dark glass */}
      <div
        className="relative z-10 w-full sm:max-w-[560px] sm:mx-4 rounded-t-3xl sm:rounded-3xl overflow-hidden transition-all duration-400"
        style={{
          ...modalCard,
          maxHeight: "92vh",
          transform: mounted ? "translateY(0)" : "translateY(40px)",
          opacity: mounted ? 1 : 0,
        }}
      >
        {/* Red top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent 0%, #E8192A 35%, #E8192A 65%, transparent 100%)" }}
        />

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(192,196,205,0.22)" }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 sm:px-7 py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <div>
            <h2 className="font-display text-[#111116] uppercase tracking-[0.08em] leading-tight" style={{ fontSize: "17px" }}>
              Book a Service
            </h2>
            <p className="font-body text-[11px] mt-0.5 font-bold" style={{ color: "rgba(0,0,0,0.6)" }}>
              Baba Royal Garage · Hubli
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(232,25,42,0.16)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)"; }}
            aria-label="Close"
          >
            <X className="h-4 w-4" style={{ color: "rgba(0,0,0,0.6)" }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: "calc(92vh - 76px)" }}>

          {/* ── Choice screen ── */}
          {choice === "none" && (
            <div className="px-5 sm:px-7 py-6">
              <p className="font-body text-center text-[13px] leading-relaxed mb-5 font-bold" style={{ color: "#111116" }}>
                How would you like to book your service?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Chat Directly */}
                <a
                  href={business.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(37,211,102,0.5)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.8)"; }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.30)", boxShadow: "0 0 15px rgba(37,211,102,0.2)" }}
                  >
                    <MessageCircle className="h-7 w-7" style={{ color: "#25D366" }} />
                  </div>
                  <div className="text-center">
                    <p className="font-heading font-black text-[#111116] text-[13px] uppercase tracking-[0.10em] mb-1.5">
                      Chat Directly
                    </p>
                    <p className="font-body text-[11.5px] leading-relaxed font-bold" style={{ color: "rgba(0,0,0,0.6)" }}>
                      Opens WhatsApp instantly. Quickest way to reach us.
                    </p>
                  </div>
                  <span
                    className="font-label text-[8px] tracking-[0.18em] uppercase px-3 py-1 rounded-full font-bold"
                    style={{ background: "rgba(37,211,102,0.1)", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)" }}
                  >
                    Instant
                  </span>
                </a>

                {/* Define Problem */}
                <button
                  onClick={() => setChoice("form")}
                  className="group flex flex-col items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(232,25,42,0.4)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.8)"; }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(232,25,42,0.1)", border: "1px solid rgba(232,25,42,0.30)", boxShadow: "0 0 15px rgba(232,25,42,0.15)" }}
                  >
                    <ClipboardList className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-heading font-black text-[#111116] text-[13px] uppercase tracking-[0.10em] mb-1.5">
                      Define Problem
                    </p>
                    <p className="font-body text-[11.5px] leading-relaxed font-bold" style={{ color: "rgba(0,0,0,0.6)" }}>
                      Fill a quick form. We&apos;ll send a pre-filled WhatsApp message.
                    </p>
                  </div>
                  <span
                    className="font-label text-[8px] tracking-[0.18em] uppercase px-3 py-1 rounded-full font-bold"
                    style={{ background: "rgba(232,25,42,0.1)", color: "#E8192A", border: "1px solid rgba(232,25,42,0.25)" }}
                  >
                    Recommended
                  </span>
                </button>
              </div>

              {/* Trust strip */}
              <div
                className="flex items-center justify-center gap-4 flex-wrap mt-5 pt-4"
                style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
              >
                {["1000+ Repairs Done", "5.0 ★ Google Rating", "Mon–Sat 10AM–8PM"].map(t => (
                  <span key={t} className="font-label text-[7.5px] tracking-[0.18em] uppercase font-bold" style={{ color: "rgba(0,0,0,0.5)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Form ── */}
          {choice === "form" && (
            <BookingForm onBack={() => setChoice("none")} />
          )}
        </div>
      </div>
    </div>
  );
}
