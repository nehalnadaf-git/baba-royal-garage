import { CheckCircle, XCircle, Wrench, Shield, Zap, Award, Truck, Star } from "lucide-react";

const comparisonCards = [
  {
    icon: Wrench,
    factor: "RE Model Knowledge",
    specialist: "Dedicated RE diagnostics and model-specific tuning for every variant.",
    general: "Broad multi-brand knowledge, limited RE focus.",
  },
  {
    icon: Shield,
    factor: "Parts Used",
    specialist: "100% genuine Royal Enfield parts — correct fitment, warranty-safe.",
    general: "Mixed aftermarket parts depending on local availability.",
  },
  {
    icon: Zap,
    factor: "Diagnosis Accuracy",
    specialist: "Root-cause diagnostics using RE-specific specialist workflow.",
    general: "Trial-and-error fixes that drive repeat, costly visits.",
  },
  {
    icon: Award,
    factor: "Experience",
    specialist: "6+ years · 1000+ Royal Enfield motorcycles expertly serviced.",
    general: "General workshop exposure across many different bike types.",
  },
  {
    icon: Truck,
    factor: "Convenience",
    specialist: "Free doorstep pickup and doorstep drop across all of Hubli.",
    general: "Ride or push the bike to the garage yourself.",
  },
  {
    icon: Star,
    factor: "Trust & Transparency",
    specialist: "Real-time WhatsApp updates, honest pricing, 5.0 ★ Google rating.",
    general: "Variable quality with limited specialist commitment.",
  },
];

export default function WhySpecialistSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 bg-ink overflow-hidden">
      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 bg-mesh-dark opacity-50 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-8 lg:px-12">

        {/* ── Section Header ────────────────────────────────────── */}
        <div className="mb-12 sm:mb-16 lg:mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[1px] w-8 bg-primary/70" />
            <span className="font-label text-primary text-[11px] sm:text-[13px] tracking-[0.32em] uppercase">
              The Specialist Difference
            </span>
            <div className="h-[1px] w-8 bg-primary/70" />
          </div>

          <h2
            className="font-display text-white uppercase"
            style={{ fontSize: "clamp(38px, 6.5vw, 88px)", lineHeight: 0.92, letterSpacing: "0.02em" }}
          >
            Why a{" "}
            <span className="text-primary">Specialist</span>
            <br />
            Beats a General Mechanic
          </h2>

          <p className="font-body text-white/60 mt-6 mx-auto leading-relaxed"
            style={{ fontSize: "clamp(15px, 1.6vw, 19px)", maxWidth: "600px" }}>
            A specialist garage cuts guesswork, reduces repeat visits, and keeps your RE exactly as it was engineered.
          </p>
        </div>

        {/* ── DESKTOP TABLE (md+) ──────────────────────────────── */}
        <div className="hidden md:block w-full max-w-6xl mx-auto">
          <div className="relative">
            {/* Outer glow border */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/30 via-transparent to-black/20 rounded-[2.4rem] pointer-events-none" />

            <div
              className="relative overflow-hidden rounded-[2.2rem] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.2)]"
              style={{ background: "linear-gradient(145deg, #E4E6EA 0%, #D2D6DA 50%, #BEC3C9 100%)" }}
            >
              {/* ── Table Header Row ── */}
              <div className="grid grid-cols-[280px_1fr_1fr] lg:grid-cols-[320px_1fr_1fr] xl:grid-cols-[360px_1fr_1fr] items-stretch border-b border-[#A8ADB3]/40">

                {/* Metric Label */}
                <div className="px-8 py-8 lg:px-10 lg:py-10 bg-black/5 flex items-center border-r border-[#A8ADB3]/40">
                  <div className="flex flex-col gap-2">
                    <span className="font-label text-[#111116]/65 text-[12px] lg:text-[14px] tracking-[0.4em] uppercase font-bold">
                      Metric Performance
                    </span>
                    <div className="h-0.5 w-14 bg-primary/60 rounded-full" />
                  </div>
                </div>

                {/* Specialist Header */}
                <div className="px-8 py-8 lg:px-10 lg:py-10 flex items-center justify-start border-r border-[#A8ADB3]/40 relative overflow-hidden bg-white/15">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent pointer-events-none" />
                  <div className="relative flex items-center gap-4 lg:gap-5">
                    <div className="relative h-14 w-14 lg:h-16 lg:w-16 rounded-2xl bg-primary flex items-center justify-center border border-white/30 shadow-[0_12px_30px_rgba(232,25,42,0.35)] shrink-0">
                      <CheckCircle className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label text-primary text-[12px] lg:text-[14px] tracking-[0.25em] uppercase font-black">
                        Official Specialist
                      </span>
                      <h3 className="font-display text-[#111116] text-xl lg:text-2xl xl:text-3xl uppercase tracking-wider leading-none mt-1">
                        Baba Royal Garage
                      </h3>
                    </div>
                  </div>
                </div>

                {/* General Mechanic Header */}
                <div className="px-8 py-8 lg:px-10 lg:py-10 flex items-center justify-start bg-black/20">
                  <div className="flex items-center gap-4 lg:gap-5">
                    <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10 shrink-0">
                      <XCircle className="h-6 w-6 lg:h-7 lg:w-7 text-white/60" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label text-white/50 text-[12px] lg:text-[14px] tracking-[0.2em] uppercase font-bold">
                        The Alternative
                      </span>
                      <span className="font-display text-white/90 text-xl lg:text-2xl xl:text-3xl uppercase tracking-widest leading-none mt-1">
                        General Mechanic
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Table Rows ── */}
              <div className="divide-y divide-[#A8ADB3]/25">
                {comparisonCards.map(({ icon: Icon, factor, specialist, general }) => (
                  <div
                    key={factor}
                    className="group/row grid grid-cols-[280px_1fr_1fr] lg:grid-cols-[320px_1fr_1fr] xl:grid-cols-[360px_1fr_1fr] transition-all duration-500 hover:bg-white/15"
                  >
                    {/* Factor Column */}
                    <div className="px-8 py-7 lg:px-10 lg:py-9 flex flex-row items-center gap-5 lg:gap-6 border-r border-[#A8ADB3]/25 bg-black/4">
                      <div className="flex w-13 h-13 lg:w-14 lg:h-14 shrink-0 rounded-xl lg:rounded-2xl bg-gradient-to-br from-white/50 to-[#D2D6DA] border border-white/60 items-center justify-center shadow-sm group-hover/row:border-primary/30 group-hover/row:shadow-[0_4px_12px_rgba(232,25,42,0.15)] transition-all duration-500">
                        <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-[#111116]/60 group-hover/row:text-primary transition-all duration-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label text-[#111116]/50 text-[11px] lg:text-[12px] tracking-[0.3em] uppercase mb-1">Standard</span>
                        <h4 className="font-display text-[#111116] text-[17px] lg:text-[19px] xl:text-[22px] uppercase tracking-widest leading-tight">
                          {factor}
                        </h4>
                      </div>
                    </div>

                    {/* Specialist Column */}
                    <div className="px-8 py-7 lg:px-10 lg:py-10 border-r border-[#A8ADB3]/25 relative overflow-hidden bg-white/35">
                      <div className="absolute top-0 left-0 bottom-0 w-[5px] bg-primary group-hover/row:w-[7px] transition-all duration-500" />
                      <div className="flex items-start gap-4 lg:gap-6 pl-2">
                        <div className="flex h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-white/70 border border-primary/30 items-center justify-center shrink-0 mt-0.5 shadow-sm transition-transform duration-500 group-hover/row:scale-110">
                          <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                        </div>
                        <p className="font-body text-[#050505] text-[16px] lg:text-[18px] xl:text-[20px] leading-relaxed font-semibold">
                          {specialist}
                        </p>
                      </div>
                    </div>

                    {/* General Column */}
                    <div className="px-8 py-7 lg:px-10 lg:py-10 bg-black/25 flex items-center">
                      <div className="flex items-start gap-4 lg:gap-6">
                        <XCircle className="h-8 w-8 lg:h-9 lg:w-9 text-white/40 shrink-0 mt-0.5" />
                        <p className="font-body text-white/75 text-[16px] lg:text-[18px] xl:text-[20px] leading-relaxed font-normal">
                          {general}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE CARDS (< md) ──────────────────────────────── */}
        <div className="md:hidden space-y-4">

          {/* Mobile Header Badges */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-primary/30 shadow-lg"
              style={{ background: "linear-gradient(135deg, #E8192A 0%, #B51220 100%)" }}
            >
              <CheckCircle className="h-4 w-4 text-white" />
              <span className="font-label text-white text-[11px] tracking-[0.18em] uppercase font-black">
                Baba Royal
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#D1D5D8] border-2 border-[#A0A4A8] flex items-center justify-center shadow-lg shrink-0">
              <span className="font-display text-[#111116] text-[9px] font-black italic">VS</span>
            </div>

            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/10 border border-white/15">
              <XCircle className="h-4 w-4 text-white/60" />
              <span className="font-label text-white/80 text-[11px] tracking-[0.18em] uppercase font-semibold">
                General
              </span>
            </div>
          </div>

          {/* Mobile Comparison Cards */}
          {comparisonCards.map(({ icon: Icon, factor, specialist, general }) => (
            <div
              key={factor}
              className="relative overflow-hidden rounded-2xl border border-white/8"
              style={{ background: "linear-gradient(145deg, #E4E6EA 0%, #CDD1D6 100%)" }}
            >
              {/* Factor Header */}
              <div className="flex items-center gap-4 px-5 py-4 border-b border-[#A8ADB3]/30 bg-black/6">
                <div className="flex w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-white/60 to-[#D2D6DA] border border-white/70 items-center justify-center shadow-sm">
                  <Icon className="h-5 w-5 text-[#111116]/65" />
                </div>
                <h4 className="font-display text-[#111116] text-[16px] uppercase tracking-wider leading-tight font-bold">
                  {factor}
                </h4>
              </div>

              {/* Two Columns */}
              <div className="grid grid-cols-2 divide-x divide-[#A8ADB3]/30">
                {/* Specialist Side */}
                <div className="px-5 py-6 bg-white/25 relative">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span className="font-label text-primary text-[11px] tracking-[0.2em] uppercase font-black">
                      Specialist
                    </span>
                  </div>
                  <p className="font-body text-[#0a0a0a] text-[14px] sm:text-[15px] leading-[1.6] font-bold">
                    {specialist}
                  </p>
                </div>

                {/* General Side */}
                <div className="px-5 py-6 bg-black/15">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-4.5 w-4.5 text-white/50 shrink-0" />
                    <span className="font-label text-white/60 text-[11px] tracking-[0.2em] uppercase font-semibold">
                      General
                    </span>
                  </div>
                  <p className="font-body text-white/70 text-[14px] sm:text-[15px] leading-[1.6] font-medium">
                    {general}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            ── PREMIUM CINEMATIC CTA BANNER ──────────────────────
            ══════════════════════════════════════════════════════════ */}
        <div className="mt-16 sm:mt-24 max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">

            {/* ── Background layers ── */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #110810 45%, #0d0509 100%)" }}
            />
            {/* Red lava glow — left */}
            <div
              className="absolute -left-24 top-1/2 -translate-y-1/2 w-[50vw] max-w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(232,25,42,0.24) 0%, rgba(180,10,25,0.12) 40%, transparent 72%)",
                filter: "blur(52px)",
              }}
            />
            {/* Subtle cool shimmer — top-right */}
            <div
              className="absolute -right-16 -top-16 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            {/* Hairlines */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {/* Border ring */}
            <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] border border-white/[0.07] pointer-events-none" />
            {/* Subtle diagonal stripes */}
            <div
              className="absolute inset-0 opacity-[0.022] pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 28px)",
              }}
            />

            {/* ── Content ── */}
            <div className="relative z-10 px-5 py-9 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">

                {/* LEFT: Text */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

                  {/* Overline */}
                  <div className="inline-flex items-center gap-3 mb-4 sm:mb-5">
                    <span className="h-[1px] w-6 sm:w-8 bg-primary" />
                    <span className="font-label text-primary text-[10px] sm:text-[11px] tracking-[0.32em] uppercase font-black">
                      Experience the Thump
                    </span>
                    <span className="h-[1px] w-6 sm:w-8 bg-primary" />
                  </div>

                  {/* Heading */}
                  <h2
                    className="font-display text-white uppercase leading-[0.92] mb-4 sm:mb-6"
                    style={{ fontSize: "clamp(30px, 5.5vw, 72px)", letterSpacing: "0.01em" }}
                  >
                    Ready for{" "}
                    <span
                      className="text-primary relative inline-block"
                      style={{ textShadow: "0 0 40px rgba(232,25,42,0.5)" }}
                    >
                      Specialist
                      <span className="absolute inset-x-0 -bottom-1 h-[3px] bg-gradient-to-r from-primary via-primary/70 to-transparent rounded-full" />
                    </span>{" "}
                    Care?
                  </h2>

                  {/* Body */}
                  <p className="font-body text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-[320px] sm:max-w-sm lg:max-w-md mx-auto lg:mx-0">
                    Your Royal Enfield deserves more than just a general checkup.
                    Visit Hubli&apos;s premier specialist garage and feel the difference.
                  </p>
                </div>

                {/* RIGHT: CTAs — full-width on mobile, auto-width on desktop */}
                <div className="flex flex-col items-stretch gap-3 w-full lg:w-auto lg:shrink-0 lg:min-w-[280px]">

                  {/* Primary — WhatsApp */}
                  <a
                    href="https://wa.me/919742291701"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/wa relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl px-6 py-4 sm:py-5 font-heading font-black text-[13px] sm:text-[14px] uppercase tracking-[0.15em] text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(232,25,42,0.50)]"
                    style={{
                      background: "linear-gradient(135deg, #E8192A 0%, #C41020 60%, #A00D1A 100%)",
                      boxShadow: "0 0 0 1px rgba(232,25,42,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/wa:translate-x-full transition-transform duration-700 ease-out" />
                    <svg className="h-5 w-5 shrink-0 relative z-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="relative z-10">Book with the Specialist</span>
                  </a>

                  {/* Secondary — Call */}
                  <a
                    href="tel:+919742291701"
                    className="group/call inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-4 font-heading font-bold text-[12px] sm:text-[13px] uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:text-white hover:bg-white/10"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 9.84a19.72 19.72 0 01-3.07-8.67A2 2 0 012.77 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 10.9a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    Call +91 97422 91701
                  </a>

                  {/* Micro info strip — single line, centered */}
                  <p className="text-white/30 text-[10px] font-label tracking-[0.14em] uppercase text-center leading-relaxed pt-1">
                    Mon–Sat &nbsp;·&nbsp; 10 AM – 8 PM<br className="sm:hidden" />
                    <span className="hidden sm:inline"> &nbsp;·&nbsp; </span>
                    Keshwapur &amp; Nehru Stadium, Hubli
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
