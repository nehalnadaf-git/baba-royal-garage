"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { business } from "@/lib/business";
import { cn } from "@/lib/utils";

/* ─── Navigation links ─────────────────────────────────────────────────── */
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

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

interface NavbarProps {
  onBookingClick: () => void;
}

export default function Navbar({ onBookingClick }: NavbarProps) {
  const pathname   = usePathname();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Scroll detection ─────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Scroll lock — iOS-safe approach ─────────────────────────────────
   * On iOS Safari, overflow:hidden on <html> alone does NOT prevent body
   * scroll. The only reliable cross-browser fix is position:fixed on body
   * with a negative top that matches the current scroll position.
   * We restore scrollY manually on unlock so there's no visible jump.
   * ─────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!mobileOpen) {
      // Restore scroll position exactly where user left off
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, -parseInt(scrollY, 10));
      }
      return;
    }
    // Lock: freeze body at current position
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (scrollY) window.scrollTo(0, -parseInt(scrollY, 10));
    };
  }, [mobileOpen]);

  /* ── Close on route change ────────────────────────────────────────── */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ── Close on Escape ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  /* ── Close on resize to desktop ───────────────────────────────────── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  /* ── Active link helper ───────────────────────────────────────────── */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* ── Desktop link class ───────────────────────────────────────────── */
  const desktopLinkCls = (href: string) =>
    cn(
      "relative font-heading font-semibold text-[11.5px] uppercase tracking-[0.14em] transition-colors duration-200 px-3 py-1.5",
      isActive(href) ? "text-white" : "text-white/55 hover:text-white"
    );

  /* ── Solid flag: when navbar bar should show its dark background ──── */
  const isSolid = scrolled || mobileOpen;

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50">

        {/* ── Main bar ────────────────────────────────────────────────── */}
        <div
          className="transition-all duration-500"
          style={{
            background:           isSolid ? "hsla(222, 16%, 6%, 0.97)" : "transparent",
            backdropFilter:       isSolid ? "blur(28px) saturate(220%)" : "none",
            WebkitBackdropFilter: isSolid ? "blur(28px) saturate(220%)" : "none",
            borderBottom:         isSolid ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
            boxShadow:            isSolid ? "0 6px 32px rgba(0,0,0,0.48)" : "none",
          }}
        >
          {/* Red accent hairline ─────────────────────────────────────── */}
          <div
            className="h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #E8192A 20%, #C0392B 50%, #E8192A 80%, transparent 100%)",
            }}
          />

          {/* ── DESKTOP nav (≥1024px) 3-column grid ──────────────────── */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-[64px] px-8 max-w-[1440px] mx-auto gap-6"
          >
            {/* Left links */}
            <div className="flex items-center gap-1">
              {LEFT_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={desktopLinkCls(l.href)}>
                  {l.label}
                  {isActive(l.href) && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary"
                      style={{ boxShadow: "0 0 8px rgba(232,25,42,0.7)" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Center brand */}
            <Link href="/" className="flex flex-col items-center leading-none group">
              <span
                className="font-display text-white uppercase"
                style={{ fontSize: "21px", letterSpacing: "0.14em", lineHeight: 1 }}
              >
                Baba{" "}<span className="text-primary">Royal Garage</span>
              </span>
              <span
                className="font-label uppercase mt-1.5"
                style={{ fontSize: "7.5px", letterSpacing: "0.30em", color: "rgba(255,255,255,0.35)" }}
              >
                Royal Enfield Specialist · Hubli
              </span>
            </Link>

            {/* Right links + Book CTA */}
            <div className="flex items-center justify-end gap-1">
              {RIGHT_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={desktopLinkCls(l.href)}>
                  {l.label}
                  {isActive(l.href) && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary"
                      style={{ boxShadow: "0 0 8px rgba(232,25,42,0.7)" }}
                    />
                  )}
                </Link>
              ))}

              <button
                onClick={onBookingClick}
                className="group relative ml-4 flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-2.5 font-heading font-bold text-[11px] uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(254,36,20,0.38)] cursor-pointer"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Book Service
              </button>

              {/* Call button — desktop */}
              <a
                href={`tel:${business.phone1}`}
                aria-label={`Call us at ${business.phone1Display}`}
                className="group ml-2 flex items-center gap-1.5 rounded-xl border border-white/20 px-4 py-2.5 font-heading font-bold text-[11px] uppercase tracking-[0.14em] text-white/75 transition-all duration-300 hover:border-primary/70 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(232,25,42,0.22)]"
                style={{
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <Phone
                  className="h-[11px] w-[11px] transition-colors duration-200 group-hover:text-primary"
                  strokeWidth={2.5}
                />
                Call
              </a>
            </div>
          </nav>

          {/* ── MOBILE / TABLET bar (<1024px) ─────────────────────────── */}
          <nav
            aria-label="Mobile navigation"
            className="lg:hidden flex items-center justify-between h-[60px] px-4 sm:px-6"
          >
            {/* Left spacer — mirrors the hamburger width to keep brand centred */}
            <div className="w-10 h-10 shrink-0" />

            {/* Brand — truly centred via absolute positioning */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none"
              tabIndex={mobileOpen ? -1 : 0}
            >
              <span
                className="font-display text-white uppercase whitespace-nowrap"
                style={{ fontSize: "19px", letterSpacing: "0.10em", lineHeight: 1 }}
              >
                Baba <span className="text-primary">Royal Garage</span>
              </span>
              <span
                className="font-label uppercase mt-1 whitespace-nowrap"
                style={{ fontSize: "7px", letterSpacing: "0.24em", color: "rgba(255,255,255,0.32)" }}
              >
                Royal Enfield Specialist · Hubli
              </span>
            </Link>

            {/* Hamburger — right, styled pill button ───────────────────── */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="relative w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200"
              style={{ color: mobileOpen ? "white" : "rgba(255,255,255,0.75)" }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {/* Animated Menu → X crossfade */}
              <Menu
                className={cn(
                  "absolute h-[18px] w-[18px] transition-all duration-250",
                  mobileOpen
                    ? "opacity-0 scale-50 rotate-90"
                    : "opacity-100 scale-100 rotate-0"
                )}
              />
              <X
                className={cn(
                  "absolute h-[18px] w-[18px] transition-all duration-250",
                  mobileOpen
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-50 -rotate-90"
                )}
              />
            </button>
          </nav>
        </div>

        {/* ── Backdrop dimmer (closes menu on outside tap) ─────────────── */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 transition-opacity duration-300",
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          style={{ top: "62px", background: "rgba(0,0,0,0.55)", zIndex: 39 }}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* ── Mobile slide-down menu panel ─────────────────────────────── */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="lg:hidden fixed left-0 right-0"
          style={{
            top: "62px",
            zIndex: 40,
            /*
             * max-height transition is the smoothest way to animate
             * a panel whose content height is dynamic. The large open value
             * (90dvh) ensures the panel never clips its content.
             */
            maxHeight:            mobileOpen ? "90vh" : "0px",
            overflow:             "hidden",
            transition:           "max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
            background:           "hsla(222, 16%, 5%, 0.98)",
            backdropFilter:       "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            borderBottom:         mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
          {/* Inner scroll area — uses safe-area-inset-bottom so CTAs
               never overlap iPhone home indicator on notched devices */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "90vh", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <nav
              className="flex flex-col px-5 sm:px-8 pt-3"
              style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}
            >

              {/* Nav links */}
              {ALL_LINKS.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center justify-between py-4 sm:py-4.5 font-heading font-bold text-[13px] sm:text-[14px] uppercase tracking-[0.15em] transition-colors duration-200",
                    isActive(l.href) ? "text-primary" : "text-white/65 hover:text-white"
                  )}
                  style={{
                    borderBottom:
                      i < ALL_LINKS.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                  }}
                >
                  {l.label}
                  {/* Active indicator dot */}
                  {isActive(l.href) && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                      style={{ boxShadow: "0 0 8px rgba(232,25,42,0.9)" }}
                    />
                  )}
                </Link>
              ))}

              {/* CTA buttons */}
              <div
                className="mt-5 pt-5 space-y-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <button
                  onClick={() => { onBookingClick(); closeMenu(); }}
                  className="w-full py-4 font-heading font-bold text-[13px] uppercase tracking-[0.15em] text-white rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  style={{
                    background:  "linear-gradient(135deg, #E8192A, #C0392B)",
                    boxShadow:   "0 4px 20px rgba(232,25,42,0.30)",
                  }}
                >
                  Book Service
                </button>

                {/* Call button — mobile */}
                <a
                  href={`tel:${business.phone1}`}
                  onClick={closeMenu}
                  aria-label={`Call us at ${business.phone1Display}`}
                  className="group w-full flex items-center justify-center gap-2.5 py-4 font-heading font-bold text-[13px] uppercase tracking-[0.15em] text-white/80 rounded-xl transition-all duration-200 active:scale-[0.98]"
                  style={{
                    border:      "1px solid rgba(232,25,42,0.35)",
                    background:  "rgba(232,25,42,0.06)",
                  }}
                >
                  <Phone
                    className="h-[15px] w-[15px] text-primary"
                    strokeWidth={2.5}
                  />
                  <span>
                    Call{" "}
                    <span className="text-white/45 font-label text-[10px] tracking-widest normal-case">
                      {business.phone1Display}
                    </span>
                  </span>
                </a>
              </div>

              {/* Bottom branding strip */}
              <p
                className="mt-6 text-center font-label text-white/20"
                style={{ fontSize: "9px", letterSpacing: "0.20em" }}
              >
                BABA ROYAL GARAGE · HUBLI
              </p>
            </nav>
          </div>
        </div>

      </div>
    </>
  );
}
