"use client";

import { Shield, Clock, Truck, Wrench, Award, Star } from "lucide-react";

const stats = [
  { icon: Award,  value: "6+",   unit: "Years",   label: "Royal Enfield Expertise" },
  { icon: Wrench, value: "1000+", unit: "Repairs",  label: "Serviced & Repaired" },
  { icon: Star,   value: "5.0",  unit: "★",        label: "Google Rating" },
  { icon: Shield, value: "100%", unit: "Genuine",  label: "RE Spare Parts" },
  { icon: Truck,  value: "All",  unit: "Hubli",    label: "Doorstep Pickup Zone" },
  { icon: Clock,  value: "6",    unit: "Days",     label: "Mon – Sat · 10AM–8PM" },
];

export default function TrustBar() {
  return (
    <section className="relative bg-[hsl(220,14%,5%)] overflow-hidden">
      {/* Top crimson hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      {/* Deep ambient glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Mobile marquee */}
      <div className="lg:hidden overflow-hidden py-5 border-b border-white/5">
        <div className="marquee-track">
          {[...stats, ...stats].map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-8 shrink-0">
              <s.icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-white text-xl leading-none" style={{ letterSpacing: "0.04em" }}>
                  {s.value}
                </span>
                <span className="font-label text-primary text-[8px] lg:text-[11px] uppercase tracking-wider">{s.unit}</span>
              </div>
              <span className="font-body text-white/40 text-xs whitespace-nowrap">{s.label}</span>
              <span className="text-primary/30 text-xs ml-2">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-6">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="group relative flex flex-col items-center justify-center py-9 px-4 cursor-default overflow-hidden border-r border-white/[0.04] last:border-r-0"
          >
            {/* Hover fill */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500" />
            {/* Hover top accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-500 ease-out" />

            <s.icon className="h-4 w-4 text-primary/60 mb-3.5 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            <div className="flex items-baseline gap-1 mb-1.5">
              <span
                className="font-display text-white group-hover:text-white transition-colors"
                style={{ fontSize: "clamp(26px,2.5vw,38px)", lineHeight: 1, letterSpacing: "0.03em" }}
              >
                {s.value}
              </span>
              <span className="font-label text-primary text-[9px] uppercase tracking-widest">{s.unit}</span>
            </div>
            <p className="font-label text-white/30 text-[8px] tracking-[0.14em] text-center group-hover:text-white/50 transition-colors">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.04]" />
    </section>
  );
}
