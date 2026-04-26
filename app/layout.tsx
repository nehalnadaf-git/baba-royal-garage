import type { Metadata } from "next";
import { Bebas_Neue, Barlow, Barlow_Condensed, Inter, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { business } from "@/lib/business";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-subheading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-tech",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: "Baba Royal Garage | Royal Enfield Specialist Hubli",
    template: "%s | Baba Royal Garage - Royal Enfield Specialist Hubli",
  },
  description:
    "Royal Enfield specialist in Hubli for expert servicing, genuine parts, engine repair, and doorstep pickup by Baba Royal Garage's trusted expert team.",
  keywords: [
    "Royal Enfield service Hubli",
    "Royal Enfield repair Hubli",
    "Baba Royal Garage",
    "RE mechanic Hubli",
    "Royal Enfield specialist Hubli",
  ],
  authors: [{ name: "Baba Royal Garage" }],
  creator: "Baba Royal Garage",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: business.url,
    siteName: "Baba Royal Garage",
    title: "Baba Royal Garage | Royal Enfield Specialist Hubli",
    description: "Royal Enfield specialist in Hubli for expert servicing, genuine parts, engine repair, and doorstep pickup by Baba Royal Garage's trusted expert team.",
    images: [{ url: "/ogimage/og-image.jpg", width: 1200, height: 630, alt: "Baba Royal Garage Royal Enfield specialist workshop in Hubli" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baba Royal Garage | Royal Enfield Specialist Hubli",
    description: "Royal Enfield specialist in Hubli for expert servicing, genuine parts, engine repair, and doorstep pickup by Baba Royal Garage's trusted expert team.",
    images: ["/ogimage/og-image.jpg"],
  },
  alternates: { canonical: business.url },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable} ${inter.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Baba" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#FE2414" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
