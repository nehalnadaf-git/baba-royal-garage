"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";
import type { Service } from "@/types";

const categoryBadgeMap: Record<Service["category"], string> = {
  regular: "General Care",
  engine: "Power & Trans",
  electrical: "Electric",
  suspension: "Stability",
  detailing: "Finish",
  doorstep: "Service Hub",
};

interface ServiceWithImage {
  service: Service;
  imageSrc: string;
  imageAlt: string;
}

interface RelatedServicesCardsProps {
  items: ServiceWithImage[];
}

export default function RelatedServicesCards({ items }: RelatedServicesCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
      {items.map(({ service: s, imageSrc, imageAlt }) => {
        const categoryBadge = categoryBadgeMap[s.category] || s.category;

        return (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#e4e4e4] shadow-[0_2px_12px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(254,36,20,0.14)] hover:border-primary/25"
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ boxShadow: "inset 0 0 0 1.5px rgba(232,25,42,0.22)" }}
            />

            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden shrink-0">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Glassmorphism badge */}
              <span
                className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label text-white text-[9px] tracking-[0.22em] uppercase"
                style={{
                  background: "rgba(15,17,23,0.40)",
                  backdropFilter: "blur(20px) saturate(1.8)",
                  WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.30)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.50)",
                }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full shrink-0 animate-pulse"
                  style={{ background: "#E8192A", boxShadow: "0 0 8px rgba(232,25,42,0.90)" }}
                />
                {categoryBadge}
              </span>
            </div>

            {/* Card body */}
            <div className="flex flex-col flex-1 p-5 sm:p-6 lg:p-8">
              {/* Accent bar */}
              <div className="w-9 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mb-4 lg:mb-5 transition-all duration-300 group-hover:w-16" />

              {/* Title */}
              <h3
                className="font-display uppercase text-foreground leading-tight tracking-[0.03em] mb-3 group-hover:text-primary transition-colors duration-250"
                style={{ fontSize: "clamp(15px, 1.4vw, 22px)" }}
              >
                {s.name}
              </h3>

              {/* Description */}
              <p
                className="font-body text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-6"
                style={{ fontSize: "clamp(13px, 1vw, 16px)" }}
              >
                {s.shortDescription}
              </p>

              {/* CTA row */}
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(buildServiceWhatsAppUrl(s.name), "_blank", "noopener,noreferrer");
                  }}
                  className="group/cta relative flex-1 flex items-center justify-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-[0.12em] rounded-xl overflow-hidden transition-all duration-300 hover:bg-primary-dark hover:shadow-[0_6px_20px_rgba(232,25,42,0.30)] cursor-pointer"
                  style={{ fontSize: "clamp(11px, 0.85vw, 13px)", padding: "clamp(10px, 1vw, 14px) 0" }}
                  aria-label={`Book ${s.name} on WhatsApp`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-600 ease-in-out" />
                  Book Now
                  <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                </button>
                <span
                  className="inline-flex items-center gap-1 text-muted-foreground font-heading font-bold uppercase tracking-[0.10em] group-hover:text-primary transition-colors shrink-0"
                  style={{ fontSize: "clamp(11px, 0.85vw, 13px)" }}
                >
                  Details
                  <ArrowRight className="h-3 w-3 lg:h-3.5 lg:w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
