import React from 'react';

/**
 * FixMate Official Logo Component
 * 
 * Props:
 *   size: 'sm' | 'md' | 'lg'
 *   showWordmark: boolean (default true)
 *   showTagline: boolean (default false)
 *   onDark: boolean — set true when rendering on navy/dark backgrounds (footer)
 *   className: extra className
 */
const Logo = ({ size = 'md', showWordmark = true, showTagline = false, onDark = false, className = '' }) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-sm', tagline: 'text-[7px]' },
    md: { icon: 38, text: 'text-lg', tagline: 'text-[9px]' },
    lg: { icon: 56, text: 'text-2xl', tagline: 'text-xs' }
  }[size] || { icon: 38, text: 'text-lg', tagline: 'text-[9px]' };

  // On dark (footer), wordmark is white; on light (navbar), wordmark is navy
  const wordmarkColor = onDark ? '#FFFFFF' : '#1B225B';
  const taglineColor = onDark ? '#39A8C7' : '#1B225B';
  const taglineLineColor = '#39A8C7';

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Official FixMate Pinwheel Shard Mark — Navy + Cyan accent */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="FixMate logo mark"
      >
        {/* Top horizontal arm (Navy) */}
        <path d="M 80 18 H 148 L 148 36 H 100 L 100 58 H 80 Z" fill="#1B225B" />

        {/* Right vertical arm (Navy) */}
        <path d="M 154 56 V 126 H 136 V 80 H 114 V 62 H 154 Z" fill="#1B225B" />

        {/* Left vertical arm (Navy) */}
        <path d="M 46 78 V 24 H 64 V 70 H 86 V 86 H 46 Z" fill="#1B225B" />

        {/* Bottom arm — Cyan Accent #39A8C7 */}
        <path d="M 62 100 H 108 L 124 136 H 108 L 96 112 H 54 Z" fill="#39A8C7" />

        {/* Center letter F (Navy) */}
        <rect x="90" y="63" width="14" height="4" fill="#1B225B" />
        <rect x="90" y="63" width="4" height="24" fill="#1B225B" />
        <rect x="90" y="74" width="11" height="4" fill="#1B225B" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none justify-center">
          <span
            className={`font-heading font-extrabold tracking-tight leading-none ${dimensions.text}`}
            style={{ color: wordmarkColor }}
          >
            FIXMATE
          </span>
          {showTagline && (
            <div className="flex items-center space-x-1 mt-1">
              <span className="h-[1.5px] w-2.5" style={{ backgroundColor: taglineLineColor }} />
              <span
                className={`font-heading font-bold uppercase tracking-[0.12em] ${dimensions.tagline}`}
                style={{ color: taglineColor }}
              >
                FIX IT FAST
              </span>
              <span className="h-[1.5px] w-2.5" style={{ backgroundColor: taglineLineColor }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
