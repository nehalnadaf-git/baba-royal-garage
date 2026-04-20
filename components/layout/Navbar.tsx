"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { business } from "@/lib/business";
import { cn } from "@/lib/utils";

/* ─── link groups ─────────────────────────────────────────────── */
const LEFT_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Services", href: "/services" },
  { label: "About",    href: "/about" },
  { label: "Blog",     href: "/blog" },
];

const RIGHT_LINKS = [
  { label: "Reviews", href: "/reviews" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  onBookingClick: () => void;
}

export default function Navbar({ onBookingClick }: NavbarProps) {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinkCls =
    "font-heading font-semibold text-[11.5px] uppercase tracking-[0.14em] text-white/55 hover:text-white transition-colors duration-200 px-3 py-1.5";

  return (
    <div className="fixed left-0 right-0 top-0 z-50">

      {/* ── Main bar ───────────────────────────────────────────── */}
      <div
        className="transition-all duration-500"
        style={{
          background: scrolled
            ? "hsla(222, 16%, 6%, 0.96)"
            : "transparent",
          backdropFilter: scrolled
            ? "blur(28px) saturate(220%)"
            : "none",
          WebkitBackdropFilter: scrolled
            ? "blur(28px) saturate(220%)"
            : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 6px 32px rgba(0,0,0,0.48)" : "none",
        }}
      >
        {/* Red top accent hairline */}
        <div
          className="h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #E8192A 20%, #C0392B 50%, #E8192A 80%, transparent 100%)",
          }}
        />

        {/* ── DESKTOP — 3-column grid ──────────────────────────── */}
        <nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-[64px] px-8 max-w-[1440px] mx-auto gap-6">

          {/* Left nav links */}
          <div className="flex items-center gap-1">
            {LEFT_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={navLinkCls}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Center brand */}
          <Link
            href="/"
            className="flex flex-col items-center leading-none group"
          >
            <span
              className="font-display text-white uppercase"
              style={{ fontSize: "21px", letterSpacing: "0.14em", lineHeight: 1 }}
            >
              Baba{" "}
              <span className="text-primary">Royal Garage</span>
            </span>
            <span
              className="font-label uppercase mt-1.5"
              style={{
                fontSize: "7.5px",
                letterSpacing: "0.30em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Royal Enfield Specialist · Hubli
            </span>
          </Link>

          {/* Right nav links + Book CTA */}
          <div className="flex items-center justify-end gap-1">
            {RIGHT_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={navLinkCls}>
                {l.label}
              </Link>
            ))}

            {/* Outlined Book Service button — inspired by "BOOK A TABLE" */}
            <button
              onClick={onBookingClick}
              className="group relative ml-3 flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-2.5 font-heading font-bold text-[11px] uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(254,36,20,0.35)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              Book Service
            </button>
          </div>
        </nav>

        {/* ── MOBILE bar ───────────────────────────────────────── */}
        <nav className="lg:hidden relative flex items-center justify-between h-[60px] px-5">

          {/* Spacer to keep brand centered */}
          <div className="w-9 shrink-0" />

          {/* Centered brand */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none"
          >
            <span
              className="font-display text-white uppercase whitespace-nowrap"
              style={{ fontSize: "19px", letterSpacing: "0.10em", lineHeight: 1 }}
            >
              Baba <span className="text-primary">Royal Garage</span>
            </span>
            <span
              className="font-label uppercase mt-1 whitespace-nowrap"
              style={{
                fontSize: "7px",
                letterSpacing: "0.24em",
                color: "rgba(255,255,255,0.32)",
              }}
            >
              Royal Enfield Specialist · Hubli
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="w-9 h-9 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            style={{ color: mobileOpen ? "white" : "rgba(255,255,255,0.65)" }}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-350 ease-in-out",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
        style={{
          background:           "hsla(222, 16%, 5%, 0.98)",
          backdropFilter:       "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderBottom:         "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <nav className="flex flex-col px-5 pb-5 pt-2">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="py-3.5 font-heading font-bold text-[12.5px] uppercase tracking-[0.14em] text-white/65 hover:text-white transition-colors"
              style={{
                borderBottom: i < LEFT_LINKS.length + RIGHT_LINKS.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* Book Service CTA in dropdown */}
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => { onBookingClick(); setMobileOpen(false); }}
              className="w-full py-3.5 font-heading font-bold text-[12.5px] uppercase tracking-[0.14em] text-white rounded-xl transition-all cursor-pointer"
              style={{ background: "#E8192A", boxShadow: "0 0 20px rgba(232,25,42,0.25)" }}
            >
              Book Service
            </button>
            <a
              href={`tel:${business.phone1}`}
              className="mt-2.5 w-full py-3.5 flex items-center justify-center gap-2.5 font-heading font-semibold text-[12px] uppercase tracking-[0.12em] text-white/60 hover:text-white rounded-xl transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.10)" }}
            >
              Call Now
            </a>
          </div>
        </nav>
      </div>

    </div>
  );
}
