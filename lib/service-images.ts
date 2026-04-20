export interface ServiceImageAsset {
  src: string;
  alt: string;
}

export const serviceImagesBySlug: Record<string, ServiceImageAsset> = {
  "royal-enfield-general-servicing-hubli": {
    src: "/images/services/service-general-service.jpg",
    alt: "Royal Enfield general servicing and oil change at Baba Royal Garage Hubli",
  },
  "engine-oil-change-hubli": {
    src: "/images/services/service-engine-oil-change.jpg",
    alt: "Royal Enfield engine oil change service in Hubli",
  },
  "engine-overhaul-hubli": {
    src: "/images/services/service-engine-overhaul.jpg",
    alt: "Royal Enfield engine overhaul and rebuild work at Baba Royal Garage",
  },
  "clutch-repair-hubli": {
    src: "/images/services/service-clutch-repair.jpg",
    alt: "Royal Enfield clutch repair and replacement service in Hubli",
  },
  "gearbox-repair-hubli": {
    src: "/images/services/service-gearbox-repair.jpg",
    alt: "Royal Enfield gearbox repair and tuning by specialist mechanics",
  },
  "brake-service-hubli": {
    src: "/images/services/service-brake-service.jpg",
    alt: "Royal Enfield brake service and pad replacement in Hubli",
  },
  "chain-service-hubli": {
    src: "/images/services/service-chain-service.jpg",
    alt: "Royal Enfield chain cleaning, lubrication and adjustment service",
  },
  "tire-service-hubli": {
    src: "/images/services/service-tire-service.jpg",
    alt: "Royal Enfield tire service and replacement at Baba Royal Garage",
  },
  "battery-replacement-hubli": {
    src: "/images/services/service-battery-replacement.jpg",
    alt: "Royal Enfield battery check and replacement in Hubli",
  },
  "electrical-diagnostics-hubli": {
    src: "/images/services/service-electrical-diagnostics.jpg",
    alt: "Royal Enfield electrical diagnostics and wiring repair service",
  },
  "suspension-service-hubli": {
    src: "/images/services/service-suspension-service.jpg",
    alt: "Royal Enfield suspension service and repair at Baba Royal Garage",
  },
  "fuel-system-cleaning-hubli": {
    src: "/images/services/service-fuel-cleaning.jpg",
    alt: "Royal Enfield fuel system cleaning and carburetor tuning service",
  },
  "bike-detailing-hubli": {
    src: "/images/services/service-bike-detailing.jpg",
    alt: "Royal Enfield bike washing and detailing in Hubli",
  },
  "spare-parts-hubli": {
    src: "/images/services/service-genuine-parts.jpg",
    alt: "Genuine Royal Enfield spare parts fitting at Baba Royal Garage",
  },
  "doorstep-pickup-drop-hubli": {
    src: "/images/services/service-general-service.jpg",
    alt: "Doorstep pickup and drop support for Royal Enfield service in Hubli",
  },
};

const fallbackServiceImage: ServiceImageAsset = {
  src: "/images/services/service-general-service.jpg",
  alt: "Royal Enfield specialist service at Baba Royal Garage Hubli",
};

export function getServiceImageBySlug(slug: string): ServiceImageAsset {
  return serviceImagesBySlug[slug] ?? fallbackServiceImage;
}
