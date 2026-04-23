"use client";

import React from "react";

interface BookServiceButtonProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  children?: React.ReactNode;
}

/**
 * A lightweight client component that opens the global booking modal
 * by dispatching a custom DOM event. Works from any Server Component page.
 */
export default function BookServiceButton({
  className = "",
  style,
  label = "Book Service",
  children,
}: BookServiceButtonProps) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("open-booking"));
  }

  return (
    <button onClick={handleClick} className={`group relative ${className}`} style={style}>
      {/* Shimmer sweep — identical to Navbar Book Service button */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      <span className="relative">{children ?? label}</span>
    </button>
  );
}
