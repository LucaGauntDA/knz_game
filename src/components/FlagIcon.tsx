import React from 'react';

interface FlagIconProps {
  oval: string;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ oval, className = 'w-full h-full' }) => {
  // Render SVG flags directly for offline resilience, sharp edges on retina displays, and instant loads
  const renderFlagSvg = () => {
    switch (oval) {
      case 'RKS': // Kosovo
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#002B7F" />
            <path
              d="M 230 180 Q 250 140 300 140 Q 360 145 375 190 Q 380 230 350 255 Q 310 270 270 260 Q 240 230 230 180 Z"
              fill="#D0A650"
            />
            {/* 6 stars in arch */}
            {[
              [240, 120],
              [265, 110],
              [290, 105],
              [315, 105],
              [340, 110],
              [365, 120],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="7" fill="#FFFFFF" />
            ))}
          </svg>
        );

      case 'D': // Germany
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#000000" />
            <rect y="133.3" width="600" height="133.3" fill="#DD0000" />
            <rect y="266.6" width="600" height="133.4" fill="#FFCE00" />
          </svg>
        );

      case 'A': // Austria
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#ED2939" />
            <rect y="133.3" width="600" height="133.3" fill="#FFFFFF" />
            <rect y="266.6" width="600" height="133.4" fill="#ED2939" />
          </svg>
        );

      case 'CH': // Switzerland
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#D52B1E" />
            <rect x="260" y="80" width="80" height="240" fill="#FFFFFF" />
            <rect x="180" y="160" width="240" height="80" fill="#FFFFFF" />
          </svg>
        );

      case 'F': // France
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="400" fill="#002395" />
            <rect x="200" width="200" height="400" fill="#FFFFFF" />
            <rect x="400" width="200" height="400" fill="#ED2939" />
          </svg>
        );

      case 'I': // Italy
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="400" fill="#009246" />
            <rect x="200" width="200" height="400" fill="#FFFFFF" />
            <rect x="400" width="200" height="400" fill="#CE2B37" />
          </svg>
        );

      case 'NL': // Netherlands
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#AE1C28" />
            <rect y="133.3" width="600" height="133.3" fill="#FFFFFF" />
            <rect y="266.6" width="600" height="133.4" fill="#21468B" />
          </svg>
        );

      case 'PL': // Poland
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="200" fill="#FFFFFF" />
            <rect y="200" width="600" height="200" fill="#DC143C" />
          </svg>
        );

      case 'CZ': // Czech Republic
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="200" fill="#FFFFFF" />
            <rect y="200" width="600" height="200" fill="#D7141A" />
            <polygon points="0,0 300,200 0,400" fill="#11457E" />
          </svg>
        );

      case 'E': // Spain
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="100" fill="#AA151B" />
            <rect y="100" width="600" height="200" fill="#F1BF00" />
            <rect y="300" width="600" height="100" fill="#AA151B" />
            {/* Coat of arms simplified silhouette */}
            <circle cx="160" cy="200" r="28" fill="#AA151B" opacity="0.8" />
            <circle cx="160" cy="200" r="20" fill="#F1BF00" />
          </svg>
        );

      case 'GB': // United Kingdom
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#012169" />
            {/* Diagonals */}
            <line x1="0" y1="0" x2="600" y2="400" stroke="#FFFFFF" strokeWidth="60" />
            <line x1="600" y1="0" x2="0" y2="400" stroke="#FFFFFF" strokeWidth="60" />
            <line x1="0" y1="0" x2="600" y2="400" stroke="#C8102E" strokeWidth="20" />
            <line x1="600" y1="0" x2="0" y2="400" stroke="#C8102E" strokeWidth="20" />
            {/* Cross */}
            <rect x="250" width="100" height="400" fill="#FFFFFF" />
            <rect y="150" width="600" height="100" fill="#FFFFFF" />
            <rect x="270" width="60" height="400" fill="#C8102E" />
            <rect y="170" width="600" height="60" fill="#C8102E" />
          </svg>
        );

      case 'AL': // Albania
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#E41E20" />
            {/* Double-headed eagle shape */}
            <path
              d="M 300 130 C 290 100 260 110 265 140 C 230 130 220 180 250 200 C 220 220 240 260 270 250 L 285 290 L 300 260 L 315 290 L 330 250 C 360 260 380 220 350 200 C 380 180 370 130 335 140 C 340 110 310 100 300 130 Z"
              fill="#000000"
            />
          </svg>
        );

      case 'HR': // Croatia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#FF0000" />
            <rect y="133.3" width="600" height="133.3" fill="#FFFFFF" />
            <rect y="266.6" width="600" height="133.4" fill="#0000FF" />
            {/* Checkerboard shield */}
            <rect x="260" y="140" width="80" height="100" fill="#FF0000" stroke="#FFFFFF" strokeWidth="4" rx="4" />
            <rect x="280" y="140" width="20" height="25" fill="#FFFFFF" />
            <rect x="320" y="140" width="20" height="25" fill="#FFFFFF" />
            <rect x="260" y="165" width="20" height="25" fill="#FFFFFF" />
            <rect x="300" y="165" width="20" height="25" fill="#FFFFFF" />
            <rect x="280" y="190" width="20" height="25" fill="#FFFFFF" />
            <rect x="320" y="190" width="20" height="25" fill="#FFFFFF" />
          </svg>
        );

      case 'S': // Sweden
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#006AA7" />
            <rect x="180" width="60" height="400" fill="#FECC00" />
            <rect y="170" width="600" height="60" fill="#FECC00" />
          </svg>
        );

      case 'DK': // Denmark
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#C60C30" />
            <rect x="160" width="56" height="400" fill="#FFFFFF" />
            <rect y="172" width="600" height="56" fill="#FFFFFF" />
          </svg>
        );

      case 'B': // Belgium
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="400" fill="#000000" />
            <rect x="200" width="200" height="400" fill="#FDDA24" />
            <rect x="400" width="200" height="400" fill="#EF3340" />
          </svg>
        );

      case 'GR': // Greece
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            {/* 9 stripes */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <rect key={i} y={i * 44.4} width="600" height="44.4" fill={i % 2 === 0 ? '#0D5EAF' : '#FFFFFF'} />
            ))}
            {/* Canton */}
            <rect width="200" height="222.2" fill="#0D5EAF" />
            <rect x="80" width="40" height="222.2" fill="#FFFFFF" />
            <rect y="91" width="200" height="40" fill="#FFFFFF" />
          </svg>
        );

      case 'N': // Norway
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#BA0C2F" />
            <rect x="140" width="80" height="400" fill="#FFFFFF" />
            <rect y="160" width="600" height="80" fill="#FFFFFF" />
            <rect x="160" width="40" height="400" fill="#00205B" />
            <rect y="180" width="600" height="40" fill="#00205B" />
          </svg>
        );

      case 'FIN': // Finland
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#FFFFFF" />
            <rect x="160" width="70" height="400" fill="#003580" />
            <rect y="165" width="600" height="70" fill="#003580" />
          </svg>
        );

      case 'IRL': // Ireland
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="400" fill="#169B62" />
            <rect x="200" width="200" height="400" fill="#FFFFFF" />
            <rect x="400" width="200" height="400" fill="#FF883E" />
          </svg>
        );

      case 'P': // Portugal
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="400" fill="#006600" />
            <rect x="240" width="360" height="400" fill="#FF0000" />
            <circle cx="240" cy="200" r="45" fill="#FFE100" />
            <rect x="225" y="180" width="30" height="40" fill="#FFFFFF" rx="4" />
          </svg>
        );

      case 'H': // Hungary
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#CE2939" />
            <rect y="133.3" width="600" height="133.3" fill="#FFFFFF" />
            <rect y="266.6" width="600" height="133.4" fill="#477050" />
          </svg>
        );

      case 'RO': // Romania
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="400" fill="#002B7F" />
            <rect x="200" width="200" height="400" fill="#FCD116" />
            <rect x="400" width="200" height="400" fill="#CE1126" />
          </svg>
        );

      case 'BG': // Bulgaria
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#FFFFFF" />
            <rect y="133.3" width="600" height="133.3" fill="#00966E" />
            <rect y="266.6" width="600" height="133.4" fill="#D62612" />
          </svg>
        );

      case 'SK': // Slovakia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#FFFFFF" />
            <rect y="133.3" width="600" height="133.3" fill="#0B4EA2" />
            <rect y="266.6" width="600" height="133.4" fill="#EE1C25" />
            {/* Coat of arms */}
            <rect x="140" y="130" width="70" height="90" rx="10" fill="#EE1C25" stroke="#FFFFFF" strokeWidth="4" />
            <rect x="170" y="145" width="10" height="55" fill="#FFFFFF" />
            <rect x="155" y="160" width="40" height="8" fill="#FFFFFF" />
          </svg>
        );

      case 'SLO': // Slovenia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#FFFFFF" />
            <rect y="133.3" width="600" height="133.3" fill="#005CE6" />
            <rect y="266.6" width="600" height="133.4" fill="#ED1C24" />
            <circle cx="160" cy="133" r="28" fill="#005CE6" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        );

      case 'EST': // Estonia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#0072CE" />
            <rect y="133.3" width="600" height="133.3" fill="#000000" />
            <rect y="266.6" width="600" height="133.4" fill="#FFFFFF" />
          </svg>
        );

      case 'LV': // Latvia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="160" fill="#9E3039" />
            <rect y="160" width="600" height="80" fill="#FFFFFF" />
            <rect y="240" width="600" height="160" fill="#9E3039" />
          </svg>
        );

      case 'LT': // Lithuania
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#FDB913" />
            <rect y="133.3" width="600" height="133.3" fill="#006A44" />
            <rect y="266.6" width="600" height="133.4" fill="#C1272D" />
          </svg>
        );

      case 'BIH': // Bosnia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#002395" />
            <polygon points="170,0 450,0 450,400" fill="#FECB00" />
            {[50, 110, 170, 230, 290, 350].map((y, idx) => (
              <circle key={idx} cx={160 + idx * 45} cy={y} r="10" fill="#FFFFFF" />
            ))}
          </svg>
        );

      case 'SRB': // Serbia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#C6363C" />
            <rect y="133.3" width="600" height="133.3" fill="#0C4076" />
            <rect y="266.6" width="600" height="133.4" fill="#FFFFFF" />
          </svg>
        );

      case 'MNE': // Montenegro
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#D4AF37" />
            <rect x="20" y="20" width="560" height="360" fill="#C40308" />
            <circle cx="300" cy="200" r="40" fill="#D4AF37" />
          </svg>
        );

      case 'NMK': // North Macedonia
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#D20000" />
            <circle cx="300" cy="200" r="45" fill="#FFE600" />
            <polygon points="300,140 285,0 315,0" fill="#FFE600" />
            <polygon points="300,260 285,400 315,400" fill="#FFE600" />
            <polygon points="240,200 0,185 0,215" fill="#FFE600" />
            <polygon points="360,200 600,185 600,215" fill="#FFE600" />
          </svg>
        );

      case 'IS': // Iceland
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#02529C" />
            <rect x="150" width="70" height="400" fill="#FFFFFF" />
            <rect y="165" width="600" height="70" fill="#FFFFFF" />
            <rect x="165" width="40" height="400" fill="#DC1E35" />
            <rect y="180" width="600" height="40" fill="#DC1E35" />
          </svg>
        );

      case 'TR': // Turkey
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#E30A17" />
            <circle cx="260" cy="200" r="60" fill="#FFFFFF" />
            <circle cx="278" cy="200" r="48" fill="#E30A17" />
            <polygon points="330,200 345,190 340,205 355,200 342,212" fill="#FFFFFF" />
          </svg>
        );

      case 'UA': // Ukraine
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="200" fill="#0057B7" />
            <rect y="200" width="600" height="200" fill="#FFDD00" />
          </svg>
        );

      case 'L': // Luxembourg
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="133.3" fill="#EA141D" />
            <rect y="133.3" width="600" height="133.3" fill="#FFFFFF" />
            <rect y="266.6" width="600" height="133.4" fill="#00A1DE" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#1F2937" />
            <text x="300" y="220" fill="#9CA3AF" fontSize="72" fontWeight="bold" textAnchor="middle">
              {oval}
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded shadow-sm border border-white/10 flex items-center justify-center bg-slate-900 select-none">
      {renderFlagSvg()}
    </div>
  );
};
