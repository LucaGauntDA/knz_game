import React from 'react';
import { motion } from 'motion/react';
import { GameMode, RoundResult } from '../types/game';
import { AppleEmoji } from '../utils/appleEmoji';

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

      {/* Darunter das 🔄 & ♾️ Emoji im echten iOS-Stil auf allen Plattformen */}
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
          className="bg-transparent border-0 outline-none focus:outline-none p-2 cursor-pointer transition-transform duration-150 flex items-center justify-center"
          title="Erneut spielen"
          aria-label="Erneut spielen"
        >
          <AppleEmoji
            emoji="🔄"
            hex="1f504"
            alt="Wiederholen"
            className="text-5xl sm:text-6xl md:text-7xl leading-none filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
            imgClassName="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)] select-none pointer-events-none"
          />
        </motion.button>

        {/* ♾️ Endlosmodus */}
        <motion.button
          type="button"
          onClick={onStartEndless || onSwitchMode}
          whileTap={{ scale: 0.86 }}
          whileHover={{ scale: 1.15 }}
          className="bg-transparent border-0 outline-none focus:outline-none p-2 cursor-pointer transition-transform duration-150 flex items-center justify-center"
          title="Endlosmodus spielen"
          aria-label="Endlosmodus"
        >
          <AppleEmoji
            emoji="♾️"
            hex="267e-fe0f"
            alt="Endlosmodus"
            className="text-5xl sm:text-6xl md:text-7xl leading-none filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
            imgClassName="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)] select-none pointer-events-none"
          />
        </motion.button>
      </motion.div>
    </div>
  );
};
