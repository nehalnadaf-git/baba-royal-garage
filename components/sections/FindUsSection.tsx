"use client";

import { MapPin, Phone, Navigation, Clock, ArrowUpRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import { business } from "@/lib/business";

const branchCards = [
  {
    key: "main",
    branchName: "Keshwapur Branch",
    badge: "Main Branch",
    badgeAccent: true,
    branchImage: "/Garage/2022-10-10 (3).webp",
    address: "Irkal Building, Near Convent High School, Keshwapur, Hubli",
    phone: business.phone1,
    phoneLabel: business.phone1Display,
    directions: business.branches[0].mapsUrl,
    hours: business.hours.weekdays,
    tag: "Primary Location",
  },
  {
    key: "nehru",
    branchName: "Nehru Stadium Branch",
    badge: "Branch 2",
    badgeAccent: false,
    branchImage: "/Garage/2022-10-10 (2).webp",
    address: "Near Nehru Stadium, Hubli",
    phone: business.phone2,
    phoneLabel: business.phone2Display,
    directions: business.branches[1].mapsUrl,
    hours: business.hours.weekdays,
    tag: "Secondary Location",
  },
];

export default function FindUsSection() {
  return (
    <section className="relative py-20 sm:py-32 bg-ink overflow-hidden">

      {/* Deep ambient glows */}
      <div className="absolute inset-0 bg-mesh-dark opacity-60 pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-[700px] h-[500px] bg-primary/7 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative container mx-auto px-5 sm:px-8">

        {/* ── Section Header ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-6 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-[1px] w-8 bg-primary/60" />
              <span className="font-label text-primary text-[10px] lg:text-[14px] tracking-[0.4em] uppercase font-black">
                Mechanical Excellence
              </span>
              <div className="h-[1px] w-8 bg-primary/60" />
            </div>
            <h2
              className="font-display uppercase text-white leading-none"
              style={{ fontSize: "clamp(36px,7vw,92px)", lineHeight: 0.85, letterSpacing: "0.01em" }}
            >
              Find Us In <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">Hubli</span>
            </h2>
          </div>
          

        </div>

        {/* ── Branch Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {branchCards.map((branch) => (
            <article
              key={branch.key}
              className="group relative rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
              style={{
                background: "linear-gradient(145deg, #F0F2F5 0%, #D1D5D8 100%)",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.5)",
              }}
            >
              {/* Animated top highlight */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

              {/* ── Branch Image ── */}
              <div className="relative w-full overflow-hidden" style={{ height: "300px" }}>
                {/* Image overlay gradient — Light variant */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(209,213,216,0.95) 100%)" }} />
                
                <Image
                  src={branch.branchImage}
                  alt={branch.branchName}
                  fill
                  className="object-cover grayscale brightness-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-100 scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />



                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border shadow-lg"
                    style={branch.badgeAccent ? {
                      background: "rgba(232,25,42,0.95)",
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "white",
                    } : {
                      background: "rgba(255,255,255,0.8)",
                      borderColor: "rgba(0,0,0,0.05)",
                      color: "#111116",
                    }}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${branch.badgeAccent ? 'bg-white animate-pulse' : 'bg-primary'}`} />
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase font-black">
                      {branch.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Info Panel ── */}
              <div className="p-6 sm:p-10 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="font-label text-primary text-[10px] tracking-[0.35em] uppercase font-black mb-2 block">Our Hubli HQ</span>
                    <h3
                      className="font-display text-[#111116] uppercase leading-none"
                      style={{ fontSize: "clamp(28px,3.5vw,42px)", letterSpacing: "0.02em" }}
                    >
                      {branch.branchName}
                    </h3>
                  </div>
                  <a
                    href={branch.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#111116]/40 hover:text-primary transition-colors group/link"
                  >
                    <span className="font-label text-[10px] uppercase tracking-widest font-black">Open in Maps</span>
                    <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-label text-black/30 text-[10px] sm:text-[11px] uppercase tracking-widest mb-1 font-black">Location</p>
                        <p className="font-body text-[#111116] text-[14px] sm:text-[15px] leading-relaxed font-bold">{branch.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-label text-black/30 text-[10px] sm:text-[11px] uppercase tracking-widest mb-1 font-black">Hotline</p>
                        <a href={`tel:${branch.phone}`} className="font-body text-[15px] text-[#111116] hover:text-primary transition-colors font-black underline decoration-black/10 underline-offset-4">
                          {branch.phoneLabel}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/5 rounded-2xl p-6 border border-black/5 shadow-inner">
                    <div className="flex items-center gap-4 mb-4">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-label text-[#111116] text-[11px] uppercase tracking-widest font-black">Service Hours</span>
                    </div>
                    <p className="font-body text-[#111116] text-[16px] font-bold leading-tight">{branch.hours}</p>
                    <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500" />
                       <span className="font-label text-black/40 text-[10px] uppercase tracking-widest">Available Now</span>
                    </div>
                  </div>
                </div>

                {/* Premium Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={branch.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 group/btn relative flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-[#111116] bg-[#111116] text-white transition-all duration-300 hover:bg-transparent hover:text-[#111116]"
                  >
                    <Navigation className="h-4 w-4 shrink-0 transition-transform group-hover/btn:rotate-12" />
                    <span className="font-heading font-black text-[12px] uppercase tracking-[0.2em]">
                      Get Directions
                    </span>
                  </a>

                  <a
                    href={`tel:${branch.phone}`}
                    className="flex-1 group/call relative flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-white transition-all duration-300 hover:shadow-[0_15px_30px_rgba(232,25,42,0.4)] hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/call:translate-x-full transition-transform duration-700" />
                    <Phone className="h-4 w-4 text-white shrink-0" />
                    <span className="font-heading font-black text-[12px] uppercase tracking-[0.2em]">
                      Call Specialist
                    </span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
