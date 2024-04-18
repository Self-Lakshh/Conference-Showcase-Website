// PageHero.tsx — Reusable animated page banner used on every inner page

import React, { useRef } from "react";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle: string;
  accentWord?: string;   // word to highlight with gradient
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, accentWord, children }) => {
  // Split title so we can gradient the accent word
  const parts = accentWord ? title.split(accentWord) : [title];

  return (
    <div className="relative overflow-hidden py-16 md:py-20 mb-10">

      {/* ── Video background (same as hero) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay muted loop playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.10, filter: "saturate(1.4)" }}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-network-of-illuminated-points-4894-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* gradient fade top + bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--c-bg) 0%, transparent 25%, transparent 75%, var(--c-bg) 100%)",
          }}
        />
      </div>

      {/* ── Floating orbs ── */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-[10%] h-40 w-40 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(79,110,247,0.20) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-6 right-[12%] h-52 w-52 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(124,90,245,0.15) 0%, transparent 70%)",
          filter: "blur(36px)",
        }}
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-2 left-[40%] h-32 w-32 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(6,214,160,0.12) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <h1 className="heading-display text-4xl md:text-5xl mb-3">
            {accentWord ? (
              <>
                {parts[0]}
                <span className="text-gradient-blue">{accentWord}</span>
                {parts[1]}
              </>
            ) : (
              <span>{title}</span>
            )}
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--c-text-2)" }}>
            {subtitle}
          </p>
        </motion.div>

        {/* Slot for filters / search */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* Bottom divider */}
      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </div>
  );
};
