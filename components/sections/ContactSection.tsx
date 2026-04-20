import { MapPin, Phone, MessageCircle, Clock, Navigation } from "lucide-react";
import { business } from "@/lib/business";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-14 sm:py-28 bg-ink overflow-hidden">
      {/* Atmospheric mesh */}
      <div className="absolute inset-0 bg-mesh-dark opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-20 reveal">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-[1px] w-8 bg-primary/50" />
            <span className="font-label text-primary text-[10px] lg:text-[12px] tracking-[0.3em] uppercase">Our Locations</span>
            <div className="h-[1px] w-8 bg-primary/50" />
          </div>
          <h2 className="font-display uppercase text-white mb-4"
            style={{ fontSize: "clamp(40px,7vw,88px)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            Find Us
          </h2>
          <p className="font-body text-white/45 text-sm sm:text-base lg:text-[18px] max-w-sm lg:max-w-2xl mx-auto mt-5 lg:mt-6 leading-relaxed lg:leading-[1.9]">
            Visit us at either of our 2 outlets across Hubballi
          </p>
        </div>

        {/* Branches grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 stagger-children">
          {business.branches.map((branch) => (
            <div key={branch.id}
              className="group relative rounded-3xl overflow-hidden bg-white/[0.03] shadow-[0_4px_24px_rgba(0,0,0,0.14)] border border-white/10 hover:border-primary/40 hover:shadow-[0_12px_48px_rgba(254,36,20,0.16)] transition-all duration-400"
            >
              {/* Map embed */}
              <div className="relative h-40 sm:h-52 w-full overflow-hidden">
                <iframe
                  src={branch.mapEmbed}
                  className="w-full h-full border-0 grayscale contrast-110 opacity-70 group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-700"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map - ${branch.name}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,14,20,0.75)] via-transparent to-transparent pointer-events-none" />
                {/* Branch pill */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[rgba(12,14,20,0.72)] backdrop-blur-sm rounded-full px-3.5 py-1.5 font-label text-white text-[9px] lg:text-[11px] tracking-[0.16em] uppercase border border-white/15 shadow-sm">
                    {branch.name}
                  </span>
                </div>
                {/* Hover top shimmer */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Details */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/12 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-body text-white/85 text-sm lg:text-[16px] leading-relaxed pt-0.5">
                    {branch.address}, <span className="text-white/45">{branch.city} {branch.pincode}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/12 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <a href={`tel:${business.phone1}`}
                    className="font-body text-sm lg:text-[16px] text-white/85 hover:text-primary transition-colors duration-200 font-medium cursor-pointer">
                    {business.phone1Display}
                  </a>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/12 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm lg:text-[16px] text-white/85 hover:text-primary transition-colors duration-200 font-medium cursor-pointer">
                    WhatsApp · {business.phone1Display}
                  </a>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/12 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-white/85 text-sm lg:text-[16px]">{business.hours.weekdays}</p>
                    <p className="font-label text-white/40 text-[9px] tracking-wider mt-0.5">{business.hours.sunday}</p>
                  </div>
                </div>

                {/* Directions CTA */}
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-dark text-white w-full py-3.5 rounded-xl font-heading font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_24px_rgba(254,36,20,0.25)] mt-1 overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
