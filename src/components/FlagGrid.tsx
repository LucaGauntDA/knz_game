import React from 'react';
import { motion } from 'motion/react';
import { FlagIcon } from './FlagIcon';
import { COUNTRY_BY_OVAL } from '../data/countries';

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
    <div className="w-full max-w-[640px] mx-auto select-none px-2 sm:px-4">
      {/* 4 rows x 4 columns grid: NO BOXES, clean floating flags + Fragezeichen-Emoji in cell 16 */}
      <div className="w-full grid grid-cols-4 gap-y-3 sm:gap-y-4 gap-x-2 sm:gap-x-3 items-center justify-items-center">
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
              whileHover={!isLocked && !isWrong ? { scale: 1.12 } : undefined}
              className={`relative aspect-[3/2] w-full flex items-center justify-center p-0 m-0 bg-transparent border-0 outline-none focus:outline-none transition-all duration-200 cursor-pointer ${
                isWinner
                  ? 'scale-125 z-10 filter drop-shadow-[0_0_16px_rgba(52,211,153,0.95)]'
                  : isWrong
                  ? 'opacity-20 grayscale cursor-not-allowed scale-90'
                  : 'hover:drop-shadow-[0_4px_10px_rgba(255,255,255,0.18)]'
              }`}
              title={countryLabel}
              aria-label={`Flagge von ${countryLabel}`}
            >
              {/* Flag Emoji without any box */}
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <FlagIcon oval={oval} className="w-full h-full" />
              </div>
            </motion.button>
          );
        })}

        {/* 16th cell (bottom right): Fragezeichen-Emoji ohne Box */}
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
              : 'cursor-pointer hover:drop-shadow-[0_0_14px_rgba(251,191,36,0.6)] text-amber-300'
          }`}
          title="Hinweis: Kennzeichen erleichtern"
          aria-label="Hinweis: Kennzeichen erleichtern"
        >
          <span
            className="text-3xl sm:text-4xl md:text-5xl select-none leading-none"
            role="img"
            aria-label="Fragezeichen"
          >
            ❓
          </span>
        </motion.button>
      </div>
    </div>
  );
};
