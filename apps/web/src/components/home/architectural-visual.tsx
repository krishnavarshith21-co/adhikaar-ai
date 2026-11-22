"use client";

import { useState } from "react";
import Image from "next/image";

interface ArchitecturalVisualProps {
  className?: string;
}

export function ArchitecturalVisual({ className = "" }: ArchitecturalVisualProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative w-full h-full min-h-[320px] sm:min-h-[420px] lg:min-h-0 overflow-hidden bg-[#172943] ${className}`}
      aria-label="Indian Heritage Palace Architectural Artwork"
    >
      {/* Primary: Standalone High-Res Clean Heritage Architecture Photograph */}
      {!imageError && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/architectural-archway.jpg"
            alt="Indian Heritage Palace Classical Archway"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center lg:object-center"
            priority
            onError={() => setImageError(true)}
          />

          {/* Left-edge smooth integration gradient into Midnight Sapphire background (Desktop) */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-44 xl:w-56 bg-gradient-to-r from-[#172943] via-[#172943]/75 via-25% via-[#172943]/30 to-transparent z-[1] pointer-events-none" />

          {/* Top-edge ambient lighting gradient */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#172943]/60 via-transparent to-transparent z-[1] pointer-events-none" />

          {/* Bottom-edge transition gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#172943]/80 via-[#172943]/25 to-transparent z-[1] pointer-events-none" />
        </div>
      )}

      {/* Vector Fallback: Handcrafted Sandstone Multi-foil Archway */}
      {imageError && (
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="skyGrad" x1="400" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#faecd8" />
                <stop offset="60%" stopColor="#eed8b8" />
                <stop offset="100%" stopColor="#dfbe96" />
              </linearGradient>

              <linearGradient id="sandstoneGrad" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#dfbf96" />
                <stop offset="35%" stopColor="#c89f6b" />
                <stop offset="70%" stopColor="#b68853" />
                <stop offset="100%" stopColor="#8d6335" />
              </linearGradient>

              <linearGradient id="depthArchGrad" x1="400" y1="120" x2="400" y2="550" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d4af7e" />
                <stop offset="50%" stopColor="#b08655" />
                <stop offset="100%" stopColor="#7c532b" />
              </linearGradient>

              <linearGradient id="floorGrad" x1="400" y1="440" x2="400" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#efe5d5" />
                <stop offset="40%" stopColor="#ded1bd" />
                <stop offset="100%" stopColor="#b5a186" />
              </linearGradient>

              <radialGradient id="brassGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#f3d79b" />
                <stop offset="40%" stopColor="#b98d57" />
                <stop offset="85%" stopColor="#7a5525" />
                <stop offset="100%" stopColor="#432c0f" />
              </radialGradient>

              <pattern id="jaliGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M12 0 L24 12 L12 24 L0 12 Z M12 4 L20 12 L12 20 L4 12 Z"
                  fill="none"
                  stroke="#a67c46"
                  strokeWidth="0.8"
                  opacity="0.45"
                />
                <circle cx="12" cy="12" r="1.5" fill="#a67c46" opacity="0.5" />
              </pattern>
            </defs>

            <rect width="800" height="460" fill="url(#skyGrad)" />
            <path
              d="M260 400 Q 280 340 310 340 Q 330 340 350 370 Q 380 320 420 320 Q 460 320 490 365 Q 520 335 550 400 Z"
              fill="#808865"
              opacity="0.5"
            />
            <path
              d="M320 400 Q 340 350 370 350 Q 390 350 410 380 Q 430 340 460 340 Q 490 340 510 400 Z"
              fill="#5d6b4a"
              opacity="0.6"
            />

            <path
              d="M 330 420 L 330 260 C 330 210, 360 170, 400 170 C 440 170, 470 210, 470 260 L 470 420 Z"
              fill="#c9a77b"
              stroke="#9c7546"
              strokeWidth="2"
            />

            <path
              d="M 270 440 L 270 230 C 270 170, 310 120, 400 120 C 490 120, 530 170, 530 230 L 530 440 Z"
              fill="url(#depthArchGrad)"
              stroke="#8c6437"
              strokeWidth="3"
            />

            <path
              d="M 275 230 C 275 175, 315 125, 400 125 C 485 125, 525 175, 525 230 Z"
              fill="url(#jaliGrid)"
            />

            <polygon points="0,440 800,440 800,600 0,600" fill="url(#floorGrad)" />
            <line x1="400" y1="440" x2="400" y2="600" stroke="#c4b297" strokeWidth="1.5" />
            <line x1="400" y1="440" x2="200" y2="600" stroke="#c4b297" strokeWidth="1.5" />
            <line x1="400" y1="440" x2="0" y2="560" stroke="#c4b297" strokeWidth="1.5" />
            <line x1="400" y1="440" x2="600" y2="600" stroke="#c4b297" strokeWidth="1.5" />
            <line x1="400" y1="440" x2="800" y2="560" stroke="#c4b297" strokeWidth="1.5" />

            <path
              d="M 0 0 L 800 0 L 800 600 L 700 600 L 700 240
                 C 700 210, 670 190, 650 170
                 C 630 150, 610 130, 580 115
                 C 550 100, 510 80, 480 65
                 C 450 50, 420 40, 400 40
                 C 380 40, 350 50, 320 65
                 C 290 80, 250 100, 220 115
                 C 190 130, 170 150, 150 170
                 C 130 190, 100 210, 100 240
                 L 100 600 L 0 600 Z"
              fill="url(#sandstoneGrad)"
            />

            <circle cx="200" cy="70" r="18" fill="#e8c79c" stroke="#87582b" strokeWidth="2" />
            <circle cx="600" cy="70" r="18" fill="#e8c79c" stroke="#87582b" strokeWidth="2" />

            <rect x="70" y="240" width="35" height="340" fill="#cda877" stroke="#7e5326" strokeWidth="1.5" />
            <rect x="695" y="240" width="35" height="340" fill="#cda877" stroke="#7e5326" strokeWidth="1.5" />

            <circle cx="555" cy="525" r="30" fill="url(#brassGrad)" stroke="#6a471c" strokeWidth="2" />
            <polygon points="400,40 240,600 560,600" fill="#fff" opacity="0.08" />
          </svg>
        </div>
      )}
    </div>
  );
}
