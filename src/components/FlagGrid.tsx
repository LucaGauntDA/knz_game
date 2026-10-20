import React from 'react';
import { motion } from 'motion/react';
import { FlagIcon } from './FlagIcon';
import { COUNTRY_BY_OVAL } from '../data/countries';
import { AppleEmoji } from '../utils/appleEmoji';

interface FlagGridProps {
  flags: string[]; // 15 oval codes (1 correct + 14 distractors)
  correctOval: string;
  wrongGuesses: string[]; // ovals that were guessed wrongly
  isLocked: boolean;
  onSelectFlag: (oval: string) => void;
  onHint: () => void;
  canHint: boolean;
  selectedWinningOval: string | null;
}

export const FlagGrid: React.FC<FlagGridProps> = ({
  flags,
  wrongGuesses,
  isLocked,
  onSelectFlag,
  onHint,
  selectedWinningOval,
}) => {
  // Take exactly 15 flags for the first 15 positions of the 4x4 grid
  const displayFlags = flags.slice(0, 15);

  return (
    <div className="w-full max-w-[860px] mx-auto select-none px-2 sm:px-4">
      {/* 4 rows x 4 columns grid: ohne Boxen, mit iOS-Emojis auf allen Plattformen */}
      <div className="w-full grid grid-cols-4 gap-y-3 sm:gap-y-5 md:gap-y-6 gap-x-2 sm:gap-x-4 md:gap-x-6 items-center justify-items-center">
        {displayFlags.map((oval) => {
          const isWrong = wrongGuesses.includes(oval);
          const isWinner = selectedWinningOval === oval;
          const country = COUNTRY_BY_OVAL[oval];
          const countryLabel = country ? country.nameDe : oval;

          return (
            <motion.button
              key={oval}
              type="button"
              disabled={isLocked || isWrong || selectedWinningOval !== null}
              onClick={() => onSelectFlag(oval)}
              whileTap={!isLocked && !isWrong ? { scale: 0.88 } : undefined}
              whileHover={!isLocked && !isWrong ? { scale: 1.14 } : undefined}
              className={`relative aspect-[3/2] w-full flex items-center justify-center p-0 m-0 bg-transparent border-0 outline-none focus:outline-none transition-all duration-200 cursor-pointer ${
                isWinner
                  ? 'scale-125 z-10 filter drop-shadow-[0_0_20px_rgba(52,211,153,0.95)]'
                  : isWrong
                  ? 'opacity-20 grayscale cursor-not-allowed scale-90'
                  : 'hover:drop-shadow-[0_6px_14px_rgba(255,255,255,0.22)]'
              }`}
              title={countryLabel}
              aria-label={`Flagge von ${countryLabel}`}
            >
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <FlagIcon oval={oval} className="w-full h-full" />
              </div>
            </motion.button>
          );
        })}

        {/* 16th cell (bottom right): iOS Fragezeichen-Emoji (auf allen Plattformen) */}
        <motion.button
          key="hint-question-button"
          type="button"
          disabled={isLocked || selectedWinningOval !== null}
          onClick={onHint}
          whileTap={!isLocked ? { scale: 0.88 } : undefined}
          whileHover={!isLocked ? { scale: 1.15 } : undefined}
          className={`relative aspect-[3/2] w-full flex items-center justify-center p-0 m-0 bg-transparent border-0 outline-none focus:outline-none transition-all duration-200 ${
            isLocked || selectedWinningOval !== null
              ? 'opacity-25 cursor-not-allowed text-slate-500'
              : 'cursor-pointer hover:drop-shadow-[0_0_18px_rgba(251,191,36,0.7)] text-amber-300'
          }`}
          title="Hinweis: Kennzeichen erleichtern"
          aria-label="Hinweis: Kennzeichen erleichtern"
        >
          <AppleEmoji
            emoji="❓"
            hex="2753"
            alt="Fragezeichen"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem]"
            imgClassName="w-11 h-11 sm:w-13 sm:h-13 md:w-16 md:h-16 lg:w-18 lg:h-18 object-contain drop-shadow-md select-none pointer-events-none"
          />
        </motion.button>
      </div>
    </div>
  );
};
