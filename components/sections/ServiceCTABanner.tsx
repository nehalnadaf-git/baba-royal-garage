import { business } from "@/lib/business";
import { Phone, MapPin, Clock } from "lucide-react";
import BookServiceButton from "@/components/shared/BookServiceButton";

interface ServiceCTABannerProps {
  /** Override the main heading — default: "Book Your Service Today" */
  heading?: string;
  /** Override the sub-text */
  subtitle?: string;
  /** Optional service name (kept for API compatibility) */
  serviceName?: string;
}

export default function ServiceCTABanner({
  heading = "Book Your Royal Enfield Service Today",
  subtitle = "Doorstep pickup anywhere in Hubli — or walk into either of our two workshops.",
}: ServiceCTABannerProps) {
  return (
    <section
      className="relative overflow-hidden py-14 sm:py-20"
      style={{
        background: "linear-gradient(135deg, #0B0D18 0%, #0F111A 50%, #12060A 100%)",
      }}
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/6 to-transparent" />

      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,25,42,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative container mx-auto px-5 sm:px-8 flex flex-col items-center text-center">
        {/* Overline */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-[1px] w-6 bg-primary/60" />
          <span className="font-label text-primary text-[10px] tracking-[0.32em] uppercase">
            Easy Booking
          </span>
          <div className="h-[1px] w-6 bg-primary/60" />
        </div>

        {/* Heading */}
        <h2
          className="font-display uppercase text-white mb-4 leading-tight"
          style={{
            fontSize: "clamp(28px, 5vw, 60px)",
            letterSpacing: "0.02em",
            lineHeight: 1.0,
          }}
        >
          {heading}
        </h2>

        {/* Sub-text */}
        <p className="font-body text-white/50 text-[14px] sm:text-[16px] leading-relaxed max-w-xl mb-8">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          {/* Book Service — opens the global booking modal (same as Navbar) */}
          <BookServiceButton
            label="Book Service"
            className="inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-primary px-8 py-4 font-heading font-bold text-[13px] uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-[0_0_32px_rgba(232,25,42,0.40)]"
          />

          <a
            href={`tel:${business.phone1}`}
            className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-heading font-bold text-[13px] uppercase tracking-[0.12em] text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:text-white"
          >
            <Phone className="h-4 w-4 shrink-0" />
            Call Now
          </a>
        </div>

        {/* Address + hours */}
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-white/30 font-label text-[10px] tracking-[0.16em] uppercase">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-primary/60" />
            Keshwapur &amp; Nehru Stadium, Hubli
          </span>
          <span className="hidden sm:block text-white/15">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-primary/60" />
            Mon – Sat · 10AM – 8PM
          </span>
        </div>
      </div>
    </section>
  );
}
