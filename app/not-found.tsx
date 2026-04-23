import Link from "next/link";
import { Home, Wrench, Phone } from "lucide-react";
import { business } from "@/lib/business";

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[hsl(220,14%,5%)] overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 bg-mesh-dark opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent 0%, #E8192A 20%, #C0392B 50%, #E8192A 80%, transparent 100%)" }} />

      <div className="relative container mx-auto px-5 sm:px-8 text-center">
        {/* Wrench icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
          <Wrench className="h-7 w-7 sm:h-10 sm:w-10 text-primary" />
        </div>

        {/* 404 display */}
        <div
          className="font-display text-primary uppercase leading-none mb-4"
          style={{ fontSize: "clamp(100px, 20vw, 200px)", lineHeight: 0.85, letterSpacing: "0.06em" }}
        >
          404
        </div>

        {/* Divider */}
        <div className="w-10 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mb-6 mx-auto" />

        <h1
          className="font-display text-white uppercase mb-3"
          style={{ fontSize: "clamp(22px,4vw,48px)", lineHeight: 1.0, letterSpacing: "0.02em" }}
        >
          Page Not Found
        </h1>
        <p className="font-body text-white/45 text-[14px] sm:text-[16px] leading-relaxed max-w-md mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved or you may have typed the wrong address.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.12em] transition-all duration-300 hover:shadow-[0_8px_28px_rgba(232,25,42,0.35)] hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Home className="h-4 w-4 shrink-0" />
            Go Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white/80 hover:text-white px-8 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.12em] transition-all duration-300 hover:-translate-y-0.5"
          >
            View Services
          </Link>
          <a
            href={`tel:${business.phone1}`}
            className="inline-flex items-center justify-center gap-2 border border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-white/70 hover:text-white px-8 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.12em] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
