import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlateManifestEntry,
  PlateStage,
  BUILTIN_PLATES,
  getInitialStage,
  getNextEasierStage,
  calculateRoundScore,
  loadPlatesManifest,
  weightedShuffle,
} from './data/platesManifest';
import { COUNTRIES, COUNTRY_BY_OVAL, CountryInfo } from './data/countries';
import { LicensePlateDisplay } from './components/LicensePlateDisplay';
import { FlagGrid } from './components/FlagGrid';
import { SummaryScreen } from './components/SummaryScreen';
import { GalleryView } from './components/GalleryView';
import { CountryDetailView } from './components/CountryDetailView';
import { soundFx } from './utils/audio';

import { GameMode, RoundState, RoundResult } from './types/game';
import { getSubdivisionForPlate, generateSubdivisionOptions, COUNTRY_SUBDIVISIONS } from './data/subdivisions';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resolveTestPlate(query: string, plates: PlateManifestEntry[]): PlateManifestEntry | undefined {
  let matched = plates.find(
    (p) => p.id.toUpperCase() === query || `${p.oval}${p.number}` === query
  );
  if (!matched) {
    const matchingPlates = plates.filter((p) => p.oval.toUpperCase() === query);
    if (matchingPlates.length > 0) {
      matched = matchingPlates[Math.floor(Math.random() * matchingPlates.length)];
    }
  }
  return matched;
}

export default function App() {
  const [allPlates, setAllPlates] = useState<PlateManifestEntry[]>(BUILTIN_PLATES);
  const [mode, setMode] = useState<GameMode>('standard');
  const [platesQueue, setPlatesQueue] = useState<PlateManifestEntry[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [roundState, setRoundState] = useState<RoundState | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Hidden routing state driven exclusively via URL
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Preload all subdivision flag images on startup for instant rendering
  useEffect(() => {
    Object.values(COUNTRY_SUBDIVISIONS).forEach((config) => {
      config.allPool.forEach((sub) => {
        const url = sub.flagUrl || `/flags/subdivisions/${sub.code}.png`;
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
      });
    });
  }, []);

  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  }, []);

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
    const targetCountry = COUNTRY_BY_OVAL[correctOval];
    const targetFlagCode = targetCountry ? targetCountry.code : correctOval;

    // Filter available distractors:
    // 1. Exclude the correct country oval
    // 2. Exclude any country that has the same visual flag code (e.g. UK / GB)
    const availableDistractors = COUNTRIES.filter(
      (c) => c.oval !== correctOval && c.code !== targetFlagCode
    );

    // Pick 14 distractors ensuring unique visual flags
    const shuffledDistractors = shuffleArray(availableDistractors);
    const chosenDistractors: string[] = [];
    const usedFlagCodes = new Set<string>([targetFlagCode]);

    for (const d of shuffledDistractors) {
      if (!usedFlagCodes.has(d.code)) {
        usedFlagCodes.add(d.code);
        chosenDistractors.push(d.oval);
        if (chosenDistractors.length === 14) break;
      }
    }

    const roundFlags = shuffleArray([correctOval, ...chosenDistractors]);

    const targetSubdivision = modeRef.current === 'flags' ? null : getSubdivisionForPlate(plate.oval, plate.number);

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
      targetSubdivision,
      phase: 'country',
      wrongSubdivisionGuesses: [],
      selectedWinningSubdivisionCode: null,
    });
  }, []);

  // Advance to next round or end game
  const handleNextRound = useCallback(
    (queue: PlateManifestEntry[] = platesQueue, currentIndex: number = currentRoundIndex) => {
      const cleanPath = currentPath.replace(/\/+$/, '') || '/';
      if (cleanPath.toLowerCase().startsWith('/test/')) {
        setTimeout(() => {
          const query = cleanPath.slice(6).toUpperCase();
          const plates = platesRef.current;
          const matched = resolveTestPlate(query, plates);
          if (matched) {
            setupRound(matched, 1);
          }
        }, 1500);
        return;
      }

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
    [platesQueue, currentRoundIndex, preloadPlateImages, setupRound, currentPath]
  );

  // Initialize a new game session with shuffled plates
  const initGame = useCallback(
    (targetMode?: GameMode, sourcePlates?: PlateManifestEntry[]) => {
      const activeMode = targetMode ?? modeRef.current;
      const rawPlates = sourcePlates ?? platesRef.current;
      const plates = activeMode === 'flags'
        ? rawPlates.filter((p) => !getSubdivisionForPlate(p.oval, p.number))
        : rawPlates;
      const shuffled = weightedShuffle(plates, (p) =>
        getSubdivisionForPlate(p.oval, p.number) ? 0.75 : 1.0
      );
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
      const plates = loaded.length > 0 ? loaded : BUILTIN_PLATES;
      platesRef.current = plates;
      setAllPlates(plates);

      const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (cleanPath.toLowerCase().startsWith('/test/')) {
        const query = cleanPath.slice(6).toUpperCase();
        const matched = resolveTestPlate(query, plates);
        if (matched) {
          setupRound(matched, 1);
          setIsGameOver(false);
          return;
        }
      }

      if (cleanPath === '/' || cleanPath === '') {
        setIsGameOver(true);
        setRoundState(null);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [initGame, setupRound]);

  // Handle dynamic path changes for /test/...
  useEffect(() => {
    const cleanPath = currentPath.replace(/\/+$/, '') || '/';
    if (cleanPath.toLowerCase().startsWith('/test/')) {
      const query = cleanPath.slice(6).toUpperCase();
      const plates = platesRef.current;
      const matched = resolveTestPlate(query, plates);
      if (matched) {
        setupRound(matched, 1);
      }
    }
  }, [currentPath, setupRound]);

  // Handle flag click
  const handleSelectFlag = (selectedOval: string) => {
    if (!roundState || roundState.isLocked || roundState.resolutionStatus !== 'playing') {
      return;
    }

    const { plate, currentStage, secretLimit, attemptsCount, stepsTaken, hintsCount, wrongGuesses } =
      roundState;
    const isCorrect = selectedOval === plate.oval;

    if (isCorrect) {
      // Check if this plate has a sub-entity (state/territory)
      const targetSubdivision = getSubdivisionForPlate(plate.oval, plate.number);

      if (targetSubdivision) {
        // Step 1 correct: Country solved! Transition to Phase 2 (Subdivision)
        soundFx.playHint();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(35);
          } catch {
            // ignore
          }
        }

        const countryIndex = roundState.displayFlags.findIndex((oval) => oval === selectedOval);
        const subdivisionOptions = generateSubdivisionOptions(
          plate.oval,
          targetSubdivision,
          countryIndex >= 0 ? countryIndex : 0
        );

        setRoundState((prev) =>
          prev
            ? {
                ...prev,
                phase: 'subdivision',
                targetSubdivision,
                correctCountryIndex: countryIndex >= 0 ? countryIndex : 0,
                subdivisionOptions,
                wrongSubdivisionGuesses: [],
              }
            : null
        );
        return;
      }

      // Standard country without sub-entity: immediate win!
      soundFx.playSuccess();

      // Send haptic signal (Vibration auf iOS / Android Geräten)
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

      // Bei richtig: SOFORT DIE SOLUTION ANZEIGEN & KEIN POP-UP
      setRoundState((prev) =>
        prev
          ? {
              ...prev,
              isLocked: true,
              currentStage: 'solution',
              resolutionStatus: 'won',
              selectedWinningOval: selectedOval,
            }
          : null
      );

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

  // Handle state/territory subdivision click (Phase 2)
  const handleSelectSubdivision = (selectedCode: string) => {
    if (!roundState || roundState.isLocked || roundState.resolutionStatus !== 'playing') {
      return;
    }

    const {
      plate,
      currentStage,
      secretLimit,
      attemptsCount,
      stepsTaken,
      hintsCount,
      wrongGuesses,
      targetSubdivision,
      wrongSubdivisionGuesses = [],
    } = roundState;

    if (!targetSubdivision) return;

    const isCorrect = selectedCode === targetSubdivision.code;

    if (isCorrect) {
      soundFx.playSuccess();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([35, 45, 35]);
        } catch {
          // ignore
        }
      }

      const firstAttempt = attemptsCount === 0;
      const score = calculateRoundScore(stepsTaken + wrongSubdivisionGuesses.length, false);

      const result: RoundResult = {
        roundNumber: roundState.roundNumber,
        plate,
        correctOval: plate.oval,
        countryName: `${plate.countryName} - ${targetSubdivision.nameDe}`,
        isWon: true,
        score,
        attemptsCount,
        hintsUsed: hintsCount,
        wrongGuessesCount: wrongGuesses.length + wrongSubdivisionGuesses.length,
        finalStage: 'solution',
        firstAttemptSuccess: firstAttempt,
        subdivisionName: targetSubdivision.nameDe,
        subdivisionCode: targetSubdivision.code,
      };

      setRoundHistory((prev) => [...prev, result]);

      setRoundState((prev) =>
        prev
          ? {
              ...prev,
              isLocked: true,
              currentStage: 'solution',
              resolutionStatus: 'won',
              selectedWinningSubdivisionCode: selectedCode,
            }
          : null
      );

      setTimeout(() => {
        handleNextRound();
      }, 1250);
    } else {
      soundFx.playError();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(60);
        } catch {
          // ignore
        }
      }

      const nextAttempts = attemptsCount + 1;
      const updatedWrong = [...wrongSubdivisionGuesses, selectedCode];

      if (nextAttempts >= secretLimit) {
        soundFx.playLost();
        const result: RoundResult = {
          roundNumber: roundState.roundNumber,
          plate,
          correctOval: plate.oval,
          countryName: `${plate.countryName} - ${targetSubdivision.nameDe}`,
          isWon: false,
          score: 0,
          attemptsCount: nextAttempts,
          hintsUsed: hintsCount,
          wrongGuessesCount: wrongGuesses.length + updatedWrong.length,
          finalStage: 'solution',
          firstAttemptSuccess: false,
          subdivisionName: targetSubdivision.nameDe,
          subdivisionCode: targetSubdivision.code,
        };

        setRoundHistory((prev) => [...prev, result]);
        setRoundState((prev) =>
          prev
            ? {
                ...prev,
                isLocked: true,
                attemptsCount: nextAttempts,
                wrongSubdivisionGuesses: updatedWrong,
                currentStage: 'solution',
                resolutionStatus: 'lost',
              }
            : null
        );

        setTimeout(() => {
          handleNextRound();
        }, 1600);
      } else {
        const nextStage = getNextEasierStage(plate, currentStage);
        setRoundState((prev) =>
          prev
            ? {
                ...prev,
                attemptsCount: nextAttempts,
                wrongSubdivisionGuesses: updatedWrong,
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

  // --- Hidden URL Routing (Accessible only via URL) ---
  const cleanPath = currentPath.replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();

  // 1. Gallery: domain.com/gallery or domain.com/gallery/flags or domain.com/flags
  if (lowerPath === '/gallery' || lowerPath === '/gallery/flags' || lowerPath === '/flags') {
    return (
      <GalleryView
        plates={allPlates}
        onSelectCountry={(oval) => navigate(`/${oval}`)}
      />
    );
  }

  // 2. Direct Image Viewer: domain.com/dateiname.jpg (SPA fallback)
  const imageMatch = cleanPath.match(/^\/([^\/]+?\.(jpe?g|png|webp))$/i);
  if (imageMatch) {
    const filename = imageMatch[1];
    return (
      <div className="w-full h-dvh bg-black flex items-center justify-center p-2 select-none">
        <img
          src={`/${filename}`}
          alt={filename}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  // 3. Country Detail Page: domain.com/{countrycode}
  if (cleanPath.length > 1 && cleanPath.startsWith('/')) {
    const rawCode = cleanPath.slice(1).toUpperCase();
    const lookupCode = rawCode === 'GB' ? 'UK' : rawCode;
    const matchedCountry = COUNTRIES.find(
      (c) => c.oval.toUpperCase() === lookupCode || c.code.toUpperCase() === lookupCode
    );

    if (matchedCountry) {
      return (
        <CountryDetailView
          country={matchedCountry}
          plates={allPlates}
          onBackToGallery={() => navigate('/gallery')}
        />
      );
    }
  }

  return (
    <div className="w-full h-dvh bg-[#0a0c10] text-slate-100 flex flex-col justify-between overflow-hidden antialiased font-sans select-none">
      {/* Keine obere Leiste: Bildschirmhöhe 100% für Kennzeichen & Flaggen */}
      <main className="flex-1 w-full flex flex-col items-center justify-between min-h-0 py-2 sm:py-3 px-2 sm:px-4">
        {isGameOver ? (
          <SummaryScreen
            mode={mode}
            results={roundHistory}
            onPlayAgain={() => {
              setMode('standard');
              initGame('standard');
            }}
            onStartEndless={() => {
              setMode('endless');
              initGame('endless');
            }}
            onStartFlags={() => {
              setMode('flags');
              initGame('flags');
            }}
            onOpenGallery={() => navigate('/gallery')}
            onSwitchMode={handleToggleMode}
          />
        ) : roundState ? (
          <div className="w-full h-full flex flex-col items-center justify-between max-w-5xl mx-auto relative">
            {/* Back arrow button */}
            <div className="absolute top-1 left-2 z-20">
              <button
                type="button"
                onClick={() => {
                  setRoundState(null);
                  setIsGameOver(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-white/10 shadow"
                title="Zurück zum Menü"
                aria-label="Zurück zum Menü"
              >
                <span className="text-base leading-none">←</span>
                <span>Menu</span>
              </button>
            </div>

            {/* Oberer Bildschirmbereich: Kennzeichen oder Ländername */}
            <div className="w-full flex-1 flex items-center justify-center min-h-0 max-h-[50vh] py-1 min-w-0">
              <LicensePlateDisplay
                plate={roundState.plate}
                currentStage={roundState.currentStage}
                isRevealingSolution={
                  roundState.resolutionStatus === 'won' || roundState.resolutionStatus === 'lost'
                }
                gameMode={mode}
              />
            </div>

            {/* Unterer Bildschirmbereich: 15 Flaggen + Score / Fragezeichen in 4x4 */}
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
                phase={roundState.phase}
                correctCountryIndex={roundState.correctCountryIndex}
                subdivisionOptions={roundState.subdivisionOptions}
                wrongSubdivisionGuesses={roundState.wrongSubdivisionGuesses}
                selectedWinningSubdivisionCode={roundState.selectedWinningSubdivisionCode}
                onSelectSubdivision={handleSelectSubdivision}
                currentScore={roundHistory.reduce((acc, r) => acc + r.score, 0)}
                gameMode={mode}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full flex items-center justify-center p-6">
            <div className="loader" role="status" aria-label="Laden..." />
          </div>
        )}
      </main>
    </div>
  );
}
