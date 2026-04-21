"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, ClipboardList } from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";
import { business } from "@/lib/business";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalCard: React.CSSProperties = {
  background: "linear-gradient(145deg, #F0F2F5 0%, #D1D5D8 100%)",
  position: "relative",
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.6)",
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

      {/* Modal card */}
      <div
        className="relative z-10 w-full sm:max-w-[540px] sm:mx-4 rounded-t-[28px] sm:rounded-2xl overflow-hidden transition-all duration-400"
        style={{
          ...modalCard,
          /* Mobile: 88vh max so it doesn't overwhelm the screen */
          maxHeight: "88vh",
          transform: mounted ? "translateY(0)" : "translateY(48px)",
          opacity: mounted ? 1 : 0,
        }}
      >
        {/* Red top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent 0%, #E8192A 35%, #E8192A 65%, transparent 100%)" }}
        />

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-2.5 pb-0.5 sm:hidden">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <div>
            <h2
              className="font-display text-[#111116] uppercase tracking-[0.08em] leading-tight"
              style={{ fontSize: "15px" }}
            >
              Book a Service
            </h2>
            <p
              className="font-body mt-0.5 font-bold"
              style={{ fontSize: "10px", color: "rgba(0,0,0,0.55)" }}
            >
              Baba Royal Garage · Hubli
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0"
            style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.09)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(232,25,42,0.14)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)"; }}
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,0.55)" }} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(88vh - 60px)" }}
        >
          {/* ── Choice screen ── */}
          {choice === "none" && (
            <div className="px-4 sm:px-6 pt-4 pb-5 sm:py-5">
              <p
                className="font-body text-center mb-4 font-semibold"
                style={{ fontSize: "12px", color: "#111116" }}
              >
                How would you like to book your service?
              </p>

              {/* ── Cards: horizontal on mobile, 2-col grid on desktop ── */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3">

                {/* Chat Directly */}
                <a
                  href={`https://wa.me/${business.phone1.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Baba Royal Garage, I would like to book a service for my Royal Enfield. Please let me know the available time slots.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-row sm:flex-col items-center gap-3 sm:gap-3.5 p-3.5 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,255,255,0.80)",
                    border: "1px solid rgba(37,211,102,0.45)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.80)"; }}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "rgba(37,211,102,0.12)",
                      border: "1px solid rgba(37,211,102,0.28)",
                      boxShadow: "0 0 12px rgba(37,211,102,0.15)",
                    }}
                  >
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#25D366" }} />
                  </div>

                  {/* Text — left-aligned on mobile, centered on desktop */}
                  <div className="flex-1 sm:flex-none text-left sm:text-center">
                    <p className="font-heading font-black text-[#111116] uppercase tracking-[0.09em] leading-tight"
                      style={{ fontSize: "11px" }}>
                      Chat Directly
                    </p>
                    <p className="font-body font-medium mt-0.5 sm:mt-1.5 leading-relaxed"
                      style={{ fontSize: "10.5px", color: "rgba(0,0,0,0.55)" }}>
                      Opens WhatsApp instantly. Quickest way to reach us.
                    </p>
                  </div>

                  {/* Badge — right on mobile, bottom-center on desktop */}
                  <span
                    className="shrink-0 sm:hidden font-label font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
                    style={{ fontSize: "8px", background: "rgba(37,211,102,0.10)", color: "#25D366", border: "1px solid rgba(37,211,102,0.28)" }}
                  >
                    Instant
                  </span>
                  <span
                    className="hidden sm:inline-block font-label font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full mt-1"
                    style={{ fontSize: "8px", background: "rgba(37,211,102,0.10)", color: "#25D366", border: "1px solid rgba(37,211,102,0.28)" }}
                  >
                    Instant
                  </span>
                </a>

                {/* Define Problem */}
                <button
                  onClick={() => setChoice("form")}
                  className="group flex flex-row sm:flex-col items-center gap-3 sm:gap-3.5 p-3.5 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 text-left"
                  style={{
                    background: "rgba(255,255,255,0.80)",
                    border: "1px solid rgba(232,25,42,0.38)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.80)"; }}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "rgba(232,25,42,0.09)",
                      border: "1px solid rgba(232,25,42,0.28)",
                      boxShadow: "0 0 12px rgba(232,25,42,0.10)",
                    }}
                  >
                    <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 sm:flex-none text-left sm:text-center">
                    <p className="font-heading font-black text-[#111116] uppercase tracking-[0.09em] leading-tight"
                      style={{ fontSize: "11px" }}>
                      Define Problem
                    </p>
                    <p className="font-body font-medium mt-0.5 sm:mt-1.5 leading-relaxed"
                      style={{ fontSize: "10.5px", color: "rgba(0,0,0,0.55)" }}>
                      Fill a quick form. We&apos;ll send a pre-filled WhatsApp message.
                    </p>
                  </div>

                  {/* Badge */}
                  <span
                    className="shrink-0 sm:hidden font-label font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
                    style={{ fontSize: "8px", background: "rgba(232,25,42,0.09)", color: "#E8192A", border: "1px solid rgba(232,25,42,0.22)" }}
                  >
                    Recommended
                  </span>
                  <span
                    className="hidden sm:inline-block font-label font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full mt-1"
                    style={{ fontSize: "8px", background: "rgba(232,25,42,0.09)", color: "#E8192A", border: "1px solid rgba(232,25,42,0.22)" }}
                  >
                    Recommended
                  </span>
                </button>
              </div>

              {/* Trust strip */}
              <div
                className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap mt-4 pt-3.5"
                style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
              >
                {["1000+ Repairs Done", "5.0 ★ Google Rating", "Mon–Sat 10AM–8PM"].map(t => (
                  <span
                    key={t}
                    className="font-label font-bold tracking-[0.16em] uppercase"
                    style={{ fontSize: "7px", color: "rgba(0,0,0,0.42)" }}
                  >
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
