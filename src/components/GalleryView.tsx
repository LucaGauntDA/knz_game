import React from 'react';
import { motion } from 'motion/react';
import { CountryInfo, COUNTRIES, COUNTRY_BY_OVAL } from '../data/countries';
import { FlagIcon } from './FlagIcon';
import { PlateManifestEntry } from '../data/platesManifest';

interface GalleryViewProps {
  plates: PlateManifestEntry[];
  onSelectCountry: (code: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ plates, onSelectCountry }) => {
  // Determine all countries that have plates in the game
  const availableOvals = new Set(plates.map((p) => p.oval.toUpperCase()));

  // Get country entries and sort them alphabetically by German name
  const countriesWithPlates: CountryInfo[] = Array.from(availableOvals)
    .map((oval) => COUNTRY_BY_OVAL[oval] || { oval, code: oval.slice(0, 2), nameDe: oval })
    .sort((a, b) => a.nameDe.localeCompare(b.nameDe, 'de'));

  return (
    <div className="w-full h-dvh bg-[#0a0c10] text-slate-100 flex flex-col overflow-hidden antialiased font-sans select-none">
      {/* Scrollable container for the 4-column flag grid */}
      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="w-full max-w-4xl mx-auto">
          {/* 4 nebeneinander, scrollbar nach unten */}
          <div className="grid grid-cols-4 gap-y-6 sm:gap-y-8 md:gap-y-10 gap-x-4 sm:gap-x-6 md:gap-x-8 items-center justify-items-center">
            {countriesWithPlates.map((country) => (
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
      </div>
    </div>
  );
};
