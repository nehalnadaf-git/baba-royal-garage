"use client";

import { useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import BookingModal from "@/components/booking/BookingModal";

export default function HomeHero() {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <>
      <HeroSection onBookingClick={() => setBookingOpen(true)} />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
