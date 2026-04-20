import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowUpRight, Award, Shield, Users, MapPin } from "lucide-react";

const credentials = [
  { icon: Award,  label: "Royal Enfield Specialist", sub: "6+ years dedicated expertise" },
  { icon: Shield, label: "Genuine Spare Parts",       sub: "Only authentic RE components" },
  { icon: Users,  label: "1000+ Happy Riders",        sub: "Hubli's most trusted garage" },
  { icon: MapPin, label: "2 Hubli Branches",          sub: "Keshwapur & Nehru Stadium" },
];



export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 sm:py-28 bg-[hsl(210,5%,95%)] overflow-hidden">
      <div className="absolute inset-0 bg-mesh-light opacity-80 pointer-events-none" />
      {/* Left vertical accent */}
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden xl:block ml-8" />
      {/* Subtle warm background bloom */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative container mx-auto px-5 sm:px-8">
        
        {/* ── Section header — Centered ────────────────────────── */}
        <div className="text-center mb-14 sm:mb-20 reveal">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-[1px] w-8 bg-primary/60" />
            <span className="font-label text-primary text-[10px] lg:text-[13px] tracking-[0.3em] uppercase">Our Story</span>
            <div className="h-[1px] w-8 bg-primary/60" />
          </div>
          <h2 className="font-display uppercase text-foreground mb-4"
            style={{ fontSize: "clamp(40px,6.5vw,88px)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            Who We Are
          </h2>
          <div className="w-12 h-[3px] bg-gradient-to-r from-primary to-primary-light rounded-full mx-auto mb-6" />
          <p className="font-body text-muted-foreground text-[15px] lg:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Baba Royal Garage was born from a deep passion for Royal Enfield motorcycles. Hubli&apos;s most trusted specialist home for every Royal Enfield rider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Image column ─────────────────────────────── */}
          <div className="order-1 reveal-left">
            <div className="relative">



              {/* Decorative offset border */}
              <div className="absolute -bottom-5 -right-5 w-[85%] h-[85%] border border-primary/12 rounded-3xl pointer-events-none z-0" />

              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.14)] aspect-[4/3] z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-10 pointer-events-none mix-blend-multiply" />
                <Image
                  src="/images/Main.png"
                  alt="Baba Royal Garage — Royal Enfield Specialist at Work"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

            </div>
          </div>

          {/* ── Content column ───────────────────────────── */}
          <div className="order-2 reveal-right">
            
            {/* Body text */}
            <div className="space-y-4 mb-8">
              <p className="font-body text-muted-foreground text-[15px] lg:text-[18px] leading-[1.8] lg:leading-[1.9]">
                Founded by{" "}
                <span className="text-foreground font-medium">Babajan Nadaf</span> in Hubballi, Karnataka,
                we set out with one mission — to give every Royal Enfield rider the expert, honest, and premium care their machine truly deserves.
              </p>
              <p className="font-body text-muted-foreground text-[15px] lg:text-[18px] leading-[1.8] lg:leading-[1.9]">
                As a Royal Enfield specialist, we combine dedicated expertise with genuine parts and a personal commitment to every bike that rolls into our garage.
                Whether it&apos;s a routine service or a full engine overhaul, we treat every Royal Enfield like it&apos;s our own.
              </p>
              <p className="font-body text-muted-foreground text-[15px] lg:text-[18px] leading-[1.8] lg:leading-[1.9]">
                With two outlets across Hubballi, we are proud to be the{" "}
                <span className="text-foreground font-medium">trusted home</span> for hundreds of Royal Enfield riders across Karnataka.
              </p>
            </div>



            {/* Credentials 2×2 grid */}
            <div className="grid grid-cols-2 gap-3 mb-9">
              {credentials.map(({ icon: Icon, label, sub }) => (
                <div key={label}
                  className="group relative rounded-2xl p-4 border border-[#ebebeb] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(254,36,20,0.10)] transition-all duration-300 overflow-hidden cursor-default"
                >
                  {/* Bottom crimson stripe on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-primary-light scale-x-0 group-hover:scale-x-100 transition-transform duration-400 rounded-b-2xl" />
                  <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-heading font-bold text-foreground text-[13px] uppercase tracking-wide leading-tight">{label}</p>
                  <p className="font-label text-muted-foreground text-[10px] sm:text-[11px] mt-0.5 tracking-wider">{sub}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://wa.me/919742291701" target="_blank" rel="noopener noreferrer"
                className="group relative w-full sm:w-auto flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-2xl font-heading font-bold text-[14px] uppercase tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_28px_rgba(254,36,20,0.30)] hover:-translate-y-0.5 overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <MessageCircle className="h-5 w-5" />
                Book Your Service Today
              </a>
              <Link href="/about"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-foreground border border-[#e5e5e5] hover:border-primary/30 hover:text-primary px-6 py-3.5 rounded-2xl font-heading font-bold text-[14px] uppercase tracking-[0.1em] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Our Full Story <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
