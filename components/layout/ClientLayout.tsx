"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import BookingModal from "@/components/booking/BookingModal";
import { useEngineSound } from "@/components/ShutterIntro/useEngineSound";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import ShutterIntro from "@/components/ShutterIntro/ShutterIntro";

const INTRO_BRAND_TRIGGER_SESSION_KEY = "brg-shutter-intro-brand-trigger";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [sessionIntroShown, setSessionIntroShown] = useState(false);
  const [introComplete, setIntroComplete] = useState(true);
  const [showIntro, setShowIntro] = useState(pathname === "/");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useScrollAnimation();
  useEngineSound({
    enabled: pathname === "/" && !prefersReducedMotion,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onChange = () => {
      setPrefersReducedMotion(media.matches);
    };

    onChange();
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Only handle intro logic if we are on the home page
    if (pathname !== "/") {
      setShowIntro(false);
      setIntroComplete(true);
      return;
    }

    // If we are on home and haven't shown the intro this session, show it
    if (!sessionIntroShown) {
      setShowIntro(true);
      setIntroComplete(false);
    } else {
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, [pathname, sessionIntroShown]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setIntroComplete(true);
    setSessionIntroShown(true);
  }, []);

  /* Listen for the global "open-booking" event fired by BookServiceButton */
  useEffect(() => {
    const handler = () => setBookingOpen(true);
    window.addEventListener("open-booking", handler);
    return () => window.removeEventListener("open-booking", handler);
  }, []);

  return (
    <>
      {pathname === "/" && showIntro ? <ShutterIntro onComplete={handleIntroComplete} /> : null}
      <Navbar onBookingClick={() => setBookingOpen(true)} />
      <main>{children}</main>
      <Footer />

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
