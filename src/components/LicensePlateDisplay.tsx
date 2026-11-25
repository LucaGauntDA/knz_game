import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlateManifestEntry, PlateStage } from '../data/platesManifest';
import { createFallbackPlateSvg } from '../utils/plateFallbackSvg';
import { COUNTRY_BY_OVAL } from '../data/countries';

interface LicensePlateDisplayProps {
  plate: PlateManifestEntry;
  currentStage: PlateStage;
  isRevealingSolution?: boolean;
  gameMode?: 'standard' | 'endless' | 'flags';
}

export const LicensePlateDisplay: React.FC<LicensePlateDisplayProps> = ({
  plate,
  currentStage,
  isRevealingSolution = false,
  gameMode = 'standard',
}) => {
  const displayStage = isRevealingSolution ? 'solution' : currentStage;
  const getBestStageUrl = (stg: PlateStage) =>
    plate.stages[stg] ||
    plate.stages.solution ||
    plate.stages.easy ||
    plate.stages.hard ||
    plate.stages.harder ||
    plate.stages.evenharder ||
    Object.values(plate.stages)[0] ||
    '';

  const initialUrl = getBestStageUrl(displayStage);
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  useEffect(() => {
    const targetUrl = getBestStageUrl(displayStage);
    setImgLoaded(false);
    setImgSrc(targetUrl);
  }, [plate.id, displayStage, plate.stages]);

  const handleImgError = () => {
    setImgSrc(createFallbackPlateSvg(plate.oval, displayStage));
    setImgLoaded(true);
  };

  const countryInfo = COUNTRY_BY_OVAL[plate.oval.toUpperCase()];
  const displayName = gameMode === 'flags'
    ? (countryInfo?.nameEn || plate.countryName)
    : plate.countryName;

  return (
    <div className="w-full h-full flex items-center justify-center select-none p-1 sm:p-2 min-h-0 min-w-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${plate.id}_${displayStage}`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-full h-full flex items-center justify-center max-w-[880px] min-h-0 min-w-0"
        >
          {gameMode === 'flags' ? (
            <div className="flex items-center justify-center px-4 py-6 text-center">
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)]">
                {displayName}
              </span>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt="Kennzeichen Rätsel"
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              onError={handleImgError}
              className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-200 drop-shadow-2xl ${
                imgLoaded ? 'opacity-100' : 'opacity-80'
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
