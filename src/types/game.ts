import { PlateManifestEntry, PlateStage } from '../data/platesManifest';

export type GameMode = 'standard' | 'endless';

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
}
