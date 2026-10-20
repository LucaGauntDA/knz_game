import React from 'react';
import { COUNTRY_BY_OVAL } from '../data/countries';
import { AppleEmoji, getFlagEmoji, getFlagEmojiHex } from '../utils/appleEmoji';

interface FlagIconProps {
  oval: string;
  className?: string;
}

export { getFlagEmoji, getFlagEmojiHex };

export const FlagIcon: React.FC<FlagIconProps> = ({ oval, className = '' }) => {
  const country = COUNTRY_BY_OVAL[oval.toUpperCase()];

  if (!country) return null;

  const emoji = getFlagEmoji(country.code);
  const hex = getFlagEmojiHex(country.code);

  return (
    <div className={`w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <AppleEmoji
        emoji={emoji}
        hex={hex}
        alt={`Flagge ${country.nameDe}`}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.8rem]"
        imgClassName="w-14 h-11 sm:w-18 sm:h-14 md:w-22 md:h-17 lg:w-26 lg:h-20 object-contain drop-shadow-md select-none pointer-events-none"
      />
    </div>
  );
};
