/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  PlateManifestEntry,
  PlateStage,
  BUILTIN_PLATES,
  getInitialStage,
  getNextEasierStage,
  calculateRoundScore,
  loadPlatesManifest,
} from './data/platesManifest';
import { COUNTRIES, COUNTRY_BY_OVAL } from './data/countries';
import { GameMode, RoundResult, RoundState } from './types/game';
import { soundFx } from './utils/audio';
import { TopBar } from './components/TopBar';
import { LicensePlateDisplay } from './components/LicensePlateDisplay';
import { FlagGrid } from './components/FlagGrid';
import { SuccessOverlay } from './components/SuccessOverlay';
import { LostRoundOverlay } from './components/LostRoundOverlay';
import { SummaryScreen } from './components/SummaryScreen';
import { RulesModal } from './components/RulesModal';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [allPlates, setAllPlates] = useState<PlateManifestEntry[]>(BUILTIN_PLATES);
  const [mode, setMode] = useState<GameMode>('standard');
  const [platesQueue, setPlatesQueue] = useState<PlateManifestEntry[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [roundState, setRoundState] = useState<RoundState | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showRules, setShowRules] = useState<boolean>(false);

  // Load manifest if dynamic file is provided
  useEffect(() => {
    loadPlatesManifest().then((loaded) => {
      if (loaded.length > 0) {
        setAllPlates(loaded);
      }
    });
  }, []);

  // Preload upcoming images
  const preloadPlateImages = useCallback((plate: PlateManifestEntry) => {
    Object.values(plate.stages).forEach((url) => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, []);

  // Initialize a new game session with shuffled plates
  const initGame = useCallback(
    (targetMode: GameMode = mode, sourcePlates: PlateManifestEntry[] = allPlates) => {
      const shuffled = shuffleArray(sourcePlates);
      const queue = targetMode === 'standard' ? shuffled.slice(0, Math.min(10, shuffled.length)) : shuffled;

      setPlatesQueue(queue);
      setCurrentRoundIndex(0);
      setRoundHistory([]);
      setIsGameOver(false);

      if (queue.length > 0) {
        // Preload first 2 plates
        preloadPlateImages(queue[0]);
        if (queue.length > 1) {
          preloadPlateImages(queue[1]);
        }
        setupRound(queue[0], 1);
      }
    },
    [mode, allPlates, preloadPlateImages]
  );

  // Set up a specific round
  const setupRound = (plate: PlateManifestEntry, roundNum: number) => {
    const initialStage = getInitialStage(plate);
    // Secret threshold of failed attempts + hints: randomly 3 to 5
    const secretLimit = Math.floor(Math.random() * 3) + 3;

    // Build 16 flags: 1 correct flag + 15 random non-duplicate distractors
    const correctOval = plate.oval;
    const availableDistractors = COUNTRIES.filter((c) => c.oval !== correctOval).map((c) => c.oval);
    const chosenDistractors = shuffleArray(availableDistractors).slice(0, 15);
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
  };

  // Start game immediately on initial render
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      initGame('standard', BUILTIN_PLATES);
    }
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
      // Correct flag chosen!
      soundFx.playSuccess();
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
        finalStage: currentStage,
        firstAttemptSuccess: firstAttempt,
      };

      setRoundHistory((prev) => [...prev, result]);
      setRoundState((prev) =>
        prev
          ? {
              ...prev,
              isLocked: true,
              resolutionStatus: 'won',
              selectedWinningOval: selectedOval,
            }
          : null
      );
    } else {
      // Wrong flag chosen
      soundFx.playError();
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
                resolutionStatus: 'lost',
              }
            : null
        );
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

  // Handle ❓ Hint click
  const handleHint = () => {
    if (!roundState || roundState.isLocked || roundState.resolutionStatus !== 'playing') {
      return;
    }

    const { plate, currentStage, secretLimit, attemptsCount, stepsTaken, hintsCount, wrongGuesses } =
      roundState;
    const nextAttempts = attemptsCount + 1;
    const nextHints = hintsCount + 1;

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
              resolutionStatus: 'lost',
            }
          : null
      );
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

  // Advance to next round or end game
  const handleNextRound = () => {
    const nextIndex = currentRoundIndex + 1;
    if (nextIndex >= platesQueue.length) {
      // Completed all rounds
      soundFx.playComplete();
      setIsGameOver(true);
      setRoundState(null);
    } else {
      setCurrentRoundIndex(nextIndex);
      setupRound(platesQueue[nextIndex], nextIndex + 1);

      // Preload the following plate
      if (nextIndex + 1 < platesQueue.length) {
        preloadPlateImages(platesQueue[nextIndex + 1]);
      }
    }
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFx.enabled = nextState;
  };

  // Switch game mode
  const handleToggleMode = () => {
    const nextMode = mode === 'standard' ? 'endless' : 'standard';
    setMode(nextMode);
    initGame(nextMode);
  };

  const totalRounds = mode === 'standard' ? Math.min(10, platesQueue.length) : platesQueue.length;

  return (
    <div className="w-full h-dvh bg-[#0a0c10] text-slate-100 flex flex-col justify-between overflow-hidden antialiased font-sans">
      {/* Top Header */}
      <TopBar
        currentRound={currentRoundIndex + 1}
        totalRounds={totalRounds}
        mode={mode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onRestart={() => initGame(mode)}
        onToggleMode={handleToggleMode}
        onShowHelp={() => setShowRules(true)}
      />

      {/* Main Game Screen */}
      <main className="flex-1 w-full flex flex-col items-center justify-between min-h-0 py-1 sm:py-2 px-2 sm:px-4">
        {isGameOver ? (
          <SummaryScreen
            mode={mode}
            results={roundHistory}
            onPlayAgain={() => initGame(mode)}
            onSwitchMode={handleToggleMode}
          />
        ) : roundState ? (
          <div className="w-full h-full flex flex-col items-center justify-between max-w-4xl mx-auto">
            {/* Upper screen half: license plate as large as possible, undistorted */}
            <div className="w-full flex-1 flex items-center justify-center min-h-[140px] max-h-[38vh]">
              <LicensePlateDisplay
                plate={roundState.plate}
                currentStage={roundState.currentStage}
                isRevealingSolution={roundState.resolutionStatus === 'lost'}
              />
            </div>

            {/* Lower screen half: 16 flags in 4 rows, matching plate width */}
            <div className="w-full pb-1 sm:pb-3 flex flex-col justify-end">
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

      {/* Overlays */}
      <AnimatePresence>
        {roundState && roundState.resolutionStatus === 'won' && (
          <SuccessOverlay
            oval={roundState.plate.oval}
            onNextRound={handleNextRound}
            isFirstAttempt={roundState.attemptsCount === 0}
          />
        )}

        {roundState && roundState.resolutionStatus === 'lost' && (
          <LostRoundOverlay plate={roundState.plate} onNextRound={handleNextRound} />
        )}

        {showRules && <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </div>
  );
}
