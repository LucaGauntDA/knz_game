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

// Built-in starter dataset matching the generated images in /public/kennzeichen_game/
export const BUILTIN_PLATES: PlateManifestEntry[] = [
  {
    id: 'RKS1',
    oval: 'RKS',
    number: 1,
    countryName: 'Kosovo',
    stages: {
      harder: '/kennzeichen_game/RKS/RKS1_harder.jpg',
      hard: '/kennzeichen_game/RKS/RKS1_hard.jpg',
      easy: '/kennzeichen_game/RKS/RKS1_easy.jpg',
      solution: '/kennzeichen_game/RKS/RKS1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'D1',
    oval: 'D',
    number: 1,
    countryName: 'Deutschland',
    stages: {
      harder: '/kennzeichen_game/D/D1_harder.jpg',
      hard: '/kennzeichen_game/D/D1_hard.jpg',
      easy: '/kennzeichen_game/D/D1_easy.jpg',
      solution: '/kennzeichen_game/D/D1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'D2',
    oval: 'D',
    number: 2,
    countryName: 'Deutschland',
    stages: {
      harder: '/kennzeichen_game/D/D2_harder.jpg',
      hard: '/kennzeichen_game/D/D2_hard.jpg',
      easy: '/kennzeichen_game/D/D2_easy.jpg',
      solution: '/kennzeichen_game/D/D2_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'A1',
    oval: 'A',
    number: 1,
    countryName: 'Österreich',
    stages: {
      harder: '/kennzeichen_game/A/A1_harder.jpg',
      hard: '/kennzeichen_game/A/A1_hard.jpg',
      easy: '/kennzeichen_game/A/A1_easy.jpg',
      solution: '/kennzeichen_game/A/A1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'CH1',
    oval: 'CH',
    number: 1,
    countryName: 'Schweiz',
    stages: {
      harder: '/kennzeichen_game/CH/CH1_harder.jpg',
      hard: '/kennzeichen_game/CH/CH1_hard.jpg',
      easy: '/kennzeichen_game/CH/CH1_easy.jpg',
      solution: '/kennzeichen_game/CH/CH1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'F1',
    oval: 'F',
    number: 1,
    countryName: 'Frankreich',
    stages: {
      harder: '/kennzeichen_game/F/F1_harder.jpg',
      hard: '/kennzeichen_game/F/F1_hard.jpg',
      easy: '/kennzeichen_game/F/F1_easy.jpg',
      solution: '/kennzeichen_game/F/F1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'I1',
    oval: 'I',
    number: 1,
    countryName: 'Italien',
    stages: {
      harder: '/kennzeichen_game/I/I1_harder.jpg',
      hard: '/kennzeichen_game/I/I1_hard.jpg',
      easy: '/kennzeichen_game/I/I1_easy.jpg',
      solution: '/kennzeichen_game/I/I1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'NL1',
    oval: 'NL',
    number: 1,
    countryName: 'Niederlande',
    stages: {
      harder: '/kennzeichen_game/NL/NL1_harder.jpg',
      hard: '/kennzeichen_game/NL/NL1_hard.jpg',
      easy: '/kennzeichen_game/NL/NL1_easy.jpg',
      solution: '/kennzeichen_game/NL/NL1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'PL1',
    oval: 'PL',
    number: 1,
    countryName: 'Polen',
    stages: {
      harder: '/kennzeichen_game/PL/PL1_harder.jpg',
      hard: '/kennzeichen_game/PL/PL1_hard.jpg',
      easy: '/kennzeichen_game/PL/PL1_easy.jpg',
      solution: '/kennzeichen_game/PL/PL1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    // Czech Republic has 'hard' deliberately omitted to test intermediate stage skipping!
    id: 'CZ1',
    oval: 'CZ',
    number: 1,
    countryName: 'Tschechien',
    stages: {
      harder: '/kennzeichen_game/CZ/CZ1_harder.jpg',
      easy: '/kennzeichen_game/CZ/CZ1_easy.jpg',
      solution: '/kennzeichen_game/CZ/CZ1_solution.jpg',
    },
    availableStages: ['harder', 'easy', 'solution'],
  },
  {
    id: 'E1',
    oval: 'E',
    number: 1,
    countryName: 'Spanien',
    stages: {
      harder: '/kennzeichen_game/E/E1_harder.jpg',
      hard: '/kennzeichen_game/E/E1_hard.jpg',
      easy: '/kennzeichen_game/E/E1_easy.jpg',
      solution: '/kennzeichen_game/E/E1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'GB1',
    oval: 'GB',
    number: 1,
    countryName: 'Großbritannien',
    stages: {
      harder: '/kennzeichen_game/GB/GB1_harder.jpg',
      hard: '/kennzeichen_game/GB/GB1_hard.jpg',
      easy: '/kennzeichen_game/GB/GB1_easy.jpg',
      solution: '/kennzeichen_game/GB/GB1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'AL1',
    oval: 'AL',
    number: 1,
    countryName: 'Albanien',
    stages: {
      harder: '/kennzeichen_game/AL/AL1_harder.jpg',
      hard: '/kennzeichen_game/AL/AL1_hard.jpg',
      easy: '/kennzeichen_game/AL/AL1_easy.jpg',
      solution: '/kennzeichen_game/AL/AL1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'HR1',
    oval: 'HR',
    number: 1,
    countryName: 'Kroatien',
    stages: {
      harder: '/kennzeichen_game/HR/HR1_harder.jpg',
      hard: '/kennzeichen_game/HR/HR1_hard.jpg',
      easy: '/kennzeichen_game/HR/HR1_easy.jpg',
      solution: '/kennzeichen_game/HR/HR1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'S1',
    oval: 'S',
    number: 1,
    countryName: 'Schweden',
    stages: {
      harder: '/kennzeichen_game/S/S1_harder.jpg',
      hard: '/kennzeichen_game/S/S1_hard.jpg',
      easy: '/kennzeichen_game/S/S1_easy.jpg',
      solution: '/kennzeichen_game/S/S1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'DK1',
    oval: 'DK',
    number: 1,
    countryName: 'Dänemark',
    stages: {
      harder: '/kennzeichen_game/DK/DK1_harder.jpg',
      hard: '/kennzeichen_game/DK/DK1_hard.jpg',
      easy: '/kennzeichen_game/DK/DK1_easy.jpg',
      solution: '/kennzeichen_game/DK/DK1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'B1',
    oval: 'B',
    number: 1,
    countryName: 'Belgien',
    stages: {
      harder: '/kennzeichen_game/B/B1_harder.jpg',
      hard: '/kennzeichen_game/B/B1_hard.jpg',
      easy: '/kennzeichen_game/B/B1_easy.jpg',
      solution: '/kennzeichen_game/B/B1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
  },
  {
    id: 'GR1',
    oval: 'GR',
    number: 1,
    countryName: 'Griechenland',
    stages: {
      harder: '/kennzeichen_game/GR/GR1_harder.jpg',
      hard: '/kennzeichen_game/GR/GR1_hard.jpg',
      easy: '/kennzeichen_game/GR/GR1_easy.jpg',
      solution: '/kennzeichen_game/GR/GR1_solution.jpg',
    },
    availableStages: ['harder', 'hard', 'easy', 'solution'],
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
