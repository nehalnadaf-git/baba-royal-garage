import type { Metadata } from "next";
import { business } from "@/lib/business";
import BookingSection from "@/components/sections/BookingSection";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { Phone, MessageCircle, Clock, MapPin, Navigation, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Baba Royal Garage Hubli | Royal Enfield Service",
  description:
    "Contact Baba Royal Garage in Hubli for Royal Enfield servicing. Call, WhatsApp, or visit our Keshwapur and Nehru Stadium branches.",
  path: "/contact",
  keywords: ["Contact Baba Royal Garage", "Royal Enfield service Hubli", "RE mechanic near me Hubli"],
});

export default function ContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" },
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: business.name,
    url: business.url,
    telephone: business.phone1,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.branches[0].address,
      addressLocality: business.branches[0].city,
      addressRegion: "Karnataka",
      postalCode: business.branches[0].pincode,
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.phone1,
      contactType: "customer service",
      availableLanguage: ["English", "Kannada", "Hindi", "Urdu"],
    },
  };

  const quickContacts = [
    {
      icon: Phone,
      label: "Call Babajan",
      value: "Call Now",
      sub: "Main Specialist",
      href: `tel:${business.phone1}`,
      accent: true,
    },
    {
      icon: Phone,
      label: "Call Raju",
      value: "Call Now",
      sub: "Service Manager",
      href: `tel:${business.phone2}`,
      accent: false,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat Now",
      sub: "Quick response",
      href: business.whatsappUrl,
      accent: true,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon – Sat",
      sub: "10:00 AM – 8:00 PM",
      href: null,
      accent: false,
    },
  ];

  const branchData = [
    {
      id: "main",
      number: "01",
      name: "Keshwapur Branch",
      badge: "Main Branch",
      badgeAccent: true,
      address:
        business.branches[0].address +
        ", " +
        business.branches[0].city +
        " " +
        business.branches[0].pincode,
      phone: business.phone1,
      image: "/Garage/2022-10-10 (3).webp",
      mapsUrl: business.branches[0].mapsUrl,
      hours: business.hours.weekdays,
    },
    {
      id: "nehru",
      number: "02",
      name: "Nehru Stadium Branch",
      badge: "Branch 2",
      badgeAccent: false,
      address: "Near Nehru Stadium, Hubli 580020",
      phone: business.phone2,
      image: "/Garage/2022-10-10 (2).webp",
      mapsUrl: business.branches[1].mapsUrl,
      hours: business.hours.weekdays,
    },
  ];

  return (
    <>
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-90 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-primary/6 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="relative container mx-auto px-5 sm:px-8">
          {/* Overline */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-7 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase font-black">
              Get In Touch
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-display text-white uppercase mb-5"
            style={{ fontSize: "clamp(48px, 8vw, 104px)", lineHeight: 0.88, letterSpacing: "0.015em" }}
          >
            Contact Us
          </h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mb-6" />
          <p className="font-body text-white/55 text-[15px] sm:text-[17px] lg:text-[18px] max-w-2xl leading-relaxed mb-10 lg:mb-14">
            Reach Baba Royal Garage for any Royal Enfield service, repair, or query. 2 branches across Hubli. Open Monday to Saturday.
          </p>

          {/* Quick contact grid — 2 col mobile, 4 col desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickContacts.map(({ icon: Icon, label, value, sub, href, accent }) => {
              const cardClass =
                "flex flex-col p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,25,42,0.12)]";
              const cardStyle = {
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.08)",
              } as React.CSSProperties;

              const inner = (
                <>
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 mb-3 sm:mb-4 ${
                      accent ? "bg-primary/20" : "bg-white/8"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-white/60"}`} />
                  </div>
                  <p className="font-label text-white/35 text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.18em] mb-1.5 font-black">
                    {label}
                  </p>
                  <p className="font-heading font-bold text-white text-[13px] sm:text-[14px] lg:text-[15px] uppercase tracking-wide leading-tight">
                    {value}
                  </p>
                  <p className="font-body text-white/40 text-[11px] sm:text-[12px] mt-1 leading-snug">{sub}</p>
                </>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("https") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={cardClass}
                  style={cardStyle}
                >
                  {inner}
                </a>
              ) : (
                <div key={label} className={cardClass} style={cardStyle}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Find Us — Branch Cards ────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 lg:py-32 bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-55 pointer-events-none" />
        <div className="absolute -top-40 left-1/4 w-[700px] h-[500px] bg-primary/7 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        {/* Top visual separator from hero */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }}
        />

        <div className="relative container mx-auto px-5 sm:px-8">

          {/* Section header */}
          <div className="flex flex-col items-center text-center gap-7 mb-16 sm:mb-20">
            <div>
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-[1px] w-8 bg-primary/60" />
                <span className="font-label text-primary text-[10px] lg:text-[14px] tracking-[0.4em] uppercase font-black">
                  Our Locations
                </span>
                <div className="h-[1px] w-8 bg-primary/60" />
              </div>
              <h2
                className="font-display uppercase text-white leading-none"
                style={{ fontSize: "clamp(36px, 7vw, 92px)", lineHeight: 0.85, letterSpacing: "0.01em" }}
              >
                Find Us In{" "}
                <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">
                  Hubli
                </span>
              </h2>
            </div>


          </div>

          {/* Branch cards — 1 col mobile, 2 col from lg */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {branchData.map((branch) => (
              <article
                key={branch.id}
                className="group relative rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
                style={{
                  background: "linear-gradient(145deg, #F0F2F5 0%, #D1D5D8 100%)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.5)",
                }}
              >
                {/* Animated top highlight on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

                {/* Image — responsive height */}
                <div className="relative w-full overflow-hidden" style={{ height: "clamp(200px, 22vw, 300px)" }}>
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255,255,255,0) 55%, rgba(209,213,216,0.95) 100%)",
                    }}
                  />
                  <Image
                    src={branch.image}
                    alt={branch.name}
                    fill
                    className="object-cover grayscale brightness-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-100 scale-[1.05]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />

                  {/* Branch number watermark */}
                  <div className="absolute top-4 left-5 z-20">
                    <span
                      className="font-display text-primary/10 select-none leading-none"
                      style={{ fontSize: "clamp(48px, 7vw, 80px)" }}
                    >
                      {branch.number}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-5 right-5 z-20">
                    <div
                      className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border shadow-lg"
                      style={
                        branch.badgeAccent
                          ? { background: "rgba(232,25,42,0.95)", borderColor: "rgba(255,255,255,0.3)", color: "white" }
                          : { background: "rgba(255,255,255,0.85)", borderColor: "rgba(0,0,0,0.06)", color: "#111116" }
                      }
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${branch.badgeAccent ? "bg-white animate-pulse" : "bg-primary"}`}
                      />
                      <span className="font-label text-[10px] tracking-[0.2em] uppercase font-black">
                        {branch.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info panel */}
                <div className="p-6 sm:p-8 lg:p-10 relative">
                  {/* Branch name row */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7 lg:mb-8">
                    <div>
                      <span className="font-label text-primary text-[10px] tracking-[0.35em] uppercase font-black mb-2 block">
                        Baba Royal Garage
                      </span>
                      <h3
                        className="font-display text-[#111116] uppercase leading-none"
                        style={{ fontSize: "clamp(22px, 2.8vw, 36px)", letterSpacing: "0.02em" }}
                      >
                        {branch.name}
                      </h3>
                    </div>
                    <a
                      href={branch.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#111116]/40 hover:text-primary transition-colors group/link shrink-0"
                    >
                      <span className="font-label text-[10px] uppercase tracking-widest font-black">
                        Open in Maps
                      </span>
                      <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* Details row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-7 mb-7 lg:mb-8">
                    {/* Left — Address + Call */}
                    <div className="space-y-5">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                          <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-label text-black/30 text-[9px] sm:text-[10px] uppercase tracking-widest mb-1 font-black">
                            Location
                          </p>
                          <p className="font-body text-[#111116] text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed font-bold">
                            {branch.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                          <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-label text-black/30 text-[9px] sm:text-[10px] uppercase tracking-widest mb-1 font-black">
                            Hotline
                          </p>
                          <a
                            href={`tel:${branch.phone}`}
                            className="font-heading font-black text-[14px] lg:text-[15px] text-[#111116] hover:text-primary transition-colors"
                          >
                            Call Now
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right — Hours box */}
                    <div className="bg-black/5 rounded-2xl p-5 lg:p-6 border border-black/5 shadow-inner">
                      <div className="flex items-center gap-3 mb-3 lg:mb-4">
                        <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                        <span className="font-label text-[#111116] text-[10px] lg:text-[11px] uppercase tracking-widest font-black">
                          Service Hours
                        </span>
                      </div>
                      <p className="font-body text-[#111116] text-[15px] lg:text-[16px] font-bold leading-snug">
                        {branch.hours}
                      </p>
                      <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-label text-black/40 text-[10px] uppercase tracking-widest">
                          Open Mon–Sat
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={branch.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group/btn relative flex items-center justify-center gap-2.5 py-3.5 lg:py-4 rounded-2xl border-2 border-[#111116] bg-[#111116] text-white font-heading font-black text-[12px] uppercase tracking-[0.18em] transition-all duration-300 hover:bg-transparent hover:text-[#111116]"
                    >
                      <Navigation className="h-4 w-4 shrink-0 transition-transform group-hover/btn:rotate-12" />
                      Get Directions
                    </a>
                    <a
                      href={`tel:${branch.phone}`}
                      className="flex-1 group/call relative flex items-center justify-center gap-2.5 py-3.5 lg:py-4 rounded-2xl bg-primary text-white font-heading font-black text-[12px] uppercase tracking-[0.18em] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(232,25,42,0.40)] hover:-translate-y-0.5 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/call:translate-x-full transition-transform duration-700" />
                      <Phone className="h-4 w-4 shrink-0" />
                      Call Now
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Book Your Service (contact page exclusive) ──────────────── */}
      <BookingSection variant="light" />
    </>
  );
}
