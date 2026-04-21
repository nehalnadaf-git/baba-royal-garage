"use client";

import { motion } from "framer-motion";

interface ShutterSlatsProps {
  isOpening: boolean;
  prefersReducedMotion: boolean;
}

const SHUTTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ShutterSlats({ isOpening, prefersReducedMotion }: ShutterSlatsProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.09) 3px, rgba(255,255,255,0.03) 6px, rgba(255,255,255,0) 10px)",
        }}
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 h-16"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.22), rgba(0,0,0,0))",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.8)",
        }}
        initial={false}
        animate={
          isOpening && !prefersReducedMotion
            ? { opacity: 0, y: -20 }
            : { opacity: 1, y: 0 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.3, ease: "easeOut" }
            : { duration: 3.4, ease: SHUTTER_EASE }
        }
      />
    </div>
  );
}
