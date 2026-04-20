"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ChevronRight, ChevronLeft, Check, MessageCircle,
  Truck, MapPin, ArrowLeft,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────────── */
/*  DATA                                                             */
/* ───────────────────────────────────────────────────────────────── */

const MODEL_GROUPS = [
  { label: "Popular",     models: ["Bullet 350", "Classic 350", "Meteor 350", "Hunter 350", "Thunderbird 350X", "Thunderbird 500X"] },
  { label: "Adventure",   models: ["Himalayan 411", "Himalayan 450", "Scram 411"] },
  { label: "Performance", models: ["Continental GT 650", "Interceptor 650"] },
  { label: "Cruiser",     models: ["Super Meteor 650", "Shotgun 650"] },
  { label: "Other",       models: ["Other Royal Enfield Model"] },
];

const PROBLEM_CATEGORIES = [
  { category: "Engine & Performance",  items: ["Engine not starting", "Loss of power", "Engine overheating", "Unusual engine noise", "Engine oil leaking", "Excessive smoke"] },
  { category: "Brakes & Safety",       items: ["Brakes not working properly", "Brake pads worn out", "Brake fluid leaking"] },
  { category: "Electrical",            items: ["Battery dead or draining fast", "Lights not working", "Indicators faulty", "Speedometer not working"] },
  { category: "Transmission & Clutch", items: ["Gear shifting problem", "Clutch slipping or stiff", "Chain loose or worn out"] },
  { category: "Tyres & Wheels",        items: ["Puncture", "Tyre worn out", "Wheel wobbling or misaligned"] },
  { category: "Suspension",            items: ["Front fork leaking oil", "Rear suspension issue", "Bike vibrating at speed"] },
  { category: "Routine Service",       items: ["General service due", "Oil change needed", "Air filter cleaning", "Spark plug replacement"] },
];

const BRANCHES = [
  { id: "keshwapur", name: "Keshwapur Branch",  location: "Bhavani Nagar, Keshwapur — Main", Icon: MapPin },
  { id: "nehru",     name: "Nehru Stadium",      location: "Nehru Stadium Road, Hubli",        Icon: MapPin },
  { id: "pickup",    name: "Doorstep Pickup",    location: "Free pickup & drop across Hubli",  Icon: Truck  },
];

const TIME_SLOTS = [
  "10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM", "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM", "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM", "06:00 PM – 07:00 PM",
];

/* ───────────────────────────────────────────────────────────────── */
/*  STYLE TOKENS                                                     */
/* ───────────────────────────────────────────────────────────────── */

const silverPill: React.CSSProperties = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(0,0,0,0.10)",
  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  color: "#111116",
};

const redPill: React.CSSProperties = {
  background: "rgba(232,25,42,0.10)",
  border: "1px solid rgba(232,25,42,0.40)",
  boxShadow: "0 2px 12px rgba(232,25,42,0.14)",
  color: "#E8192A",
};

const silverCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(0,0,0,0.10)",
  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
};

const redCard: React.CSSProperties = {
  background: "rgba(232,25,42,0.08)",
  border: "1px solid rgba(232,25,42,0.40)",
  boxShadow: "0 0 0 3px rgba(232,25,42,0.07)",
};

/* Responsive input — slightly smaller on mobile */
const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.70)",
  border: "1px solid rgba(0,0,0,0.12)",
  color: "#111116",
  outline: "none",
  width: "100%",
  borderRadius: "10px",
  padding: "11px 14px",
  fontFamily: "inherit",
  fontSize: "13px",
  minHeight: "44px",
  fontWeight: "600",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
};

/* ───────────────────────────────────────────────────────────────── */
/*  COMPONENT                                                        */
/* ───────────────────────────────────────────────────────────────── */

export default function BookingForm({ onBack }: { onBack: () => void }) {
  const [step, setStep]                   = useState(1);
  const [model, setModel]                 = useState("");
  const [customModel, setCustomModel]     = useState("");
  const [problems, setProblems]           = useState<string[]>([]);
  const [customProblem, setCustomProblem] = useState("");
  const [showCustom, setShowCustom]       = useState(false);
  const [name, setName]                   = useState("");
  const [phone, setPhone]                 = useState("");
  const [branch, setBranch]               = useState("");
  const [date, setDate]                   = useState("");
  const [timeSlot, setTimeSlot]           = useState("");
  const [notes, setNotes]                 = useState("");
  const [touchedPhone, setTouchedPhone]   = useState(false);

  const phoneValid  = /^[6-9]\d{9}$/.test(phone.trim());
  const allProblems = [...problems, ...(customProblem.trim() ? [customProblem.trim()] : [])];

  const canProceed = (s: number) => {
    if (s === 1) return model.trim().length > 0;
    if (s === 2) return allProblems.length > 0;
    if (s === 3) return name.trim().length > 0 && phoneValid && branch.length > 0;
    return true;
  };

  const goNext = () => { if (canProceed(step)) setStep(s => Math.min(s + 1, 4)); };
  const goBack = () => { if (step === 1) onBack(); else setStep(s => s - 1); };

  const toggleProblem = useCallback((p: string) => {
    setProblems(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const waLink = useMemo(() => {
    const displayModel = model === "Other Royal Enfield Model"
      ? (customModel.trim() || "Not specified") : model;
    const branchLabel  = BRANCHES.find(b => b.id === branch)?.name ?? "";
    const dateStr      = date
      ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "Flexible";
    const lines = [
      "🏍️ *SERVICE BOOKING — BABA ROYAL GARAGE*", "",
      `🔧 *Bike Model:* ${displayModel}`, "",
      "⚠️ *Problem(s) Reported:*",
      ...allProblems.map(p => `  • ${p}`), "",
      "👤 *Customer Details*",
      `  Name: ${name}`,
      `  Phone: +91 ${phone}`,
      `  Branch: ${branchLabel}`,
      `  Date: ${dateStr}`,
      ...(timeSlot ? [`  Time: ${timeSlot}`] : []),
      ...(notes.trim() ? ["", `📝 Notes: ${notes.trim()}`] : []),
      "", "_Sent from babaroyalgarage.com_",
    ];
    return `https://wa.me/919742291701?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [model, customModel, allProblems, name, phone, branch, date, timeSlot, notes]);

  const stepLabels = ["Bike", "Problem", "Details", "Confirm"];

  /* ── render ── */
  return (
    <div className="flex flex-col">

      {/* ── Step progress bar ── */}
      <div
        className="flex items-center px-4 sm:px-7 py-2.5 sm:py-3.5 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.35)" }}
      >
        {stepLabels.map((label, i) => {
          const n      = i + 1;
          const done   = step > n;
          const active = step === n;
          return (
            <div key={label} className="flex items-center" style={{ flex: i < 3 ? 1 : "none" }}>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Step circle */}
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-label text-[8px] sm:text-[9px] font-bold transition-all duration-300 shrink-0"
                  style={{
                    background: done ? "#E8192A" : active ? "rgba(232,25,42,0.10)" : "rgba(0,0,0,0.05)",
                    border: done ? "none" : active ? "1.5px solid #E8192A" : "1.5px solid rgba(0,0,0,0.12)",
                    color: done ? "white" : active ? "#E8192A" : "rgba(0,0,0,0.35)",
                    boxShadow: active ? "0 0 10px rgba(232,25,42,0.22)" : "none",
                  }}
                >
                  {done ? <Check className="h-2.5 w-2.5 text-white" /> : n}
                </div>
                {/* Label — always visible, compact on mobile */}
                <span
                  className="font-label tracking-[0.12em] sm:tracking-[0.16em] uppercase font-black"
                  style={{
                    fontSize: "7.5px",
                    color: active ? "#E8192A" : done ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.28)",
                  }}
                >
                  {label}
                </span>
              </div>
              {/* Connector line */}
              {i < 3 && (
                <div
                  className="h-[1.5px] flex-1 mx-1.5 sm:mx-2.5 rounded-full transition-all duration-500"
                  style={{ background: step > n ? "#E8192A" : "rgba(0,0,0,0.08)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 px-4 sm:px-7 py-4 sm:py-5 overflow-y-auto">

        {/* ══ STEP 1 — Bike Model ══ */}
        {step === 1 && (
          <div>
            <p
              className="font-display text-[#111116] uppercase leading-tight mb-0.5"
              style={{ fontSize: "clamp(17px, 2.5vw, 26px)" }}
            >
              What&apos;s your Royal Enfield?
            </p>
            <p
              className="font-body font-medium mb-4"
              style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.52)" }}
            >
              Select your model so we know exactly how to help.
            </p>

            <div className="space-y-3.5">
              {MODEL_GROUPS.map(group => (
                <div key={group.label}>
                  <p
                    className="font-label tracking-[0.22em] uppercase mb-1.5 font-black"
                    style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.48)" }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {group.models.map(m => {
                      const sel = model === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setModel(m)}
                          className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-label tracking-[0.10em] uppercase cursor-pointer transition-all duration-200 font-bold"
                          style={{
                            ...(sel ? redPill : silverPill),
                            fontSize: "9px",
                            minHeight: "34px",
                          }}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {model === "Other Royal Enfield Model" && (
              <input
                className="mt-3"
                style={inputBase}
                placeholder="Enter your model name..."
                value={customModel}
                onChange={e => setCustomModel(e.target.value)}
              />
            )}
          </div>
        )}

        {/* ══ STEP 2 — Problem ══ */}
        {step === 2 && (
          <div>
            <p
              className="font-display text-[#111116] uppercase leading-tight mb-0.5"
              style={{ fontSize: "clamp(17px, 2.5vw, 26px)" }}
            >
              What&apos;s the issue?
            </p>
            <p
              className="font-body font-medium mb-3"
              style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.52)" }}
            >
              Select one or more problems you&apos;re facing.
            </p>

            {/* Problem list — bounded height so footer stays visible */}
            <div className="space-y-3 max-h-[36vh] sm:max-h-[280px] overflow-y-auto pr-0.5 scrollbar-hide">
              {PROBLEM_CATEGORIES.map(cat => (
                <div key={cat.category}>
                  <p
                    className="font-label tracking-[0.22em] uppercase mb-1.5 font-black"
                    style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.48)" }}
                  >
                    {cat.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {cat.items.map(item => {
                      const sel = problems.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleProblem(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body cursor-pointer transition-all duration-200 font-semibold"
                          style={{ ...(sel ? redPill : silverPill), fontSize: "10.5px", minHeight: "34px" }}
                        >
                          {sel && <Check className="h-2.5 w-2.5 shrink-0 text-primary" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-black/[0.06]">
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="inline-flex items-center gap-1.5 font-label tracking-[0.14em] uppercase cursor-pointer transition-colors font-bold"
                style={{ fontSize: "8.5px", color: showCustom ? "#E8192A" : "rgba(0,0,0,0.45)" }}
              >
                <span className="text-[13px] leading-none">{showCustom ? "−" : "+"}</span>
                Describe your own problem
              </button>
              {showCustom && (
                <textarea
                  rows={2}
                  className="mt-2.5"
                  style={{ ...inputBase, resize: "none" } as React.CSSProperties}
                  placeholder="Tell us what's happening with your bike..."
                  maxLength={250}
                  value={customProblem}
                  onChange={e => setCustomProblem(e.target.value)}
                />
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 3 — Contact info ══ */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <p
                className="font-display text-[#111116] uppercase leading-tight mb-0.5"
                style={{ fontSize: "clamp(17px, 2.5vw, 26px)" }}
              >
                Almost done!
              </p>
              <p
                className="font-body font-medium"
                style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.52)" }}
              >
                Let us know who you are so we can confirm your slot.
              </p>
            </div>

            {/* Name + Phone — side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="font-label tracking-[0.20em] uppercase block mb-1.5 font-black"
                  style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.58)" }}
                >
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  style={inputBase}
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="font-label tracking-[0.20em] uppercase block mb-1.5 font-black"
                  style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.58)" }}
                >
                  Phone <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 font-body pointer-events-none font-bold select-none"
                    style={{ fontSize: "13px", color: "rgba(0,0,0,0.42)" }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    style={{ ...inputBase, paddingLeft: "44px" }}
                    placeholder="10-digit number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onBlur={() => setTouchedPhone(true)}
                  />
                </div>
                {touchedPhone && phone && !phoneValid && (
                  <p className="font-label tracking-wide mt-1 text-primary font-bold" style={{ fontSize: "7.5px" }}>
                    Enter a valid 10-digit mobile number
                  </p>
                )}
              </div>
            </div>

            {/* Branch */}
            <div>
              <label
                className="font-label tracking-[0.20em] uppercase block mb-1.5 font-black"
                style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.58)" }}
              >
                Branch / Service Type <span className="text-primary">*</span>
              </label>
              <div className="space-y-2">
                {BRANCHES.map(({ id, name: bname, location, Icon }) => {
                  const sel = branch === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setBranch(id)}
                      className="w-full flex items-center gap-3 text-left px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
                      style={{ ...(sel ? redCard : silverCard), minHeight: "50px" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: sel ? "rgba(232,25,42,0.12)" : "rgba(255,255,255,1)",
                          border: sel ? "1px solid rgba(232,25,42,0.22)" : "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: sel ? "#E8192A" : "rgba(0,0,0,0.48)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-heading font-bold uppercase tracking-wide leading-tight"
                          style={{ fontSize: "11px", color: sel ? "#E8192A" : "#111116" }}
                        >
                          {bname}
                        </p>
                        <p
                          className="font-body font-medium mt-0.5"
                          style={{ fontSize: "10px", color: "rgba(0,0,0,0.48)" }}
                        >
                          {location}
                        </p>
                      </div>
                      {sel && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="font-label tracking-[0.20em] uppercase block mb-1.5 font-black"
                  style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.58)" }}
                >
                  Preferred Date{" "}
                  <span style={{ color: "rgba(0,0,0,0.32)", fontSize: "7px", textTransform: "none", letterSpacing: 0 }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="date"
                  min={today}
                  style={{ ...inputBase, colorScheme: "light" } as React.CSSProperties}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="font-label tracking-[0.20em] uppercase block mb-1.5 font-black"
                  style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.58)" }}
                >
                  Preferred Time{" "}
                  <span style={{ color: "rgba(0,0,0,0.32)", fontSize: "7px", textTransform: "none", letterSpacing: 0 }}>
                    (optional)
                  </span>
                </label>
                <select
                  style={{ ...inputBase, cursor: "pointer", colorScheme: "light" } as React.CSSProperties}
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                >
                  <option value="">Any time...</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                className="font-label tracking-[0.20em] uppercase block mb-1.5 font-black"
                style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.58)" }}
              >
                Additional Notes{" "}
                <span style={{ color: "rgba(0,0,0,0.32)", fontSize: "7px", textTransform: "none", letterSpacing: 0 }}>
                  (optional)
                </span>
              </label>
              <textarea
                rows={2}
                style={{ ...inputBase, resize: "none" } as React.CSSProperties}
                placeholder="Anything else we should know?"
                maxLength={200}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ══ STEP 4 — Review ══ */}
        {step === 4 && (
          <div>
            <p
              className="font-display text-[#111116] uppercase leading-tight mb-0.5"
              style={{ fontSize: "clamp(17px, 2.5vw, 26px)" }}
            >
              Ready to Book!
            </p>
            <p
              className="font-body font-medium mb-4"
              style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.52)" }}
            >
              Review your details before sending via WhatsApp.
            </p>

            {/* Summary card */}
            <div
              className="rounded-xl p-3.5 sm:p-4 space-y-0.5 mb-4"
              style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}
            >
              {([
                { label: "Bike",     value: model === "Other Royal Enfield Model" ? (customModel || "—") : model },
                { label: "Issue(s)", value: allProblems.join(", ") || "—" },
                { label: "Name",     value: name },
                { label: "Phone",    value: `+91 ${phone}` },
                { label: "Branch",   value: BRANCHES.find(b => b.id === branch)?.name ?? "" },
                ...(date ? [{ label: "Date", value: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) }] : []),
                ...(timeSlot ? [{ label: "Time", value: timeSlot }] : []),
                ...(notes.trim() ? [{ label: "Notes", value: notes }] : []),
              ] as { label: string; value: string }[]).map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-2.5 sm:gap-3 py-2"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <span
                    className="font-label tracking-[0.14em] uppercase shrink-0 mt-0.5 font-bold"
                    style={{ fontSize: "7.5px", color: "rgba(0,0,0,0.38)", width: "46px" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-body leading-snug font-semibold"
                    style={{ fontSize: "12px", color: "rgba(0,0,0,0.80)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* WhatsApp note */}
            <div
              className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
              style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.26)" }}
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#25D366" }} />
              <p
                className="font-body leading-relaxed font-semibold"
                style={{ fontSize: "11px", color: "rgba(0,0,0,0.58)" }}
              >
                Tap <strong style={{ color: "#25D366" }}>Send on WhatsApp</strong> — your details are pre-filled. Just hit Send and we&apos;ll confirm within minutes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer — navigation ── */}
      <div
        className="flex items-center justify-between gap-2 px-4 sm:px-7 py-3 sm:py-3.5 shrink-0"
        style={{ borderTop: "1px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.35)" }}
      >
        {/* Back */}
        <button
          onClick={goBack}
          className="flex items-center gap-1 cursor-pointer transition-colors font-bold"
          style={{ color: "rgba(0,0,0,0.40)", minHeight: "40px", padding: "0 4px" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.80)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.40)"}
        >
          {step === 1 ? <ArrowLeft className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          <span className="font-label tracking-[0.16em] uppercase" style={{ fontSize: "8.5px" }}>
            {step === 1 ? "Options" : "Back"}
          </span>
        </button>

        {/* Problem count badge */}
        {step === 2 && allProblems.length > 0 && (
          <span
            className="font-label tracking-[0.12em] uppercase px-2.5 py-1 rounded-full font-bold"
            style={{ fontSize: "8px", background: "rgba(232,25,42,0.10)", color: "#E8192A", border: "1px solid rgba(232,25,42,0.22)" }}
          >
            {allProblems.length} selected
          </span>
        )}

        {/* Next / Send */}
        {step < 4 ? (
          <button
            onClick={goNext}
            disabled={!canProceed(step)}
            className="group relative flex items-center gap-1.5 rounded-xl font-heading font-bold uppercase tracking-[0.10em] cursor-pointer transition-all duration-280 overflow-hidden disabled:opacity-35 disabled:cursor-not-allowed hover:-translate-y-0.5"
            style={{
              background: "#E8192A",
              color: "white",
              padding: "10px 18px",
              minHeight: "40px",
              fontSize: "10.5px",
              boxShadow: "0 4px 14px rgba(232,25,42,0.22)",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {step === 3 ? "Review" : "Continue"}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-1.5 rounded-xl font-heading font-bold uppercase tracking-[0.10em] cursor-pointer transition-all duration-280 hover:-translate-y-0.5 overflow-hidden"
            style={{
              background: "#25D366",
              color: "white",
              padding: "10px 18px",
              minHeight: "40px",
              fontSize: "10.5px",
              boxShadow: "0 4px 16px rgba(37,211,102,0.24)",
              textDecoration: "none",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            Send on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
