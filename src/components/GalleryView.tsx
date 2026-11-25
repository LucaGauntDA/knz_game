import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CountryInfo, COUNTRIES, COUNTRY_BY_OVAL } from '../data/countries';
import { FlagIcon } from './FlagIcon';
import { PlateManifestEntry } from '../data/platesManifest';
import { COUNTRY_SUBDIVISIONS, Subdivision } from '../data/subdivisions';

interface GalleryViewProps {
  plates: PlateManifestEntry[];
  onSelectCountry: (code: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ plates, onSelectCountry }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Determine all countries that have plates in the game
  const availableOvals = new Set(plates.map((p) => p.oval.toUpperCase()));

  const allCountries: CountryInfo[] = Array.from(availableOvals)
    .map((oval) => COUNTRY_BY_OVAL[oval] || { oval, code: oval.slice(0, 2), nameDe: oval })
    .sort((a, b) => a.nameDe.localeCompare(b.nameDe, 'de'));

  // Custom flags (territories with custom flag url, like Alderney GBA)
  const customFlagCountries = allCountries.filter(
    (c) => c.customFlagUrl || c.oval.toUpperCase() === 'GBA'
  );

  return (
    <div className="w-full h-dvh bg-[#0a0c10] text-slate-100 flex flex-col overflow-hidden antialiased font-sans select-none">
      {/* Scrollable container */}
      <div className="flex-1 w-full overflow-y-auto">
        {/* Main Plates Gallery */}
        <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-y-6 sm:gap-y-8 md:gap-y-10 gap-x-4 sm:gap-x-6 md:gap-x-8 items-center justify-items-center">
            {allCountries.map((country) => (
              <motion.button
                key={country.oval}
                type="button"
                onClick={() => onSelectCountry(country.oval)}
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.15 }}
                className="relative aspect-[3/2] w-full flex items-center justify-center p-0 m-0 bg-transparent border-0 outline-none focus:outline-none transition-all duration-150 cursor-pointer hover:drop-shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
                title={`${country.nameDe} (${country.oval})`}
                aria-label={`${country.nameDe} (${country.oval})`}
              >
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  <FlagIcon oval={country.oval} className="w-full h-full" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>



        {/* Custom Flags Section */}
        <div className="w-full bg-[#0a0c10] px-4 sm:px-8 pb-16">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-[0.2em] text-sky-400 mb-12 drop-shadow-md">
              flags
            </h2>

            {/* Subdivisions Galleries per Country */}
            {Object.entries(COUNTRY_SUBDIVISIONS).map(([oval, config]) => {
              const countryInfo = COUNTRY_BY_OVAL[oval] || { nameDe: oval };
              return (
                <div key={`gallery-sub-${oval}`} className="w-full mb-12">
                  <h3 className="text-base font-bold text-sky-300 uppercase tracking-wider mb-6 pb-2">
                    {countryInfo.nameDe} (Subdivisions)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 items-center justify-items-center">
                    {config.allPool.map((sub: Subdivision) => (
                      <div
                        key={`flag-item-${oval}-${sub.code}`}
                        className="flex flex-col items-center justify-center gap-2 p-2 w-full max-w-[130px]"
                      >
                        <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden bg-transparent">
                          <img
                            src={sub.flagUrl || '/flags/no_flag_yet.jpeg'}
                            alt={`Flagge ${sub.nameDe}`}
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/flags/no_flag_yet.jpeg';
                            }}
                            className="w-full h-full object-contain p-0.5 drop-shadow"
                            draggable={false}
                          />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-300 text-center truncate w-full">
                          {sub.nameDe}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Other Custom Flags (e.g. Alderney / GBA) */}
            {customFlagCountries.length > 0 && (
              <div className="w-full mb-12">
                <h3 className="text-base font-bold text-sky-300 uppercase tracking-wider mb-6 pb-2">
                  Custom Flags
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 items-center justify-items-center">
                  {customFlagCountries.map((country) => (
                    <div
                      key={`custom-flag-${country.oval}`}
                      className="flex flex-col items-center justify-center gap-2 p-2 w-full max-w-[130px]"
                    >
                      <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden bg-transparent">
                        <FlagIcon oval={country.oval} className="w-full h-full p-0.5" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-300 text-center truncate w-full">
                        {country.nameDe}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Symbol & Section at the bottom */}
            <div className="w-full flex justify-end mt-8">
              <button
                type="button"
                onClick={() => setShowInfoModal(true)}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-200 text-xs font-semibold transition-all cursor-pointer shadow-md"
                title="How I generate my custom flags"
              >
                <span className="w-5 h-5 rounded-full bg-sky-500/30 flex items-center justify-center font-bold text-xs text-sky-100">
                  i
                </span>
                <span>How I generate my custom flags</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-[#161b22] border border-white/15 rounded-2xl p-6 text-slate-100 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-sky-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-xs font-bold">
                    i
                  </span>
                  How I generate my custom flags
                </h3>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                For transparency: At the beginning I just gave ChatGPT (with Images 2.5) the flags and this worked surprisingly well. You can recognize the first few flags from ChatGPT as they’re bigger then the rest. For these I built a mini app with Wabi, hence I didn’t want to pay or wait for the limit to reset. The Wabi app works with putting the plain image from Google into a placeholder manually. You can recognize these manually created flags by its smaller size. 
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-all cursor-pointer shadow"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
