import type { Metadata } from "next";
import type React from "react";
import { business } from "@/lib/business";
import BookingSection from "@/components/sections/BookingSection";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { Phone, MessageCircle, Clock } from "lucide-react";
import BranchSlider, { type BranchData } from "@/components/sections/BranchSlider";

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

  const branchData: BranchData[] = [
    {
      key: "main",
      number: "01",
      branchName: "Keshwapur Branch",
      badge: "Main Branch",
      badgeAccent: true,
      address:
        business.branches[0].address +
        ", " +
        business.branches[0].city +
        " " +
        business.branches[0].pincode,
      phone: business.phone1,
      phoneLabel: business.phone1Display,
      branchImage: "/images/gallery/main-branch.webp",
      directions: business.branches[0].mapsUrl,
      hours: business.hours.weekdays,
    },
    {
      key: "nehru",
      number: "02",
      branchName: "Nehru Stadium Branch",
      badge: "Branch 2",
      badgeAccent: false,
      address: "Near Nehru Stadium, Hubli 580020",
      phone: business.phone2,
      phoneLabel: business.phone2Display,
      branchImage: "/images/gallery/garage-02.webp",
      directions: business.branches[1].mapsUrl,
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
              const cardStyle: React.CSSProperties = {
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.08)",
              };

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

          {/* Branch Slider — swipeable on mobile, 2-col grid on desktop */}
          <BranchSlider branches={branchData} />
        </div>
      </section>

      {/* ── Book Your Service (contact page exclusive) ──────────────── */}
      <BookingSection variant="light" />
    </>
  );
}
