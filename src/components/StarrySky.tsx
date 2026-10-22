"use client";

import React from "react";
import "./StarrySky.css";

// Deterministic star field data to ensure SSR consistency and zero layout shift
interface StarData {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
  minOp: number;
  maxOp: number;
  color?: string;
}

const DOT_STARS: StarData[] = [
  // Cluster on right open area (most prominent)
  { id: 1, top: "14%", left: "78%", size: 2.2, duration: "3.2s", delay: "0s", minOp: 0.3, maxOp: 1, color: "#ffffff" },
  { id: 2, top: "18%", left: "86%", size: 1.6, duration: "2.6s", delay: "0.8s", minOp: 0.25, maxOp: 0.9, color: "#bfdbfe" },
  { id: 3, top: "25%", left: "72%", size: 2.5, duration: "4.1s", delay: "1.4s", minOp: 0.4, maxOp: 1, color: "#fef08a" },
  { id: 4, top: "28%", left: "91%", size: 1.8, duration: "3.5s", delay: "0.3s", minOp: 0.3, maxOp: 0.95, color: "#ffffff" },
  { id: 5, top: "33%", left: "65%", size: 1.5, duration: "2.8s", delay: "2.1s", minOp: 0.2, maxOp: 0.85, color: "#bae6fd" },
  { id: 6, top: "39%", left: "81%", size: 2.4, duration: "3.8s", delay: "1.7s", minOp: 0.35, maxOp: 1, color: "#ffffff" },
  { id: 7, top: "44%", left: "94%", size: 1.4, duration: "2.4s", delay: "0.6s", minOp: 0.25, maxOp: 0.8, color: "#e0e7ff" },
  { id: 8, top: "52%", left: "75%", size: 2.0, duration: "3.1s", delay: "2.5s", minOp: 0.3, maxOp: 0.95, color: "#ffffff" },
  { id: 9, top: "58%", left: "88%", size: 1.7, duration: "4.4s", delay: "1.1s", minOp: 0.2, maxOp: 0.9, color: "#fef9c3" },
  { id: 10, top: "66%", left: "68%", size: 2.2, duration: "3.6s", delay: "0.4s", minOp: 0.3, maxOp: 1, color: "#ffffff" },
  { id: 11, top: "71%", left: "83%", size: 1.8, duration: "2.9s", delay: "2.8s", minOp: 0.25, maxOp: 0.9, color: "#93c5fd" },
  { id: 12, top: "79%", left: "92%", size: 2.4, duration: "4.0s", delay: "1.9s", minOp: 0.35, maxOp: 1, color: "#ffffff" },
  { id: 13, top: "84%", left: "77%", size: 1.5, duration: "2.5s", delay: "0.7s", minOp: 0.2, maxOp: 0.8, color: "#ffffff" },
  { id: 14, top: "89%", left: "85%", size: 2.0, duration: "3.4s", delay: "2.2s", minOp: 0.3, maxOp: 0.95, color: "#fef08a" },

  // Upper middle and sky canopy
  { id: 15, top: "8%", left: "55%", size: 2.0, duration: "3.7s", delay: "1.0s", minOp: 0.3, maxOp: 0.95, color: "#ffffff" },
  { id: 16, top: "12%", left: "64%", size: 1.5, duration: "2.8s", delay: "2.4s", minOp: 0.2, maxOp: 0.85, color: "#bae6fd" },
  { id: 17, top: "19%", left: "52%", size: 2.3, duration: "4.3s", delay: "0.5s", minOp: 0.35, maxOp: 1, color: "#ffffff" },
  { id: 18, top: "7%", left: "40%", size: 1.6, duration: "3.0s", delay: "1.8s", minOp: 0.25, maxOp: 0.9, color: "#ffffff" },
  { id: 19, top: "15%", left: "34%", size: 1.8, duration: "3.5s", delay: "2.7s", minOp: 0.2, maxOp: 0.85, color: "#fef9c3" },
  { id: 20, top: "9%", left: "22%", size: 2.1, duration: "4.0s", delay: "0.9s", minOp: 0.3, maxOp: 0.95, color: "#ffffff" },
  { id: 21, top: "14%", left: "12%", size: 1.4, duration: "2.7s", delay: "1.5s", minOp: 0.2, maxOp: 0.75, color: "#bae6fd" },
  { id: 22, top: "6%", left: "8%", size: 1.7, duration: "3.3s", delay: "2.0s", minOp: 0.25, maxOp: 0.8, color: "#ffffff" },

  // Micro ambient stars across the whole width
  { id: 23, top: "22%", left: "44%", size: 1.2, duration: "2.2s", delay: "1.2s", minOp: 0.2, maxOp: 0.7 },
  { id: 24, top: "31%", left: "58%", size: 1.3, duration: "3.9s", delay: "0.1s", minOp: 0.2, maxOp: 0.75 },
  { id: 25, top: "47%", left: "62%", size: 1.2, duration: "2.9s", delay: "2.3s", minOp: 0.2, maxOp: 0.7 },
  { id: 26, top: "60%", left: "55%", size: 1.4, duration: "3.6s", delay: "1.6s", minOp: 0.2, maxOp: 0.8 },
  { id: 27, top: "74%", left: "60%", size: 1.3, duration: "4.2s", delay: "0.8s", minOp: 0.2, maxOp: 0.75 },
  { id: 28, top: "86%", left: "50%", size: 1.2, duration: "2.7s", delay: "1.9s", minOp: 0.15, maxOp: 0.7 },
  { id: 29, top: "92%", left: "67%", size: 1.5, duration: "3.2s", delay: "0.3s", minOp: 0.2, maxOp: 0.8 },

  // Subtle background stars in left zone (softly visible behind text)
  { id: 30, top: "27%", left: "18%", size: 1.2, duration: "3.4s", delay: "2.9s", minOp: 0.15, maxOp: 0.6 },
  { id: 31, top: "36%", left: "28%", size: 1.3, duration: "2.6s", delay: "1.1s", minOp: 0.15, maxOp: 0.65 },
  { id: 32, top: "49%", left: "15%", size: 1.1, duration: "3.8s", delay: "0.5s", minOp: 0.15, maxOp: 0.55 },
  { id: 33, top: "63%", left: "24%", size: 1.3, duration: "3.0s", delay: "2.2s", minOp: 0.15, maxOp: 0.6 },
  { id: 34, top: "78%", left: "12%", size: 1.2, duration: "4.1s", delay: "1.4s", minOp: 0.15, maxOp: 0.55 },
  { id: 35, top: "88%", left: "29%", size: 1.4, duration: "2.8s", delay: "0.7s", minOp: 0.2, maxOp: 0.65 },

  // Far right edge depth stars
  { id: 36, top: "11%", left: "95%", size: 1.6, duration: "3.5s", delay: "1.7s", minOp: 0.25, maxOp: 0.85 },
  { id: 37, top: "21%", left: "97%", size: 1.3, duration: "2.9s", delay: "0.2s", minOp: 0.2, maxOp: 0.75 },
  { id: 38, top: "54%", left: "97%", size: 1.7, duration: "4.0s", delay: "2.6s", minOp: 0.25, maxOp: 0.85 },
  { id: 39, top: "68%", left: "96%", size: 1.4, duration: "3.1s", delay: "1.3s", minOp: 0.2, maxOp: 0.8 },
  { id: 40, top: "82%", left: "98%", size: 1.5, duration: "2.5s", delay: "0.5s", minOp: 0.2, maxOp: 0.75 },

  // Additional cosmic shimmer particles
  { id: 41, top: "16%", left: "74%", size: 1.0, duration: "2.1s", delay: "0.9s", minOp: 0.2, maxOp: 0.7 },
  { id: 42, top: "23%", left: "82%", size: 1.1, duration: "3.3s", delay: "1.6s", minOp: 0.25, maxOp: 0.75 },
  { id: 43, top: "35%", left: "76%", size: 1.0, duration: "2.7s", delay: "2.4s", minOp: 0.2, maxOp: 0.7 },
  { id: 44, top: "42%", left: "87%", size: 1.2, duration: "3.8s", delay: "0.4s", minOp: 0.25, maxOp: 0.8 },
  { id: 45, top: "48%", left: "70%", size: 1.0, duration: "2.4s", delay: "1.8s", minOp: 0.2, maxOp: 0.65 },
  { id: 46, top: "62%", left: "80%", size: 1.1, duration: "3.6s", delay: "0.9s", minOp: 0.2, maxOp: 0.75 },
  { id: 47, top: "75%", left: "75%", size: 1.0, duration: "2.9s", delay: "2.1s", minOp: 0.2, maxOp: 0.7 },
  { id: 48, top: "83%", left: "89%", size: 1.2, duration: "3.5s", delay: "1.3s", minOp: 0.25, maxOp: 0.8 },
  { id: 49, top: "94%", left: "80%", size: 1.0, duration: "2.6s", delay: "0.2s", minOp: 0.2, maxOp: 0.65 },
  { id: 50, top: "5%", left: "69%", size: 1.3, duration: "3.0s", delay: "1.5s", minOp: 0.25, maxOp: 0.8 }
];

// Brilliant 4-pointed sparkle stars
interface SparkleStar {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
  color: string;
  glowColor: string;
}

const SPARKLE_STARS: SparkleStar[] = [
  { id: 1, top: "18%", left: "82%", size: 22, duration: "3.4s", delay: "0s", color: "#ffffff", glowColor: "rgba(147, 197, 253, 0.9)" },
  { id: 2, top: "46%", left: "73%", size: 18, duration: "4.2s", delay: "1.3s", color: "#e0f2fe", glowColor: "rgba(56, 189, 248, 0.85)" },
  { id: 3, top: "74%", left: "86%", size: 20, duration: "3.8s", delay: "2.1s", color: "#fef9c3", glowColor: "rgba(253, 224, 71, 0.8)" },
  { id: 4, top: "24%", left: "61%", size: 16, duration: "4.6s", delay: "0.8s", color: "#ffffff", glowColor: "rgba(255, 255, 255, 0.85)" },
  { id: 5, top: "32%", left: "92%", size: 17, duration: "3.6s", delay: "2.7s", color: "#bae6fd", glowColor: "rgba(125, 211, 252, 0.8)" },
  { id: 6, top: "11%", left: "44%", size: 15, duration: "4.0s", delay: "1.8s", color: "#ffffff", glowColor: "rgba(199, 210, 254, 0.8)" },
];

export interface StarrySkyProps {
  className?: string;
  showMeteors?: boolean;
  showConstellation?: boolean;
}

export default function StarrySky({
  className = "",
  showMeteors = true,
  showConstellation = true,
}: StarrySkyProps) {
  return (
    <div className={`starry-sky-container ${className}`} aria-hidden="true">
      {/* Cosmic Nebula Glows */}
      <div className="starry-nebula starry-nebula-1" />
      <div className="starry-nebula starry-nebula-2" />

      {/* Architectural Constellation Lines (Geometric blueprint of the stars) */}
      {showConstellation && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 sm:opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Constellation lines on right hemisphere */}
          <line x1="61%" y1="24%" x2="73%" y2="46%" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="73%" y1="46%" x2="82%" y2="18%" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="82%" y1="18%" x2="92%" y2="32%" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="73%" y1="46%" x2="86%" y2="74%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="86%" y1="74%" x2="92%" y2="32%" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="44%" y1="11%" x2="61%" y2="24%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" strokeDasharray="3 4" />

          {/* Node halos */}
          <circle cx="82%" cy="18%" r="4" fill="none" stroke="rgba(147, 197, 253, 0.3)" strokeWidth="1" />
          <circle cx="73%" cy="46%" r="3.5" fill="none" stroke="rgba(147, 197, 253, 0.25)" strokeWidth="1" />
          <circle cx="86%" cy="74%" r="4" fill="none" stroke="rgba(253, 224, 71, 0.3)" strokeWidth="1" />
        </svg>
      )}

      {/* Dot Stars */}
      {DOT_STARS.map((star) => (
        <span
          key={star.id}
          className="starry-dot"
          style={
            {
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color || "#ffffff",
              boxShadow: star.size > 1.8 ? `0 0 ${star.size * 2}px ${star.color || "#ffffff"}` : undefined,
              animationDuration: star.duration,
              animationDelay: star.delay,
              "--min-op": star.minOp,
              "--max-op": star.maxOp,
            } as React.CSSProperties
          }
        />
      ))}

      {/* 4-Point Brilliant Sparkle Stars */}
      {SPARKLE_STARS.map((sparkle) => (
        <div
          key={sparkle.id}
          className="starry-sparkle"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            transform: "translate(-50%, -50%)",
            animationDuration: sparkle.duration,
            animationDelay: sparkle.delay,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={sparkle.size}
            height={sparkle.size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center Core Glow */}
            <circle cx="12" cy="12" r="3" fill={sparkle.color} />
            {/* 4-pointed diamond star rays */}
            <path
              d="M12 0 C12 7 7 12 0 12 C7 12 12 17 12 24 C12 17 17 12 24 12 C17 12 12 7 12 0 Z"
              fill={sparkle.color}
            />
            {/* Diagonal subtle micro rays */}
            <path
              d="M12 6 C12 9.5 9.5 12 6 12 C9.5 12 12 14.5 12 18 C12 14.5 14.5 12 18 12 C14.5 12 12 9.5 12 6 Z"
              fill={sparkle.color}
              opacity="0.6"
              transform="rotate(45 12 12)"
            />
          </svg>
        </div>
      ))}

      {/* Shooting Stars / Meteors */}
      {showMeteors && (
        <>
          <div className="starry-meteor starry-meteor-1" />
          <div className="starry-meteor starry-meteor-2" />
        </>
      )}

      {/* Vignette Layer for readability */}
      <div className="starry-vignette" />
    </div>
  );
}
