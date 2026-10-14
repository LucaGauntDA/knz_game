import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PlateManifestEntry } from '../data/platesManifest';
import { FlagIcon } from './FlagIcon';
import { COUNTRY_BY_OVAL } from '../data/countries';
import { createFallbackPlateSvg } from '../utils/plateFallbackSvg';
import { ArrowRight } from 'lucide-react';

interface LostRoundOverlayProps {
  plate: PlateManifestEntry;
  onNextRound: () => void;
}

export const LostRoundOverlay: React.FC<LostRoundOverlayProps> = ({ plate, onNextRound }) => {
  const country = COUNTRY_BY_OVAL[plate.oval];
  const countryName = country ? country.nameDe : plate.oval;
  const solutionUrl = plate.stages.solution || '';
  const [imgSrc, setImgSrc] = useState(solutionUrl);

  useEffect(() => {
    const timer = setTimeout(() => {
      onNextRound();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onNextRound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 select-none"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        className="flex flex-col items-center max-w-md w-full text-center bg-neutral-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          Runde beendet
        </span>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Die Lösung lautet: <span className="text-emerald-400">{countryName}</span>
        </h3>

        {/* Unblurred solution plate image */}
        <div className="w-full aspect-[800/220] rounded-xl overflow-hidden bg-neutral-950 p-2 border border-white/10 shadow-lg mb-4 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={`Lösung: ${countryName}`}
            referrerPolicy="no-referrer"
            onError={() => setImgSrc(createFallbackPlateSvg(plate.oval, 'solution'))}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Solution Flag and Info */}
        <div className="flex items-center gap-3 mb-6 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <div className="w-9 h-6 rounded overflow-hidden">
            <FlagIcon oval={plate.oval} className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">{countryName}</div>
            <div className="text-xs text-slate-400 font-mono">Kennzeichen: {plate.oval}</div>
          </div>
        </div>

        {/* Fast forward button */}
        <button
          type="button"
          onClick={onNextRound}
          className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Nächste Runde</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
};
