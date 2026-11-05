import React from 'react';

export default function AnimatedQRBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Radiant Golden Ambient Radial Glows */}
      <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] animate-glow-pulse" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[160px] animate-glow-pulse" style={{ animationDelay: '3s' }} />
      <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-amber-400/8 rounded-full blur-[130px] animate-glow-pulse" style={{ animationDelay: '5s' }} />

      {/* Floating QR Code 1 - Top Left */}
      <div
        className="absolute top-16 left-[4%] opacity-25 sm:opacity-35 animate-qr-float-1"
        style={{ width: '180px', height: '180px' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Top-Left Eye */}
          <rect x="8" y="8" width="28" height="28" rx="7" stroke="currentColor" strokeWidth="2.5" />
          <rect x="15" y="15" width="14" height="14" rx="3.5" fill="currentColor" />

          {/* Top-Right Eye */}
          <rect x="64" y="8" width="28" height="28" rx="7" stroke="currentColor" strokeWidth="2.5" />
          <rect x="71" y="15" width="14" height="14" rx="3.5" fill="currentColor" />

          {/* Bottom-Left Eye */}
          <rect x="8" y="64" width="28" height="28" rx="7" stroke="currentColor" strokeWidth="2.5" />
          <rect x="15" y="71" width="14" height="14" rx="3.5" fill="currentColor" />

          {/* Data Modules */}
          <rect x="42" y="12" width="6" height="6" rx="1.5" fill="currentColor" />
          <rect x="52" y="20" width="6" height="6" rx="1.5" fill="currentColor" />
          <rect x="44" y="44" width="12" height="12" rx="3" fill="currentColor" opacity="0.9" />
          <rect x="64" y="44" width="6" height="6" rx="1.5" fill="currentColor" />
          <rect x="76" y="52" width="8" height="8" rx="2" fill="currentColor" />
          <rect x="42" y="68" width="8" height="8" rx="2" fill="currentColor" />
          <rect x="62" y="74" width="10" height="6" rx="1.5" fill="currentColor" />
          <rect x="80" y="80" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Floating QR Code 2 - Top Right */}
      <div
        className="absolute top-24 right-[5%] opacity-25 sm:opacity-35 animate-qr-float-2"
        style={{ width: '220px', height: '220px' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.25)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Top-Left Eye */}
          <rect x="6" y="6" width="30" height="30" rx="8" stroke="currentColor" strokeWidth="3" />
          <rect x="14" y="14" width="14" height="14" rx="4" fill="currentColor" />

          {/* Top-Right Eye */}
          <rect x="64" y="6" width="30" height="30" rx="8" stroke="currentColor" strokeWidth="3" />
          <rect x="72" y="14" width="14" height="14" rx="4" fill="currentColor" />

          {/* Bottom-Left Eye */}
          <rect x="6" y="64" width="30" height="30" rx="8" stroke="currentColor" strokeWidth="3" />
          <rect x="14" y="72" width="14" height="14" rx="4" fill="currentColor" />

          {/* Center Hologram Pattern */}
          <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" opacity="0.8" />
          <rect x="42" y="24" width="6" height="6" rx="2" fill="currentColor" />
          <rect x="52" y="14" width="6" height="6" rx="2" fill="currentColor" />
          <rect x="44" y="70" width="8" height="8" rx="2" fill="currentColor" />
          <rect x="68" y="46" width="8" height="8" rx="2" fill="currentColor" />
          <rect x="80" y="66" width="10" height="10" rx="2" fill="currentColor" />
        </svg>
      </div>

      {/* Floating QR Code 3 - Mid-Left */}
      <div
        className="absolute top-[42%] left-[2%] opacity-20 sm:opacity-30 animate-qr-float-3"
        style={{ width: '150px', height: '150px' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.25)]"
          fill="none"
        >
          <rect x="10" y="10" width="26" height="26" rx="5" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="23" cy="23" r="5" fill="currentColor" />
          <rect x="64" y="10" width="26" height="26" rx="5" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="77" cy="23" r="5" fill="currentColor" />
          <rect x="10" y="64" width="26" height="26" rx="5" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="23" cy="77" r="5" fill="currentColor" />

          <rect x="44" y="18" width="6" height="6" rx="1.5" fill="currentColor" />
          <rect x="46" y="44" width="8" height="8" rx="2" fill="currentColor" />
          <rect x="68" y="52" width="6" height="6" rx="1.5" fill="currentColor" />
          <rect x="54" y="74" width="8" height="8" rx="2" fill="currentColor" />
        </svg>
      </div>

      {/* Floating QR Code 4 - Mid-Right */}
      <div
        className="absolute top-[52%] right-[3%] opacity-20 sm:opacity-30 animate-qr-float-4"
        style={{ width: '175px', height: '175px' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-yellow-500 drop-shadow-[0_0_18px_rgba(234,179,8,0.25)]"
          fill="none"
        >
          <rect x="8" y="8" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" />
          <rect x="15" y="15" width="14" height="14" rx="2" fill="currentColor" />
          <rect x="64" y="8" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" />
          <rect x="71" y="15" width="14" height="14" rx="2" fill="currentColor" />
          <rect x="8" y="64" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" />
          <rect x="15" y="71" width="14" height="14" rx="2" fill="currentColor" />
          <rect x="45" y="45" width="10" height="10" rx="3" fill="currentColor" />
          <rect x="65" y="65" width="8" height="8" rx="2" fill="currentColor" />
          <rect x="78" y="45" width="8" height="8" rx="2" fill="currentColor" />
        </svg>
      </div>

      {/* Floating QR Code 5 - Bottom-Left */}
      <div
        className="absolute bottom-20 left-[8%] opacity-15 sm:opacity-25 animate-qr-float-2"
        style={{ width: '160px', height: '160px', animationDelay: '-6s' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="10" y="10" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="2.5" />
          <rect x="17" y="17" width="12" height="12" rx="2" fill="currentColor" />
          <rect x="64" y="10" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="2.5" />
          <rect x="71" y="17" width="12" height="12" rx="2" fill="currentColor" />
          <rect x="10" y="64" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="2.5" />
          <rect x="17" y="71" width="12" height="12" rx="2" fill="currentColor" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <rect x="42" y="72" width="6" height="6" rx="1.5" fill="currentColor" />
          <rect x="72" y="42" width="6" height="6" rx="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Floating QR Code 6 - Bottom-Right */}
      <div
        className="absolute bottom-24 right-[10%] opacity-20 sm:opacity-30 animate-qr-float-1"
        style={{ width: '200px', height: '200px', animationDelay: '-11s' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          fill="none"
        >
          <rect x="8" y="8" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" />
          <rect x="15" y="15" width="14" height="14" rx="2" fill="currentColor" />
          <rect x="64" y="8" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" />
          <rect x="71" y="15" width="14" height="14" rx="2" fill="currentColor" />
          <rect x="8" y="64" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" />
          <rect x="15" y="71" width="14" height="14" rx="2" fill="currentColor" />
          <rect x="45" y="45" width="10" height="10" rx="3" fill="currentColor" />
          <rect x="65" y="65" width="8" height="8" rx="2" fill="currentColor" />
          <rect x="78" y="45" width="8" height="8" rx="2" fill="currentColor" />
        </svg>
      </div>

      {/* Kinetic Golden Laser Scan Sweeper */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-[2px] animate-laser-scan pointer-events-none" />

      {/* Delicate Matrix Grid Dots Layer */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
}
