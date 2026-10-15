import { COUNTRY_BY_OVAL } from './countries';

export type PlateStage = 'harder' | 'hard' | 'easy' | 'solution';

export const STAGES_ORDER_DESC: PlateStage[] = ['harder', 'hard', 'easy', 'solution'];

export interface PlateManifestEntry {
  id: string; // e.g. "RKS1"
  oval: string; // e.g. "RKS"
  number: number; // e.g. 1
  countryName: string;
  // Map of available stage -> file URL
  stages: Partial<Record<PlateStage, string>>;
  availableStages: PlateStage[];
}

export const BUILTIN_PLATES: PlateManifestEntry[] = [
  {
    id: 'A1',
    oval: 'A',
    number: 1,
    countryName: 'Österreich',
    stages: {
      harder: '/kennzeichen_game/A/A1_harder.JPG',
      hard: '/kennzeichen_game/A/A1_hard.JPG',
      easy: '/kennzeichen_game/A/A1_easy.JPG',
      solution: '/kennzeichen_game/A/A1_solution.JPG',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'B1',
    oval: 'B',
    number: 1,
    countryName: 'Belgien',
    stages: {
      easy: '/kennzeichen_game/B/B1_easy.JPG',
      solution: '/kennzeichen_game/B/B1_solution.JPG',
    },
    availableStages: ['easy', 'solution'],
  },
  {
    id: 'CH1',
    oval: 'CH',
    number: 1,
    countryName: 'Schweiz',
    stages: {
      hard: '/kennzeichen_game/CH/CH1_hard.JPG',
      easy: '/kennzeichen_game/CH/CH1_easy.JPG',
      solution: '/kennzeichen_game/CH/CH1_solution.JPG',
    },
    availableStages: ['hard', 'easy', 'solution'],
  },
  {
    id: 'CZ1',
    oval: 'CZ',
    number: 1,
    countryName: 'Tschechien',
    stages: {
      easy: '/kennzeichen_game/CZ/CZ1_easy.JPG',
      solution: '/kennzeichen_game/CZ/CZ1_solution.JPG',
    },
    availableStages: ['easy', 'solution'],
  },
  {
    id: 'D1',
    oval: 'D',
    number: 1,
    countryName: 'Deutschland',
    stages: {
      hard: '/kennzeichen_game/D/D1_hard.JPG',
      easy: '/kennzeichen_game/D/D1_easy.JPG',
      solution: '/kennzeichen_game/D/D1_solution.JPG',
    },
    availableStages: ['hard', 'easy', 'solution'],
  },
  {
    id: 'DK1',
    oval: 'DK',
    number: 1,
    countryName: 'Dänemark',
    stages: {
      easy: '/kennzeichen_game/DK/DK1_easy.JPG',
      solution: '/kennzeichen_game/DK/DK1_solution.JPG',
    },
    availableStages: ['easy', 'solution'],
  },
];

/**
 * Gets initial (hardest available) stage for a plate
 */
export function getInitialStage(plate: PlateManifestEntry): PlateStage {
  for (const st of STAGES_ORDER_DESC) {
    if (plate.availableStages.includes(st) && plate.stages[st]) {
      return st;
    }
  }
  return 'solution';
}

/**
 * Gets next easier available stage for a plate, correctly skipping any missing stages.
 * If already at 'solution', returns null (cannot be simplified further).
 */
export function getNextEasierStage(
  plate: PlateManifestEntry,
  currentStage: PlateStage
): PlateStage | null {
  const currentIndex = STAGES_ORDER_DESC.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= STAGES_ORDER_DESC.length - 1) {
    return null;
  }

  // Scan remaining stages in ascending ease
  for (let i = currentIndex + 1; i < STAGES_ORDER_DESC.length; i++) {
    const candidate = STAGES_ORDER_DESC[i];
    if (plate.availableStages.includes(candidate) && plate.stages[candidate]) {
      return candidate;
    }
  }

  return null;
}

/**
 * Calculates earned points for a successfully solved plate
 * 5 points for first guess with 0 simplification steps and 0 hints/errors.
 * 1 point deducted for each step to an easier stage.
 * If solved at 'easy' after 1 step (e.g. harder->easy due to missing hard): 4 points.
 */
export function calculateRoundScore(stepsTaken: number, isLost: boolean): number {
  if (isLost) return 0;
  return Math.max(1, 5 - stepsTaken);
}

/**
 * Asynchronously checks /kennzeichen_game/manifest.json if available to allow dynamic drop-in additions.
 */
export async function loadPlatesManifest(): Promise<PlateManifestEntry[]> {
  try {
    const res = await fetch('/kennzeichen_game/manifest.json', { cache: 'no-cache' });
    if (!res.ok) {
      return BUILTIN_PLATES;
    }
    const data = await res.json();
    if (Array.isArray(data.plates) && data.plates.length > 0) {
      return data.plates.map((item: any) => {
        const oval = item.oval.toUpperCase();
        const num = item.number || 1;
        const country = COUNTRY_BY_OVAL[oval];
        const countryName = item.countryName || (country ? country.nameDe : oval);
        const stages: Partial<Record<PlateStage, string>> = {};
        const availableStages: PlateStage[] = [];

        for (const st of STAGES_ORDER_DESC) {
          if (item.stages && item.stages[st]) {
            stages[st] = item.stages[st];
            availableStages.push(st);
          }
        }

        return {
          id: `${oval}${num}`,
          oval,
          number: num,
          countryName,
          stages,
          availableStages,
        };
      });
    }
  } catch (err) {
    console.warn('Could not load dynamic manifest, using built-in manifest:', err);
  }
  return BUILTIN_PLATES;
}
