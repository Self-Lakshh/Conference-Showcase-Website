import React, { useState } from "react";

interface SafeLogoProps {
  src?: string;
  name: string;
  className?: string;
}

export const SafeLogo: React.FC<SafeLogoProps> = ({ src, name, className = "h-6 w-6" }) => {
  const [hasError, setHasError] = useState(false);

  // Generate clean initials (e.g. "MIT" -> "MT", "Stanford University" -> "SU")
  const getInitials = (fullName: string) => {
    const cleanName = fullName.replace(/^(Dr\.|Prof\.)\s+/i, "");
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  // If no source or failed to load, render a gorgeous HSL gradient badge matching the design system
  if (!src || hasError) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Tailored color palettes (avoid boring greys, generate vivid HSL dark gradients)
    const hue = Math.abs(hash % 360);
    const fallbackBg = `linear-gradient(135deg, hsl(${hue}, 70%, 35%) 0%, hsl(${(hue + 45) % 360}, 80%, 15%) 100%)`;

    return (
      <div
        className={`${className} flex items-center justify-center rounded font-mono text-[9px] font-bold text-white border border-white/10 select-none shadow-sm`}
        style={{ background: fallbackBg }}
        title={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  // Rewrite any legacy clearbit URLs to the new hunter.io logo service
  const safeSrc = src.replace("logo.clearbit.com", "logos.hunter.io");

  return (
    <img
      src={safeSrc}
      alt={name}
      className={`${className} object-contain rounded invert brightness-200`}
      onError={() => setHasError(true)}
    />
  );
};
