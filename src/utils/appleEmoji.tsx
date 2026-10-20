import React, { useState } from 'react';

/**
 * Detects whether the current device is an Apple device (iPhone, iPad, Mac)
 * where the system natively supports and renders Apple Color Emoji.
 */
export const isAppleDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /(iPhone|iPad|iPod|Macintosh|Mac OS X)/i.test(navigator.userAgent || '');
};

/**
 * Returns Unicode regional indicator flag emoji from a 2-letter ISO country code.
 */
export function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(...code.split('').map((c) => 0x1F1E6 - 65 + c.charCodeAt(0)));
}

/**
 * Computes the Apple emoji datasource hex string for a 2-letter ISO country code.
 */
export function getFlagEmojiHex(countryCode: string): string {
  const code = countryCode.toLowerCase();
  return code
    .split('')
    .map((c) => (0x1f1e6 - 97 + c.charCodeAt(0)).toString(16))
    .join('-');
}

/**
 * Generates the CDN URL for official Apple iOS emoji PNGs.
 */
export function getAppleEmojiUrl(hex: string): string {
  return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${hex}.png`;
}

interface AppleEmojiProps {
  emoji: string;
  hex: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Cross-platform component:
 * - On Apple devices (iPad, iPhone, Mac): Renders native Apple Color Emoji font.
 * - On other platforms (Windows, Android, Linux): Renders the official Apple iOS emoji PNG.
 */
export const AppleEmoji: React.FC<AppleEmojiProps> = ({
  emoji,
  hex,
  alt,
  className = '',
  imgClassName = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain inline-block select-none pointer-events-none',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const isApple = isAppleDevice();

  if (isApple) {
    return (
      <span
        className={`font-['Apple_Color_Emoji',_-apple-system,_sans-serif] leading-none select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        {emoji}
      </span>
    );
  }

  if (!imgFailed) {
    return (
      <img
        src={getAppleEmojiUrl(hex)}
        alt={alt}
        onError={() => setImgFailed(true)}
        className={imgClassName}
        draggable={false}
      />
    );
  }

  // Fallback if network fails
  return (
    <span
      className={`font-['Apple_Color_Emoji',_'Segoe_UI_Emoji',_'Noto_Color_Emoji',_sans-serif] leading-none select-none ${className}`}
      role="img"
      aria-label={alt}
    >
      {emoji}
    </span>
  );
};
