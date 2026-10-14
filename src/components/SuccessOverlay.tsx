import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { FlagIcon } from './FlagIcon';
import { COUNTRY_BY_OVAL } from '../data/countries';
import confetti from 'canvas-confetti';

interface SuccessOverlayProps {
  oval: string;
  onNextRound: () => void;
  isFirstAttempt: boolean;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
  oval,
  onNextRound,
  isFirstAttempt,
}) => {
  const country = COUNTRY_BY_OVAL[oval];
  const countryName = country ? country.nameDe : oval;

  useEffect(() => {
    // Elegant, lightweight confetti burst on first attempt or clean milestone
    if (isFirstAttempt) {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B'],
          disableForReducedMotion: true,
        });
      } catch {
        // Confetti fallback
      }
    }

    const timer = setTimeout(() => {
      onNextRound();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onNextRound, isFirstAttempt]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md p-6 select-none"
    >
      <motion.div
        initial={{ scale: 0.7, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="flex flex-col items-center max-w-sm w-full text-center"
      >
        {/* Animated Flag in center of screen */}
        <div className="w-48 sm:w-56 aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-400/80 mb-5 ring-4 ring-emerald-500/20">
          <FlagIcon oval={oval} className="w-full h-full object-cover" />
        </div>

        {/* Large readable country name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1.5"
        >
          {countryName}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="text-sm text-slate-400 font-mono tracking-widest uppercase"
        >
          Kennzeichen-Kürzel: {oval}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
