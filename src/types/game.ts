import { PlateManifestEntry, PlateStage } from '../data/platesManifest';
import { Subdivision } from '../data/subdivisions';

export type GameMode = 'standard' | 'endless' | 'flags';

export interface RoundResult {
  roundNumber: number;
  plate: PlateManifestEntry;
  correctOval: string;
  countryName: string;
  isWon: boolean;
  score: number; // 0 to 5
  attemptsCount: number;
  hintsUsed: number;
  wrongGuessesCount: number;
  finalStage: PlateStage;
  firstAttemptSuccess: boolean;
  subdivisionName?: string;
  subdivisionCode?: string;
}

export interface SubdivisionCellOption {
  cellIndex: number; // 0..14 in the 4x4 grid
  subdivision: Subdivision;
}

export interface RoundState {
  roundNumber: number;
  plate: PlateManifestEntry;
  currentStage: PlateStage;
  secretLimit: number; // 3 to 5
  attemptsCount: number; // sum of wrong guesses + hints
  wrongGuesses: string[]; // ovals of wrong picked flags
  hintsCount: number;
  stepsTaken: number;
  isLocked: boolean; // prevents multi-clicks during animations
  resolutionStatus: 'playing' | 'won' | 'lost';
  selectedWinningOval: string | null;
  displayFlags: string[]; // 16 oval codes in randomized order

  // Sub-entity (State/Territory) phase support
  targetSubdivision?: Subdivision | null;
  phase: 'country' | 'subdivision';
  correctCountryIndex?: number;
  subdivisionOptions?: SubdivisionCellOption[];
  wrongSubdivisionGuesses: string[];
  selectedWinningSubdivisionCode?: string | null;
}
