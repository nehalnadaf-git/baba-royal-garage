"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";

interface PremiumServiceCard {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  categoryBadge: string;
  features: string[];
  price: string;
}

const premiumCards: PremiumServiceCard[] = [
  // Essential
  {
      slug: "royal-enfield-general-servicing-hubli",
      title: "General Servicing and Oil Change",
      description: "Complete 30-point Royal Enfield care with premium oil and specialist inspection.",
      image: "/images/services/service-general-service.jpg",
      imageAlt: "Royal Enfield general service in progress at Baba Royal Garage Hubli workshop",
      categoryBadge: "Essential",
      features: ["Genuine Parts", "Expert Technician", "30-Point Check"],
      price: "Starts from INR 999",
    },
    {
      slug: "engine-oil-change-hubli",
      title: "Engine Oil Change",
      description: "Model-specific premium oil replacement for smooth ride quality and engine protection.",
      image: "/images/services/service-engine-oil-change.jpg",
      imageAlt: "Royal Enfield engine oil replacement service by specialist mechanic in Hubli",
      categoryBadge: "Maintenance",
      features: ["Right Oil Grade", "Filter Check", "Quick Turnaround"],
      price: "Starts from INR 699",
    },
    {
      slug: "brake-service-hubli",
      title: "Brake Service and Pad Replacement",
      description: "Full brake diagnostics and pad care to restore safe stopping confidence.",
      image: "/images/services/service-brake-service.jpg",
      imageAlt: "Royal Enfield disc brake service and pad replacement at Hubli branch",
      categoryBadge: "Safety",
      features: ["ABS Check", "Pad Replacement", "Road Test"],
      price: "Starts from INR 899",
    },
    // Engine
    {
      slug: "engine-overhaul-hubli",
      title: "Engine Overhaul and Rebuild",
      description: "Complete Royal Enfield engine rebuild for restored thump, power, and reliability.",
      image: "/images/services/service-engine-overhaul.jpg",
      imageAlt: "Royal Enfield engine overhaul and rebuild by specialist team in Hubli",
      categoryBadge: "Engine",
      features: ["Precision Assembly", "Factory Specs", "Genuine Internals"],
      price: "Starts from INR 8,500",
    },
    {
      slug: "clutch-repair-hubli",
      title: "Clutch Repair and Replacement",
      description: "Fix clutch slip and lever stiffness with exact RE clutch pack setup.",
      image: "/images/services/service-clutch-repair.jpg",
      imageAlt: "Royal Enfield clutch repair and replacement service at Baba Royal Garage",
      categoryBadge: "Performance",
      features: ["Smooth Engagement", "Genuine Plates", "Road Calibration"],
      price: "Starts from INR 1,800",
    },
    {
      slug: "gearbox-repair-hubli",
      title: "Gearbox Repair and Tuning",
      description: "Eliminate false neutrals and hard shifts with precision gearbox tuning.",
      image: "/images/services/service-gearbox-repair.jpg",
      imageAlt: "Royal Enfield gearbox tuning and repair workbench at Hubli garage",
      categoryBadge: "Transmission",
      features: ["False Neutral Fix", "Shift Fork Setup", "Noise Reduction"],
      price: "Starts from INR 2,500",
    },
    // Electrical
    {
      slug: "electrical-diagnostics-hubli",
      title: "Electrical Diagnostics and Repair",
      description: "Advanced diagnosis for sensors, wiring faults, battery drains, and ECU alerts.",
      image: "/images/services/service-electrical-diagnostics.jpg",
      imageAlt: "Royal Enfield electrical diagnostics test at Baba Royal Garage Hubli",
      categoryBadge: "Diagnostics",
      features: ["Scanner Testing", "Wiring Repair", "Charging Check"],
      price: "Starts from INR 1,200",
    },
    {
      slug: "battery-replacement-hubli",
      title: "Battery Check and Replacement",
      description: "Reliable starter performance with proper load testing and genuine battery fitment.",
      image: "/images/services/service-battery-replacement.jpg",
      imageAlt: "Royal Enfield battery testing and replacement for Hubli rider",
      categoryBadge: "Electrical",
      features: ["Load Test", "Charging Test", "Doorstep Support"],
      price: "Starts from INR 2,200",
    },
    {
      slug: "fuel-system-cleaning-hubli",
      title: "Fuel System Cleaning",
      description: "Injector and fuel-path cleaning for cleaner throttle response and improved mileage.",
      image: "/images/services/service-fuel-cleaning.jpg",
      imageAlt: "Royal Enfield fuel system cleaning and injector service in Hubli",
      categoryBadge: "Efficiency",
      features: ["Injector Care", "Throttle Response", "Mileage Boost"],
      price: "Starts from INR 1,100",
    },
    // Suspension
    {
      slug: "suspension-service-hubli",
      title: "Suspension Service",
      description: "Front and rear suspension setup for stable handling on city and highway rides.",
      image: "/images/services/service-suspension-service.jpg",
      imageAlt: "Royal Enfield suspension service and tuning at specialist garage in Hubli",
      categoryBadge: "Handling",
      features: ["Fork Service", "Shock Setup", "Ride Balance"],
      price: "Starts from INR 1,600",
    },
    {
      slug: "tire-service-hubli",
      title: "Tire Service and Replacement",
      description: "Grip-first tire care including puncture support, balancing, and replacement.",
      image: "/images/services/service-tire-service.jpg",
      imageAlt: "Royal Enfield tire inspection and wheel balancing service in Hubli",
      categoryBadge: "Road Control",
      features: ["Wheel Balance", "Tread Check", "Puncture Support"],
      price: "Starts from INR 850",
    },
    {
      slug: "chain-service-hubli",
      title: "Chain Cleaning and Adjustment",
      description: "Accurate chain tension and lubrication for smoother acceleration and less wear.",
      image: "/images/services/service-chain-service.jpg",
      imageAlt: "Royal Enfield chain cleaning lubrication and tension service at Baba Royal Garage",
      categoryBadge: "Drive Train",
      features: ["Deep Cleaning", "Lubrication", "Alignment Check"],
      price: "Starts from INR 499",
    },
    // Detailing
    {
      slug: "bike-detailing-hubli",
      title: "Bike Detailing",
      description: "Restore paint depth and road presence with premium detailing and finish protection.",
      image: "/images/services/service-bike-detailing.jpg",
      imageAlt: "Royal Enfield bike detailing and polishing result at Hubli workshop",
      categoryBadge: "Detailing",
      features: ["Paint Protection", "Chrome Finish", "Deep Clean"],
      price: "Starts from INR 1,500",
    },
    {
      slug: "spare-parts-hubli",
      title: "Genuine Parts Fitting",
      description: "Authentic Royal Enfield spare part replacement for reliability and warranty confidence.",
      image: "/images/services/service-genuine-parts.jpg",
      imageAlt: "Genuine Royal Enfield spare parts installation at Baba Royal Garage Hubli",
      categoryBadge: "Genuine Parts",
      features: ["OEM Fitment", "Warranty Safe", "Specialist Install"],
      price: "Starts from INR 300",
    },
    {
      slug: "doorstep-pickup-drop-hubli",
      title: "Doorstep Pickup and Drop",
      description: "Convenient bike pickup, service, and safe return across all areas of Hubli.",
      image: "/images/services/service-doorstep-pickup.webp",
      imageAlt: "Royal Enfield doorstep pickup and drop service truck in Hubli",
      categoryBadge: "Convenience",
      features: ["Citywide Hubli", "Safe Transport", "Live Updates"],
      price: "Starts from INR 299",
    },
];

interface ServicesSectionProps {
  limit?: number;
  showViewAll?: boolean;
  variant?: "light" | "dark";
}

export default function ServicesSection({ limit = 6, showViewAll = false, variant = "dark" }: ServicesSectionProps) {
  const displayed = limit ? premiumCards.slice(0, limit) : premiumCards;
  const isDark = variant === "dark";

  const sectionClasses = isDark
    ? "relative py-16 sm:py-28 bg-ink overflow-hidden"
    : "relative py-16 sm:py-28 bg-[hsl(210,5%,95%)] overflow-hidden";

  const cardClasses = isDark
    ? "glass-dark border border-white/10"
    : "bg-white border border-[hsl(var(--gold-muted)/0.35)] shadow-[0_10px_30px_rgba(0,0,0,0.06)]";

  return (
    <section id="services" className={sectionClasses}>
      {!isDark && <div className="absolute inset-0 bg-mesh-light opacity-80 pointer-events-none" />}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/6 rounded-full blur-[180px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[140px] pointer-events-none translate-y-1/3 -translate-x-1/4" />
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${isDark ? "via-primary/30" : "via-primary/45"} to-transparent`} />

      <div className="relative container mx-auto px-5 sm:px-8">
        <div className="text-center mb-14 sm:mb-20 reveal">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-[1px] w-8 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[14px] xl:text-[15px] tracking-[0.3em] uppercase">Professional Service</span>
            <div className="h-[1px] w-8 bg-primary/60" />
          </div>
          <h2
            className={`font-display uppercase mb-4 ${isDark ? "text-white" : "text-foreground"}`}
            style={{ fontSize: "clamp(40px,6.5vw,88px)", lineHeight: 0.9, letterSpacing: "0.02em" }}
          >
            Our Services
          </h2>
          <p className={`font-body max-w-xl lg:max-w-3xl mx-auto text-[15px] lg:text-[18px] leading-relaxed lg:leading-[1.9] mt-5 lg:mt-8 ${isDark ? "text-white/55" : "text-muted-foreground"}`}>
            Comprehensive Royal Enfield care under one roof — every service backed by specialist expertise and genuine parts.
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 stagger-children">
          {displayed.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className={[
                "group relative rounded-2xl overflow-hidden block cursor-pointer transition-all duration-500 transform-gpu",
                "hover:-translate-y-2",
                isDark
                  ? "glass-dark border border-white/10 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_20px_rgba(254,36,20,0.15)]"
                  : "bg-white border border-[hsl(var(--gold-muted)/0.3)] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_48px_rgba(254,36,20,0.12)] hover:border-primary/30"
              ].join(" ")}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Badge */}
                <div
                  className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label text-white text-[9px] tracking-[0.18em] uppercase"
                  style={{
                    background: "rgba(10,12,16,0.5)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {service.categoryBadge}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className={`font-display uppercase mb-3 leading-tight tracking-[0.03em] ${isDark ? "text-white" : "text-foreground"}`}
                  style={{ fontSize: "clamp(20px,2.2vw,26px)" }}>
                  {service.title}
                </h3>
                <p className={`font-body text-[14px] lg:text-[17.5px] leading-relaxed lg:leading-[1.8] mb-8 line-clamp-2 ${isDark ? "text-white/55" : "text-muted-foreground"}`}>
                  {service.description}
                </p>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(
                        buildServiceWhatsAppUrl(service.title),
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="group/btn relative w-full overflow-hidden flex items-center justify-center gap-2.5 bg-primary text-white py-4 rounded-xl font-heading font-bold text-[13px] lg:text-[15px] uppercase tracking-[0.12em] transition-all duration-300 hover:bg-primary-dark hover:shadow-[0_10px_32px_rgba(254,36,20,0.3)] hover:-translate-y-0.5 cursor-pointer"
                    aria-label={`Book ${service.title} on WhatsApp`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                    Book Now <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-1.5 font-subheading font-bold text-[11px] lg:text-[13px] uppercase tracking-[0.14em] text-muted-foreground/60 group-hover:text-primary transition-colors">
                      Learn More <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-16 reveal">
            <Link
              href="/services"
              className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden px-10 py-4 rounded-xl font-heading font-bold text-[13px] uppercase tracking-[0.12em] transition-all duration-500 hover:-translate-y-1 ${
                isDark 
                  ? "border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(254,36,20,0.15)]" 
                  : "border border-border bg-white text-foreground hover:border-primary/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)]"
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              View All Services
              <ArrowUpRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
