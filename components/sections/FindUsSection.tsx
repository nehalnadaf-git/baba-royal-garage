"use client";

import { business } from "@/lib/business";
import BranchSlider, { type BranchData } from "@/components/sections/BranchSlider";

const branchCards: BranchData[] = [
  {
    key: "main",
    number: "01",
    branchName: "Keshwapur Branch",
    badge: "Main Branch",
    badgeAccent: true,
    branchImage: "/Garage/Main Branch.png",
    address: "Irkal Building, Near Convent High School, Keshwapur, Hubli",
    phone: business.phone1,
    phoneLabel: business.phone1Display,
    directions: business.branches[0].mapsUrl,
    hours: business.hours.weekdays,
  },
  {
    key: "nehru",
    number: "02",
    branchName: "Nehru Stadium Branch",
    badge: "Branch 2",
    badgeAccent: false,
    branchImage: "/Garage/2022-10-10 (2).webp",
    address: "Near Nehru Stadium, Hubli",
    phone: business.phone2,
    phoneLabel: business.phone2Display,
    directions: business.branches[1].mapsUrl,
    hours: business.hours.weekdays,
  },
];

export default function FindUsSection() {
  return (
    <section className="relative py-20 sm:py-32 bg-ink overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute inset-0 bg-mesh-dark opacity-60 pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-[700px] h-[500px] bg-primary/7 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative container mx-auto px-5 sm:px-8">

        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center justify-center gap-4 mb-4">
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
              Find Us In{" "}
              <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">
                Hubli
              </span>
            </h2>
          </div>
        </div>

        {/* ── Branch Slider / Grid ── */}
        <BranchSlider branches={branchCards} />

      </div>
    </section>
  );
}
