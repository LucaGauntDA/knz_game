import { SubdivisionCellOption } from '../types/game';

export interface Subdivision {
  code: string;
  nameDe: string;
  flagUrl?: string;
}

export interface CountrySubdivisionConfig {
  byNumber: Record<number, Subdivision>;
  allPool: Subdivision[];
}

export const COUNTRY_SUBDIVISIONS: Record<string, CountrySubdivisionConfig> = {
  USA: {
    byNumber: {
      1: { code: 'AK', nameDe: 'Alaska', flagUrl: '/flags/subdivisions/USA/AK.png' },
      2: { code: 'CA', nameDe: 'Kalifornien', flagUrl: '/flags/subdivisions/USA/CA.png' },
      3: { code: 'FL', nameDe: 'Florida', flagUrl: '/flags/subdivisions/USA/FL.png' },
      4: { code: 'HI', nameDe: 'Hawaii', flagUrl: '/flags/subdivisions/USA/HI.png' },
      5: { code: 'NY', nameDe: 'New York', flagUrl: '/flags/subdivisions/USA/NY.png' },
      6: { code: 'CO', nameDe: 'Colorado', flagUrl: '/flags/subdivisions/USA/CO.png' },
      7: { code: 'DE', nameDe: 'Delaware', flagUrl: '/flags/subdivisions/USA/DE.png' },
      8: { code: 'DC', nameDe: 'Washington D.C.', flagUrl: '/flags/subdivisions/USA/DC.png' },
      9: { code: 'GA', nameDe: 'Georgia', flagUrl: '/flags/subdivisions/USA/GA.png' },
      10: { code: 'IN', nameDe: 'Indiana', flagUrl: '/flags/subdivisions/USA/IN.png' },
    },
    allPool: [
      { code: 'AK', nameDe: 'Alaska', flagUrl: '/flags/subdivisions/USA/AK.png' },
      { code: 'CA', nameDe: 'Kalifornien', flagUrl: '/flags/subdivisions/USA/CA.png' },
      { code: 'FL', nameDe: 'Florida', flagUrl: '/flags/subdivisions/USA/FL.png' },
      { code: 'HI', nameDe: 'Hawaii', flagUrl: '/flags/subdivisions/USA/HI.png' },
      { code: 'NY', nameDe: 'New York', flagUrl: '/flags/subdivisions/USA/NY.png' },
      { code: 'CO', nameDe: 'Colorado', flagUrl: '/flags/subdivisions/USA/CO.png' },
      { code: 'DE', nameDe: 'Delaware', flagUrl: '/flags/subdivisions/USA/DE.png' },
      { code: 'DC', nameDe: 'Washington D.C.', flagUrl: '/flags/subdivisions/USA/DC.png' },
      { code: 'GA', nameDe: 'Georgia', flagUrl: '/flags/subdivisions/USA/GA.png' },
      { code: 'IN', nameDe: 'Indiana', flagUrl: '/flags/subdivisions/USA/IN.png' },
    ],
  },
  CDN: {
    byNumber: {
      1: { code: 'ON', nameDe: 'Ontario', flagUrl: '/flags/subdivisions/CDN/ON.png' },
      2: { code: 'QC', nameDe: 'Québec', flagUrl: '/flags/subdivisions/CDN/QC.png' },
      3: { code: 'NT', nameDe: 'Northwest Territories', flagUrl: '/flags/subdivisions/CDN/NT.png' },
      4: { code: 'PE', nameDe: 'Prince Edward Island', flagUrl: '/flags/subdivisions/CDN/PE.png' },
      5: { code: 'AB', nameDe: 'Alberta', flagUrl: '/flags/subdivisions/CDN/AB.png' },
      6: { code: 'BC', nameDe: 'British Columbia', flagUrl: '/flags/subdivisions/CDN/BC.png' },
      7: { code: 'SK', nameDe: 'Saskatchewan', flagUrl: '/flags/subdivisions/CDN/SK.png' },
      8: { code: 'NS', nameDe: 'Nova Scotia', flagUrl: '/flags/subdivisions/CDN/NS.png' },
      9: { code: 'NB', nameDe: 'New Brunswick', flagUrl: '/flags/subdivisions/CDN/NB.png' },
      10: { code: 'YT', nameDe: 'Yukon', flagUrl: '/flags/subdivisions/CDN/YT.png' },
    },
    allPool: [
      { code: 'ON', nameDe: 'Ontario', flagUrl: '/flags/subdivisions/CDN/ON.png' },
      { code: 'QC', nameDe: 'Québec', flagUrl: '/flags/subdivisions/CDN/QC.png' },
      { code: 'NT', nameDe: 'Northwest Territories', flagUrl: '/flags/subdivisions/CDN/NT.png' },
      { code: 'PE', nameDe: 'Prince Edward Island', flagUrl: '/flags/subdivisions/CDN/PE.png' },
      { code: 'AB', nameDe: 'Alberta', flagUrl: '/flags/subdivisions/CDN/AB.png' },
      { code: 'BC', nameDe: 'British Columbia', flagUrl: '/flags/subdivisions/CDN/BC.png' },
      { code: 'SK', nameDe: 'Saskatchewan', flagUrl: '/flags/subdivisions/CDN/SK.png' },
      { code: 'NS', nameDe: 'Nova Scotia', flagUrl: '/flags/subdivisions/CDN/NS.png' },
      { code: 'NB', nameDe: 'New Brunswick', flagUrl: '/flags/subdivisions/CDN/NB.png' },
      { code: 'YT', nameDe: 'Yukon', flagUrl: '/flags/subdivisions/CDN/YT.png' },
    ],
  },
  AUS: {
    byNumber: {
      1: { code: 'QLD', nameDe: 'Queensland', flagUrl: '/flags/subdivisions/AUS/QLD.png' },
      2: { code: 'NSW', nameDe: 'New South Wales', flagUrl: '/flags/subdivisions/AUS/NSW.png' },
      3: { code: 'ACT', nameDe: 'Australian Capital Territory', flagUrl: '/flags/subdivisions/AUS/ACT.png' },
      4: { code: 'VIC', nameDe: 'Victoria', flagUrl: '/flags/subdivisions/AUS/VIC.png' },
      5: { code: 'SA', nameDe: 'South Australia', flagUrl: '/flags/subdivisions/AUS/SA.png' },
      6: { code: 'NT', nameDe: 'Northern Territory', flagUrl: '/flags/subdivisions/AUS/NT.png' },
      7: { code: 'WA', nameDe: 'Western Australia', flagUrl: '/flags/subdivisions/AUS/WA.png' },
      8: { code: 'TAS', nameDe: 'Tasmanien', flagUrl: '/flags/subdivisions/AUS/TAS.png' },
    },
    allPool: [
      { code: 'QLD', nameDe: 'Queensland', flagUrl: '/flags/subdivisions/AUS/QLD.png' },
      { code: 'NSW', nameDe: 'New South Wales', flagUrl: '/flags/subdivisions/AUS/NSW.png' },
      { code: 'ACT', nameDe: 'Australian Capital Territory', flagUrl: '/flags/subdivisions/AUS/ACT.png' },
      { code: 'VIC', nameDe: 'Victoria', flagUrl: '/flags/subdivisions/AUS/VIC.png' },
      { code: 'SA', nameDe: 'South Australia', flagUrl: '/flags/subdivisions/AUS/SA.png' },
      { code: 'NT', nameDe: 'Northern Territory', flagUrl: '/flags/subdivisions/AUS/NT.png' },
      { code: 'WA', nameDe: 'Western Australia', flagUrl: '/flags/subdivisions/AUS/WA.png' },
      { code: 'TAS', nameDe: 'Tasmanien', flagUrl: '/flags/subdivisions/AUS/TAS.png' },
    ],
  },
  MEX: {
    byNumber: {
      1: { code: 'MOR', nameDe: 'Morelos', flagUrl: '/flags/subdivisions/MEX/MOR.png' },
      2: { code: 'CAM', nameDe: 'Campeche', flagUrl: '/flags/subdivisions/MEX/CAM.png' },
      3: { code: 'OAX', nameDe: 'Oaxaca', flagUrl: '/flags/subdivisions/MEX/OAX.png' },
      4: { code: 'SON', nameDe: 'Sonora', flagUrl: '/flags/subdivisions/MEX/SON.png' },
      5: { code: 'AGS', nameDe: 'Aguascalientes', flagUrl: '/flags/subdivisions/MEX/AGS.png' },
      6: { code: 'CL', nameDe: 'Colima', flagUrl: '/flags/subdivisions/MEX/CL.png' },
      7: { code: 'VER', nameDe: 'Veracruz', flagUrl: '/flags/subdivisions/MEX/VER.png' },
      8: { code: 'BCN', nameDe: 'Baja California', flagUrl: '/flags/subdivisions/MEX/BCN.png' },
      9: { code: 'COA', nameDe: 'Coahuila', flagUrl: '/flags/subdivisions/MEX/COAH.png' },
      10: { code: 'CDMX', nameDe: 'Ciudad de México', flagUrl: '/flags/subdivisions/MEX/CDMX.png' },
    },
    allPool: [
      { code: 'MOR', nameDe: 'Morelos', flagUrl: '/flags/subdivisions/MEX/MOR.png' },
      { code: 'CAM', nameDe: 'Campeche', flagUrl: '/flags/subdivisions/MEX/CAM.png' },
      { code: 'OAX', nameDe: 'Oaxaca', flagUrl: '/flags/subdivisions/MEX/OAX.png' },
      { code: 'SON', nameDe: 'Sonora', flagUrl: '/flags/subdivisions/MEX/SON.png' },
      { code: 'AGS', nameDe: 'Aguascalientes', flagUrl: '/flags/subdivisions/MEX/AGS.png' },
      { code: 'CL', nameDe: 'Colima', flagUrl: '/flags/subdivisions/MEX/CL.png' },
      { code: 'VER', nameDe: 'Veracruz', flagUrl: '/flags/subdivisions/MEX/VER.png' },
      { code: 'BCN', nameDe: 'Baja California', flagUrl: '/flags/subdivisions/MEX/BCN.png' },
      { code: 'COA', nameDe: 'Coahuila', flagUrl: '/flags/subdivisions/MEX/COAH.png' },
      { code: 'CDMX', nameDe: 'Ciudad de México', flagUrl: '/flags/subdivisions/MEX/CDMX.png' },
    ],
  },
  UAE: {
    byNumber: {
      1: { code: 'AUH', nameDe: 'Abu Dhabi', flagUrl: '/flags/subdivisions/UAE/AUH.png' },
      2: { code: 'DXB', nameDe: 'Dubai', flagUrl: '/flags/subdivisions/UAE/DXB.png' },
      3: { code: 'SHJ', nameDe: 'Sharjah', flagUrl: '/flags/subdivisions/UAE/SHJ.png' },
      4: { code: 'UAQ', nameDe: 'Umm al Quwain', flagUrl: '/flags/subdivisions/UAE/UAQ.png' },
      5: { code: 'FU', nameDe: 'Al-Fujairah', flagUrl: '/flags/subdivisions/UAE/FU.png' },
      6: { code: 'RAK', nameDe: 'Ras al-Khaimah', flagUrl: '/flags/subdivisions/UAE/RAK.png' },
      7: { code: 'AJ', nameDe: 'Ajman', flagUrl: '/flags/subdivisions/UAE/AJ.png' },
    },
    allPool: [
      { code: 'AUH', nameDe: 'Abu Dhabi', flagUrl: '/flags/subdivisions/UAE/AUH.png' },
      { code: 'DXB', nameDe: 'Dubai', flagUrl: '/flags/subdivisions/UAE/DXB.png' },
      { code: 'SHJ', nameDe: 'Sharjah', flagUrl: '/flags/subdivisions/UAE/SHJ.png' },
      { code: 'UAQ', nameDe: 'Umm al Quwain', flagUrl: '/flags/subdivisions/UAE/UAQ.png' },
      { code: 'FU', nameDe: 'Al-Fujairah', flagUrl: '/flags/subdivisions/UAE/FU.png' },
      { code: 'RAK', nameDe: 'Ras al-Khaimah', flagUrl: '/flags/subdivisions/UAE/RAK.png' },
      { code: 'AJ', nameDe: 'Ajman', flagUrl: '/flags/subdivisions/UAE/AJ.png' },
    ],
  },
};

/**
 * Returns the subdivision object for a given country oval and plate number, or null if not applicable.
 */
export function getSubdivisionForPlate(oval: string, plateNumber: number): Subdivision | null {
  const config = COUNTRY_SUBDIVISIONS[oval.toUpperCase()];
  if (!config) return null;
  return config.byNumber[plateNumber] || null;
}

/**
 * Returns the surrounding cell indices (up to count) in a 4x4 grid around countryIndex.
 * Cell 15 (hint ❓) and countryIndex are always excluded.
 */
export function getSurroundingCellIndices(countryIndex: number, count = 8): number[] {
  const row = Math.floor(countryIndex / 4);
  const col = countryIndex % 4;
  const candidates: { index: number; dist: number }[] = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      if (idx === countryIndex || idx === 15) continue;
      const dist = Math.max(Math.abs(r - row), Math.abs(c - col));
      const eucDist = Math.hypot(r - row, c - col);
      candidates.push({ index: idx, dist: dist * 10 + eucDist });
    }
  }

  candidates.sort((a, b) => a.dist - b.dist);
  return candidates.slice(0, count).map((c) => c.index);
}

/**
 * Generates subdivision options for Phase 2 surrounding the correct country position.
 */
export function generateSubdivisionOptions(
  oval: string,
  targetSubdivision: Subdivision,
  countryIndex: number
): SubdivisionCellOption[] {
  const config = COUNTRY_SUBDIVISIONS[oval.toUpperCase()];
  if (!config) return [];

  // Exclude targetSubdivision from pool of distractors
  const distractors = config.allPool.filter((s) => s.code !== targetSubdivision.code);
  const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);

  const surroundingIndices = getSurroundingCellIndices(countryIndex, Math.min(8, shuffledDistractors.length));
  const options: SubdivisionCellOption[] = [];

  // Place target subdivision in a random surrounding slot
  const targetSlotIdx = Math.floor(Math.random() * surroundingIndices.length);
  const correctCellIndex = surroundingIndices[targetSlotIdx];

  options.push({ cellIndex: correctCellIndex, subdivision: targetSubdivision });

  let distractorIdx = 0;
  for (let i = 0; i < surroundingIndices.length; i++) {
    if (i === targetSlotIdx) continue;
    if (distractorIdx < shuffledDistractors.length) {
      options.push({ cellIndex: surroundingIndices[i], subdivision: shuffledDistractors[distractorIdx++] });
    }
  }

  return options;
}
