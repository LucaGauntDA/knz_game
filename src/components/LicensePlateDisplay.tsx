import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlateManifestEntry, PlateStage } from '../data/platesManifest';
import { createFallbackPlateSvg } from '../utils/plateFallbackSvg';

interface LicensePlateDisplayProps {
  plate: PlateManifestEntry;
  currentStage: PlateStage;
  isRevealingSolution?: boolean;
}

export const LicensePlateDisplay: React.FC<LicensePlateDisplayProps> = ({
  plate,
  currentStage,
  isRevealingSolution = false,
}) => {
  const displayStage = isRevealingSolution ? 'solution' : currentStage;
  const initialUrl = plate.stages[displayStage] || plate.stages.solution || '';
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  useEffect(() => {
    const targetUrl = plate.stages[displayStage] || plate.stages.solution || '';
    setImgLoaded(false);
    setImgSrc(targetUrl);
  }, [plate.id, displayStage, plate.stages]);

  const handleImgError = () => {
    // If the image fails to load from disk, provide guaranteed fallback SVG
    setImgSrc(createFallbackPlateSvg(plate.oval, displayStage));
    setImgLoaded(true);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* License plate frame container */}
      <div className="relative w-full max-w-[680px] aspect-[800/220] rounded-2xl bg-neutral-900/90 p-2 sm:p-3 shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden">
        {/* Subtle screw mounting holes for realistic automotive feel */}
        <div className="absolute top-3 left-4 w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700/60 shadow-inner z-20 pointer-events-none" />
        <div className="absolute top-3 right-4 w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700/60 shadow-inner z-20 pointer-events-none" />
        <div className="absolute bottom-3 left-4 w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700/60 shadow-inner z-20 pointer-events-none" />
        <div className="absolute bottom-3 right-4 w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700/60 shadow-inner z-20 pointer-events-none" />

        {/* Ambient plate glow */}
        <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${plate.id}_${displayStage}`}
            initial={{ opacity: 0.65, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={imgSrc}
              alt="Kennzeichen Rätsel"
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              onError={handleImgError}
              className={`w-full h-full object-contain rounded-xl transition-all duration-300 drop-shadow-md ${
                imgLoaded ? 'opacity-100' : 'opacity-80'
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
