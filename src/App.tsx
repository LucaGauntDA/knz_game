import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlateManifestEntry,
  PlateStage,
  BUILTIN_PLATES,
  getInitialStage,
  getNextEasierStage,
  calculateRoundScore,
  loadPlatesManifest,
} from './data/platesManifest';
import { COUNTRIES } from './data/countries';
import { LicensePlateDisplay } from './components/LicensePlateDisplay';
import { FlagGrid } from './components/FlagGrid';
import { SummaryScreen } from './components/SummaryScreen';
import { soundFx } from './utils/audio';

export type GameMode = 'standard' | 'endless';

export interface RoundState {
  roundNumber: number;
  plate: PlateManifestEntry;
  currentStage: PlateStage;
  secretLimit: number;
  attemptsCount: number;
  wrongGuesses: string[];
  hintsCount: number;
  stepsTaken: number;
  isLocked: boolean;
  resolutionStatus: 'playing' | 'won' | 'lost';
  selectedWinningOval: string | null;
  displayFlags: string[];
}

export interface RoundResult {
  roundNumber: number;
  plate: PlateManifestEntry;
  correctOval: string;
  countryName: string;
  isWon: boolean;
  score: number;
  attemptsCount: number;
  hintsUsed: number;
  wrongGuessesCount: number;
  finalStage: PlateStage;
  firstAttemptSuccess: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [, setAllPlates] = useState<PlateManifestEntry[]>(BUILTIN_PLATES);
  const [mode, setMode] = useState<GameMode>('standard');
  const [platesQueue, setPlatesQueue] = useState<PlateManifestEntry[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [roundState, setRoundState] = useState<RoundState | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const platesRef = useRef<PlateManifestEntry[]>(BUILTIN_PLATES);
  const modeRef = useRef<GameMode>(mode);
  modeRef.current = mode;

  // Preload upcoming images
  const preloadPlateImages = useCallback((plate: PlateManifestEntry) => {
    Object.values(plate.stages).forEach((url) => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, []);

  // Set up a specific round
  const setupRound = useCallback((plate: PlateManifestEntry, roundNum: number) => {
    const initialStage = getInitialStage(plate);
    // Secret threshold of failed attempts + hints: randomly 3 to 5
    const secretLimit = Math.floor(Math.random() * 3) + 3;

    // Build 15 flags: 1 correct flag + 14 random non-duplicate distractors
    // The 16th cell (bottom right) is reserved for the ❓ hint emoji
    const correctOval = plate.oval;
    const availableDistractors = COUNTRIES.filter((c) => c.oval !== correctOval).map((c) => c.oval);
    const chosenDistractors = shuffleArray(availableDistractors).slice(0, 14);
    const roundFlags = shuffleArray([correctOval, ...chosenDistractors]);

    setRoundState({
      roundNumber: roundNum,
      plate,
      currentStage: initialStage,
      secretLimit,
      attemptsCount: 0,
      wrongGuesses: [],
      hintsCount: 0,
      stepsTaken: 0,
      isLocked: false,
      resolutionStatus: 'playing',
      selectedWinningOval: null,
      displayFlags: roundFlags,
    });
  }, []);

  // Advance to next round or end game
  const handleNextRound = useCallback(
    (queue: PlateManifestEntry[] = platesQueue, currentIndex: number = currentRoundIndex) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        // Completed all rounds
        soundFx.playComplete();
        setIsGameOver(true);
        setRoundState(null);
      } else {
        setCurrentRoundIndex(nextIndex);
        setupRound(queue[nextIndex], nextIndex + 1);

        // Preload the following plate
        if (nextIndex + 1 < queue.length) {
          preloadPlateImages(queue[nextIndex + 1]);
        }
      }
    },
    [platesQueue, currentRoundIndex, preloadPlateImages, setupRound]
  );

  // Initialize a new game session with shuffled plates
  const initGame = useCallback(
    (targetMode?: GameMode, sourcePlates?: PlateManifestEntry[]) => {
      const activeMode = targetMode ?? modeRef.current;
      const plates = sourcePlates ?? platesRef.current;
      const shuffled = shuffleArray(plates);
      const queue = activeMode === 'standard' ? shuffled.slice(0, Math.min(10, shuffled.length)) : shuffled;

      setPlatesQueue(queue);
      setCurrentRoundIndex(0);
      setRoundHistory([]);
      setIsGameOver(false);

      if (queue.length > 0) {
        preloadPlateImages(queue[0]);
        if (queue.length > 1) {
          preloadPlateImages(queue[1]);
        }
        setupRound(queue[0], 1);
      }
    },
    [preloadPlateImages, setupRound]
  );

  // Start game immediately on initial render and load manifest once
  useEffect(() => {
    let isCancelled = false;
    loadPlatesManifest().then((loaded) => {
      if (isCancelled) return;
      if (loaded.length > 0) {
        platesRef.current = loaded;
        setAllPlates(loaded);
        initGame(modeRef.current, loaded);
      } else {
        initGame(modeRef.current, BUILTIN_PLATES);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [initGame]);

  // Handle flag click
  const handleSelectFlag = (selectedOval: string) => {
    if (!roundState || roundState.isLocked || roundState.resolutionStatus !== 'playing') {
      return;
    }

    const { plate, currentStage, secretLimit, attemptsCount, stepsTaken, hintsCount, wrongGuesses } =
      roundState;
    const isCorrect = selectedOval === plate.oval;

    if (isCorrect) {
      // 1. Play success sound
      soundFx.playSuccess();

      // 2. Send haptic signal (Vibration auf iOS / Android Geräten)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([35, 45, 35]);
        } catch {
          // ignore if vibration is not permitted
        }
      }

      const firstAttempt = attemptsCount === 0;
      const score = calculateRoundScore(stepsTaken, false);

      const result: RoundResult = {
        roundNumber: roundState.roundNumber,
        plate,
        correctOval: plate.oval,
        countryName: plate.countryName,
        isWon: true,
        score,
        attemptsCount,
        hintsUsed: hintsCount,
        wrongGuessesCount: wrongGuesses.length,
        finalStage: 'solution',
        firstAttemptSuccess: firstAttempt,
      };

      setRoundHistory((prev) => [...prev, result]);

      // 3. Bei richtig: SOFORT DIE SOLUTION ANZEIGEN & KEIN POP-UP
      setRoundState((prev) =>
        prev
          ? {
              ...prev,
              isLocked: true,
              currentStage: 'solution', // Zeigt direkt die Lösung
              resolutionStatus: 'won',
              selectedWinningOval: selectedOval,
            }
          : null
      );

      // Nach 1,2 Sekunden Betrachtung der Lösung nahtlos zur nächsten Runde wechseln
      setTimeout(() => {
        handleNextRound();
      }, 1250);
    } else {
      // Wrong flag chosen
      soundFx.playError();

      // Haptisches Signal bei Fehler
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(60);
        } catch {
          // ignore
        }
      }

      const nextAttempts = attemptsCount + 1;
      const updatedWrong = [...wrongGuesses, selectedOval];

      // Check secret threshold
      if (nextAttempts >= secretLimit) {
        // Round lost!
        soundFx.playLost();
        const result: RoundResult = {
          roundNumber: roundState.roundNumber,
          plate,
          correctOval: plate.oval,
          countryName: plate.countryName,
          isWon: false,
          score: 0,
          attemptsCount: nextAttempts,
          hintsUsed: hintsCount,
          wrongGuessesCount: updatedWrong.length,
          finalStage: 'solution',
          firstAttemptSuccess: false,
        };

        setRoundHistory((prev) => [...prev, result]);
        setRoundState((prev) =>
          prev
            ? {
                ...prev,
                isLocked: true,
                attemptsCount: nextAttempts,
                wrongGuesses: updatedWrong,
                currentStage: 'solution', // Zeigt Lösung bei Rundenverlust
                resolutionStatus: 'lost',
              }
            : null
        );

        // Nach 1,6 Sekunden zur nächsten Runde
        setTimeout(() => {
          handleNextRound();
        }, 1600);
      } else {
        // Step to next easier available stage
        const nextStage = getNextEasierStage(plate, currentStage);
        setRoundState((prev) =>
          prev
            ? {
                ...prev,
                attemptsCount: nextAttempts,
                wrongGuesses: updatedWrong,
                currentStage: nextStage ?? currentStage,
                stepsTaken: nextStage ? stepsTaken + 1 : stepsTaken,
              }
            : null
        );
      }
    }
  };

  // Handle ❓ Hint click in cell 16
  const handleHint = () => {
    if (!roundState || roundState.isLocked || roundState.resolutionStatus !== 'playing') {
      return;
    }

    const { plate, currentStage, secretLimit, attemptsCount, stepsTaken, hintsCount, wrongGuesses } =
      roundState;
    const nextAttempts = attemptsCount + 1;
    const nextHints = hintsCount + 1;

    // Haptischer Klick
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    // Check secret threshold
    if (nextAttempts >= secretLimit) {
      soundFx.playLost();
      const result: RoundResult = {
        roundNumber: roundState.roundNumber,
        plate,
        correctOval: plate.oval,
        countryName: plate.countryName,
        isWon: false,
        score: 0,
        attemptsCount: nextAttempts,
        hintsUsed: nextHints,
        wrongGuessesCount: wrongGuesses.length,
        finalStage: 'solution',
        firstAttemptSuccess: false,
      };

      setRoundHistory((prev) => [...prev, result]);
      setRoundState((prev) =>
        prev
          ? {
              ...prev,
              isLocked: true,
              attemptsCount: nextAttempts,
              hintsCount: nextHints,
              currentStage: 'solution',
              resolutionStatus: 'lost',
            }
          : null
      );

      setTimeout(() => {
        handleNextRound();
      }, 1600);
      return;
    }

    soundFx.playHint();
    const nextStage = getNextEasierStage(plate, currentStage);
    setRoundState((prev) =>
      prev
        ? {
            ...prev,
            attemptsCount: nextAttempts,
            hintsCount: nextHints,
            currentStage: nextStage ?? currentStage,
            stepsTaken: nextStage ? stepsTaken + 1 : stepsTaken,
          }
        : null
    );
  };

  const handleToggleMode = () => {
    const nextMode = mode === 'standard' ? 'endless' : 'standard';
    setMode(nextMode);
    initGame(nextMode);
  };

  return (
    <div className="w-full h-dvh bg-[#0a0c10] text-slate-100 flex flex-col justify-between overflow-hidden antialiased font-sans select-none">
      {/* Keine obere Leiste: Bildschirmhöhe 100% für Kennzeichen & Flaggen */}
      <main className="flex-1 w-full flex flex-col items-center justify-between min-h-0 py-2 sm:py-3 px-2 sm:px-4">
        {isGameOver ? (
          <SummaryScreen
            mode={mode}
            results={roundHistory}
            onPlayAgain={() => initGame(mode)}
            onSwitchMode={handleToggleMode}
          />
        ) : roundState ? (
          <div className="w-full h-full flex flex-col items-center justify-between max-w-5xl mx-auto">
            {/* Oberer Bildschirmbereich: Kennzeichen viel größer ohne Ränder */}
            <div className="w-full flex-1 flex items-center justify-center min-h-[180px] max-h-[50vh] py-1">
              <LicensePlateDisplay
                plate={roundState.plate}
                currentStage={roundState.currentStage}
                isRevealingSolution={
                  roundState.resolutionStatus === 'won' || roundState.resolutionStatus === 'lost'
                }
              />
            </div>

            {/* Unterer Bildschirmbereich: 15 Flaggen + ❓ Emoji in 4x4 viel größer */}
            <div className="w-full pb-2 sm:pb-5 md:pb-6 flex flex-col justify-end">
              <FlagGrid
                flags={roundState.displayFlags}
                correctOval={roundState.plate.oval}
                wrongGuesses={roundState.wrongGuesses}
                isLocked={roundState.isLocked}
                onSelectFlag={handleSelectFlag}
                onHint={handleHint}
                canHint={roundState.currentStage !== 'solution'}
                selectedWinningOval={roundState.selectedWinningOval}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Lade Kennzeichen...
          </div>
        )}
      </main>
    </div>
  );
}
