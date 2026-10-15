import React, { useState } from 'react';
import { COUNTRY_BY_OVAL } from '../data/countries';

interface FlagIconProps {
  oval: string;
  className?: string;
}

/**
 * Returns the Unicode flag emoji for a given 2-letter country code.
 * Uses Unicode Regional Indicator Symbols (0x1F1E6 to 0x1F1FF).
 */
export function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  // Regional Indicator Symbol letter: 0x1F1E6 for 'A'
  return String.fromCodePoint(...code.split('').map((c) => 0x1F1E6 - 65 + c.charCodeAt(0)));
}

export const FlagIcon: React.FC<FlagIconProps> = ({ oval, className = '' }) => {
  const country = COUNTRY_BY_OVAL[oval.toUpperCase()];
  const [imgError, setImgError] = useState(false);

  if (!country) return null;

  const code = country.code.toLowerCase();
  const emoji = getFlagEmoji(country.code);

  // Detect Apple OS (iOS on iPad/iPhone or macOS) where Apple Color Emoji renders native Apple flags
  const isApple =
    typeof navigator !== 'undefined' &&
    /(iPhone|iPad|iPod|Macintosh|Mac OS X)/i.test(navigator.userAgent || '');

  if (isApple) {
    // Pure native iOS flag emoji on Apple devices (iPad, iPhone, Mac)
    return (
      <span
        className={`inline-flex items-center justify-center leading-none select-none text-4xl sm:text-5xl md:text-6xl font-['Apple_Color_Emoji',_-apple-system,_sans-serif] ${className}`}
        role="img"
        aria-label={`Flagge ${country.nameDe}`}
      >
        {emoji}
      </span>
    );
  }

  // On non-Apple platforms (like Windows where browsers don't bundle flag emojis natively),
  // render high-resolution flag graphic with iOS emoji rounded style and fallback to emoji
  if (!imgError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <img
          src={`https://flagcdn.com/w160/${code}.png`}
          alt={`Flagge ${country.nameDe}`}
          onError={() => setImgError(true)}
          className="w-14 h-9 sm:w-16 sm:h-10 md:w-20 md:h-13 object-cover rounded-md shadow-sm select-none pointer-events-none"
        />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center leading-none select-none text-4xl sm:text-5xl font-['Apple_Color_Emoji',_'Segoe_UI_Emoji',_'Noto_Color_Emoji',_sans-serif] ${className}`}
      role="img"
      aria-label={`Flagge ${country.nameDe}`}
    >
      {emoji}
    </span>
  );
};
