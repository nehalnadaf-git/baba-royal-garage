import Link from "next/link";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { business } from "@/lib/business";
import { services } from "@/lib/services";
import { locations } from "@/lib/locations";

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery",  href: "/gallery" },
  { label: "About",    href: "/about" },
  { label: "Reviews",  href: "/reviews" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
  { label: "FAQ",      href: "/faq" },
];

export default function Footer() {
  const year  = new Date().getFullYear();
  const topServices = services.slice(0, 6);
  const allLocations = locations;

  return (
    <footer style={{ background: "hsl(222,20%,5%)" }} className="relative overflow-hidden">

      {/* Top crimson hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/65 to-transparent" />
      {/* Subtle ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div className="relative container mx-auto px-5 sm:px-8 pt-14 pb-10 sm:pt-16 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">

          {/* ── Brand column ─────────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Wordmark */}
            <Link href="/" className="inline-block mb-3 group">
              <p
                className="font-display text-white uppercase leading-none"
                style={{ fontSize: "clamp(22px,3vw,28px)", letterSpacing: "0.04em" }}
              >
                Baba{" "}
                <span className="text-primary group-hover:text-primary-light transition-colors duration-300">
                  Royal
                </span>{" "}
                Garage
              </p>
              <p className="font-label text-white/40 text-[8px] lg:text-[11px] tracking-[0.3em] uppercase mt-1 lg:mt-2">
                Royal Enfield Specialist · Hubli
              </p>
            </Link>

            <p className="font-body text-white/55 text-[13px] lg:text-[15px] leading-[1.75] lg:leading-[1.9] mb-6 lg:mb-8 max-w-[260px] lg:max-w-xs">
              {business.shortDescription}
            </p>

            {/* Contact details */}
            <div className="space-y-3">
              {[
                { phone: business.phone1, label: "Call Now" },
                { phone: business.phone2, label: "Call Branch 2" },
              ].map(({ phone, label }) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="flex items-center gap-2.5 text-white/65 hover:text-primary transition-colors duration-200 group cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-body text-[13px] lg:text-[15px]">{label}</span>
                </a>
              ))}
              <a
                href={business.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/65 hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-body text-[13px] lg:text-[15px]">WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* ── Navigate ─────────────────────────────────────────── */}
          <div>
            <h3 className="font-label text-white text-[9px] lg:text-[11px] tracking-[0.28em] uppercase mb-5 pb-2 border-b border-white/10">
              Navigate
            </h3>
            <ul className="space-y-2.5 lg:space-y-3.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-[13px] lg:text-[15px] text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ─────────────────────────────────────────── */}
          <div>
            <h3 className="font-label text-white text-[9px] lg:text-[11px] tracking-[0.28em] uppercase mb-5 pb-2 border-b border-white/10">
              Our Services
            </h3>
            <ul className="space-y-2.5 lg:space-y-3.5">
              {topServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="font-body text-[13px] lg:text-[15px] text-white/60 hover:text-white transition-colors duration-200 leading-snug block"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="font-label text-[9px] text-primary uppercase tracking-[0.18em] hover:text-primary-light transition-colors mt-1 inline-block"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Visit Us ─────────────────────────────────────────── */}
          <div>
            <h3 className="font-label text-white text-[9px] lg:text-[11px] tracking-[0.28em] uppercase mb-5 pb-2 border-b border-white/10">
              Visit Us
            </h3>
            <div className="space-y-5 lg:space-y-7">
              {business.branches.map((branch) => (
                <div key={branch.id}>
                  <p className="font-label text-primary text-[8px] lg:text-[12px] tracking-[0.22em] uppercase mb-1.5">{branch.name}</p>
                  <a
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-[13px] lg:text-[15px] text-white/60 hover:text-white transition-colors duration-200 cursor-pointer leading-snug"
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="font-body">{branch.address}, {branch.city} {branch.pincode}</span>
                  </a>
                </div>
              ))}

              <div>
                <p className="font-label text-primary text-[8px] lg:text-[12px] tracking-[0.22em] uppercase mb-1.5">Working Hours</p>
                <div className="flex items-start gap-2 text-[13px] lg:text-[15px] text-white/60 leading-snug">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <div className="font-body">
                    <p>{business.hours.weekdays}</p>
                    <p className="text-white/35">{business.hours.sunday}</p>
                  </div>
                </div>
              </div>


            </div>
          </div>

        </div>
      </div>

      {/* ── Areas We Serve ────────────────────────────────────────── */}
      <div className="relative border-t border-white/[0.06]">
        <div className="container mx-auto px-5 sm:px-8 py-5">
          <p className="font-label text-[8px] lg:text-[10px] tracking-[0.28em] uppercase text-white/28 mb-3">
            Serving Hubli —
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {allLocations.map((loc, idx) => (
              <span key={loc.slug} className="inline-flex items-center">
                <Link
                  href={`/${loc.slug}`}
                  className="font-body text-[12px] lg:text-[14px] text-white/45 hover:text-primary transition-colors duration-200"
                >
                  {loc.name}
                </Link>
                {idx < allLocations.length - 1 && (
                  <span className="text-white/12 text-[10px] ml-3">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="relative border-t border-white/[0.06]">
        <div className="container mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">

          <p className="font-body text-[11px] lg:text-[13.5px] text-white/35 text-center sm:text-left">
            © {year} Baba Royal Garage · Royal Enfield Specialist, Hubli, Karnataka.
          </p>

          <div className="flex items-center gap-4 text-[11px] lg:text-[13.5px] font-body text-white/35">
            <Link href="/privacy-policy" className="hover:text-white/65 transition-colors">Privacy Policy</Link>
            <span className="text-white/15">|</span>
            <Link href="/terms-of-service" className="hover:text-white/65 transition-colors">Terms of Service</Link>
            <span className="text-white/15">|</span>
            <Link href="/faq" className="hover:text-white/65 transition-colors">FAQ</Link>
          </div>

        </div>
      </div>

    </footer>
  );
}
