import React from 'react';
import { motion } from 'motion/react';
import { FlagIcon } from './FlagIcon';
import { COUNTRY_BY_OVAL } from '../data/countries';
import { HelpCircle, X } from 'lucide-react';

interface FlagGridProps {
  flags: string[]; // 16 oval codes
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
  canHint,
  selectedWinningOval,
}) => {
  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* 4 rows x 4 columns grid = 16 flag items */}
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-3">
        {flags.map((oval) => {
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
              whileTap={!isLocked && !isWrong ? { scale: 0.94 } : undefined}
              className={`group relative aspect-[3/2] w-full rounded-xl overflow-hidden p-1 sm:p-1.5 transition-all duration-200 flex items-center justify-center border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isWinner
                  ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/20 z-10 scale-[1.04]'
                  : isWrong
                  ? 'border-rose-900/60 bg-rose-950/20 opacity-30 cursor-not-allowed scale-[0.98]'
                  : 'border-white/10 bg-slate-900/70 hover:border-slate-500/70 hover:bg-slate-800/80 active:border-indigo-400 cursor-pointer shadow-sm'
              }`}
              title={countryLabel}
              aria-label={`Flagge von ${countryLabel}`}
            >
              {/* Flag SVG */}
              <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center pointer-events-none">
                <FlagIcon oval={oval} className="w-full h-full object-cover" />
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
      </div>

      {/* Ganz rechts unten im Grid befindet sich ein Button mit ❓ als Hinweis */}
      <div className="w-full flex justify-end items-center mt-2.5 sm:mt-3 px-0.5">
        <motion.button
          type="button"
          disabled={isLocked || selectedWinningOval !== null}
          onClick={onHint}
          whileTap={!isLocked ? { scale: 0.94 } : undefined}
          whileHover={{ scale: 1.02 }}
          className={`h-11 sm:h-12 px-4 sm:px-5 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isLocked || selectedWinningOval !== null
              ? 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-500'
              : 'border-amber-500/30 bg-slate-900/90 text-amber-300 hover:border-amber-400/60 hover:bg-slate-800 cursor-pointer shadow-amber-950/20'
          }`}
          title="Hinweis: Kennzeichen um eine Stufe erleichtern"
          aria-label="Hinweis: Kennzeichen um eine Stufe erleichtern"
        >
          <span className="text-lg leading-none" role="img" aria-label="Fragezeichen">
            ❓
          </span>
          <span className="text-xs sm:text-sm tracking-wide font-medium">Hinweis</span>
        </motion.button>
      </div>
    </div>
  );
};
