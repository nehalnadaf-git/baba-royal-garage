"use client";

import { MessageCircle } from "lucide-react";
import { business } from "@/lib/business";

export default function WhatsAppButton() {
  return (
    <a
      href={business.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 group flex items-center gap-0 hover:gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.55)] transition-all duration-500 overflow-hidden"
      aria-label="Chat on WhatsApp"
    >
      {/* Icon — always visible */}
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <MessageCircle className="h-6 w-6 fill-white/20 transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Label — expands on hover */}
      <span className="font-heading font-bold text-sm uppercase tracking-widest whitespace-nowrap max-w-0 group-hover:max-w-[140px] overflow-hidden transition-all duration-500 ease-out pr-0 group-hover:pr-5">
        Chat Now
      </span>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-30 pointer-events-none" />
    </a>
  );
}
