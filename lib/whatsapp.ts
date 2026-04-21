import { business } from "@/lib/business";

/**
 * Builds a direct WhatsApp booking URL for a specific service.
 * Goes to the main number. No emojis. Professional format.
 */
export function buildServiceWhatsAppUrl(serviceName: string): string {
  const phone = business.phone1.replace(/\D/g, "");

  const message = [
    "Hello Baba Royal Garage,",
    "",
    `I would like to book the following service: ${serviceName}.`,
    "",
    "Please confirm the earliest available slot and any details I should know before visiting.",
    "",
    "Thank you.",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
