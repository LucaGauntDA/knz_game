import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Subdivision } from '../data/subdivisions';

interface SubdivisionBadgeProps {
  subdivision: Subdivision;
  isWrong: boolean;
  isWinner: boolean;
  isLocked: boolean;
  onClick: () => void;
}

const KNOWN_FLAG_CODES = new Set(['AK', 'CA', 'FL', 'HI', 'ON', 'QC', 'NT', 'PE', 'QLD', 'NSW', 'ACT', 'VIC', 'MOR', 'CAM', 'OAX', 'SON', 'AB', 'SA', 'NY', 'BC', 'SK', 'NS', 'NB', 'WA', 'TAS', 'AGS', 'VER', 'BCN', 'COAH', 'CDMX', 'CO', 'DE', 'DC', 'GA', 'IN', 'AUH', 'DXB', 'SHJ', 'UAQ', 'FU', 'RAK', 'AJ', 'YT']);

export const SubdivisionBadge: React.FC<SubdivisionBadgeProps> = ({
  subdivision,
  isWrong,
  isWinner,
  isLocked,
  onClick,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [subdivision.code]);

  const potentialFlagUrl =
    subdivision.flagUrl ||
    (KNOWN_FLAG_CODES.has(subdivision.code) ? `/flags/subdivisions/${subdivision.code}.png` : null) ||
    '/flags/no_flag_yet.jpeg';
  const flagSrc = !imgFailed ? potentialFlagUrl : '/flags/no_flag_yet.jpeg';

  return (
    <motion.button
      type="button"
      disabled={isLocked || isWrong}
      onClick={onClick}
      whileTap={!isLocked && !isWrong ? { scale: 0.92 } : undefined}
      whileHover={!isLocked && !isWrong ? { scale: 1.08 } : undefined}
      className={`relative w-full max-w-[110px] sm:max-w-[124px] flex flex-col items-center justify-center gap-1.5 p-1 transition-all duration-200 cursor-pointer select-none group bg-transparent border-0 outline-none ${
        isWinner
          ? 'scale-110 z-10 filter drop-shadow-[0_0_20px_rgba(52,211,153,0.95)]'
          : isWrong
          ? 'opacity-25 grayscale scale-90 cursor-not-allowed'
          : 'hover:opacity-100'
      }`}
      title={`${subdivision.nameDe} (${subdivision.code})`}
      aria-label={`${subdivision.nameDe} (${subdivision.code})`}
    >
      <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden bg-transparent">
        <img
          src={flagSrc}
          alt={`Flagge ${subdivision.nameDe}`}
          decoding="async"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain drop-shadow pointer-events-none"
          draggable={false}
        />
      </div>
      <span className="text-[10px] sm:text-[11px] md:text-[12px] font-medium text-slate-200 truncate max-w-full px-0.5 leading-tight text-center drop-shadow">
        {subdivision.nameDe}
      </span>
    </motion.button>
  );
};
