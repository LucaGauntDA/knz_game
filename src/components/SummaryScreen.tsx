import React from 'react';
import { motion } from 'motion/react';
import { GameMode, RoundResult } from '../types/game';

interface SummaryScreenProps {
  mode: GameMode;
  results: RoundResult[];
  onPlayAgain: () => void;
  onSwitchMode: () => void;
  onStartEndless?: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  results,
  onPlayAgain,
  onStartEndless,
  onSwitchMode,
}) => {
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none text-center px-4">
      {/* Groß die Punktzahl (ohne Maximalpunktzahl) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="text-8xl sm:text-9xl md:text-[11rem] font-bold font-mono tracking-tight text-white leading-none select-none drop-shadow-2xl mb-8 sm:mb-12"
      >
        {totalScore}
      </motion.div>

      {/* Darunter das 🔄 & ♾️ Emoji */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.25 }}
        className="flex items-center justify-center gap-10 sm:gap-14"
      >
        {/* 🔄 Wiederholen / Erneut spielen */}
        <motion.button
          type="button"
          onClick={onPlayAgain}
          whileTap={{ scale: 0.86 }}
          whileHover={{ scale: 1.15 }}
          className="bg-transparent border-0 outline-none focus:outline-none p-2 cursor-pointer transition-transform duration-150"
          title="Erneut spielen"
          aria-label="Erneut spielen"
        >
          <span
            className="text-5xl sm:text-6xl md:text-7xl select-none leading-none filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
            role="img"
            aria-label="Wiederholen"
          >
            🔄
          </span>
        </motion.button>

        {/* ♾️ Endlosmodus */}
        <motion.button
          type="button"
          onClick={onStartEndless || onSwitchMode}
          whileTap={{ scale: 0.86 }}
          whileHover={{ scale: 1.15 }}
          className="bg-transparent border-0 outline-none focus:outline-none p-2 cursor-pointer transition-transform duration-150"
          title="Endlosmodus spielen"
          aria-label="Endlosmodus"
        >
          <span
            className="text-5xl sm:text-6xl md:text-7xl select-none leading-none filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
            role="img"
            aria-label="Endlosmodus"
          >
            ♾️
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};
