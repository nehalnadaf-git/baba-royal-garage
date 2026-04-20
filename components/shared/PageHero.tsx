// Shared page-level hero banner — used on About, Services, Reviews, Blog, etc.
// Keeps typography, spacing, and colors consistent across all inner pages.

import { ReactNode } from "react";

interface PageHeroProps {
  overline?: string;     // e.g. "Our Story"
  title: ReactNode;      // Main h1
  subtitle?: string;     // Sub-paragraph
  children?: ReactNode;  // Any extra content (badges, star ratings, etc.)
  variant?: "dark" | "light";
}

export default function PageHero({ overline, title, subtitle, children, variant = "dark" }: PageHeroProps) {
  const isDark = variant === "dark";

  return (
    <section className={`relative pt-24 sm:pt-36 pb-12 sm:pb-20 overflow-hidden ${isDark ? "bg-[hsl(220,14%,5%)]" : "bg-[hsl(210,5%,95%)]"}`}>
      {/* Atmospheric glow */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? "bg-mesh-dark opacity-70" : "bg-mesh-light opacity-95"}`} />
      <div className="absolute -top-24 left-1/3 w-[500px] h-[280px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      {/* Bottom hairline */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${isDark ? "via-primary/25" : "via-primary/35"} to-transparent`} />

      <div className="relative container mx-auto px-5 sm:px-8 flex flex-col items-center text-center">
        {overline && (
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="h-[1px] w-8 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">{overline}</span>
            <div className="h-[1px] w-8 bg-primary/60" />
          </div>
        )}
        <h1
          className={`font-display uppercase mb-4 ${isDark ? "text-white" : "text-foreground"}`}
          style={{ fontSize: "clamp(40px,7vw,88px)", lineHeight: 0.9, letterSpacing: "0.02em" }}
        >
          {title}
        </h1>
        <div className="w-10 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mb-5 mx-auto" />
        {subtitle && (
          <p className={`font-body text-[15px] lg:text-[18px] leading-relaxed lg:leading-[1.9] max-w-2xl lg:max-w-3xl ${isDark ? "text-white/50" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
