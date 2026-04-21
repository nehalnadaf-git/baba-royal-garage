"use client";

import { ArrowRight } from "lucide-react";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface ServiceBookButtonProps {
  serviceName: string;
  variant?: "filled" | "outline" | "ghost";
  label?: string;
  className?: string;
  showArrow?: boolean;
}

export default function ServiceBookButton({
  serviceName,
  variant = "filled",
  label = "Book Now",
  className,
  showArrow = false,
}: ServiceBookButtonProps) {
  const waUrl = buildServiceWhatsAppUrl(serviceName);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const baseClass =
    "relative inline-flex items-center justify-center gap-2 font-heading font-bold uppercase tracking-[0.13em] transition-all duration-200 cursor-pointer select-none";

  const variantClass = {
    filled:
      "bg-primary hover:bg-primary-dark text-white rounded-xl px-8 py-4 text-[13px] sm:text-[14px] hover:shadow-hover hover:-translate-y-0.5",
    outline:
      "glass border border-white/20 hover:border-primary/50 text-foreground rounded-xl px-8 py-4 text-[13px] sm:text-[14px]",
    ghost:
      "text-foreground hover:text-primary text-[11px] sm:text-[13px] px-0 py-0",
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(baseClass, variantClass, className)}
      aria-label={`Book ${serviceName} on WhatsApp`}
    >
      {label}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
