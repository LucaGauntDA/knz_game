import React from 'react';
import { motion } from 'motion/react';
import { GameMode, RoundResult } from '../types/game';
import { FlagIcon } from './FlagIcon';
import { RotateCcw, SlidersHorizontal, CheckCircle2, XCircle } from 'lucide-react';

interface SummaryScreenProps {
  mode: GameMode;
  results: RoundResult[];
  onPlayAgain: () => void;
  onSwitchMode: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  mode,
  results,
  onPlayAgain,
  onSwitchMode,
}) => {
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const maxPossibleScore = results.length * 5;
  const firstAttemptWins = results.filter((r) => r.firstAttemptSuccess).length;
  const totalHintsUsed = results.reduce((acc, r) => acc + r.hintsUsed, 0);
  const totalRounds = results.length;

  const modeTitle = mode === 'standard' ? 'Standardmodus (10 Runden)' : 'Endlosmodus';

  return (
    <div className="w-full max-w-3xl mx-auto h-full flex flex-col justify-between p-4 sm:p-6 overflow-y-auto select-none">
      {/* Header zone */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center pt-2 sm:pt-4 mb-6"
      >
        <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">
          {modeTitle}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
          Spiel beendet
        </h1>
      </motion.div>

      {/* Metrics strip - Zero-pill discipline with tabular figures */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        className="grid grid-cols-3 gap-3 sm:gap-4 mb-6"
      >
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-slate-400 font-medium mb-1">Gesamtpunktzahl</span>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
            {totalScore}
            <span className="text-sm font-normal text-slate-500 ml-1">/ {maxPossibleScore}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-slate-400 font-medium mb-1">1. Versuch gelöst</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tabular-nums">
            {firstAttemptWins}
            <span className="text-sm font-normal text-slate-500 ml-1">/ {totalRounds}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-slate-400 font-medium mb-1">Verwendete Hinweise</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono tabular-nums">
            {totalHintsUsed}
          </div>
        </div>
      </motion.div>

      {/* Round-by-round recap table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.25 }}
        className="flex-1 min-h-0 bg-slate-900/60 border border-white/10 rounded-2xl p-3 sm:p-4 mb-6 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <span>Runde & Kennzeichen</span>
          <span>Ergebnis</span>
        </div>

        <div className="overflow-y-auto divide-y divide-white/5 space-y-1 pr-1">
          {results.map((r) => {
            const solutionImg = r.plate.stages.solution || '';

            return (
              <div
                key={r.roundNumber}
                className="flex items-center justify-between py-2.5 px-2 hover:bg-white/[0.02] rounded-lg transition-colors"
              >
                {/* Left: Round & Country info */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono tabular-nums w-5">
                    #{r.roundNumber}
                  </span>

                  {/* Flag */}
                  <div className="w-8 h-5 rounded overflow-hidden shadow-sm shrink-0">
                    <FlagIcon oval={r.correctOval} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      {r.countryName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {r.plate.oval}
                      {r.plate.number > 1 ? ` (Typ ${r.plate.number})` : ''} · Stufe:{' '}
                      {r.isWon ? r.finalStage : 'verloren'}
                    </div>
                  </div>
                </div>

                {/* Right: Score and status */}
                <div className="flex items-center gap-3 text-right">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono tabular-nums text-white">
                      {r.score}{' '}
                      <span className="text-xs font-normal text-slate-500">Pkt.</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {r.hintsUsed > 0 ? `${r.hintsUsed} ❓` : '0 ❓'} · {r.wrongGuessesCount} ✕
                    </div>
                  </div>

                  {r.isWon ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.25 }}
        className="flex items-center justify-center gap-3 sm:gap-4 pb-2"
      >
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 max-w-xs h-12 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Erneut spielen</span>
        </button>

        <button
          type="button"
          onClick={onSwitchMode}
          className="flex-1 max-w-xs h-12 rounded-xl bg-slate-900 border border-white/20 text-white font-medium text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Modus wechseln ({mode === 'standard' ? 'Endlos' : '10 Runden'})</span>
        </button>
      </motion.div>
    </div>
  );
};
