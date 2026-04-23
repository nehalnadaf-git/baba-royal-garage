"use client";

import { useState, useCallback, useMemo } from "react";
import {
  MessageCircle, Phone, ChevronRight, ChevronLeft, Check,
  Truck, MapPin, Clock, Star, X,
} from "lucide-react";
import { business } from "@/lib/business";

/* ─────────────────────────────────────────────────────────────── */
/*  DATA                                                           */
/* ─────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    id: "essential", label: "Essential", emoji: "🔧",
    services: [
      "General Servicing & Oil Change",
      "Engine Oil Change",
      "Brake Service & Pad Replacement",
      "Chain & Sprocket Service",
      "Tyre Service & Alignment",
    ],
  },
  {
    id: "engine", label: "Engine", emoji: "⚙️",
    services: [
      "Engine Overhaul & Rebuild",
      "Clutch Repair & Replacement",
      "Gearbox Repair & Tuning",
      "Fuel System Cleaning",
    ],
  },
  {
    id: "electrical", label: "Electrical", emoji: "⚡",
    services: [
      "Electrical Diagnostics & Repair",
      "Battery Replacement",
      "Lighting & Indicator Repair",
      "ECU Diagnostic Reset",
    ],
  },
  {
    id: "suspension", label: "Suspension", emoji: "🛞",
    services: [
      "Front Fork Service",
      "Rear Suspension Service",
      "Fork Oil Change",
      "Shock Absorber Replacement",
    ],
  },
  {
    id: "detailing", label: "Detailing", emoji: "✨",
    services: [
      "Full Bike Detailing",
      "Engine Bay Cleaning",
      "Body Polish & Wax",
    ],
  },
];

const RE_MODELS = [
  "Classic 350", "Classic 500", "Bullet 350", "Bullet 500",
  "Thunderbird 350X", "Thunderbird 500X", "Himalayan",
  "Meteor 350", "Hunter 350", "Scram 411",
  "Continental GT 650", "Interceptor 650",
  "Super Meteor 650", "Shotgun 650", "Other",
];

const BRANCHES = [
  {
    id: "keshwapur",
    label: "Keshwapur Branch",
    sub: "Bhavani Nagar, Keshwapur — Main Branch",
    Icon: MapPin,
  },
  {
    id: "nehru",
    label: "Nehru Stadium Branch",
    sub: "Nehru Stadium Road, Hubli",
    Icon: MapPin,
  },
  {
    id: "pickup",
    label: "Doorstep Pickup",
    sub: "Free pickup & drop anywhere in Hubli",
    Icon: Truck,
  },
];

const TIME_SLOTS = [
  "10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM", "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM", "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM", "06:00 PM – 07:00 PM",
];

/* ─────────────────────────────────────────────────────────────── */
/*  TYPES                                                          */
/* ─────────────────────────────────────────────────────────────── */

interface Form {
  category: string;
  service: string;
  model: string;
  customModel: string;
  name: string;
  phone: string;
  branch: string;
  date: string;
  timeSlot: string;
  notes: string;
}

const INIT: Form = {
  category: "", service: "", model: "", customModel: "",
  name: "", phone: "", branch: "", date: "", timeSlot: "", notes: "",
};

/* ─────────────────────────────────────────────────────────────── */
/*  SHARED STYLES                                                  */
/* ─────────────────────────────────────────────────────────────── */

const formCard: React.CSSProperties = {
  background: "linear-gradient(145deg, #F0F2F5 0%, #D1D5D8 100%)",
  position: "relative",
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.6)",
};

const inputBase: React.CSSProperties = {
  background: "rgba(0,0,0,0.03)",
  border: "1px solid rgba(0,0,0,0.1)",
  color: "#111116",
  outline: "none",
  width: "100%",
  borderRadius: "12px",
  padding: "12px 16px",
  fontFamily: "inherit",
  fontSize: "13.5px",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
};

/* ─────────────────────────────────────────────────────────────── */
/*  COMPONENT                                                      */
/* ─────────────────────────────────────────────────────────────── */

interface BookingSectionProps { variant?: "dark" | "light" }

export default function BookingSection({ variant = "dark" }: BookingSectionProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<Form>(INIT);
  const [touchedPhone, setTouchedPhone] = useState(false);

  const set = useCallback((k: keyof Form, v: string) =>
    setForm(p => ({ ...p, [k]: v })), []);

  const step1Ok = !!form.category && !!form.service;
  const phoneValid = /^[6-9]\d{9}$/.test(form.phone.trim());
  const step2Ok = !!form.model && !!form.name.trim() && phoneValid && !!form.branch;

  const activeCat = CATEGORIES.find(c => c.label === form.category);

  /* Build deep WhatsApp message */
  const waLink = useMemo(() => {
    const model = form.model === "Other"
      ? (form.customModel.trim() || "Not specified")
      : form.model;
    const branchLabel = BRANCHES.find(b => b.id === form.branch)?.label ?? "";
    const dateStr = form.date
      ? new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "";
    const lines: string[] = [
      "*SERVICE BOOKING REQUEST*",
      "*Baba Royal Garage —",
      "Royal Enfield Specialist, Hubli*",
      "--------------------------------------------",
      "",
      "*SERVICE DETAILS*",
      `Category        : ${form.category}`,
      `Service         : ${form.service}`,
      `RE Model        : ${model}`,
      "",
      "*CUSTOMER DETAILS*",
      `Name            : ${form.name}`,
      `Phone           : +91 ${form.phone}`,
      `Branch          : ${branchLabel}`,
      ...(dateStr        ? [`Preferred Date  : ${dateStr}`]        : []),
      ...(form.timeSlot  ? [`Preferred Time  : ${form.timeSlot}`]  : []),
      ...(form.notes.trim() ? ["", "*ADDITIONAL NOTES*", form.notes.trim()] : []),
    ];
    return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [form]);

  const stepLabels = ["Service", "Details", "Confirm"];

  /* ──────────────────────────────────────────────────────── */
  return (
    <section
      id="booking"
      className={`relative py-20 sm:py-28 overflow-hidden transition-colors duration-500 ${variant === 'light' ? 'bg-[hsl(210,5%,95%)]' : 'bg-[#0E0E16]'}`}
    >
      {/* Ambient layers */}
      <div className={`absolute inset-0 pointer-events-none ${variant === 'light' ? 'bg-mesh-light opacity-80' : 'bg-mesh-dark opacity-60'}`} />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: variant === 'light' ? "rgba(232,25,42,0.04)" : "rgba(232,25,42,0.08)" }}
      />
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent ${variant === 'light' ? 'opacity-20' : ''}`} />
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent ${variant === 'light' ? 'opacity-0' : ''}`} />

      <div className="relative container mx-auto px-4 sm:px-8">
        
        {/* ── Section header — Centered ────────────────────────── */}
        <div className="text-center mb-14 sm:mb-20 reveal">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-[1px] w-6 bg-primary/70" />
            <span className="font-label text-primary text-[9px] lg:text-[12px] tracking-[0.32em] uppercase">Easy Booking</span>
            <div className="h-[1px] w-6 bg-primary/70" />
          </div>
          <h2
            className={`font-display uppercase leading-none mb-5 ${variant === 'light' ? 'text-foreground' : 'text-white'}`}
            style={{ fontSize: "clamp(42px, 6vw, 84px)", letterSpacing: "0.025em" }}
          >
            Book Your <span className="text-primary">Service</span>
          </h2>
          <p className={`font-body text-[14px] sm:text-[15px] lg:text-[17px] leading-[1.85] max-w-2xl mx-auto mb-10 ${variant === 'light' ? 'text-muted-foreground' : 'text-white/55'}`}>
            Book your Royal Enfield specialist service in under 60 seconds via WhatsApp.{" "}
            Fill in the form — we confirm within minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 lg:gap-16 items-start">
          
          {/* ── LEFT — Brand sidebar ────────────────────────────── */}
          <div className="lg:pt-6">

            {/* Perks list */}
            <div className="space-y-3.5 mb-10">
              {[
                { Icon: Truck,          t: "Free Doorstep Pickup",         s: "Anywhere across Hubli city" },
                { Icon: MessageCircle,  t: "Instant WhatsApp Confirmation", s: "Confirmed within minutes" },
                { Icon: Clock,          t: "Mon – Sat · 10AM – 8PM",        s: "Walk-in or scheduled pickup" },
                { Icon: Star,           t: "5.0 ★ Google Rating",           s: "1000+ repairs · 6+ years specialist care" },
              ].map(({ Icon, t, s }) => (
                <div key={t} className="flex items-start gap-3.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(232,25,42,0.12)", border: "1px solid rgba(232,25,42,0.25)" }}
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className={`font-heading font-bold text-[12.5px] uppercase tracking-wider leading-tight ${variant === 'light' ? 'text-foreground' : 'text-white'}`}>
                      {t}
                    </p>
                    <p className={`font-body text-[11.5px] mt-0.5 ${variant === 'light' ? 'text-muted-foreground/80' : 'text-white/38'}`}>{s}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Branch pills */}
            <p className={`font-label text-[8px] tracking-[0.28em] uppercase mb-3 ${variant === 'light' ? 'text-foreground/40' : 'text-white/30'}`}>Our Branches</p>
            <div className="space-y-2 mb-8">
              {business.branches.map(b => (
                <a
                  key={b.id}
                  href={b.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(192,196,205,0.04)",
                    border: "1px solid rgba(192,196,205,0.10)",
                  }}
                >
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-heading font-bold text-[12px] uppercase tracking-wide leading-tight ${variant === 'light' ? 'text-foreground' : 'text-white'}`}>
                      {b.name}
                    </p>
                    <p className={`font-body text-[11px] mt-0.5 ${variant === 'light' ? 'text-muted-foreground/80' : 'text-white/35'}`}>{b.address}, {b.city}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Call option */}
            <div
              className="pt-5"
              style={{ borderTop: "1px solid rgba(192,196,205,0.08)" }}
            >
              <p className={`font-label text-[8px] tracking-[0.28em] uppercase mb-3 ${variant === 'light' ? 'text-foreground/40' : 'text-white/28'}`}>Prefer to call?</p>
              <div className="space-y-1.5">
                {[
                  { href: `tel:${business.phone1}`, text: "Call Now — Babajan" },
                  { href: `tel:${business.phone2}`, text: "Call Now — Raju" },
                ].map(({ href, text }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-2 font-body text-[13px] transition-colors"
                    style={{ color: variant === 'light' ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.50)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = variant === 'light' ? "#E8192A" : "white")}
                    onMouseLeave={e => (e.currentTarget.style.color = variant === 'light' ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.50)")}
                  >
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    {text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Multi-step form ─────────────────────────── */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden" style={formCard}>

            {/* ── Form header — step progress ── */}
            <div
              className="px-5 sm:px-8 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.3)" }}
            >
              {stepLabels.map((label, i) => {
                const n = (i + 1) as 1 | 2 | 3;
                const done = step > n;
                const active = step === n;
                return (
                  <div key={label} className="flex items-center" style={{ flex: i < 2 ? 1 : "none" }}>
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-label text-[9.5px] font-bold transition-all duration-400"
                        style={{
                          background: done ? "#E8192A" : active ? "rgba(232,25,42,0.15)" : "rgba(0,0,0,0.05)",
                          border: done ? "none" : active ? "1.5px solid #E8192A" : "1.5px solid rgba(0,0,0,0.1)",
                          color: done ? "white" : active ? "#E8192A" : "rgba(0,0,0,0.4)",
                          boxShadow: active ? "0 0 12px rgba(232,25,42,0.2)" : "none",
                        }}
                      >
                        {done ? <Check className="h-3 w-3" /> : n}
                      </div>
                      <span
                        className="font-label text-[8.5px] tracking-[0.18em] uppercase hidden sm:block font-bold"
                        style={{
                          color: active ? "#111116"
                            : done ? "rgba(0,0,0,0.5)"
                            : "rgba(0,0,0,0.25)",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div
                        className="h-[1px] flex-1 mx-2 sm:mx-3 transition-all duration-600"
                        style={{ background: step > n ? "#E8192A" : "rgba(0,0,0,0.08)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Form body ── */}
            <div className="px-5 sm:px-8 py-6 sm:py-7">

              {/* ╔══════════════════════════════╗ */}
              {/* ║  STEP 1 — Service Selection  ║ */}
              {/* ╚══════════════════════════════╝ */}
              {step === 1 && (
                <div>
                  <p className="font-display text-[#111116] text-[clamp(22px,3vw,30px)] uppercase leading-tight mb-1">
                    Select Your Service
                  </p>
                  <p className="font-body text-black/70 text-[12.5px] mb-6 font-medium">
                    Pick a category, then choose the specific service you need.
                  </p>

                  {/* Category tabs */}
                  <p className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase mb-2.5 font-black">
                    Service Category
                  </p>
                  {/* 3-col on mobile → 5-col on sm+ for 5 categories */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
                    {CATEGORIES.map(cat => {
                      const active = form.category === cat.label;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { set("category", cat.label); set("service", ""); }}
                          className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 rounded-xl cursor-pointer transition-all duration-250"
                          style={{
                            background: active ? "rgba(232,25,42,0.10)" : "rgba(255,255,255,0.85)",
                            border: active ? "1.5px solid rgba(232,25,42,0.40)" : "1px solid rgba(0,0,0,0.10)",
                            boxShadow: active ? "0 4px 14px rgba(232,25,42,0.14)" : "0 2px 6px rgba(0,0,0,0.03)",
                            minHeight: "60px",
                          }}
                        >
                          <span className="text-[18px] sm:text-xl leading-none">{cat.emoji}</span>
                          <span
                            className="font-label text-[8px] sm:text-[9px] tracking-[0.14em] uppercase leading-tight text-center font-bold"
                            style={{ color: active ? "#E8192A" : "#111116" }}
                          >
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Service list */}
                  {activeCat ? (
                    <div>
                      <p className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase mb-2.5 font-black">
                        Choose Specific Service
                      </p>
                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-hide">
                        {activeCat.services.map(srv => {
                          const sel = form.service === srv;
                          return (
                            <button
                              key={srv}
                              onClick={() => set("service", srv)}
                              className="w-full text-left flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-220"
                              style={{
                                background: sel ? "rgba(232,25,42,0.08)" : "rgba(255,255,255,0.88)",
                                border: sel ? "1.5px solid rgba(232,25,42,0.40)" : "1px solid rgba(0,0,0,0.10)",
                                boxShadow: sel ? "0 2px 12px rgba(232,25,42,0.10)" : "0 2px 6px rgba(0,0,0,0.03)",
                                minHeight: "52px",
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                                  style={{
                                    border: `2px solid ${sel ? "#E8192A" : "rgba(0,0,0,0.18)"}`,
                                    background: sel ? "#E8192A" : "transparent",
                                  }}
                                >
                                  {sel && <Check className="h-2.5 w-2.5 text-white" />}
                                </div>
                                <span
                                  className="font-body text-[13px] sm:text-[14px] leading-snug font-semibold"
                                  style={{ color: sel ? "#E8192A" : "#111116" }}
                                >
                                  {srv}
                                </span>
                              </div>
                              {sel && (
                                <span
                                  className="font-label text-[8px] tracking-[0.12em] uppercase shrink-0 px-2.5 py-1 rounded-full font-bold"
                                  style={{ background: "rgba(232,25,42,0.09)", color: "#E8192A", border: "1px solid rgba(232,25,42,0.20)" }}
                                >
                                  Selected
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center py-10 rounded-xl"
                      style={{ border: "1px dashed rgba(0,0,0,0.1)", background: "rgba(0,0,0,0.02)" }}
                    >
                      <span className="text-3xl mb-3 opacity-50">🔧</span>
                      <p className="font-body text-black/40 text-[12.5px] text-center font-medium">
                        Select a category above to see available services
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ╔═════════════════════════╗ */}
              {/* ║  STEP 2 — Your Details  ║ */}
              {/* ╚═════════════════════════╝ */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <p className="font-display text-[#111116] uppercase leading-tight mb-1" style={{ fontSize: "clamp(22px, 3vw, 32px)" }}>
                      Your Details
                    </p>
                    <p className="font-body text-black/60 text-[13px] sm:text-[14px] font-medium">
                      Help us prepare for your service appointment.
                    </p>
                  </div>

                  {/* RE Model */}
                  <div>
                    <label className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase block mb-2 font-black">
                      Royal Enfield Model <span className="text-primary">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {RE_MODELS.map(m => {
                        const sel = form.model === m;
                        return (
                          <button
                            key={m}
                            onClick={() => set("model", m)}
                            className="px-3 py-1.5 rounded-full font-label text-[8.5px] tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 font-bold"
                            style={{
                              background: sel ? "rgba(232,25,42,0.12)" : "rgba(255,255,255,0.7)",
                              border: sel ? "1px solid rgba(232,25,42,0.4)" : "1px solid rgba(0,0,0,0.1)",
                              color: sel ? "#E8192A" : "#111116",
                              boxShadow: sel ? "0 2px 10px rgba(232,25,42,0.15)" : "0 1px 3px rgba(0,0,0,0.03)",
                            }}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                    {form.model === "Other" && (
                      <input
                        className="mt-2.5"
                        style={inputBase}
                        placeholder="Enter your Royal Enfield model..."
                        value={form.customModel}
                        onChange={e => set("customModel", e.target.value)}
                      />
                    )}
                  </div>

                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase block mb-1.5 font-black">
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <input
                        style={inputBase}
                        placeholder="Full name"
                        value={form.name}
                        onChange={e => set("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase block mb-1.5 font-black">
                        Phone <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-[13px] pointer-events-none font-bold"
                          style={{ color: "rgba(0,0,0,0.6)" }}
                        >
                          +91
                        </span>
                        <input
                          style={{ ...inputBase, paddingLeft: "48px" }}
                          placeholder="10-digit number"
                          type="tel"
                          maxLength={10}
                          value={form.phone}
                          onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          onBlur={() => setTouchedPhone(true)}
                        />
                      </div>
                      {touchedPhone && form.phone && !phoneValid && (
                        <p className="font-label text-[8px] tracking-wide mt-1 font-bold" style={{ color: "#E8192A" }}>
                          Enter a valid 10-digit mobile number
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Branch */}
                  <div>
                    <label className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase block mb-2 font-black">
                      Branch / Service Type <span className="text-primary">*</span>
                    </label>
                    <div className="space-y-2">
                      {BRANCHES.map(({ id, label, sub, Icon }) => {
                        const sel = form.branch === id;
                        return (
                          <button
                            key={id}
                            onClick={() => set("branch", id)}
                            className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl cursor-pointer transition-all duration-220"
                            style={{
                              background: sel ? "rgba(232,25,42,0.1)" : "rgba(255,255,255,0.8)",
                              border: sel ? "1px solid rgba(232,25,42,0.4)" : "1px solid rgba(0,0,0,0.1)",
                              boxShadow: sel ? "none" : "0 2px 4px rgba(0,0,0,0.02)"
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                              style={{
                                background: sel ? "rgba(232,25,42,0.15)" : "rgba(255,255,255,1)",
                                border: sel ? "1px solid rgba(232,25,42,0.2)" : "1px solid rgba(0,0,0,0.06)",
                              }}
                            >
                              <Icon className="h-3.5 w-3.5" style={{ color: sel ? "#E8192A" : "rgba(0,0,0,0.6)" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-heading font-bold text-[12.5px] uppercase tracking-wide"
                                style={{ color: sel ? "#E8192A" : "#111116" }}
                              >
                                {label}
                              </p>
                              <p className="font-body text-[11px] mt-0.5 font-medium" style={{ color: "rgba(0,0,0,0.6)" }}>
                                {sub}
                              </p>
                            </div>
                            {sel && <Check className="h-4 w-4 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase block mb-1.5 font-black">
                        Preferred Date <span className="text-black/40 text-[7.5px]">(optional)</span>
                      </label>
                      <input
                        type="date"
                        style={{ ...inputBase, colorScheme: "light" } as React.CSSProperties}
                        min={new Date().toISOString().split("T")[0]}
                        value={form.date}
                        onChange={e => set("date", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase block mb-1.5 font-black">
                        Preferred Time <span className="text-black/40 text-[7.5px]">(optional)</span>
                      </label>
                      <select
                        style={{ ...inputBase, cursor: "pointer", colorScheme: "light" } as React.CSSProperties}
                        value={form.timeSlot}
                        onChange={e => set("timeSlot", e.target.value)}
                      >
                        <option value="">Any time...</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="font-label text-black/80 text-[8px] tracking-[0.25em] uppercase block mb-1.5 font-black">
                      Special Notes <span className="text-black/40 text-[7.5px]">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      style={{ ...inputBase, resize: "none" } as React.CSSProperties}
                      placeholder="Specific issue, problem description, or special requests..."
                      value={form.notes}
                      onChange={e => set("notes", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ╔═══════════════════════════════╗ */}
              {/* ║  STEP 3 — Review & Confirm    ║ */}
              {/* ╚═══════════════════════════════╝ */}
              {step === 3 && (
                <div>
                  <p className="font-display text-[#111116] text-[clamp(22px,3vw,30px)] uppercase leading-tight mb-1">
                    Review & Send
                  </p>
                  <p className="font-body text-black/50 text-[12.5px] mb-5 font-medium">
                    Confirm your details before sending the WhatsApp booking.
                  </p>

                  {/* Summary */}
                  <div
                    className="rounded-xl p-4 sm:p-5 mb-5 shadow-inner"
                    style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)" }}
                  >
                    {([
                      { label: "Service",  value: `${form.category} → ${form.service}` },
                      { label: "RE Model", value: form.model === "Other" ? (form.customModel || "—") : form.model },
                      { label: "Name",     value: form.name },
                      { label: "Phone",    value: `+91 ${form.phone}` },
                      { label: "Branch",   value: BRANCHES.find(b => b.id === form.branch)?.label ?? "" },
                      ...(form.date ? [{ label: "Date", value: new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) }] : []),
                      ...(form.timeSlot ? [{ label: "Time", value: form.timeSlot }] : []),
                      ...(form.notes.trim() ? [{ label: "Notes", value: form.notes }] : []),
                    ] as { label: string; value: string }[]).map(({ label, value }) => (
                      <div key={label} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <span
                          className="font-label text-[8px] tracking-[0.16em] uppercase shrink-0 mt-0.5 w-14 font-bold"
                          style={{ color: "rgba(0,0,0,0.4)" }}
                        >
                          {label}
                        </span>
                        <span className="font-body text-[13px] leading-snug font-bold" style={{ color: "rgba(0,0,0,0.8)" }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp note */}
                  <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3 shadow-sm bg-white"
                    style={{ border: "1px solid rgba(37,211,102,0.3)" }}
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#25D366" }} />
                    <p className="font-body text-[12.5px] leading-snug font-bold" style={{ color: "rgba(0,0,0,0.6)" }}>
                      Tapping <strong style={{ color: "#25D366" }}>Send on WhatsApp</strong> opens WhatsApp with your
                      booking pre-filled. Just tap Send — we confirm within minutes.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Form footer — navigation ── */}
            <div
              className="px-5 sm:px-8 py-4 flex items-center justify-between gap-3"
              style={{ borderTop: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.3)" }}
            >
              {/* Back */}
              {step > 1 ? (
                <button
                  onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                  className="flex items-center gap-1.5 font-label text-[8.5px] tracking-[0.18em] uppercase cursor-pointer transition-colors font-bold"
                  style={{ color: "rgba(0,0,0,0.4)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(0,0,0,0.8)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,0,0,0.4)")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {/* Trust note */}
              <p className="font-label text-[7.5px] tracking-[0.15em] uppercase text-center hidden sm:block font-bold" style={{ color: "rgba(0,0,0,0.3)" }}>
                No commitment · Free pickup · 5.0 ★
              </p>

              {/* Next / Send */}
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && step1Ok) setStep(2);
                    if (step === 2 && step2Ok) setStep(3);
                  }}
                  disabled={(step === 1 && !step1Ok) || (step === 2 && !step2Ok)}
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3.5 font-heading font-bold text-[12.5px] uppercase tracking-[0.10em] text-white transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(254,36,20,0.35)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  {step === 1 ? "Next — My Details" : "Review Booking"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-[#25D366] px-6 py-3.5 font-heading font-bold text-[12.5px] uppercase tracking-[0.10em] text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(37,211,102,0.35)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <MessageCircle className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-12" />
                  Send on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
