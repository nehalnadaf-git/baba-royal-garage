export interface ServiceImageAsset {
  src: string;
  alt: string;
}

export const serviceImagesBySlug: Record<string, ServiceImageAsset> = {
  "royal-enfield-general-servicing-hubli": {
    src: "/images/services/service-general-service.webp",
    alt: "Royal Enfield general servicing and oil change at Baba Royal Garage Hubli",
  },
  "engine-oil-change-hubli": {
    src: "/images/services/service-engine-oil-change.webp",
    alt: "Royal Enfield engine oil change service in Hubli",
  },
  "engine-overhaul-hubli": {
    src: "/images/services/service-engine-overhaul.webp",
    alt: "Royal Enfield engine overhaul and rebuild work at Baba Royal Garage",
  },
  "clutch-repair-hubli": {
    src: "/images/services/service-clutch-repair.webp",
    alt: "Royal Enfield clutch repair and replacement service in Hubli",
  },
  "gearbox-repair-hubli": {
    src: "/images/services/service-gearbox-repair.webp",
    alt: "Royal Enfield gearbox repair and tuning by specialist mechanics",
  },
  "brake-service-hubli": {
    src: "/images/services/service-brake-service.webp",
    alt: "Royal Enfield brake service and pad replacement in Hubli",
  },
  "chain-service-hubli": {
    src: "/images/services/service-chain-service.webp",
    alt: "Royal Enfield chain cleaning, lubrication and adjustment service",
  },
  "tire-service-hubli": {
    src: "/images/services/service-tire-service.webp",
    alt: "Royal Enfield tire service and replacement at Baba Royal Garage",
  },
  "battery-replacement-hubli": {
    src: "/images/services/service-battery-replacement.webp",
    alt: "Royal Enfield battery check and replacement in Hubli",
  },
  "electrical-diagnostics-hubli": {
    src: "/images/services/service-electrical-diagnostics.webp",
    alt: "Royal Enfield electrical diagnostics and wiring repair service",
  },
  "suspension-service-hubli": {
    src: "/images/services/service-suspension-service.webp",
    alt: "Royal Enfield suspension service and repair at Baba Royal Garage",
  },
  "fuel-system-cleaning-hubli": {
    src: "/images/services/service-fuel-cleaning.webp",
    alt: "Royal Enfield fuel system cleaning and carburetor tuning service",
  },
  "bike-detailing-hubli": {
    src: "/images/services/service-bike-detailing.webp",
    alt: "Royal Enfield bike washing and detailing in Hubli",
  },
  "spare-parts-hubli": {
    src: "/images/services/service-genuine-parts.webp",
    alt: "Genuine Royal Enfield spare parts fitting at Baba Royal Garage",
  },
  "doorstep-pickup-drop-hubli": {
    src: "/images/services/service-general-service.webp",
    alt: "Doorstep pickup and drop support for Royal Enfield service in Hubli",
  },
};

const fallbackServiceImage: ServiceImageAsset = {
  src: "/images/services/service-general-service.webp",
  alt: "Royal Enfield specialist service at Baba Royal Garage Hubli",
};

export function getServiceImageBySlug(slug: string): ServiceImageAsset {
  return serviceImagesBySlug[slug] ?? fallbackServiceImage;
}
