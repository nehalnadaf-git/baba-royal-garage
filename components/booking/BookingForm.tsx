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

const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.70)",
  border: "1px solid rgba(0,0,0,0.12)",
  color: "#111116",
  outline: "none",
  width: "100%",
  borderRadius: "12px",
  padding: "13px 16px",
  fontFamily: "inherit",
  fontSize: "14px",
  minHeight: "48px",
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

  const stepLabels = ["Your Bike", "Problem", "Details", "Confirm"];

  /* ── render ── */
  return (
    <div className="flex flex-col">

      {/* ── Step progress bar ───────────────────────────────────── */}
      <div
        className="flex items-center px-5 sm:px-8 py-3.5 sm:py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.35)" }}
      >
        {stepLabels.map((label, i) => {
          const n      = i + 1;
          const done   = step > n;
          const active = step === n;
          return (
            <div key={label} className="flex items-center" style={{ flex: i < 3 ? 1 : "none" }}>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Step circle — min 28px for tap-friendly */}
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-label text-[9px] sm:text-[10px] font-bold transition-all duration-300 shrink-0"
                  style={{
                    background: done ? "#E8192A" : active ? "rgba(232,25,42,0.10)" : "rgba(0,0,0,0.05)",
                    border: done ? "none" : active ? "2px solid #E8192A" : "1.5px solid rgba(0,0,0,0.12)",
                    color: done ? "white" : active ? "#E8192A" : "rgba(0,0,0,0.35)",
                    boxShadow: active ? "0 0 12px rgba(232,25,42,0.25)" : "none",
                  }}
                >
                  {done ? <Check className="h-3 w-3 text-white" /> : n}
                </div>
                {/* Label — visible on sm+ */}
                <span
                  className="font-label text-[8px] sm:text-[9px] tracking-[0.16em] uppercase font-black hidden xs:block sm:block"
                  style={{ color: active ? "#E8192A" : done ? "rgba(0,0,0,0.70)" : "rgba(0,0,0,0.28)" }}
                >
                  {label}
                </span>
              </div>
              {/* Connector line */}
              {i < 3 && (
                <div
                  className="h-[1.5px] flex-1 mx-2 sm:mx-3 rounded-full transition-all duration-500"
                  style={{ background: step > n ? "#E8192A" : "rgba(0,0,0,0.08)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div className="flex-1 px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto">

        {/* ╔══════════════════════════════╗ */}
        {/* ║  STEP 1 — Bike Model         ║ */}
        {/* ╚══════════════════════════════╝ */}
        {step === 1 && (
          <div>
            <p
              className="font-display text-[#111116] uppercase leading-tight mb-1"
              style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
            >
              What&apos;s your Royal Enfield?
            </p>
            <p className="font-body text-[13px] sm:text-[14px] mb-5 font-medium" style={{ color: "rgba(0,0,0,0.55)" }}>
              Select your model so we know exactly how to help.
            </p>

            <div className="space-y-4">
              {MODEL_GROUPS.map(group => (
                <div key={group.label}>
                  <p
                    className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase mb-2 font-black"
                    style={{ color: "rgba(0,0,0,0.50)" }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.models.map(m => {
                      const sel = model === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setModel(m)}
                          className="px-3.5 py-2 rounded-full font-label text-[9px] sm:text-[10px] tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 font-bold"
                          style={{
                            ...(sel ? redPill : silverPill),
                            minHeight: "40px",
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
                className="mt-4"
                style={inputBase}
                placeholder="Enter your model name..."
                value={customModel}
                onChange={e => setCustomModel(e.target.value)}
              />
            )}
          </div>
        )}

        {/* ╔══════════════╗ */}
        {/* ║  STEP 2      ║ */}
        {/* ╚══════════════╝ */}
        {step === 2 && (
          <div>
            <p
              className="font-display text-[#111116] uppercase leading-tight mb-1"
              style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
            >
              What&apos;s the issue?
            </p>
            <p className="font-body text-[13px] sm:text-[14px] mb-4 font-medium" style={{ color: "rgba(0,0,0,0.55)" }}>
              Select one or more problems you&apos;re facing.
            </p>

            <div className="space-y-4 max-h-[50vh] sm:max-h-[300px] overflow-y-auto pr-0.5 scrollbar-hide">
              {PROBLEM_CATEGORIES.map(cat => (
                <div key={cat.category}>
                  <p
                    className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase mb-2 font-black"
                    style={{ color: "rgba(0,0,0,0.50)" }}
                  >
                    {cat.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => {
                      const sel = problems.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleProblem(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-body text-[11.5px] sm:text-[12px] cursor-pointer transition-all duration-200 font-semibold"
                          style={{ ...(sel ? redPill : silverPill), minHeight: "40px" }}
                        >
                          {sel && <Check className="h-3 w-3 shrink-0 text-primary" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-black/[0.06]">
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="inline-flex items-center gap-1.5 font-label text-[9px] sm:text-[10px] tracking-[0.16em] uppercase cursor-pointer transition-colors font-bold"
                style={{ color: showCustom ? "#E8192A" : "rgba(0,0,0,0.45)" }}
              >
                <span className="text-[14px] leading-none">{showCustom ? "−" : "+"}</span>
                Describe your own problem
              </button>
              {showCustom && (
                <textarea
                  rows={2}
                  className="mt-3"
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

        {/* ╔══════════════════════════╗ */}
        {/* ║  STEP 3 — Contact info   ║ */}
        {/* ╚══════════════════════════╝ */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <p
                className="font-display text-[#111116] uppercase leading-tight mb-1"
                style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
              >
                Almost done!
              </p>
              <p className="font-body text-[13px] sm:text-[14px] font-medium" style={{ color: "rgba(0,0,0,0.55)" }}>
                Let us know who you are so we can confirm your slot.
              </p>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase block mb-2 font-black"
                  style={{ color: "rgba(0,0,0,0.60)" }}
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
                  className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase block mb-2 font-black"
                  style={{ color: "rgba(0,0,0,0.60)" }}
                >
                  Phone <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-[14px] pointer-events-none font-bold select-none"
                    style={{ color: "rgba(0,0,0,0.45)" }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    style={{ ...inputBase, paddingLeft: "48px" }}
                    placeholder="10-digit number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onBlur={() => setTouchedPhone(true)}
                  />
                </div>
                {touchedPhone && phone && !phoneValid && (
                  <p className="font-label text-[8px] tracking-wide mt-1.5 text-primary font-bold">
                    Enter a valid 10-digit mobile number
                  </p>
                )}
              </div>
            </div>

            {/* Branch — silver glass cards */}
            <div>
              <label
                className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase block mb-2 font-black"
                style={{ color: "rgba(0,0,0,0.60)" }}
              >
                Branch / Service Type <span className="text-primary">*</span>
              </label>
              <div className="space-y-2.5">
                {BRANCHES.map(({ id, name: bname, location, Icon }) => {
                  const sel = branch === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setBranch(id)}
                      className="w-full flex items-center gap-3.5 text-left px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{ ...(sel ? redCard : silverCard), minHeight: "56px" }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: sel ? "rgba(232,25,42,0.13)" : "rgba(255,255,255,1)",
                          border: sel ? "1px solid rgba(232,25,42,0.22)" : "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: sel ? "#E8192A" : "rgba(0,0,0,0.50)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-heading font-bold text-[12px] sm:text-[13px] uppercase tracking-wide leading-tight"
                          style={{ color: sel ? "#E8192A" : "#111116" }}
                        >
                          {bname}
                        </p>
                        <p className="font-body text-[11px] sm:text-[12px] mt-0.5 font-medium" style={{ color: "rgba(0,0,0,0.50)" }}>
                          {location}
                        </p>
                      </div>
                      {sel && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase block mb-2 font-black"
                  style={{ color: "rgba(0,0,0,0.60)" }}
                >
                  Preferred Date{" "}
                  <span style={{ color: "rgba(0,0,0,0.35)", fontSize: "7px", textTransform: "none", letterSpacing: 0 }}>
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
                  className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase block mb-2 font-black"
                  style={{ color: "rgba(0,0,0,0.60)" }}
                >
                  Preferred Time{" "}
                  <span style={{ color: "rgba(0,0,0,0.35)", fontSize: "7px", textTransform: "none", letterSpacing: 0 }}>
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
                className="font-label text-[8px] sm:text-[9px] tracking-[0.24em] uppercase block mb-2 font-black"
                style={{ color: "rgba(0,0,0,0.60)" }}
              >
                Additional Notes{" "}
                <span style={{ color: "rgba(0,0,0,0.35)", fontSize: "7px", textTransform: "none", letterSpacing: 0 }}>
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

        {/* ╔═══════════════════╗ */}
        {/* ║  STEP 4 — Review  ║ */}
        {/* ╚═══════════════════╝ */}
        {step === 4 && (
          <div>
            <p
              className="font-display text-[#111116] uppercase leading-tight mb-1"
              style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
            >
              Ready to Book!
            </p>
            <p className="font-body text-[13px] sm:text-[14px] mb-5 font-medium" style={{ color: "rgba(0,0,0,0.55)" }}>
              Review your details before sending via WhatsApp.
            </p>

            {/* Summary card */}
            <div
              className="rounded-2xl p-4 sm:p-5 space-y-1 mb-5"
              style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}
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
                <div key={label} className="flex items-start gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <span
                    className="font-label text-[8px] sm:text-[9px] tracking-[0.16em] uppercase shrink-0 mt-0.5 font-bold"
                    style={{ color: "rgba(0,0,0,0.40)", width: "52px" }}
                  >
                    {label}
                  </span>
                  <span className="font-body text-[13px] sm:text-[14px] leading-snug font-semibold" style={{ color: "rgba(0,0,0,0.80)" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* WhatsApp note */}
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3.5"
              style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.28)" }}
            >
              <MessageCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#25D366" }} />
              <p className="font-body text-[12px] sm:text-[13px] leading-relaxed font-semibold" style={{ color: "rgba(0,0,0,0.60)" }}>
                Tap <strong style={{ color: "#25D366" }}>Send on WhatsApp</strong> — your details are pre-filled. Just tap Send and we&apos;ll confirm within minutes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer — navigation ──────────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-3 px-5 sm:px-8 py-4 shrink-0"
        style={{ borderTop: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.35)" }}
      >
        {/* Back */}
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 cursor-pointer transition-colors font-bold min-h-[44px] px-1"
          style={{ color: "rgba(0,0,0,0.40)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.80)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.40)"}
        >
          {step === 1 ? <ArrowLeft className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="font-label text-[9px] sm:text-[10px] tracking-[0.18em] uppercase">
            {step === 1 ? "Options" : "Back"}
          </span>
        </button>

        {/* Problem count badge */}
        {step === 2 && allProblems.length > 0 && (
          <span
            className="font-label text-[8px] sm:text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full font-bold"
            style={{ background: "rgba(232,25,42,0.10)", color: "#E8192A", border: "1px solid rgba(232,25,42,0.25)" }}
          >
            {allProblems.length} selected
          </span>
        )}

        {/* Next / Send */}
        {step < 4 ? (
          <button
            onClick={goNext}
            disabled={!canProceed(step)}
            className="group relative flex items-center gap-2 rounded-xl font-heading font-bold uppercase tracking-[0.10em] cursor-pointer transition-all duration-280 overflow-hidden disabled:opacity-35 disabled:cursor-not-allowed hover:-translate-y-0.5"
            style={{
              background: "#E8192A",
              color: "white",
              padding: "12px 22px",
              minHeight: "46px",
              fontSize: "11px",
              boxShadow: "0 4px 16px rgba(232,25,42,0.22)",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {step === 3 ? "Review Booking" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 rounded-xl font-heading font-bold uppercase tracking-[0.10em] cursor-pointer transition-all duration-280 hover:-translate-y-0.5 overflow-hidden"
            style={{
              background: "#25D366",
              color: "white",
              padding: "12px 22px",
              minHeight: "46px",
              fontSize: "11px",
              boxShadow: "0 4px 20px rgba(37,211,102,0.24)",
              textDecoration: "none",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <MessageCircle className="h-4 w-4 shrink-0" />
            Send on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
