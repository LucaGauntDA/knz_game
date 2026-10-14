import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl text-left"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h2 className="text-lg font-bold text-white">Spielregeln & Punkte</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-sm text-slate-300 leading-relaxed">
          <div>
            <span className="font-semibold text-white">Ziel:</span> Erkenne das Land anhand des
            gezeigten Kennzeichens und wähle die passende Flagge aus den 16 Optionen.
          </div>

          <div>
            <span className="font-semibold text-white">Schwierigkeitsstufen:</span> Jedes
            Kennzeichen beginnt mit Unschärfe (<code className="text-amber-300">harder</code> /{' '}
            <code className="text-amber-300">hard</code> /{' '}
            <code className="text-amber-300">easy</code> /{' '}
            <code className="text-amber-300">solution</code>).
          </div>

          <div>
            <span className="font-semibold text-white">Fehlversuche & Hinweise (❓):</span> Ein
            falscher Tipp oder der Klick auf ❓ macht das Kennzeichen sofort eine Stufe leichter.
            Pro Runde gibt es eine geheime Grenze von 3 bis 5 Versuchen. Wird sie erreicht, ist die
            Runde verloren.
          </div>

          <div>
            <span className="font-semibold text-white">Punkte:</span> 5 Punkte für die richtige
            Antwort beim ersten Versuch. Für jeden Schritt zur leichteren Stufe wird 1 Punkt
            abgezogen. Bei Verlust der Runde gibt es 0 Punkte. Die Punkte bleiben während des Spiels
            geheim.
          </div>

          <div>
            <span className="font-semibold text-white">Modi:</span> Standard (10 Runden) oder
            Endlosmodus (alle verfügbaren Kennzeichen ohne Wiederholungen).
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Verstanden
        </button>
      </motion.div>
    </div>
  );
};
