import { business } from "@/lib/business";

/**
 * Builds a direct WhatsApp booking URL for a specific service.
 * Goes to the main number. No emojis. Professional format.
 */
export function buildServiceWhatsAppUrl(serviceName: string, timeEstimate?: string): string {
  const lines: string[] = [
    "Hello Baba Royal Garage,",
    "",
    "I would like to book the following service:",
    "",
    `Service: ${serviceName}`,
  ];

  if (timeEstimate) {
    lines.push(`Estimated Duration: ${timeEstimate}`);
  }

  lines.push(
    "",
    "Please let me know the earliest available slot.",
    "",
    "Thank you."
  );

  const message = lines.join("\n");
  const phone = business.phone1.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
