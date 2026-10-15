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
    setImgSrc(createFallbackPlateSvg(plate.oval, displayStage));
    setImgLoaded(true);
  };

  return (
    <div className="w-full h-full flex items-center justify-center select-none overflow-hidden p-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${plate.id}_${displayStage}`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-full h-full flex items-center justify-center max-w-[680px]"
        >
          {/* Kennzeichen-Bild ohne jegliche künstliche Rahmen, Ränder oder Boxen */}
          <img
            src={imgSrc}
            alt="Kennzeichen Rätsel"
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
            className={`w-full max-h-[36vh] sm:max-h-[38vh] object-contain transition-opacity duration-200 ${
              imgLoaded ? 'opacity-100' : 'opacity-80'
            }`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
