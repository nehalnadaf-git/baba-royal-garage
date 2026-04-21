/**
 * Builds a WhatsApp pre-filled booking URL for a specific service + branch.
 * No emojis — professional, clean format.
 */
export interface WhatsAppBookingOptions {
  serviceName: string;
  timeEstimate?: string;
  branchDisplayName: string;
  branchPhone: string;
}

export function buildServiceWhatsAppUrl(options: WhatsAppBookingOptions): string {
  const { serviceName, timeEstimate, branchDisplayName, branchPhone } = options;

  const lines: string[] = [
    "Hello Baba Royal Garage,",
    "",
    `I would like to book the following service at your ${branchDisplayName}:`,
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
  const phone = branchPhone.replace(/\D/g, ""); // strip +, spaces, dashes
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
