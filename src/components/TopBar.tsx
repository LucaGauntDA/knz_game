import React from 'react';
import { GameMode } from '../types/game';
import { Volume2, VolumeX, RotateCcw, HelpCircle } from 'lucide-react';

interface TopBarProps {
  currentRound: number;
  totalRounds: number;
  mode: GameMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onToggleMode: () => void;
  onShowHelp: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRound,
  totalRounds,
  mode,
  soundEnabled,
  onToggleSound,
  onRestart,
  onToggleMode,
  onShowHelp,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
          Kennzeichen-Quiz
        </span>
        <button
          type="button"
          onClick={onToggleMode}
          className="text-[11px] sm:text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
          title="Modus wechseln"
        >
          {mode === 'standard' ? '10 Runden' : 'Endlos'}
        </button>
      </div>

      {/* Zone 2: Subtle round progress without any score */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-medium text-slate-300 font-mono tabular-nums">
          Runde {currentRound}
          {mode === 'standard' ? ` / ${totalRounds}` : ''}
        </span>
      </div>

      {/* Zone 3: Quiet utility controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onShowHelp}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Spielregeln"
          aria-label="Spielregeln anzeigen"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={soundEnabled ? 'Ton ausschalten' : 'Ton einschalten'}
          aria-label={soundEnabled ? 'Ton ausschalten' : 'Ton einschalten'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Neustart"
          aria-label="Spiel neu starten"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};
