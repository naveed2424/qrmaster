import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Reference Dual-Eye Scanner Mark from the PDF Screenshot */}
      <div
        className={`${iconSizes[size]} relative shrink-0 p-1 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-[1.5px] shadow-[0_0_15px_rgba(251,191,36,0.3)]`}
      >
        <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center p-1 relative overflow-hidden">
          <svg viewBox="0 0 28 28" fill="none" className="w-full h-full text-amber-400">
            {/* Top-Left Finder Eye */}
            <rect x="2" y="2" width="10" height="10" rx="3" stroke="#facc15" strokeWidth="2.2" />
            <rect x="5" y="5" width="4" height="4" rx="1.2" fill="#fde047" />

            {/* Top-Right Finder Eye */}
            <rect x="16" y="2" width="10" height="10" rx="3" stroke="#facc15" strokeWidth="2.2" />
            <rect x="19" y="5" width="4" height="4" rx="1.2" fill="#fde047" />

            {/* Bottom-Left Finder Eye */}
            <rect x="2" y="16" width="10" height="10" rx="3" stroke="#facc15" strokeWidth="2.2" />
            <rect x="5" y="19" width="4" height="4" rx="1.2" fill="#fde047" />

            {/* Bottom-Right Alignment Pattern Dots (Matching reference site) */}
            <circle cx="20" cy="18" r="2" fill="#facc15" />
            <circle cx="20" cy="24" r="2" fill="#eab308" />
          </svg>
        </div>
      </div>

      {/* Typography: 2qrcode.com */}
      <div className="flex items-center text-left leading-none">
        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
          <span className="text-gold-gradient">2qrcode</span>
          <span className="text-zinc-200">.com</span>
        </span>
      </div>
    </div>
  );
}
