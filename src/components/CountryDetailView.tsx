import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CountryInfo } from '../data/countries';
import { PlateManifestEntry } from '../data/platesManifest';
import { FlagIcon } from './FlagIcon';
import { ArrowLeft } from 'lucide-react';

interface CountryDetailViewProps {
  country: CountryInfo;
  plates: PlateManifestEntry[];
  onBackToGallery: () => void;
}

const STAGE_ORDER = ['harder', 'hard', 'easy', 'solution'] as const;

export const CountryDetailView: React.FC<CountryDetailViewProps> = ({
  country,
  plates,
  onBackToGallery,
}) => {
  // State: toggle header between Country Name and Country Code
  const [showCountryCode, setShowCountryCode] = useState<boolean>(false);

  // State: toggle all captions between difficulty name ("easy", "hard", "very hard", "solution") and filename without .jpg
  const [showFilenames, setShowFilenames] = useState<boolean>(false);

  // Filter all plates for this country, sorted by number (e.g. D1, D2...)
  const countryPlates = plates
    .filter((p) => p.oval.toUpperCase() === country.oval.toUpperCase())
    .sort((a, b) => a.number - b.number);

  // Helper to extract filename from URL (e.g. /kennzeichen_game/D/D1_solution.JPG -> D1_solution.JPG)
  const getFilenameFromUrl = (url: string): string => {
    return url.split('/').pop() || url;
  };

  // Helper to get filename without extension
  const getFilenameWithoutExt = (url: string): string => {
    const filename = getFilenameFromUrl(url);
    return filename.replace(/\.[^/.]+$/, '');
  };

  // Helper to get display stage name ("harder" -> "very hard")
  const getStageLabel = (stageKey: string): string => {
    if (stageKey.toLowerCase() === 'harder') return 'very hard';
    return stageKey.toLowerCase();
  };

  // Click on image opens direct URL schema: domain.com/dateiname.jpg in a separate window
  const handleImageClick = (stageUrl: string) => {
    const filename = getFilenameFromUrl(stageUrl);
    window.open(`/${filename}`, '_blank');
  };

  return (
    <div className="w-full h-dvh bg-[#0a0c10] text-slate-100 flex flex-col overflow-hidden antialiased font-sans select-none">
      {/* Scrollable container */}
      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Header area with subtle back button and large Flag + Country Name/Code */}
          <div className="w-full flex items-center justify-between mb-8 sm:mb-12">
            <button
              type="button"
              onClick={onBackToGallery}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="Zurück zur Galerie"
              aria-label="Zurück zur Galerie"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Oben groß als Überschrift: Flagge vor dem Ländernamen. Klick toggelt zu Countrycode */}
            <div className="flex-1 flex items-center justify-center gap-3 sm:gap-5">
              <div className="w-12 h-9 sm:w-16 sm:h-12 md:w-20 md:h-14 flex items-center justify-center shrink-0">
                <FlagIcon oval={country.oval} className="w-full h-full" />
              </div>

              <motion.button
                type="button"
                onClick={() => setShowCountryCode((prev) => !prev)}
                whileTap={{ scale: 0.96 }}
                className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white hover:text-slate-200 transition-colors cursor-pointer bg-transparent border-0 outline-none p-0 select-none text-left"
                title="Klicken zum Umschalten zwischen Ländername und Ländercode"
              >
                {showCountryCode ? country.oval : country.nameDe}
              </motion.button>
            </div>

            {/* Empty balance spacer */}
            <div className="w-9 sm:w-10" />
          </div>

          {/* Plates and stages listing */}
          <div className="w-full flex flex-col items-center gap-10 sm:gap-14 pb-12">
            {countryPlates.length === 0 ? (
              <div className="text-slate-500 text-sm font-mono py-12">
                Keine Kennzeichen für dieses Land hinterlegt.
              </div>
            ) : (
              countryPlates.map((plate) => {
                // Collect existing stages in STAGE_ORDER: harder -> hard -> easy -> solution
                const availableStages = STAGE_ORDER.filter((s) => Boolean(plate.stages[s]));

                return (
                  <div
                    key={`${plate.oval}_${plate.number}`}
                    className="w-full flex flex-col items-center gap-8 sm:gap-10"
                  >
                    {availableStages.map((stageKey) => {
                      const stageUrl = plate.stages[stageKey]!;
                      const filenameWithoutExt = getFilenameWithoutExt(stageUrl);
                      const stageLabel = getStageLabel(stageKey);

                      return (
                        <div
                          key={stageKey}
                          className="w-full flex flex-col items-center max-w-2xl sm:max-w-3xl"
                        >
                          {/* Großes Bild: Klick öffnet domain.com/dateiname.jpg im separaten Fenster */}
                          <motion.div
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => handleImageClick(stageUrl)}
                            className="w-full flex items-center justify-center cursor-pointer transition-transform duration-150"
                            title="Im neuen Fenster als Bild öffnen"
                          >
                            <img
                              src={stageUrl}
                              alt={`${country.nameDe} ${stageLabel}`}
                              className="w-full max-h-[60vh] object-contain drop-shadow-2xl rounded-sm select-none"
                              loading="lazy"
                            />
                          </motion.div>

                          {/* Sehr kleine Bildunterschrift: Klick schaltet ganze Seite zwischen Stufe und Dateiname um */}
                          <button
                            type="button"
                            onClick={() => setShowFilenames((prev) => !prev)}
                            className="mt-2.5 sm:mt-3 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono lowercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors bg-transparent border-0 outline-none cursor-pointer select-none"
                            title="Klicken zum Umschalten zwischen Schwierigkeit und Dateiname"
                          >
                            {showFilenames ? filenameWithoutExt : stageLabel}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
