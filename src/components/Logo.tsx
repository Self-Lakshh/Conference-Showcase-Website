import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", size = 32 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A2BE2" />
          <stop offset="50%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#00FA9A" />
        </linearGradient>
      </defs>
      
      {/* Outer Hexagon Shield Crest */}
      <polygon
        points="50,6 88,27 88,73 50,94 12,73 12,27"
        stroke="url(#logoGrad)"
        strokeWidth="4"
        fill="rgba(138, 43, 226, 0.05)"
      />
      
      {/* Network Nodes on Hexagon Vertices */}
      <circle cx="50" cy="6" r="4.5" fill="#00E5FF" />
      <circle cx="88" cy="27" r="4.5" fill="#8A2BE2" />
      <circle cx="88" cy="73" r="4.5" fill="#00FA9A" />
      <circle cx="50" cy="94" r="4.5" fill="#00E5FF" />
      <circle cx="12" cy="73" r="4.5" fill="#8A2BE2" />
      <circle cx="12" cy="27" r="4.5" fill="#00FA9A" />
      
      {/* Inner Cap/Crest Design representing Academic Research and Events */}
      <path
        d="M50 23 L78 37 L50 51 L22 37 Z"
        fill="url(#logoGrad)"
        opacity="0.95"
      />
      <path
        d="M32 45 V62 C32 66 40 71 50 71 C60 71 68 66 68 62 V45 L50 53.5 Z"
        fill="url(#logoGrad)"
        opacity="0.85"
      />
      
      {/* Cap tassel cord and pendant */}
      <path
        d="M71 40.5 V54"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="71" cy="55.5" r="2.2" fill="#FFFFFF" />
    </svg>
  );
};
