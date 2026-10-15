import React from 'react';
import { motion } from 'motion/react';
import { FlagIcon } from './FlagIcon';
import { COUNTRY_BY_OVAL } from '../data/countries';
import { X } from 'lucide-react';

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
  // Take up to 15 flags for the first 15 positions of the 4x4 grid
  const displayFlags = flags.slice(0, 15);

  return (
    <div className="w-full max-w-[680px] mx-auto select-none px-2 sm:px-4">
      {/* 4 rows x 4 columns grid = 15 flags + 1 question mark emoji in bottom-right cell */}
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-3">
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
              whileTap={!isLocked && !isWrong ? { scale: 0.93 } : undefined}
              className={`group relative aspect-[3/2] w-full rounded-xl overflow-hidden p-1 transition-all duration-200 flex items-center justify-center border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isWinner
                  ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/25 z-10 scale-[1.04]'
                  : isWrong
                  ? 'border-rose-900/60 bg-rose-950/20 opacity-30 cursor-not-allowed scale-[0.98]'
                  : 'border-white/10 bg-slate-900/70 hover:border-slate-500/70 hover:bg-slate-800/80 active:border-indigo-400 cursor-pointer shadow-sm'
              }`}
              title={countryLabel}
              aria-label={`Flagge von ${countryLabel}`}
            >
              {/* Flag icon */}
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <FlagIcon oval={oval} className="w-full h-full" />
              </div>

              {/* Wrong guess indicator overlay */}
              {isWrong && (
                <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-600/90 flex items-center justify-center text-white shadow-md">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                  </div>
                </div>
              )}

              {/* Hover touch sheen */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors pointer-events-none" />
            </motion.button>
          );
        })}

        {/* 16th cell (bottom right): Fragezeichen-Emoji Button statt einer Flagge */}
        <motion.button
          key="hint-question-button"
          type="button"
          disabled={isLocked || selectedWinningOval !== null}
          onClick={onHint}
          whileTap={!isLocked ? { scale: 0.93 } : undefined}
          whileHover={{ scale: 1.02 }}
          className={`group relative aspect-[3/2] w-full rounded-xl overflow-hidden p-1 transition-all duration-200 flex items-center justify-center border focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isLocked || selectedWinningOval !== null
              ? 'border-white/5 bg-slate-900/30 opacity-40 cursor-not-allowed text-slate-500'
              : 'border-amber-500/30 bg-slate-900/80 hover:border-amber-400/60 hover:bg-slate-800/90 active:border-amber-400 cursor-pointer shadow-sm text-amber-300'
          }`}
          title="Hinweis: Kennzeichen um eine Stufe erleichtern (kostet 1 Versuch)"
          aria-label="Hinweis: Kennzeichen um eine Stufe erleichtern"
        >
          <span className="text-2xl sm:text-3xl select-none leading-none" role="img" aria-label="Fragezeichen">
            ❓
          </span>
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors pointer-events-none" />
        </motion.button>
      </div>
    </div>
  );
};
